'use strict';

function smoothUserData (user_data) {
  Object.keys(user_data.information).forEach((key) => {
    user_data[key] = user_data.information[key];
  });

  user_data.information = null;

  if (!user_data.last_showup_location)
    user_data.last_showup_location = '';
  if (!user_data.last_showup_time)
    user_data.last_showup_time = null;
  return user_data;
}

const methods = {

  test: {
    url: '/test',
    method: 'GET',
    success: (response) => {
      return response.data;
    }
  },

  getToken: {
    url: '/token',
    method: 'GET',
    success: (response) => {
      return response.data;
    }
  },

  getCurrentUser: {
    url: '/user',
    method: 'GET',
    success: (response) => {
      if (response.data.current_user.event) {
        const event = response.data.current_user.event;
        event.information.start_time = new Date(event.information.start_time);
        event.information.end_time = new Date(event.information.end_time);

        //如果传过来的last_shouw_time为0,那么就不转换
        if (event.last_showup_time)
          event.last_showup_time = new Date(event.last_showup_time);

      }
      return smoothUserData(response.data.current_user);
    }
  },

  postUserTelephone: {
    url: '/user/telephone',
    method: 'POST',
    success: (response) => {
      return response.data;
    }
  },

  putUserTelephone: {
    url: '/user/telephone',
    method: 'PUT',
    success: (response) => {
      return response.data;
    }
  },

  getEventMessages: {
    url: '/message',
    method: 'GET',
    success: (response) => {
      return response.data;
      // return {
      //   messages: [
      //     {
      //       event_id: 2,
      //       sub_type: 'like_status',
      //       body: {
      //         from: 'aaa',
      //         value: true,
      //       }
      //     }
      //   ]
      // };
    }
  },

  putMessagesRead: {
    url: '/message',
    method: 'PUT',
    success: (response) => {
      return response.data;
    }
  },


  getUserEvents: {
    url: '/user/events',
    method: 'GET',
    // mood: true,
    // success: () => {
    //   return [
    //     {
    //       "event_id": 1,
    //       "likes": 10,
    //       "role": "manager" | "participant",
    //       "status": {
    //         "is_rsvp": true,
    //         "is_checkin": false,
    //         "is_checkout": false
    //       },
    //       "information": {
    //         "name": "活动名字",
    //         "place": "活动地点",
    //         "start_time": new Date(),
    //         "end_time": new Date()
    //       },
    //       is_sharing_showup: true,
    //       last_showup_location: 'dd',
    //       last_showup_time: new Date()
    //     }
    //   ]
    // },
    success: (response) => {
      response.data.events.map((obj) => {
        obj.information.start_time = new Date(obj.information.start_time);
        obj.information.end_time = new Date(obj.information.end_time);
      });
      return response.data.events;
    }
  },

  getEvent: {
    url: '/event/:event_id',
    method: 'GET',
    success: (response) => {
      const event = response.data.event;
      event.start_time = new Date(event.start_time);
      event.end_time = new Date(event.end_time);

      return response.data;
    }
  },

  getEventUsers: {
    url: '/event/:event_id/users',
    method: 'GET',
    success: (response) => {
      return response.data;
    }
  },

  updateEvent: {
    url: '/event/:event_id',
    method: 'PUT',
    success: (response) => {
      return response.data;
    }
  },

  getEventCode: {
    url: '/event/code',
    method: 'GET',
    success: (response) => {
      return response.data.event_code;
    }
  },

  createEvent: {
    url: '/event',
    method: 'POST',
    success: (response) => {
      return response.data.event;
    }
  },


  updateCurrentUser: {
    url: '/user',
    method: 'PUT',
    success: (response) => {
      return smoothUserData(response.data.current_user);
    }
  },

  updateCurrentStatus: {
    url: '/event/:event_id/user',
    method: 'PUT',
    success: (response) => {
      let event = response.data.current_user.event;
      event.last_showup_time = new Date(event.last_showup_time);

      return response.data.current_user;
    }
  },

  deleteEvent: {
    url: '/user/events',
    method: 'DELETE',
    success: (response) => {
      return response.data
    }
  },

  getEventStats: {
    url: '/event/:event_id/stats',
    method: 'GET',
    success: (response) => {
      const event = response.data.event;
      event.start_time = new Date(event.start_time);
      return response.data;
    }
  },

  followEvent: {
    url: '/user/events',
    method: 'POST',
    success: (response) => {
      return response.data.event;
    }
  },

  getOtherUser: {
    url: '/user/:user_id',
    method: 'GET',
    success: (response) => {
      let event = response.data.current_user.event;
      event.last_showup_time = new Date(event.last_showup_time);

      return response.data.current_user;
    }
  },

  putUserLikes: {
    url: '/user/:user_id/like',
    method: 'PUT',
    success: (response) => {
      return response.data.user.event.is_liked;
    }
  },

  getReseller: {
    url: '/reseller',
    method: 'GET',
    success: (response) => {
      return response.data.current_user;
    }

  },

  putResellerInventory: {
    url: '/reseller/inventory',
    method: 'PUT',
    success: (response) => {
      return response.data.event_code;
    }
  },

  getAdminTel: {
    mock: true,
    url: '/',
    method: 'GET',
    success: (response) => {
      return {
        name: 'Chance',
        tel: '13006899827',
        avatar: 'kdkdgre'
      }
    }
  },

  getAdminBusiness: {
    url: '/admin/business',
    method: 'GET',
    success: (response) => {
      return response.data.business;
    }
  },

  getJsConfig: {
    url: '/jsapi',
    method: 'GET',
    success: (response) => {
      return response.data.config;
    }
  },

  getUserNews: {
    url: '',
    method: 'GET',
    mock: true,
    success: (response) => {
      return ['new1', 'new2', 'new3', 'new4', 'new5'];
    }
  },

  getInviteCodeList: {
    url: '/event/:event_id/invite-code',
    method: 'GET',
    success: (response) => {
      // return {
      //   invite_codes: [
      //     {
      //       code: '232434',
      //       name: 'glrgjirtgjoygkltjiytl',
      //       used_at: Date.now(),
      //       is_used: true
      //     },
      //     {
      //       code: '232434',
      //       name: null,
      //       used_at: null,
      //       is_uesd: false
      //     }
      //   ]
      // }

      return response.data;
    }
  },

  createInviteCode: {
    url: '/event/:event_id/invite-code',
    // mock: true,
    method: 'POST',
    success: (response) => {
      // return {
      //   invite_code: {
      //     code: '232434',
      //     name: null,
      //     used_at: null,
      //     is_uesd: false
      //   }
      // }
      return response.data;
    }
  },

  updateInviteCode: {
    url: '/event/:event_id/invite-code',
    // mock: true,
    method: 'PUT',
    success: (response) => {
      // return {
      //   invite_code: {
      //     code: '232434',
      //     name: 'balabala',
      //     used_at: Date.now(),
      //     is_uesd: true
      //   }
      // }
      return response.data;
    }
  },

  sendEventStatsEmail: {
    url: '/event/:event_id/stats',
    method: 'POST',
    success: (response) => response.data
  }
};


export default methods;
