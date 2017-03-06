/**
 * Created by brambles on 16/8/30.
 */
"use strict";

import Index from './components/index.vue'
import Event from './components/event.vue'
import Profile from './components/profile.vue'
import User from './components/user.vue'
import CreateEvent from './components/create-event.vue'
import CreateEventCode from './components/create-event-code.vue'
import UpdateEvent from './components/update-event.vue'
import FollowReceller from './components/follow-receller.vue'
import EventStats from './components/event-states.vue'
import Test from './components/test'
import Resell from './components/resell.vue'
import ResellSummary from './components/reseller-summary.vue'
import RequestCode from './components/request-code.vue'
import SaleCode from './components/sale-code.vue'
import Admin from './components/admin.vue'
import EventCategory from './components/event-category.vue'
import EventCheckedin from './components/event-checkedin.vue'
import EventInterested from './components/event-interested.vue'
import EventMostTag from './components/event-most-tag.vue'
import EventRsvp from './components/event-rsvp.vue'

const router_map = {
  '/': {
    name: 'index',
    component: Index
  },
  '/event/:id': {
    name: 'event',
    component: Event,
    subRoutes: {
      '/': {
        name: 'category',
        component: EventCategory
      },
      '/interested': {
        name: 'interested',
        component: EventInterested,
      },
      '/checkedin': {
        name: 'checkedin',
        component: EventCheckedin
      },
      '/most_tag': {
        name: 'most_tag',
        component: EventMostTag
      },
      '/rsvp': {
        name: 'rsvp',
        component: EventRsvp
      }
    }
  },
  '/profile': {
    name: 'profile',
    component: Profile
  },
  '/user/:id': {
    name: 'user',
    component: User
  },
  '/create-event': {
    component: CreateEvent,
    subRoutes: {
      '/': {
        name: 'create_event_code',
        component: CreateEventCode
      }
      // '/url': {
      //   component: CreateUrl
      // },
      // 'information': {
      //   component: CreateEventInfo
      // }
    }
  },
  'update-event': {
    name: 'update_event',
    component: UpdateEvent
  },
  '/resell': {
    component: Resell,
    subRoutes: {
      '/': {
        name: 'resell',
        component: ResellSummary
      },
      '/request-code': {
        name: 'request_code',
        component: RequestCode
      },
      '/sell-code': {
        name: 'sell_code',
        component: SaleCode
      }
    }
  },
  '/follow-reseller': {
    name: 'follow_reseller',
    component: FollowReceller
  },
  '/event/stats': {
    name: 'event_stats',
    component: EventStats
  },
  '/admin': {
    name: 'admin',
    component: Admin
  },
  '/test': {
    name: 'test',
    component: Test
  }
};

export default router_map

