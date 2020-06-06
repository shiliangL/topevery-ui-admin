/*
 * @Author: shiliangL
 * @Date: 2020-06-04 10:04:10
 * @LastEditTime: 2020-06-04 11:06:51
 * @LastEditors: Do not edit
 * @Description: 命令行创建页面+api文件夹
 * @FilePath: /topevery-ui-admin-dev/scripts/build-page.js
 */

/**
 * 自动生成文件脚本,执行命令 npm run tep `文件名`
 */

// eslint-disable-next-line import/no-commonjs
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const dirName = process.argv[2]

// eslint-disable-next-line no-unused-vars
function titleCase(str) {
  const array = str.toLowerCase().split(' ')
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length)
  }
  const string = array.join(' ')
  return string
}

// eslint-disable-next-line no-unused-vars
function resolvePath(...file) {
  return path.resolve(__dirname, ...file)
}

// eslint-disable-next-line no-unused-vars
const hasComponentExists = (tepPath) => fs.existsSync(tepPath)

if (!dirName) {
  console.log('文件夹名称不能为空！')
  console.log('示例：npm run tep test')
  process.exit(0)
}

// 页面模版
const indexTep = `
<template>
  <div class="${dirName}">
    ${dirName}页面
  </div>
</template>

<script>

import { fetchList, saveOne, updateOne, deleteOne } from '@/api/${dirName}'

export default {
  name: '${titleCase(dirName)}',
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.${dirName}{

}
</style>
`

// service页面模版
const tepApi = `
import request from '@/utils/request'

export const fetchList = (params) => {
  return request({
    url: '/api/bigdata/xxxx',
    method: 'get',
    params
  })
}

export const saveOne = (data) => {
  return request({
    url: '/api/bigdata/xxxx',
    method: 'post',
    data
  })
}

export const updateOne = (data) => {
  return request({
    url: '/api/bigdata/xxxx',
    method: 'post',
    data
  })
}

export const deleteOne = (data) => {
  return request({
    url: '/api/bigdata/xxxx',
    method: 'post',
    data
  })
}
`

if (!hasComponentExists(`./src/views/${dirName}`)) {
  fs.mkdirSync(`./src/views/${dirName}`) // mkdir $1
} else {
  return console.log(chalk.red(`./src/views/${dirName}`, '文件夹已经存在'))
}

if (!hasComponentExists(`./src/api/${dirName}`)) {
  fs.mkdirSync(`./src/api/${dirName}`) // mkdir $1
} else {
  return console.log(chalk.red(`./src/api/${dirName}`, '文件夹已经存在'))
}

process.chdir(`./src/views/${dirName}`) // cd $1
fs.writeFileSync('index.vue', indexTep)
console.log(chalk.green(`${dirName}-page创建完成,请手补全其他信息`))

process.chdir(`../../api/${dirName}`) // cd $1
fs.writeFileSync('index.js', tepApi)

console.log(chalk.green(`${dirName}-api创建完成,请手补全其他信息`))
process.exit(0)
