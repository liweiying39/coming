'use strict';
(function () {
  const rbac = {
    CLIENT_ROLE: 'client',
    RESELLER_ROLE: 'reseller',
    ADMIN_ROLE: 'admin',
    MANAGER_ROLE: 'manager',
    PARTICIPANT_ROLE: 'participant',
    GUEST_ROLE: null,

    allow_list: null,
    deny_list: null
  };

  /**
   * 为当前rbac添加允许访问的role
   * 允许的role之间为或关系
   *
   * Example::
   *   rbac.allow(rbac.MANAGER_ROLE, rbac.CLIENT_ROLE).check(...)
   */
  rbac.allow = function (...args) {
    this.allow_list = args.splice(0, args.length);
    return this;
  };

  /**
   * 为当前rbac添加禁止访问的role
   * 禁止的role之间为或关系
   *
   * 调用了deny之后，allow则无效
   *
   * Example::
   *   rbac.deny(rbac.MANAGER_ROLE).check(...)
   *
   */
  rbac.deny = function (...args) {
    this.deny_list = args.splice(0, args.length);
    return this;
  };

  /**
   * 根据给定的参数检查此前allow或deny的角色
   *
   * 参数列表中最后一个参数需要为function作为检查后回调的函数
   *
   * Example::
   *   rbac.allow(...).check(role, function(can_pass) {...})
   */
  rbac.check = function (...args) {
    let callback = args.slice(-1)[0];
    if (typeof callback !== 'function') throw new Error('callback is not a function');

    const check_list = args.slice(0, -1);
    let can_pass = true;
    if (this.deny_list) {
      for (let check of check_list) {
        if (this.deny_list.indexOf(check) !== -1) {
          can_pass = false;
          break;
        }
      }
    } else {
      can_pass = false;
      for (let check of check_list) {
        if (this.allow_list.indexOf(check) !== -1) {
          can_pass = true;
          break;
        }
      }
    }
    this.init();
    return callback(can_pass);
  };

  /**
   * 初始化rbac
   */
  rbac.init = function () {
    this.allow_list = null;
    this.deny_list = null;
    return this;
  };

  module.exports = rbac;
})();
