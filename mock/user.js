/*
 * @Author: shiliangL
 * @Date: 2020-05-27 09:43:51
 * @LastEditTime: 2020-05-27 11:02:35
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/mock/user.js
 */

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://user-gold-cdn.xitu.io/2017/11/12/28d5b3e40b283b37045283324ecde57d?imageView2/1/w/180/h/180/q/85/format/webp/interlace/1',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://user-gold-cdn.xitu.io/2017/11/12/28d5b3e40b283b37045283324ecde57d?imageView2/1/w/180/h/180/q/85/format/webp/interlace/1',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
