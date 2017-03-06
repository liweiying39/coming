'use strict';

import querystring from 'querystring'

const routers = {
  INDEX: '/',
  EVENT: '/event/:id',
  PROFILE: '/profile',
  USER: '/user/:id',
  CREATE_EVENT_CODE: '/create-event',
  // CREATE_EVENT_URL: '/create-event/url',
  // CREATE_EVENT_INFO: '/create-event/information',
  UPDATE_EVENT: '/update-event',
  FOLLOW_RESELLER: '/follow-reseller',
  EVENT_STATS: '/event/stats',
  RESELL: '/resell',
  RESELL_REQUEST_CODE: '/resell/request-code',
  RESELL_SELL_CODE: '/resell/sell-code',
  ADMIN : '/admin',
  EVENT_CATEGORY: '/event/:id',
  EVENT_INTERESTED: '/event/:id/interested',
  EVENT_CHECKEDIN: '/event/:id/checkedin',
  EVENT_MOST_TAG: 'event/:id/most_tag',
  EVENT_RSVP: 'event/:id/rsvp'
};

function generateURL(router, { params, query } = {}) {
  let origin_url = routers[router];
  if (!origin_url) throw new Error('router not found');

  if (params) {
    Object.keys(params).forEach(function (val) {
      let pattern = `:${val}`;
      origin_url = origin_url.replace(new RegExp(pattern, 'g'), params[val]);
    });
  }

  if (query)
    origin_url += '?' + querystring.stringify(query);

  return origin_url;
}

module.exports = generateURL;
