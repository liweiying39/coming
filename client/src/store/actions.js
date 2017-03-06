/**
 * Created by brambles on 16/8/30.
 */
'use strict';

const exports = {};

exports.updateCurrentUser = ({ commit }, user_data) => {
  commit('UPDATE_CURRENT_USER', user_data);
};

exports.updateEventNews = ({ commit }, news_data) => {
  commit('UPDATE_EVENT_NEWS', news_data);
};

exports.shiftEventNews = ({ commit }, event_id) => {
  commit('SHIFT_EVENT_NEWS', event_id);
};

exports.updateActiveEvent = ({ commit }, new_event_data) => {
  commit('UPDATE_EVENT', new_event_data)
};

exports.updateActiveEventUsers = ({ commit }, new_event_users) => {
  commit('INSERT_USERS', new_event_users);
};

// exports.updateUsersStatus = ({ commit }, event_id, user_id, status, bol) => {
//   commit('UPDATE_USERS_STATUS', event_id, user_id, status, bol);
// };

exports.updateCurrentUserRole = ({ commit }, role = 'participant') => {
  commit('UPDATE_CURRENT_USER_ROLE', role)
};

exports.increaseEventPageNum = ({ commit }, page_num = null) => {
  commit('INCREASE_EVENT_PAGE_NUMBER', page_num);
};

exports.updateUserTagCount = ({ commit }, { event_id, user_id, delta }) => {
  commit('UPDATE_USER_TAG_COUNT', { event_id: event_id, user_id: user_id, delta: delta });
};

exports.setNoticeMessageDone = ({ commit }) => {
  commit('SET_NOTICE_MESSAGE_DONE');
};

exports.updateHasNoticeMessages = ({ commit }) => {
  commit('UPDATE_HAS_NOTICE_MESSAGES');
};

export default exports;
