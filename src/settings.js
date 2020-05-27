/*
 * @Author: shiliangL
 * @Date: 2020-05-27 09:43:51
 * @LastEditTime: 2020-05-27 09:50:24
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/src/settings.js
 */
module.exports = {
  title: 'Topevery-Ui Admin',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
