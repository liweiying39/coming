"use strict";

const EVENTS_PAGE_SIZE = 20;

const co = require('co');

const config = require('../../config');
const checkToken = require('../utils/auth.js').checkToken;
const core = require('../../core');

const db = core.getService('db');
const cache = core.getService('cache');
const sms = core.getService('sms');
const crypto = core.getService('crypto');

// const emitter = require('../socket/emitter.js');
const notifier = require('../utils/notifier.js');

function init (api) {

  api
    .use('/user', checkToken)

    .get('/user', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      let extra_data = {};

      if ('event_id' in ctx.request.query) {
        let event_id = ctx.request.query.event_id;
        let events = yield current_user.getEvents({ where: { id: event_id } });
        if (events.length > 0) {
          let event = events[0];
          extra_data.event = yield* event.UserEventRelation.getData(
            { information: yield* event.getData() },
            { show_is_invited: true });
        } else
          return ctx.fn.error(422, 'unknown event_id value');
      }

      return ctx.body = {
        current_user: yield* current_user.getData(extra_data, { managing_count: true })
      };
    })

    .put('/user', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const request_body = ctx.request.body;

      if (request_body.job_title)
        current_user.job_title = request_body.job_title;
      if (request_body.organization)
        current_user.organization = request_body.organization;
      // if (request_body.telephone)
      //   current_user.telephone = request_body.telephone;

      try {
        yield current_user.save();
      } catch (err) {
        console.error(err);
        return ctx.fn.error(422, 'timestamp error');
      }

      return ctx.body = {
        current_user: yield* current_user.getData(null, { managing_count: true })
      }
    })

    .get('/user/events', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;

      let page = Number.parseInt(ctx.request.query.page) || 1;
      if (page <= 0)
        page = 1;

      const events = yield current_user.getEvents({
        order: [
          ['created_at', 'DESC']
        ],
        offset: (page - 1) * EVENTS_PAGE_SIZE,
        limit: EVENTS_PAGE_SIZE
      });
      let result = { events: [] };

      for (let event of events) {
        result.events.push(yield* event.UserEventRelation.getData({
          information: yield* event.getData()
        }));
      }

      return ctx.body = result;
    })

    .post('/user/events', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const request_body = ctx.request.body;

      if (request_body.event_id) {
        // let event = yield cache.db.Event.findOne({ where: { id: request_body.event_id } });
        let event = yield db.Event.findOne({ where: { id: request_body.event_id } });
        if (!event)
          return ctx.fn.error(404, 'event not found');

        // event = db.Event.build(event, {
        //   isNewRecord: false
        // });

        let has_user = yield event.hasUser(current_user);
        if (has_user)
          return ctx.fn.error(403, 'can not follow same event twice');

        yield event.addUser(current_user, {
          is_rsvp: false,
          is_checkin: false,
          is_checkout: false,
          likes: 0,
          role: event.manager_id === current_user.id ? 'manager' : 'participant'
        });

        let new_event = yield current_user.getEvents({
          where: { id: request_body.event_id },
          limit: 1
        });
        if (new_event.length !== 1)
          return ctx.fn.error(500, 'please try again');
        new_event = new_event[0];
        return ctx.body = {
          event: yield* new_event.UserEventRelation.getData({
            user_id: current_user.id,
            name: current_user.name,
            avatar: current_user.avatar,
            information: {
              job_title: current_user.job_title, organization: current_user.organization
            }
          }, {
            show_is_invited: true
          })
        }

      } else
        return ctx.fn.error(422, 'event_id missing');
    })

    .delete('/user/events', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const request_body = ctx.request.body;

      if (request_body.event_id) {
        // let event = yield cache.db.Event.findOne({ where: { id: request_body.event_id } });
        let event = yield db.Event.findOne({ where: { id: request_body.event_id } });
        if (!event)
          return ctx.fn.error(404, 'event not found');

        // event = db.Event.build(event, {
        //   isNewRecord: false
        // });

        if (event.manager_id === current_user.id)
          return ctx.fn.error(400, 'manager can not unfollow a managing event');

        let has_user = yield event.hasUser(current_user);
        if (!has_user)
          return ctx.fn.error(403, 'current user is not following this event');

        let relation = yield event.getUsers({ where: { id: current_user.id }, limit: 1 });
        if (relation.length !== 1)
          return ctx.fn.error(500, 'please try again');

        yield relation[0].UserEventRelation.destroy();

        yield db.UserLikesRelation.destroy({
          where: {
            // target_user_id: current_user.id,
            // from_user_id: current_user.id,
            event_id: request_body.event_id,
            $or: [
              { target_user_id: current_user.id },
              { from_user_id: current_user.id }
            ]
          }
        });

        // let
        //   event_id = request_body.event_id,
        //   user_name = current_user.name,
        //   user_id = current_user.id;
        //
        // db.UserLikesRelation
        //   .findAll({
        //     attributes: ['from_user_id'],
        //     where: { target_user_id: user_id, event_id: event_id }
        //   })
        //   .then((relations) => {
        //     let user_id_list = relations.map((rel) => rel.from_user_id);
        //     notifier
        //       .deliverMessage(user_id_list, 'event_news', {
        //         event_id: event_id,
        //         sub_type: 'joining_status',
        //         body: { from: user_name, value: false }
        //       });
        //   });

        return ctx.body = { done: true };

      } else
        return ctx.fn.error(422, 'event_id missing');
    })

    .post('/user/telephone', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const request_body = ctx.request.body;

      if (!request_body.telephone)
        return ctx.fn.error(422, 'telephone missing');

      let ip = crypto.md5.hash(ctx.request.ips.join(','));
      let code = (Math.random()).toString().slice(2, 8);

      // check last request time
      let verification_history = yield db.VerificationCode.findOne({
        where: {
          ip_address: ip,
          use_for: 'telephone'
        },
        order: [['created_at', 'DESC']]
      });
      if (verification_history &&
          Math.round((new Date() - verification_history.created_at) / 1000) < 60)
        return ctx.fn.error(403, 'too fast for getting verification code');

      // send sms
      const log4 = require('koa-log4').getLogger('sms');
      if (process.env.NODE_ENV != 'development') {
        sms.single.to(request_body.telephone).content(config.sms_template_id, [code]).send()
          .then((res) => {
            log4.info(`[SMS SEND DONE] telephone: ${request_body.telephone}`);
            if (res.data.result !== 0) {
              log4.warn(`[SMS SEND FAILD] telephone: ${request_body.telephone}\n\terr: ${JSON.stringify(res.data)}`);
            }
          })
          .catch((err) => {
            log4.error(`[SMS SERVICE ERROR] ${JSON.stringify(err)}`);
          });
      } else {
        log4.info(`[SMS DEVELOPMENT] code: ${code}`);
      }

      yield db.VerificationCode.create({
        destination: request_body.telephone,
        ip_address: ip,
        code: code,
        use_for: 'telephone'
      });

      return ctx.body = {
        done: true
      };
    })

    .put('/user/telephone', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const request_body = ctx.request.body;

      if (!request_body.telephone || !request_body.code)
        return ctx.fn.error(422, 'parameter missing');

      let verification_history = yield db.VerificationCode.findOne({
        where: {
          destination: request_body.telephone,
          code: request_body.code,
          is_used: false,
          use_for: 'telephone'
        }
      });

      if (!verification_history)
        return ctx.fn.error(404, 'verification code not match');
      else if (Math.round((new Date() - verification_history.created_at) / 1000) > 1800)
        return ctx.fn.error(403, 'verification code has overdue');

      yield verification_history.update({ is_used: true });
      yield current_user.update({ telephone: request_body.telephone });

      return ctx.body = {
        done: true,
        data: {
          new_telephone: request_body.telephone
        }
      };
    })

    .param('user_id', function* (user_id, next) {
      const ctx = this;
      const current_user = ctx.current_user;

      if (user_id == current_user.id)
        return ctx.fn.error(403, 'no allow');
      else {
        // let user = yield cache.db.User.findOne({ where: { id: parseInt(user_id) } });
        let user = yield db.User.findOne({ where: { id: parseInt(user_id) } });
        if (user)
          ctx.target_user = user;
        // ctx.target_user = db.User.build(user, {
        //   isNewRecord: false
        // });
        else
          return ctx.fn.error(404, 'no user found');
      }
      yield next;
    })

    .get('/user/:user_id', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const target_user = ctx.target_user;
      let extra_data = {};

      if ('event_id' in ctx.request.query) {
        let event_id = ctx.request.query.event_id;
        let events = yield target_user.getEvents({ where: { id: event_id } });
        if (events.length > 0) {
          let event = events[0];

          let user_like_relation = yield db.UserLikesRelation.findOne({
            where: {
              from_user_id: current_user.id,
              target_user_id: target_user.id,
              event_id: event.id
            }
          });

          let is_liked;
          if (!user_like_relation)
            is_liked = false;
          else
            is_liked = (!user_like_relation.deleted_at);

          extra_data.event = yield* event.UserEventRelation.getData({
            information: yield* event.getData(),
            is_liked: is_liked
          })
        } else
          return ctx.fn.error(422, 'unknown event_id value');
      }

      return ctx.body = {
        current_user: yield* target_user.getData(extra_data)
      };
    })

    .put('/user/:user_id/like', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const target_user = ctx.target_user;

      if (!ctx.request.query.event_id)
        return ctx.fn.error(422, 'missing required parameter event_id');

      let event_id = parseInt(ctx.request.query.event_id);
      // let event = yield cache.db.Event.findOne({ where: { id: event_id } });
      let event = yield db.Event.findOne({ where: { id: event_id } });
      if (!event)
        return ctx.fn.error(422, 'unknown event_id value');

      // event = db.Event.build(event, {
      //   isNewRecord: false
      // });

      let relation = yield event.hasUsers([current_user, target_user]);
      if (!relation)
        return ctx.fn.error(403);

      let likes = yield db.UserLikesRelation.findOne({
        paranoid: false,
        where: {
          from_user_id: current_user.id,
          target_user_id: target_user.id,
          event_id: event.id
        }
      });

      if (!likes)
        likes = yield db.UserLikesRelation.create({
          from_user_id: current_user.id,
          target_user_id: target_user.id,
          event_id: event.id
        });
      else {
        if (likes.deleted_at) {
          likes.setDataValue('deleted_at', null);
          likes.save({ paranoid: false });
        }
        else
          likes.destroy();
      }

      let user_event_relation = yield db.UserEventRelation.findOne({
        where: {
          event_id: event.id, user_id: target_user.id
        }
      });
      yield user_event_relation.update({
        likes: yield db.UserLikesRelation.count({
          where: { event_id: event.id, target_user_id: target_user.id }
        })
      });

      // let like_result = !likes.deleted_at;
      // emitter
      //   .client(target_user.id)
      //   .content('event_news', {
      //     event_id: event.id,
      //     sub_type: 'like_status',
      //     body: { from: current_user.name, value: like_result }
      //   })
      //   .emit();
      notifier
        .deliverMessage([target_user.id], 'event_news', {
          event_id: event.id,
          sub_type: 'like_status',
          body: { from: current_user.name, value: !likes.deleted_at }
        }, notifier.WRITE);

      return ctx.body = {
        user: yield* target_user.getData({
          event: yield* user_event_relation.getData({
            information: yield* event.getData(),
            is_liked: (!likes.deleted_at)
          })
        })
      };

    });

  return true;
}

module.exports = init;
