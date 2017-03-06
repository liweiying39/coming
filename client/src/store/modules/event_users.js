/**
 * Created by autress on 16-12-1.
 */

'use strict';
import Vue from 'vue';

const state = {
  events: {}
};

let mutations = {
  UPDATE_EVENT_USERS(state, event_data, current_user, participants) {
    let event_id = event_data['event_id'];
    let events = state.events;
    //先初始化state的结构
    if (!events.hasOwnProperty(event_id))
      Vue.set(events, event_id, { event_info: null, current_user: null, participants: [] });

    if (event_data) {
      events[event_id].event_info = event_data;
    }
    if (event_users) {
      if (event_data.current_user)
        events[event_id].current_user = current_user;
      if (event_data.participants.length) {
        participants.forEach((element) => {
          events[event_id].participants.push(element);
        })
      }

    }
  },

  //改变status,like的状态，其中rsvp代表is_rsvp/not_going,checked_in代表checked_in/checked_out,like 代表like/unlike
  UPDATE_USERS_STATUS(state, event_id, user_id, status, bol) {
    if (!state.events[event_id])
      throw new Error('This event is no exit');

    let event = state.events[event_id];
    if (event.current_user.user_id == user_id) {
      updateState(event.current_user, status, bol);
    } else {
      event_users.participants.forEach((element) => {
        if (element.user_id == user_id) {
          updateState(element, status, bol);
        }
      })
    }

    function updateState (element, status, bol) {
      if (status == 'rsvp') {
        if (!bol) {
          delete  state[event_id]
        }
        element.status.is_rsvp = bol;
      } else if (status == 'checkin') {
        element.status.is_checkin = bol;
      } else if (status == 'like') {
        Boolean(bol) ? element.likes++ : element.likes--;
      }
    }
  }
}
export default { state, mutations }
