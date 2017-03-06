'use strict';

// en
module.exports = {
  coming_title: 'Dropmeet Event',
  coming_desc: 'Welcome to join this event',
  time: '{0}-{1}-{2} {3}:{4}',
  button: {
    cancel: 'Cancel',
    back: 'Back',
    checked_in: 'Checkin',
    checked_out: 'Checkout',
    event: {
      like: 'Tag',
      unlike: 'Untag'
    },
    create_event: {
      new_event: 'New Event',
      request_code: 'Request Event Code',
      next: 'Next',
      skip_next: 'Skip & enter event detail',
      save_share: 'Save & Share to Friends'
    },
    reseller: {
      call_code: 'Call Sales Rep',
      copy_code: 'Copy Event Code',
      back: 'Back'
    },
    //2016-12-18
    invite_code: 'Create Invite Code',
    //2017-1-2
    excel_button: {
      export: 'Export',
      export_mail: 'Export And Send'
    },
    //2017-1-9
    qr_button: 'Spread',

    verification_code: 'Send Verification Code',
    active_verification_code: 'The Verification Code has been sent to the phone number'
  },
  status: {
    rsvp: 'RSVP',
    checked_in: 'Checked-in',
    checked_out: 'Checked-out'
  },
  header: {
    profile: {
      title: 'My Dropmeet events',
      managing: 'Managing',
      interested: 'Interested',
      rsvp: 'My RSVP'
    },
    event: {
      // title: 'My @Coming events',
      time: 'Time',
      place: 'Place',
      interested: 'Interested'
    },
    create_event: {
      title: 'My Dropmeet Service',
      sub_title: 'Create my Dropmeet events'
    },
    reseller: {
      title: 'My Resell Business',
      reseller_id: 'Reseller ID',
      status: 'Status',
      status_value: {
        valid: 'Valid',
        canceled: 'Canceled'
      }
    },
    admin: {
      title: 'HQ Business',
      admin_id: 'My ID'
    }
  },
  loading: {
    text: 'loading...'
  },
  dialog: {
    cancel_text: 'Cancel',
    confirm_text: 'OK',

    is_sharing_info: {
      title: 'Notes on Sharing',
      content: 'You are about to share your WeChart avatar, nickname and geo-tag to others' +
               'who are also interested in the event. You can stop sharing above data anytime you like.',
      cancel_text: 'Cancel',
      confirm_text: 'OK'
    },
    enter_telephone: {
      header: 'Mobiel phone number required to register',
      tel: 'Your mobile phone',
      tel_placeholder: 'Enter your mobiel phone',
      warn_msg_telephone: 'Please enter the right phone number',
      confirm_text: 'OK',
      verification_code_placeholder: 'Enter Verification Code',
      warn_msg_verification_code: 'Please enter the right phone number and verification code'
    },
    //2017-1-10
    invite_code: {
      header: 'Please enter the invite code',
      title: 'Invite Code',
      placeholder: 'Enter the invite code',
      warn_msg: 'Please enter the right invite code',
    },

    enter_info: {
      header: 'Something about yourself',
      job_title: 'Job Title',
      organization: 'Organization',
      warn_msg: 'Please enter your Job and Organization',
      confirm_text: 'OK'
    },
    change_info: {
      job_org: {
        title: 'Edit job and organization',
        warn_msg: 'Please enter your Job and Organization',
        job: {
          title: 'Job',
          placeholder: 'Job'
        },
        organization: {
          title: 'Organization',
          placeholder: 'Organization'
        }
      },
      hobby: {
        title: 'Edit need and offer',
        warn_msg: 'Please enter your need and offer',
        i_need: {
          title: 'I need',
          placeholder: 'I need'
        },
        i_offer: {
          title: 'I offer',
          placeholder: 'I offer'
        }
      },
      time_place: {
        title: 'Share my location',
        //add 2016-11-16
        warn_msg: 'Please enter the location',

        last_showup_location: {
          title: 'last show up location',
          placeholder: 'Please type name of your current spot'
        }
      },

      cancel_text: 'Cancel',
      confirm_text: 'Save'
    },
    code_error: {
      title: 'Error',
      content: 'Event Code is incorrect or used',
      cancel: 'Cancel',
      confirm: 'OK',
    },
    event_info: {
      title: 'Enter the event information',
      warn_msg: 'Please enter the name and place',
      name: {
        title: 'Name',
        placeholder: 'Name'
      },
      start_time: {
        title: 'Start time',
        placeholder: 'Start time'
      },
      end_time: {
        title: 'End time',
        placeholder: 'End time'
      },
      place: {
        title: 'Place',
        placeholder: 'Place'
      },
      cancel_text: 'Cancel',
      confirm_text: 'Save'
    },
    //2017-1-2
    email_info: {
     header: 'Please enter the email,and the excel will send to this email',
      warn_msg: 'Please enter the right email',
      email: {
        title: 'Email',
        placeholder: 'Email'
      }
    },
  },

  error: {
    default: {
      title: 'Error message',
      content: 'Request failed, please try again later'
    },
    updateCurrentUser: {
      title: 'Error message',
      content: 'Please enter the right message '
    },
    getEventCode: {
      title: 'Error message',
      content: 'Your event code is incorrect or used'
    },
    putInventory: {
      title: 'Error message',
      content: 'Your event code inventory is empty'
    },
    createEvent: {
      title: 'Error message',
      content: 'Please enter the event name and place'
    },
    invite_code: {
      title: 'Error Message',
      content: 'Please enter the right invite code'
    },
    user_not_following: 'The user has left this event'
  },

  footer_menus: {
    cancel: 'Cancel',
    index: {
      new_event: 'New Event',
      reseller: 'Resell',
      admin: 'HQ Business'
    },
    event: {
      // sign_up: 'Signup to this event at 活动行',
      checked_in: 'Checkin',
      checked_out: 'Checkout',
      participant: {
        rsvp: 'RSVP',
        not_going: 'Not going',
        stop_sharing: 'Stop sharing my status & leave'
      },
      manager: {
        stats: 'Manage',
        checked_in: 'Participant checks in'
      }
    },
    reseller: {
      request_code: 'Request Event Code Inventory',
      sell_code: 'Sell Event Code'

    }
  },

  index: {
    event_list_empty: "You have no Dropmeet event. Please click + below to add"
  },

  event: {
    from: 'from',
    likes: 'Tagged',
    start_time: 'Start time ',
    create_event: {
      event_code: {
        code_title: 'Please enter your Event Code to build your own Dropmeet',
        placeholder: 'Paste your Event Code here',
        code_error_msg: 'Please enter the right event code',
        code_empty_msg: 'you have no event code',
        request_title: 'No Event Code?'
      },
      event_url: {
        url_title: "Please copy & paste your external event URL here. We'll get event detail for you:",
        placeholder: "Paste your event URL here"
      },
      event_info: {
        title: 'event title',
        sub_title: 'enter the title and place create event',
        time: 'Time',
        place: 'Place',
        start_time: 'Start time',
        end_time: 'End time',
        start_time_warn: 'Please select start time',
        end_time_warn: 'Please select end time',
        notify: "Once finish,'Save & Share' this event to your WeChat friends or groups,and start " +
                "tracking interested" + " participants!"
      }
    },
    event_stats: {
      interested: 'Interested',
      rsvp: 'RSVP',
      checked_in: 'Checked-in',
      incoming_visits: 'Incoming visits',
      interested_total: 'Interested total',
      rsvp_total: 'RSVP total',
      checked_in_total: 'Checked-in total',

      // 2016-12-26
      count_nav: 'Count',
      excel_nav: 'Export',
      //2017-1-9
      qr_nav: 'QRCode',
      invite_code_nav: 'Invite',
      invite_code_notice: 'Click the button to create the invite code',
      //2017-1-10
      copy_paste_code_notice: 'and then long press the invite code to copy',
      excel_notice: 'Click the button to export excel, and send it to mailbox',
      //2017-1-9
      qr_notice: 'The event\'s QR code',
      qr_title: 'Long press and copy the event url',

      invite_code_status: {
        used: 'Used',
        unused: 'Unused'
      },
      // 2016-12-28
      invite_code_header: 'Invite Code List',
      //2017-1-4
      email_success_notice: 'The excel has been sent to the mailbox,please check'
    },
    details: {},
    // 2017-1-5
    classify: {
      interested: 'Interested',
      rsvp: 'RSVP',
      checked_in: 'Checked-in',
      most_tagged: 'Most Tagged'
    }
  },
  user: {
    job_title: 'Job:',
    organization: 'Organization:',
    i_offer: 'I offer:',
    i_need: 'I need:',
    last_show_time: 'Last show up at:',
    // last_show_place: 'Last showup at:',
    not_sharing: 'Not sharing',
    like: 'Tag',
    unlike: 'Untag',
    not_sharing_showup: 'Not sharing',

    // 2017-1-4
    select_lang_title: 'Please selected languages',
    lang_title: 'Language',

    // 2017-1-5
    edit_last_showup: "You can edit the last show up location"
  },

  reseller: {
    summary: {
      sold: 'Sold',
      used: 'Used',
      inventory: 'Inventory',
      total: 'Total'
    },
    request_code: {
      notify: 'Click to call sales rep to request more Event Code'
    },
    sell_code: {
      notify: 'Please copy & paste this Event Code to people who want to new Dropmeet event:'
    },
    follow_reseller: {
      notify: 'Please call our sales reps to request more Event Code'
    }
  },

  // 2016-11-15 add
  notice: {
    like_status: {
      true: '{0} tagged you',
      false: '{0} un-tagged you'
    },
    checkin_status: {
      true: '{0} checked-in',
      false: '{0} checked-out'
    },
    rsvp_status: {
      true: '{0} rsvp',
      false: '{0} not rsvp'
    },
    joining_status: {
      true: '{0} joining in this event',
      false: '{0} leaving this event'
    }
  },

  messages: {
    like_status: {
      true: '{0} tagged you in {1} event',
      false: '{0} un-tagged you in {1} event',
    },
    checkin_status: {
      true: '{0} checked-in in {1} event',
      false: '{0} checked-out in {1} event',
    },
    rsvp_status: {
      true: '{0} rsvp in {1} event',
      false: '{0} not rsvp in {1} event'
    },
    joining_status: {
      true: '{0} joining in the {1} event',
      false: '{0} leaving this {1} event'
    }
  },

  //2016-12-3 add
  // loading_text: 'More... | Loading... | The end'
  loading_text: {
    more: 'More...',
    loading: 'Loading...',
    end: 'The end'
  },

  more_status: 'More...',
  loading_status: 'Loading...',
  end_status: 'The end',

  //2016-12-26
  event_is_start_error: 'Event already started',
  event_not_start_error: 'Event hasn\'t started yet',
  event_has_end_error: 'Event already ended.',

  //2016-12-27
  invite_code_used_time: {
    s: ' just now',
    m: ' mins ago',
    h: ' hours ago',
    d: ' day ago',
  }
};
