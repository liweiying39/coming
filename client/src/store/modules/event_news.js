'use strict';

import Vue from 'vue'
import timer from '../../utils/timer';

const state = {
  news_group: {},
  news_max_length: 15,
};

const mutations = {
  UPDATE_EVENT_NEWS(state, news_data) {
    let event_id = news_data.event_id;
    let news_group = state.news_group;
    if (!news_group.hasOwnProperty(event_id))
      Vue.set(news_group, event_id, []);
      // news_group[event_id] = [];

    let news_list = news_group[event_id];
    news_list.push(news_data);
    if (news_list.length > state.news_max_length) {
      if (timer.is_running) {
        timer.ignore();
      }
      news_list.shift();
    }
  },

  SHIFT_EVENT_NEWS(state, event_id) {
    let news_group = state.news_group;
    let new_list = news_group[event_id];

    if (new_list && new_list.length)
      new_list.shift();
  }
};


export default { state, mutations }
