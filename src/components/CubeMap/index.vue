<template>
  <baidu-map
    class="cube-baidu-map"
    :center="centerName"
    :map-click="mapClick"
    @ready="mapReady"
  >
    <!-- 省市区边界 -->
    <bm-boundary
      v-if="showBoundary"
      :disable-mass-clear="true"
      :name="centerName"
      :stroke-weight="2"
      fill-color=""
      stroke-color="red"
      @loaded="boundaryLoaded"
    />

    <!-- 覆盖物 -->
    <template v-if="map">

      <bm-control key="line_list_bm_marker_template">
        <template v-for="(polygon,index) in markerList">
          <bm-marker
            :key="index+'line_list_bm_marker'"
            :position="polygon"
            stroke-color="blue"
            :editing="false"
            :fill-color="styleOptions.fillColor"
            :fill-opacity="styleOptions.fillOpacity"
            :stroke-opacity="styleOptions.strokeOpacity"
            :stroke-style="styleOptions.strokeStyle"
            :stroke-weight="styleOptions.strokeWeight"
            @rightclick="rightclick"
            @lineupdate="polygonUpdate"
          />
        </template>
      </bm-control>

      <bm-control key="line_list_bm_polyline_template">
        <template v-for="(polygon,index) in lineList">
          <bm-polyline
            :key="index+'line_list_bm_polyline'"
            :path="polygon"
            stroke-color="blue"
            :editing="false"
            :fill-color="styleOptions.fillColor"
            :fill-opacity="styleOptions.fillOpacity"
            :stroke-opacity="styleOptions.strokeOpacity"
            :stroke-style="styleOptions.strokeStyle"
            :stroke-weight="styleOptions.strokeWeight"
            @rightclick="rightclick"
            @lineupdate="polygonUpdate"
          />
        </template>
      </bm-control>

      <bm-control key="line_list_bm_polygon_template">
        <template v-for="(polygon,index) in polygonList">
          <bm-polygon
            :key="index+'line_list_bm_polygon'"
            :path="polygon"
            stroke-color="blue"
            :editing="false"
            :fill-color="styleOptions.fillColor"
            :fill-opacity="styleOptions.fillOpacity"
            :stroke-opacity="styleOptions.strokeOpacity"
            :stroke-style="styleOptions.strokeStyle"
            :stroke-weight="styleOptions.strokeWeight"
            @rightclick="rightclick"
            @lineupdate="polygonUpdate"
          />
        </template>
      </bm-control>
    </template>

    <!-- 自定义鼠标右键菜单 -->
    <transition name="el-zoom-in-top">
      <ul
        v-if="visible"
        v-clickOutside="clickOutside"
        :style="{left:left+'px',top:top+'px'}"
        class="contextmenu"
      >
        <li
          v-if="drawType!=='marker' && !editing"
          @click.stop="handlerContextmenu(1)"
        > 编辑 </li>
        <li @click.stop="handlerContextmenu(0)"> 删除 </li>
      </ul>
    </transition>

    <!-- 地图控件 绘图工具-->
    <bm-control
      :anchor="anchor"
      @ready="controlReady"
    >
      <div
        v-if="map"
        class="tools"
      >
        <el-link
          v-show="isEdiing"
          style="border-top: 1px solid red;"
          :underline="false"
          @click.stop="draw(6)"
        > {{ isEdiing ?'编辑中...(点击保存)':'' }}</el-link>

        <el-link
          :underline="false"
          type="primary"
          @click.stop="draw(1)"
        >
          <i class="el-icon-full-screen" /> 视角
        </el-link>

        <template v-if="!previewMode">
          <el-link
            :underline="false"
            type="warning"
            @click.stop="draw(0)"
          > <i class="el-icon-thumb" /> 停止绘制</el-link>
          <el-link
            :underline="false"
            type="primary"
            @click.stop="draw(2)"
          >
            <i class="el-icon-s-flag" /> 标点 </el-link>
          <el-link
            :underline="false"
            type="primary"
            @click.stop="draw(3)"
          >
            <i class="el-icon-crop" /> 画面 </el-link>
          <el-link
            :underline="false"
            type="primary"
            @click.stop="draw(4)"
          >
            <i class="el-icon-minus rotate90" /> 画线
          </el-link>
          <el-link
            :underline="false"
            type="danger"
            @click.stop="draw(5)"
          >
            清空所有绘制</el-link>
          <el-tooltip
            placement="top"
            effect="light"
          >
            <div slot="content">
              1、鼠标右键编辑、删除图形
              <br>
              2、清空所有绘制会清空地图上所有图形
              <br>
              3、画面、画线操作时,双击完成绘制
              <br>
              4、请及时保存地图保证数据同步
            </div>
            <el-link
              :underline="false"
              type="warning"
            >信息提示</el-link>
          </el-tooltip>
        </template>

      </div>
    </bm-control>

    <!-- 外部控件插槽 -->
    <slot name="bm-overlay" />
  </baidu-map>
