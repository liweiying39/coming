"use strict";

import Vue from 'vue';

const state = {
  active_event_id: null,
  information: null,
  participants: [],
  current_user_info: null,
  indexs: {
    rsvp: [],
    checkin: [],
    top_like: []
  },
  page_num: 1,
};

const mutations = {
  UPDATE_EVENT (state, new_event_data) {
    Vue.set(state, 'participants', []);
    Vue.set(state.indexs, 'rsvp', []);
    Vue.set(state.indexs, 'checkin', []);
    Vue.set(state.indexs, 'top_like', []);

    state.current_user_info = null;
    state.active_event_id = new_event_data.event_id;
    state.information = new_event_data;
  },
  INSERT_USERS(state, new_users_data) {
    if (!state.active_event_id)
      throw new Error('has no event');

    if (new_users_data.current_user) {
      state.current_user_info = new_users_data.current_user;
      if (new_users_data.current_user.role)
        state.participants.push(new_users_data.current_user);
    }

    let last_index = state.participants.length == 0 ? 0 : (state.participants.length - 1);
    state.participants = state.participants.concat(new_users_data.participants);

    for (let index = last_index; index < state.participants.length; index++) {
      let user = state.participants[index];

      if (user.status.is_rsvp) {
        state.indexs.rsvp.push(index)
      }
      if (user.status.is_checkin) {
        state.indexs.checkin.push(index);
      }
    }

    state.indexs.top_like = sortTop10(state.participants);
  },

  UPDATE_CURRENT_USER_INVITED (state, status = true) {
    state.current_user_info.status.is_invited = status;
  },

  UPDATE_CURRENT_USER_ROLE(state, role) {
    state.current_user_info.role = role;
  },

  INCREASE_EVENT_PAGE_NUMBER (state, page_num = null) {
    if (page_num)
      state.page_num = page_num;
    else
      state.page_num = state.page_num + 1;
  },

  UPDATE_USER_TAG_COUNT(state, { event_id, user_id, delta }) {
    if (state.active_event_id != event_id)
      return;

    for (let u of state.participants) {
      if (u.user_id == user_id) {
        u.likes += delta;
        if (u.likes < 0)
          u.likes = 0;
        break;
      }
    }
    state.indexs.top_like = sortTop10(state.participants);
  },
//   UPDATE_USERS_STATUS(state, {event_id, user_id, status, vale}) {
//     if(state.active_event_id != event_id)
//       return;
//
//     for(let u of state.participants) {
//       if(u.user_id == user_id) {
//         if(status == 'checkin') {
//
//         } else if(status == 'rsvp') {
//
//         } else if(status == 'leave') {
//
//         }
//       }
//     }
//
//   }
// };
};

function sortTop10 (arr) {
  return arr.slice(0).sort(function (a, b) {
    return b.likes - a.likes;
  }).slice(0, 10);
}

export default { state, mutations };
