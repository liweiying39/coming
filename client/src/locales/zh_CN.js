'use strict';

// zh_CN
module.exports = {
  coming_title: 'Dropmeet活动',
  coming_desc: '欢迎参加本次活动',
  time: '{0}-{1}-{2} {3}:{4}',
  button: {
    cancel: '取消',
    back: '返回',
    checked_in: '签到',
    checked_out: '签出',
    event: {
      like: '标记',
      unlike: '取消标记'
    },
    create_event: {
      new_event: '新建活动',
      request_code: '申请活动码',
      next: '下一步',
      skip_next: '忽略并进入活动',
      save_share: '保存并分享给朋友'
    },
    reseller: {
      call_code: '呼叫销售代表',
      copy_code: '复制活动码',
      back: '返回'
    },
    //2016-12-18
    invite_code: '创建邀请码',
    //2017-1-2
    excel_button: {
      export: '导出',
      export_mail: '导出并发送'
    },

    //2017-1-9
    qr_button: '传播',
    verification_code: '发送短信校验码'
  },
  status: {
    rsvp: '报名',
    checked_in: '已签到',
    checked_out: '已签出'
  },
  header: {
    profile: {
      title: '我的 Dropmeet 活动',
      managing: '我发起的',
      interested: '感兴趣的',
      rsvp: '我已报名的'
    },
    event: {
      // title: 'My @Coming events',
      time: '时间',
      place: '地点',
      interested: '感兴趣的'
    },
    create_event: {
      title: '我的 Dropmeet 服务',
      sub_title: '创建我的 Dropmeet 活动'
    },
    reseller: {
      title: '我的分销业务',
      reseller_id: '分销商ID',
      status: '状态',
      status_value: {
        valid: '有效',
        canceled: '已取消'
      }
    },
    admin: {
      title: '总部业务',
      admin_id: '我的ID'
    }
  },
  loading: {
    text: '载入中......'
  },
  dialog: {
    cancel_text: '取消',
    confirm_text: '确认',

    is_sharing_info: {
      title: '隐私提醒',
      content: '您将分享您的微信头像、昵称以及位置信息给其他人' +
               '他们也对本活动感兴趣。您可以随时通过+菜单停止分享并离开。',
      cancel_text: '取消',
      confirm_text: '确认'
    },
    enter_telephone: {
      header: '需要用您的手机号注册',
      tel: '您的手机号',
      tel_placeholder: '输入您的手机号',
      warn_msg_telephone: '请输入正确的手机号',
      confirm_text: 'OK',
      verification_code_placeholder: '输入短信校验码',
      warn_msg_verification_code: '请输入正确的手机号和短信校验码'
    },
    //2017-1-10
    invite_code: {
      header: '请输入邀请码',
      title: '邀请码',
      placeholder: '输入邀请码',
      warn_msg: '请输入正确的邀请码',
    },

    enter_info: {
      header: '您的简要介绍',
      job_title: '工作职位',
      organization: '组织',
      warn_msg: '请输入您的工作职位和组织名称',
      confirm_text: 'OK'
    },
    change_info: {
      job_org: {
        title: '编辑工作和组织',
        warn_msg: '请输入您的工作职位和组织',
        job: {
          title: '工作职位',
          placeholder: '工作职位'
        },
        organization: {
          title: '组织',
          placeholder: '组织名称'
        }
      },
      hobby: {
        title: '编辑需要和给予',
        warn_msg: '请输入您的需要和提供',
        i_need: {
          title: '我需要',
          placeholder: '我需要'
        },
        i_offer: {
          title: '我提供',
          placeholder: '我提供'
        }
      },
      time_place: {
        title: '共享我的位置',
        //add 2016-11-16
        warn_msg: '请输入位置信息',

        last_showup_location: {
          title: '最后出现在',
          placeholder: '请描述您的当前位置'
        }
      },

      cancel_text: '取消',
      confirm_text: '保存'
    },
    code_error: {
      title: '出错啦',
      content: '活动码不正确或已被使用',
      cancel: '取消',
      confirm: '确认',
    },
    event_info: {
      title: '输入活动信息',
      warn_msg: '请输入活动名称和地点',
      name: {
        title: '名称',
        placeholder: '名称'
      },
      start_time: {
        title: '开始时间',
        placeholder: '开始时间'
      },
      end_time: {
        title: '结束时间',
        placeholder: '结束时间'
      },
      place: {
        title: '地点',
        placeholder: '地点'
      },
      cancel_text: '取消',
      confirm_text: '保存'
    },
    //2017-1-2
    email_info: {
      header: '请输入导出Excel文件的接收邮箱',
      warn_msg: '请输入正确的邮箱',
      email: {
        title: '邮箱',
        placeholder: '邮箱'
      }
    },
  },

  error: {
    default: {
      title: '错误信息',
      content: '请求失败，请稍后再试一次'
    },
    updateCurrentUser: {
      title: '错误信息',
      content: '请输入正确的信息 '
    },
    getEventCode: {
      title: '错误信息',
      content: '您的活动码不正确或已被使用'
    },
    putInventory: {
      title: '错误信息',
      content: '您的活动码库存为空'
    },
    createEvent: {
      title: '错误信息',
      content: '请输入活动名称和地点'
    },
    user_not_following: '用户已离开此活动'

  },

  footer_menus: {
    cancel: '取消',
    index: {
      new_event: '新建活动',
      reseller: '分销',
      admin: '总部业务'
    },
    event: {
      // sign_up: 'Signup to this event at 活动行',
      checked_in: '签到',
      checked_out: '签出',
      participant: {
        rsvp: '报名',
        not_going: '取消报名',
        stop_sharing: '停止共享我的状态并离开'
      },
      manager: {
        stats: '管理',
        checked_in: '参加者签到'
      }
    },
    reseller: {
      request_code: '申请活动码库存',
      sell_code: '销售活动码'

    }
  },

  index: {
    event_list_empty: "您没有 Dropmeet 活动。请点击 + 添加"
  },

  event: {
    from: 'from',
    likes: '已标记',
    start_time: '开始时间 ',
    create_event: {
      event_code: {
        code_title: '请输入您的活动码以新建 Dropmeet 活动',
        placeholder: '粘贴你的活动码到这里',
        code_error_msg: '请输入正确的活动码',
        code_empty_msg: '您没有活动码',
        request_title: '没有活动码？'
      },
      event_url: {
        url_title: "请复制粘贴您的活动详情页面URL到这里。我们将自动提取关键活动信息：",
        placeholder: "粘贴你的外部活动页面URL到这里"
      },
      event_info: {
        title: '活动名称',
        sub_title: '输入活动名称和地点来创建活动',
        time: '时间',
        place: '地点',
        start_time: '开始时间',
        end_time: '结束时间',
        start_time_warn: '请选择开始时间',
        end_time_warn: '请选择结束时间',
        notify: "完成后，请保存和分享此活动给你的微信朋友或微信群，并开始 " +
                "跟踪传播进展" + " 以及谁感兴趣!"
      }
    },
    event_stats: {
      interested: '感兴趣的',
      rsvp: '已报名',
      checked_in: '已签到',
      incoming_visits: '访问量',
      interested_total: '感兴趣总计',
      rsvp_total: '已报名总计',
      checked_in_total: '已签到总计',

      // 2016-12-26
      count_nav: '统计',
      excel_nav: '导出',

      //2017-1-9
     qr_nav: '传播',

      invite_code_nav: '邀请码',
      invite_code_notice: '点击按钮创建邀请码',
      //2017-1-10
      copy_paste_code_notice: '长按复制邀请码',
      excel_notice: '点选按钮导出签到表到Excel，并发送到指定邮箱',
      //2017-1-9
      qr_notice: '活动分享二维码',
      qr_title: '长按复制并粘贴活动链接',

      invite_code_status: {
        used: '已使用',
        unused: '未使用'
      },
      // 2016-12-28
      invite_code_header: '邀请码列表'
    },
    details: {},
    // 2017-1-5
    classify: {
      interested: '感兴趣的',
      rsvp: '已报名',
      checked_in: '已签到',
      most_tagged: '被标记最多'
    }
  },
  user: {
    job_title: '工作职位:',
    organization: '组织:',
    i_offer: '我提供:',
    i_need: '我需要:',
    last_show_time: '最后出现位置:',
    // last_show_place: 'Last showup at:',
    not_sharing: '没有共享',
    like: '标记',
    unlike: '取消标记',
    not_sharing_showup: '没有共享',

    // 2017-1-4
    select_lang_title: '请选择语言',
    lang_title: '语言',

    // 2017-1-5
    edit_last_showup: "你可以编辑最后出现的位置"
  },

  reseller: {
    summary: {
      sold: '已售出',
      used: '已使用',
      inventory: '库存',
      total: '总计'
    },
    request_code: {
      notify: '点选按钮呼叫销售代表，获取更多活动码'
    },
    sell_code: {
      notify: '请复制粘贴活动码，发给需要新建 Dropmeet 活动的人:'
    },
    follow_reseller: {
      notify: '请呼叫我们的销售代表索取更多活动码'
    }
  },

  // 2016-11-15 add
  notice: {
    like_status: {
      true: '{0} 标记了你',
      false: '{0} 停止标记你'
    },
    checkin_status: {
      true: '{0} 已签到',
      false: '{0} 已签出'
    },
    rsvp_status: {
      true: '{0} 已报名',
      false: '{0} 未报名'
    },
    joining_status: {
      true: '{0} 在加入此活动',
      false: '{0} 在离开此活动'
    }
  },

  messages: {
    like_status: {
      true: '{0} 在 {1} 活动中标记了你。',
      false: '{0} 在 {1} 活动中停止标记你。',
    },
    checkin_status: {
      true: '{0} 已签到参加 {1} 活动',
      false: '{0} 已签出 {1} 活动',
    },
    rsvp_status: {
      true: '{0} 已报名活动 {1}',
      false: '{0} 取消报名 {1} 活动'
    },
    joining_status: {
      true: '{0} 正在加入 {1} 活动',
      false: '{0} 正在离开 {1} 活动'
    }
  },

  //2016-12-3 add
  // loading_text: 'More... | Loading... | The end'
  loading_text: {
    more: '更多...',
    loading: '载入中...',
    end: '结尾'
  },

  more_status: '更多...',
  loading_status: '载入中...',
  end_status: '结尾',

  //2016-12-26
  event_is_start_error: '活动已经开始',
  event_not_start_error: '活动未开始',
  event_has_end_error: '活动已结束',

  //2016-12-27
  invite_code_used_time: {
    s: '刚刚',
    m: '分钟前',
    h: '小时前',
    d: '天前',
  }
};

