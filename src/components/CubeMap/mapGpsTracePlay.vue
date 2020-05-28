<template>
  <bm-control
    :anchor="anchor"
    :offset="offset"
    @ready="mapReady"
  >
    <div v-if="map" class="trace-control clearfix">
      <!-- 轨迹播放菜单 -->
      <div class="trace-play-content clearfix">
        <!-- 时间范围 -->
        <div class="trace-play-item fl trace-play-picker">
          <el-date-picker
            v-model="choiceDay"
            :disabled="loading"
            style="width:110px"
            type="date"
            size="mini"
            :clearable="false"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            popper-class="tracePopper"
            :picker-options="pickerOptions"
          />
        </div>
        <div
          class="timeBox fl"
          style="margin-right:15px"
        >
          <el-time-picker
            v-model="rangeTime"
            :disabled="loading"
            is-range
            size="mini"
            value-format="HH:mm"
            format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            style="width: 260px"
            :clearable="false"
          />
        </div>
        <!-- 播放速率 -->
        <div class="trace-play-item fl trace-play-select">
          <el-select
            v-model="speedValue"
            size="mini"
            :disabled="loading"
            @change="speedChange"
          >
            <el-option
              v-for="item in speedList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- 播放按钮 进度条 -->
        <div class="trace-play-item fl trace-progress">
          <el-button
            v-if="status === 0"
            ref="btnStartPlay"
            size="mini"
            type="primary"
            :loading="loading"
            @click="startPlay"
          >播放</el-button>
          <el-button
            v-if="status === 1"
            size="mini"
            type="warning"
            :loading="loading"
            @click="pausePlay"
          >暂停</el-button>
          <el-button
            v-if="status === 2"
            size="mini"
            type="primary"
            @click="continuePlay"
          >继续</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="stopPlay"
          >停止</el-button>
          <div class="trace-progress-wrap">
            <div
              :style="'width:' + playPercentage +'%'"
              class="trace-progress-bar"
            >{{ playPercentage }}%</div>
          </div>
        </div>
      </div>
    </div>
  </bm-control>
</template>

<script>

import { parseTime } from '@/utils'
import GpsTracePlayer from '@/utils/gpsTracePlayer'
// import moment from 'moment'

