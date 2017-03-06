'use strict';

const state = {
  is_first_loading_done: false,
  notice_messages: {
    has_notice: false,
    is_done: false
  }
};

const mutations = {
  SET_FIRST_LOADING_DONE(state) {
    state.is_first_loading_done = true;
  },

  SET_NOTICE_MESSAGE_DONE(state) {
    state.notice_messages.is_done = true;
  },

  UPDATE_HAS_NOTICE_MESSAGES(state, has_notice) {
    state.notice_messages.has_notice = has_notice;
  }
};

export default { state, mutations }
