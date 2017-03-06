/**
 * Created by brambles on 16/8/30.
 */
'use strict';

const exports = {};

exports.getCurrentUser = (state) => state.current_user;

exports.getEventNews = (state) => state.event_news.news_group;

exports.getUsers = (state) => state.events;

exports.getActiveEventId = (state) => state.active_event.active_event_id;

exports.getActiveEventInfo = (state) => state.active_event.information;

exports.getParticipants = (state) => state.active_event.participants;

exports.getCurrentUserInfo = (state) => state.active_event.current_user_info;

exports.getRsvp = (state) => {
  const active_event = state.active_event;
  return active_event.indexs.rsvp.map(function (i) {
    return active_event.participants[i];
  });
};

exports.getCheckin = (state) => {
  const active_event = state.active_event;
  return active_event.indexs.checkin.map(function (i) {
    return active_event.participants[i]
  })
};

exports.getTopLikes = (state) => state.active_event.indexs.top_like;

export default exports;