export default {
  name: 'MapGpsTracePlay',
  props: {
    anchor: {
      type: String,
      default: 'BMAP_ANCHOR_BOTTOM_LEFT'
    },
    offset: {
      type: Object,
      default() {
        return {
          width: 10,
          height: 10
        }
      }
    },
    // 父级数据
    objId: { type: String, default: null },
    objType: { type: Number, default: 0 },
    objName: { type: String, default: '' },
    beginDate: { type: String, default: '' },
    endDate: { type: String, default: '' }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      loading: false,
      playPercentage: 0, // 进度条百分比
      speedValue: 100, // 播放速度
      // 播放速度选择列表
      speedList: [
        {
          value: 1000,
          text: '正常'
        },
        {
          value: 800,
          text: '2倍速'
        },
        {
          value: 400,
          text: '4倍速'
        },
        {
          value: 200,
          text: '8倍速'
        },
        {
          value: 100,
          text: '16倍速'
        },
        {
          value: 50,
          text: '32倍速'
        },
        {
          value: 25,
          text: '64倍速'
        },
        {
          value: 12.5,
          text: '128倍速'
        },
        {
          value: 6.25,
          text: '256倍速'
        }
      ],
      status: 0,
      map: null, // 地图数据
      gpsPlayer: null, // 轨迹播放
      serviceId: '', // 设备号
      choiceDay: '', // 选择的日期, 默认当天
      calendarData: {
        beginEndDate: [],
        objectId: 0,
        objectType: 0
      },
      rangeTime: []
    }
  },
  mounted() {
    this.initWorkerData()
  },
  beforeDestroy() {
    this.map = null
    this.gpsPlayer = null
  },
  methods: {
    initWorkerData() {
      // 设置日历时间
      this.choiceDay = parseTime(new Date(), '{y}-{m}-{d}')
      this.rangeTime = ['00:00', parseTime(new Date(), '{h}:{i}')]
      // 个人日历班次请求参数
      this.calendarData.objectType = this.objType // 0 代表人 1 代表车
      this.calendarData.objectId = this.objId // 设置车辆/人员id
      this.serviceId = this.objId// 设置设备号
    },
    // 地图加载完成再发送请求
    mapReady(res) {
      this.map = res.map // 设置地图数据
      this.initGpsTrace() // 初始化播放轨迹 + api
    },
    // 初始化播放轨迹
    initGpsTrace() {
      const that = this
      this.gpsPlayer = new GpsTracePlayer(this.map, {
        requestUrl: '/gpsTrace/getGpsTrace',
        playingHandler: () => { },
        playPauseHandler: function() { },
        playStopHandler: () => {
          this.loading = false
          this.status = 0
        },
        errorHandler: error => {
          this.$message(error)
        },
        noPointHandler: () => {
          this.status = 0
          this.$message.error('该时间段内没有查找到轨迹。')
          this.loading = false
          this.$emit('traceReady', [], [])
        },
        afterMovePositionHandler: (index, total) => {
          this.playPercentage = ((++index / total) * 100).toFixed(2) * 1
        },
        requestDataSuccessHandler(data, trajectory) {
          that.loading = false
          that.$emit('traceReady', data, trajectory)
        }
      })
    },
    // 播放速度切换
    speedChange(val) {
      this.gpsPlayer.setFreq(val)
    },
    // 开始播放
    startPlay() {
      if (!this.gpsPlayer) return
      this.loading = true
      this.status = 1
      this.playPercentage = 0
      const startTime = this.choiceDay + ' ' + this.rangeTime[0]
      const endTime = this.choiceDay + ' ' + this.rangeTime[1]
      const speed = this.speedValue
      // 设置轨迹播放参数
      this.gpsPlayer.start(
        this.serviceId,
        startTime,
        endTime,
        speed,
        this.objType,
        this.objName,
        this.objId,
      )
      this.showCalendar = false
    },
    // 暂停播放
    pausePlay() {
      this.status = 2
      this.gpsPlayer.pause()
    },
    // 继续播放
    continuePlay() {
      this.status = 1
      this.gpsPlayer.playContinue()
    },
    stopPlay() {
      this.gpsPlayer.clear()
      this.gpsPlayer.stop()
      this.playPercentage = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.fl {
  float: left;
}

.show {
  display: block;
}

.hide {
  display: none;
}

.clearfix:after {
  content: "";
  display: block;
  clear: both;
}

.BMap_noprint {
  width: 99%;
  z-index: 99 !important;
}

.trace-control {
  width: 100%;
  font-size: 14px;
  background-color: #fff;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
}

.trace-member {
  position: absolute;
  left: 0;
  top: 0;
  width: 300px;
  height: 100%;
  line-height: 30px;
  box-sizing: unset;
}

.trace-member-describe {
  position: relative;
  z-index: 6;
  width: 100%;
  padding: 10px 0;
  background-color: #fff;
}

.trace-member-name {
  padding-left: 20px;
  padding-right: 10px;
  color: #333;
  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    vertical-align: middle;
    border-radius: 50%;
  }
  span {
    display: block;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    text-align: center;
    background-color: #ccc;
    border-radius: 50%;
    .icon-onePeople {
      line-height: 30px;
      font-size: 16px;
      color: #aaa;
      margin-top: 4px;
    }
  }
  p {
    display: inline-block;
    width: 140px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
  }
}

.trace-member-arrow,
.trace-member-list-btn {
  width: 30px;
  height: 30px;
}

.trace-member-arrow {
  position: relative;
  padding-right: 10px;
  cursor: pointer;
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 10px;
    height: 10px;
    margin-top: -2px;
    margin-left: -10px;
    border-top: 2px solid #7e7e7e;
    border-right: 2px solid #7e7e7e;
    transform: rotate(-45deg);
  }
  &.down:after {
    margin-top: -8px;
    transform: rotate(135deg);
  }
}

.trace-member-list-btn {
  text-align: center;
  cursor: pointer;
  .icon-people {
    margin-top: 6px;
    width: 20px;
    height: 20px;
    color: #7e7e7e;
  }
}

.trace-member-content {
  position: absolute;
  bottom: 100%;
  left: 0;
  z-index: 3;
  width: 320px;
  padding-bottom: 10px;
  color: #aaa;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
}

.trace-member-details {
  position: relative;
  min-height: 70px;
  padding-left: 80px;
}

.trace-member-avatar {
  position: absolute;
  top: 10px;
  left: 10px;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  overflow: hidden;
  img,
  span {
    display: block;
    width: 60px;
    height: 60px;
  }
  span {
    text-align: center;
    background-color: #ccc;
    .icon-onePeople2 {
      line-height: 30px;
      font-size: 28px;
      color: #aaa;
      margin-top: 14px;
    }
  }
}

.trace-member-title-item {
  display: inline-block;
  vertical-align: top;
}

.trace-member-title-name {
  padding: 5px 0;
  line-height: 20px;
  color: #333;
}

.trace-member-title-icon {
  width: 26px;
  text-align: center;
  &.online {
    color: #6fb50b;
  }
  .icon-signal {
    width: 16px;
    height: 16px;
  }
}

