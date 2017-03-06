'use strict';

const EVENT_USERS_PAGE_SIZE = 20;
const INVITE_CODES_PAGE_SIZE = 20;

const colors = require('colors');
const core = require('../../core');
const config = require('../../config');

const db = core.getService('db');

const checkToken = require('../utils/auth.js').checkToken;
const checkManager = require('../utils/auth.js').checkManager;
const notifier = require('../utils/notifier.js');
const cache = require('../utils/cache.js');

function init (api) {

  api
    .use('/event', checkToken)

    .post('/event', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const request_body = ctx.request.body;

      if (!request_body.name || !request_body.place || !request_body.start_time || !request_body.end_time || !request_body.event_code) {
        console.log('request error' + colors.red(JSON.stringify(request_body)));
        return ctx.fn.error(422, 'required parameters missing');
      }

      let using_code = yield db.EventCode.findOne({ where: { code: request_body.event_code } });
      if (!using_code)
        return ctx.fn.error(403, 'invalid event code');

      let new_event;
      try {
        new_event = yield db.Event.create({
          name: request_body.name,
          place: request_body.place,
          start_time: new Date(+request_body.start_time),
          end_time: new Date(+request_body.end_time),
          manager_id: current_user.id,
          event_page_url: request_body.url || null,
          event_code: using_code.code
        });
      } catch (err) {
        console.log('create error' + colors.red(JSON.stringify(err)));
        return ctx.fn.error(422, 'timestamp format error');
      }

      yield using_code.update({
        is_used: true,
        used_time: parseInt(Date.now()),
        event_id: new_event.id,
        manager_id: current_user.id,
      });
      yield current_user.addEvent(new_event, {
        likes: 0,
        role: 'manager',
        is_rsvp: true,
        is_checkin: false,
        is_checkout: false
      });

      return ctx.body = {
        event: { event_id: new_event.id }
      }
    })

    /**
     * !!!不应该是get
     */
    .get('/event/code', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;

      let event_code = null;
      if ('content' in ctx.request.query) {
        let content = ctx.request.query.content;

        event_code = yield* db.EventCode.checkValidity(content);
        if (!event_code)
          return ctx.fn.error(422, 'event code not found');
      } else if (current_user.free_event_count > 0) {
        event_code = yield* db.EventCode.generate({ manager_id: current_user.id });
        let new_number = current_user.free_event_count - 1;
        if (new_number < 0)
          new_number = 0;
        current_user.setDataValue('free_event_count', new_number);
        yield current_user.save();
      }

      if (event_code)
        return ctx.body = { event_code: yield* event_code.getData() };
      else
        return ctx.fn.error(404, 'no event code');
    })

    .param('event_id', function* (event_id, next) {
      const ctx = this;
      // let event = yield cache.db.Event.findOne({ where: { id: parseInt(event_id) } });
      let event = yield db.Event.findOne({ where: { id: parseInt(event_id) } });

      if (!event)
        return ctx.fn.error(404, 'event not found');

      ctx.target_event = event;
      // console.log(colors.bold(cache.db.Event.cacheHit));
      // if (cache.db.Event.cacheHit)
      //   ctx.target_event = db.Event.build(event, {
      //     isNewRecord: false
      //   });

      yield next;
    })

    .get('/event/:event_id', function* (next) {
      const ctx = this;
      const target_event = ctx.target_event;

      let result = {
        event: yield* target_event.getData({
          event_id: target_event.id,
          interested_count: yield db.UserEventRelation.count({ where: { event_id: ctx.target_event.id } }),
          manager_id: target_event.manager_id,
          event_code: target_event.event_code
        })
      };

      return ctx.body = result;
    })

    .put('/event/:event_id', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const target_event = ctx.target_event;
      let request_body = ctx.request.body;

      if (target_event.manager_id !== current_user.id)
        return ctx.fn.error(403, 'current user can not modify this event information');

      let update_data = {};
      if (request_body.name)
        update_data.name = request_body.name;
      if (request_body.place)
        update_data.place = request_body.place;
      if (request_body.start_time)
        update_data.start_time = (+request_body.start_time);
      if (request_body.end_time)
        update_data.end_time = (+request_body.start_time);

      yield target_event.update(update_data);

      return ctx.body = {
        event: yield* target_event.getData({ event_id: target_event.id })
      }
    })

    .get('/event/:event_id/users', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const target_event = ctx.target_event;

      let event_users = {
        participants: []
      };

      let page = Number.parseInt(ctx.request.query.page) || 1;
      if (page <= 0)
        page = 1;

      if (page == 1) {
        let current_user_data = yield target_event.getUsers({
          where: { id: current_user.id },
          limit: 1
        });
        if (current_user_data.length) {
          let _current = current_user_data[0];
          event_users.current_user = yield* _current.UserEventRelation.getData(
            {
              user_id: _current.id,
              name: _current.name,
              avatar: _current.avatar,
              information: { job_title: _current.job_title, organization: _current.organization }
            }, {
              show_is_invited: true
            });
        }
        else
          event_users.current_user = {
            likes: 0,
            role: null,
            status: { is_rsvp: false, is_checkin: false, is_checkout: false }
          };
      }

      let users = yield target_event.getUsers({
        where: {
          id: {
            // $notIn: [current_user.id, target_event.manager_id]
            $ne: current_user.id
          }
        },
        order: [[db.Sequelize.literal("`UserEventRelation.created_at`"), 'ASC']],
        offset: (page - 1) * EVENT_USERS_PAGE_SIZE,
        limit: EVENT_USERS_PAGE_SIZE
      });
      // return console.log(users);
      for (let user of users) {
        let user_data = yield* user.UserEventRelation.getData({
          user_id: user.id,
          name: user.name,
          avatar: user.avatar,
          information: { job_title: user.job_title, organization: user.organization }
        });
        event_users.participants.push(user_data);
      }

      let result = {
        users: event_users
      };
      return ctx.body = result;
    })

    .put('/event/:event_id/user', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const request_body = ctx.request.body;
      const target_event = ctx.target_event;

      let relation = yield db.UserEventRelation.findOne({
        where: {
          event_id: ctx.target_event.id,
          user_id: current_user.id
        }
      });
      if (!relation)
        return ctx.fn.error(404, 'no event found');

      let now = Date.now();

      if (request_body.is_rsvp) {
        if (now > target_event.start_time.getTime())
          return ctx.fn.error(422, 'too late');

        if (relation.checkRole('manager'))
          return ctx.fn.error(403, 'manager can not change is_rsvp');
        relation.rsvped_at = new Date();
        relation.is_rsvp = request_body.is_rsvp;
      }

      if (request_body.is_checkin) {
        if (now < target_event.start_time.getTime())
          return ctx.fn.error(422, 'early');
        else if (now > target_event.end_time.getTime())
          return ctx.fn.error(422, 'late');

        relation.is_checkin = request_body.is_checkin;
        relation.is_checkout = (!relation.is_checkin).toString();
      }

      if (request_body.i_need)
        relation.need = request_body.i_need;
      if (request_body.i_offer)
        relation.offer = request_body.i_offer;

      if (request_body.is_sharing_showup)
        relation.is_sharing_showup = request_body.is_sharing_showup;
      if (request_body.last_showup_location) {
        relation.last_showup_time = new Date();
        relation.last_showup_location = request_body.last_showup_location;
      }

      yield relation.save();

      // 根据api的调用发送通知给其他socket用户
      let
        user_id = current_user.id,
        event_id = ctx.target_event.id,
        user_name = current_user.name,
        is_change_rsvp = request_body.rsvp,
        is_change_checkin = request_body.is_checkin;

      db.UserLikesRelation
        .findAll({
          attributes: ['from_user_id'],
          where: { target_user_id: user_id, event_id: event_id }
        })
        .then((relations) => {
          let user_id_list = relations.map((relation) => relation.from_user_id);
          if (is_change_rsvp)
            notifier
              .deliverMessage(user_id_list, 'event_news', {
                event_id: event_id,
                sub_type: 'rsvp_status',
                body: { from: user_name, value: is_change_rsvp === 'true' }
              });
          if (is_change_checkin)
            notifier
              .deliverMessage(user_id_list, 'event_news', {
                event_id: event_id,
                sub_type: 'checkin_status',
                body: { from: user_name, value: is_change_checkin === 'true' }
              });
        });

      return ctx.body = {
        current_user: {
          event: yield* relation.getData({
            information: yield* ctx.target_event.getData()
          })
        }
      }

    })

    .get('/event/:event_id/stats', checkManager, function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const target_event = ctx.target_event;

      let users = yield ctx.target_event.getUsers();

      let total_interested = users.length;
      let total_rsvp = users.filter((user) => user.UserEventRelation.is_rsvp).length;
      let total_checkin = users.filter((user) => user.UserEventRelation.is_checkin).length;

      return ctx.body = {
        event: yield* target_event.getData({
          stats: {
            total_interested: total_interested,
            total_rsvp: total_rsvp,
            total_checkin: total_checkin
          }
        })
      }
    })

    .post('/event/:event_id/stats', checkManager, function* (next) {
      const ctx = this;
      const target_event = ctx.target_event;
      const request_body = ctx.request.body;

      if (!request_body.email)
        return ctx.fn.error(422, 'email is missing');

      const mailer = core.getService('mailer');
      const xlsxer = core.getService('xlsxer');
      const path = require('path');

      let filename = `event_${target_event.id}${target_event.event_code}_${Date.now()}.xls`;
      let filepath = path.join(config.event_state_path, filename);

      let users = yield db.User.findAll({
        attributes: ["id", "telephone", "name"],
        include: [{
          attributes: ["id"],
          model: db.Event,
          through: {
            attributes: ["id", "is_rsvp", "rsvped_at"],
            where: { is_rsvp: true },
            order: [['created_at', 'ASC']]
          },
          where: { id: target_event.id }
        }]
      });

      let formatTime = (date) =>
        `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

      let worksheet_body = users.map((user) => {
        return [user.name, user.telephone, '', formatTime(user.Events[0].UserEventRelation.rsvped_at)];
      });

      worksheet_body.unshift(['昵称', '手机号码', '签到', '报名时间']);
      worksheet_body.unshift([`时间：${formatTime(target_event.start_time)} 地点：${target_event.place}`]);
      worksheet_body.unshift([target_event.name]);
      let worksheet = xlsxer.createWorksheet(worksheet_body);
      let mailoptions = {
        to: request_body.email,
        subject: `${target_event.name} 签到表`,
        text: `${target_event.name} 签到表`,
        attachments: [
          { filename: `签到表.xls`, path: filepath }
        ]
      };

      const log4 = require('koa-log4').getLogger('event_stats');
      try {
        yield xlsxer.build(filepath, worksheet, {
          '!merges': [{ s: { c: 0, r: 0 }, e: { c: 3, r: 0 } }, { s: { c: 0, r: 1 }, e: { c: 3, r: 1 } }]
        });
        let result = yield mailer.send(mailoptions);
        log4.info(`[EVENT STATS SEND DONE] data: ${JSON.stringify(result)}`);
        return ctx.body = {
          done: true,
          data: result
        }
      } catch (err) {
        log4.error(`[EVENT STATS SEND ERROR] err: ${JSON.stringify(err)}`);
        return ctx.fn.error(403, 'service error');
      }
    })

    .get('/event/:event_id/invite-code', checkManager, function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const target_event = ctx.target_event;

      let page = Number.parseInt(ctx.request.query.page) || 1;
      if (page <= 0)
        page = 1;

      let invite_codes = yield db.InviteCode.findAll({
        where: {
          event_id: target_event.id,
          creator_id: current_user.id
        },
        order: [['created_at', 'DESC']],
        offset: (page - 1) * INVITE_CODES_PAGE_SIZE,
        limit: INVITE_CODES_PAGE_SIZE
      });

      let result = [];
      for (let code of invite_codes)
        result.push(yield* code.getData());

      return ctx.body = {
        invite_codes: result
      }
    })

    .post('/event/:event_id/invite-code', checkManager, function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const target_event = ctx.target_event;

      let new_code = yield* db.InviteCode.generate({
        creator_id: current_user.id,
        event_id: target_event.id
      });

      return ctx.body = {
        invite_code: yield* new_code.getData()
      };
    })

    .put('/event/:event_id/invite-code', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;
      const target_event = ctx.target_event;
      const request_body = ctx.request.body;

      if (!request_body.code)
        return ctx.fn.error(422, 'code missing');

      let relation = yield db.UserEventRelation.findOne({
        where: { user_id: current_user.id, event_id: target_event.id }
      });
      if (!relation)
        return ctx.fn.error(403, 'current user not following this event');

      let code = yield* db.InviteCode.checkValidity(request_body.code, target_event.id);

      if (!code)
        return ctx.fn.error(404, 'code not found');
      else if (code.is_used)
        return ctx.fn.error(403, 'code is used');

      yield code.update({
        user_id: current_user.id,
        user_name: current_user.name,
        is_used: true,
        used_at: new Date()
      });

      return ctx.body = {
        invite_code: yield* code.getData()
      };
    });

  return true;
}

module.exports = init;
