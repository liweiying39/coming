'use strict';

const state = {
  user_id: null,
  name: null,
  role: null,
  avatar: null,
  job_title: null,
  telephone: null,
  organization: null,
  managing_count: null,
  interesting_count: null,
  free_event_count: null
};

const mutations = {
  UPDATE_CURRENT_USER(state, user_data) {
    updateUser(state, user_data);
  }
};

function updateUser (origin, data) {
  Object.keys(data).forEach(function (attr) {
    if (origin.hasOwnProperty(attr))
      origin[attr] = data[attr];
  });
  if (!origin.is_sharing_showup)
    origin.last_showup_location = origin.last_showup_time = null;
}

export default { state, mutations }