</template>

<script>

// BMAP_ANCHOR_TOP_LEFT	控件将定位到地图的左上角
// BMAP_ANCHOR_TOP_RIGHT	控件将定位到地图的右上角
// BMAP_ANCHOR_BOTTOM_LEFT	控件将定位到地图的左下角
// BMAP_ANCHOR_BOTTOM_RIGHT	控件将定位到地图的右下角
import vClickOutside from 'v-click-outside'

export default {
  name: 'CubeMap',
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    centerName: {
      type: String,
      default: () => '深圳市'
    },
    anchor: {
      type: String,
      default: () => 'BMAP_ANCHOR_TOP_RIGHT'
    },
    showBoundary: {
      type: Boolean,
      default: () => true
    },
    mapClick: {
      type: Boolean,
      default: () => false
    },
    previewMode: {
      type: Boolean,
      default: () => false
    },
    markerList: {
      type: Array,
      default: () => []
    },
    lineList: {
      type: Array,
      default: () => []
    },
    polygonList: {
      type: Array,
      default: () => []
    },
    // 地图状态 如果是编辑中
    // 则引导用户确认编辑
    // 确认编辑之后将同步地图坐标
    isEdiing: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      map: null,
      drawType: null,
      editing: false, // 是否是编辑状态
      canEmitChange: false,
      addNewOverLayout: [], // 暂时存放新增覆盖物。
      styleOptions: {
        strokeColor: 'blue', // 边线颜色。
        fillColor: '#3689F3', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2, // 边线的宽度，以像素为单位。
        strokeOpacity: 1, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.4, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'dashed' // 边线的样式，solid dashed。
      }
    }
  },
  beforeDestroy() {
    this.canEmitChange = false
  },
  methods: {
    // 地图初始化完毕
    mapReady({ map, BMap }) {
      // console.log(map)
      this.map = map
      this.map.enableScrollWheelZoom()
      this.map.disableDoubleClickZoom()
      this.$emit('mapReady', map, BMap)
      // this.initDrawingManager(map)
    },
    // 自定义控件初始化完毕
    controlReady(e) {
      this.initDrawingManager(e.map)
    },
    // 省市区边界初始化完毕
    boundaryLoaded(points) {
      this.boundaryLoadedpoints = Object.freeze(points)
      this.map && this.map.setViewport(points)
    },
    // 初始化鼠标绘图工具
    initDrawingManager(map) {
      map.disableDoubleClickZoom()
      // eslint-disable-next-line no-undef
      const { styleOptions } = this
      // eslint-disable-next-line no-undef
      this.drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, // 是否开启绘制模式
        enableDrawingTool: false, // 是否显示工具栏
        // eslint-disable-next-line no-undef
        drawingMode: BMAP_DRAWING_POLYGON, // 绘制模式  多边形
        // eslint-disable-next-line no-undef
        drawingToolOptions: {
          // eslint-disable-next-line no-undef
          anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
          // eslint-disable-next-line no-undef
          offset: new BMap.Size(5, 5), // 偏离值
          drawingTypes: [
            // eslint-disable-next-line no-undef
            BMAP_DRAWING_MARKER,
            // eslint-disable-next-line no-undef
            BMAP_DRAWING_POLYLINE,
            // eslint-disable-next-line no-undef
            BMAP_DRAWING_POLYGON
          ]
        },
        // 圆的样式
        circleOptions: styleOptions,
        // 线的样式
        polylineOptions: styleOptions,
        // 多边形的样式
        polygonOptions: styleOptions,
        // 矩形的样式
        rectangleOptions: styleOptions
      })
      // eslint-disable-next-line no-undef
      this.drawingManager && this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete)
    },
    // 绘制覆盖物完成
    overlaycomplete(e) {
      if (!e.drawingMode) return
      this.$emit('update:isEdiing', true)
      // "marker"  "polygon" "polyline"
      const overlay = e.overlay
      const polygonType = ['polygon', 'polyline']
      e.overlay.__overLayoutKey__ = e.drawingMode
      if (polygonType.includes(e.drawingMode)) {
        this.addNewOverLayout.push(overlay)
        // 其实这里只是用了 数据 图层已经删除了。
        overlay && overlay.addEventListener('rightclick', (e) => this.rightclick(e))
        overlay && overlay.addEventListener('lineupdate', (e) => this.polygonUpdate(e))
        setTimeout(_ => { overlay && overlay.enableEditing() }, 200)
      }
      if (e.drawingMode === 'marker') {
        this.addNewOverLayout.push(overlay)
        overlay && overlay.addEventListener('rightclick', (e) => this.rightclick(e))
      }
    },
    // 鼠标右键覆盖物
    rightclick(e) {
      if (this.previewMode) return
      e.domEvent.preventDefault()
      if (!e.target) return
      this.rightClickOverlay = e.target
      this.left = e.clientX
      this.top = e.clientY
      this.drawType = e.target.__overLayoutKey__
      this.editing = e.target.getEditing()
      this.map && this.map.disableDragging()
      this.map && this.map.disableScrollWheelZoom()
      this.visible = true
    },
    // 点击右键菜单外部
    clickOutside() {
      this.visible = false
      this.editing = false
      this.map && this.map.enableDragging()
      this.map && this.map.enableScrollWheelZoom()
      this.rightClickOverlay = null
    },
    // 右键菜单操作 - 开启编辑唯一入口 - 鼠标右键 + 新增覆盖物 + 删除
    handlerContextmenu(type) {
      const { rightClickOverlay } = this
      if (!rightClickOverlay) return
      switch (type) {
        case 0:
          // 删除
          this.clickOutside()
          this.map && this.map.removeOverlay(rightClickOverlay)
          this.$emit('update:isEdiing', true)
          return
        case 1:
          // 编辑
          this.clickOutside()
          this.canEmitChange = true
          this.map && rightClickOverlay.enableEditing()
          this.$emit('update:isEdiing', true)
          return
        default:
          return
      }
    },
    // 同步数据的时候删除新增图层
    removeAddNewOverlay() {
      const { addNewOverLayout } = this
      if (addNewOverLayout.length) {
        addNewOverLayout.map((overlay) => this.map && this.map.removeOverlay(overlay))
      }
    },
    // 获取地图覆盖物坐标更新坐标信息
    updatePointsByType() {
      // "marker"  "polygon" "polyline"
      if (!this.map) return
      const polygon = []
      const polyline = []
      const marker = []
      const points = this.map.getOverlays() || []
      // const pointArray = []
      const pointsList = points.filter(item => item.__overLayoutKey__)
      for (const item of pointsList) {
        if (item.__overLayoutKey__ === 'polygon') {
          if (item.getPath() && item.getPath().length) {
            polygon.push(item.getPath())
          }
        }
        if (item.__overLayoutKey__ === 'polyline') {
          if (item.getPath() && item.getPath().length) {
            polyline.push(item.getPath())
          }
        }
        if (item.__overLayoutKey__ === 'marker') {
          if (item.point) {
            marker.push(item.point)
          }
        }
      }
      this.removeAddNewOverlay()
      this.$emit('update:polygonList', polygon)
      this.$emit('update:lineList', polyline)
      this.$emit('update:markerList', marker)
      this.$emit('change')
    },
    // 绘制多边形
    polygonUpdate(e) {
      // 这里暂时 没有用 实时同步双向数据的话 视图问题会更新 不利于编辑的操作
      // console.log(e.target.getEditing(), 'getEditing')
      if (this.canEmitChange) {
        console.log('绘制多边形')
        // this.updatePointsByType()
        // this.$emit('change')
      }
    },
    // 关闭所有编辑状态
    closeEditorIng() {
      if (this.map) {
        const points = this.map.getOverlays() || []
        const pointsList = points.filter(item => item.__overLayoutKey__)
        for (const item of pointsList) {
          if (item.__overLayoutKey__ !== 'marker') item.disableEditing()
        }
        this.$emit('update:isEdiing', false)
      }
    },
    // 选择绘图方式
    draw(type) {
      // this.drawingManager && this.drawingManager.close()
      switch (type) {
        case 0:
          this.drawType = null
          this.drawingManager && this.drawingManager.close()
          break
        case 1:
          this.getBetterViewByOverlays()
          break
        case 2:
          this.drawingManager.open()
          // eslint-disable-next-line no-undef
          this.drawingManager.setDrawingMode(BMAP_DRAWING_MARKER)
          break
        case 3:
          this.drawingManager.open()
          // eslint-disable-next-line no-undef
          this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON)
          break
        case 4:
          this.drawingManager.open()
          // eslint-disable-next-line no-undef
          this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE)
          break
        case 5:
          this.$confirm('是否确定删除地图上所有的绘制, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.closeEditorIng()
            this.drawingManager && this.drawingManager.close()
            this.map && this.map.clearOverlays()
            this.$emit('update:polygonList', [])
            this.$emit('update:lineList', [])
            this.$emit('update:markerList', [])
            this.$emit('clear')
            this.$emit('change')
            setTimeout(_ => {
              this.getBetterViewByOverlays()
            }, 200)
          }).catch(() => { })
          break
        case 6:
          // 完成编辑同步数据
          this.closeEditorIng()
          this.updatePointsByType()
          break
        case 7:
        default:
          break
      }
    },
    // 最佳可视视角
    getBetterViewByOverlays() {
      if (this.map) {
        // console.log(this.map.getOverlays()) 获取地图覆盖物
        const points = this.map.getOverlays() || []
        const pointArray = []
        const pointsList = points.filter(item => item.__overLayoutKey__)
        for (const item of pointsList) {
          if (item.__overLayoutKey__ !== 'marker') {
            const itmeList = item.getPath()
            if (itmeList.length) itmeList.map(k => pointArray.push(k))
          } else {
            if (item.point) pointArray.push(item.point)
          }
        }
        const b = pointArray.map((item) => new BMap.Point(item.lng, item.lat)) || []
        const list = b.length ? b : this.boundaryLoadedpoints || []
        this.map.setViewport(list)
      }
    },
    // 对象深度合并
    deepMerge(target, merged) {
      for (const key in merged) {
        target[key] = target[key] && target[key].toString() === '[object Object]' ? this.deepMerge(target[key], merged[key]) : target[key] = merged[key]
      }
      return target
    }
  }
}
</script>

<style lang="scss" scoped>
.cube-baidu-map {
  width: 100%;
  height: 100%;
}
.tools {
  user-select: none;
  height: 36px;
  line-height: 36px;
  background: #ffffff;
  margin: 10px;
  padding: 0 10px;
  box-shadow: 0px 0px 10px rgba(10, 41, 59, 0.1);
}

.el-link {
  display: inline-block;
  margin: 0 4px;
}

.contextmenu {
  margin: 0;
  padding: 0;
  background: #fff;
  list-style-type: none;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  z-index: 99999999;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  position: fixed;
  width: 80px;
  text-align: left;
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
      color: #1d6fff;
    }
  }
}

.rotate90 {
  transform: rotate(90deg);
}
</style>