.trace-member-title-tips {
  font-size: 12px;
  color: #fe5c5c;
  .icon-sos {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
}

.trace-member-company,
.trace-member-post {
  font-size: 12px;
  line-height: 18px;
}

.trace-member-car {
  margin-top: 10px;
  margin-bottom: -10px;
  border-top: 1px dashed #e4e4e4;
}

.trace-member-work {
  margin-top: 10px;
  border-top: 1px dashed #e4e4e4;
  border-bottom: 1px dashed #e4e4e4;
  font-size: 0; // 消除 inline-block 左右的间隙
  line-height: 0; // 消除 inline-block 上下的间隙
}

.trace-member-work-item {
  display: inline-block;
  padding: 6px 0;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  border-right: 1px solid #e4e4e4;
}

.trace-member-work-time {
  width: 130px;
}

.trace-member-work-mileage {
  width: 110px;
}

.trace-member-work-second {
  width: 78px;
}

.trace-member-arrangement-title {
  padding: 0 10px;
  line-height: 36px;
  color: #333;
}

.trace-member-arrangement-list {
  padding: 1px 10px 0;
  max-height: 320px;
  overflow-y: auto;
}

.trace-member-arrangement-item {
  position: relative;
  padding-left: 30px;
  margin-top: -1px;
  border: 1px solid #e4e4e4;
}

.trace-member-arrangement-none {
  text-align: center;
  border: 1px solid #e4e4e4;
}

.trace-member-arrangement-number {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 100%;
  text-align: center;
  &:after {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
}

.trace-member-arrangement-details {
  border-left: 1px solid #e4e4e4;
}

.trace-member-arrangement-address {
  border-bottom: 1px dashed #e4e4e4;
}

.trace-member-arrangement-address,
.trace-member-arrangement-time {
  padding: 0 10px;
}

.trace-member-arrangement-standard {
  position: absolute;
  top: 0;
  left: 0;
  width: 61px;
  img {
    display: block;
    width: 100%;
  }
}

.trace-member-work-describe {
  color: #f59a23;
}

.trace-member-work-item:last-child {
  border: none;
}

.trace-play-content {
  position: relative;
  z-index: 10;
  padding: 12px 0 10px;
  border-left: 1px dashed #eee;
  background-color: #fff;
}

.trace-play-picker {
  padding: 0 16px;
  /deep/ .el-input__inner {
    padding: 0 10px;
  }
  /deep/ .el-input__icon {
    display: none;
  }
}

.trace-play-select {
  .el-select {
    width: 88px;
  }
  /deep/ .el-input__inner {
    padding-left: 10px;
  }
}

.trace-progress {
  padding-left: 10px;
  /deep/ .el-progress-bar__innerText {
    margin-top: -4px;
  }
}

.trace-play-area,
.trace-play-point {
  position: relative;
  display: inline-block;
  padding-left: 16px;
  line-height: 28px;
  color: #7f7f7f;
  cursor: pointer;
  user-select: none;
  &:before {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    border: 2px solid #7f7f7f;
    border-radius: 2px;
    margin-right: 10px;
  }
  &:after {
    content: "";
    position: absolute;
    top: 10px;
    left: 21px;
    display: block;
    width: 5px;
    height: 8px;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(45deg);
  }
  &.act {
    color: #f59a23;
    &:before {
      border-color: #f59a23;
      background-color: #f59a23;
    }
  }
}

.trace-calendar-btn {
  padding: 0 10px;
  line-height: 26px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.trace-calendar-wrap {
  position: absolute;
  left: 0;
  bottom: 100%;
  border: 1px solid #ccc;
  background-color: #fff;
}

.trace-calendar {
  /deep/ .wh_content_all {
    background-color: #fff;
    .wh_top_changge li {
      color: #333;
      .wh_jiantou1,
      .wh_jiantou2 {
        border-color: #333;
      }
    }

    .wh_content {
      .wh_content_item {
        color: #333;
      }
      .wh_content_item {
        .wh_item_date {
          border-radius: 100px;
        }
        .nogood,
        .good {
          margin: auto;
          z-index: 2;
          position: relative;
          &::after {
            content: "";
            display: block;
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            top: 2px;
            right: 2px;
            z-index: 100;
          }
        }
        .nogood {
          &::after {
            background-color: #ff4343;
          }
        }
        .good {
          &::after {
            border: 1px solid #28dc90;
          }
        }
        .wh_chose_day,
        .wh_isMark {
          background-color: #409eff;
          color: #fff;
        }
      }
    }
  }
}

.trace-calendar-bottom {
  text-align: right;
  padding: 0 15px 10px;
}

.trace-progress-wrap {
  position: relative;
  display: inline-block;
  width: 300px;
  height: 12px;
  margin-left: 6px;
  font-size: 12px;
  line-height: 12px;
  background-color: #ebeef5;
  border-radius: 20px;
}

.trace-progress-bar {
  text-align: right;
  color: #fff;
  white-space: nowrap;
  background-color: #409eff;
  border-radius: 20px;
  box-sizing: border-box;
}
</style>
