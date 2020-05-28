<template>
  <baidu-map
    class="baidu-map"
    style="width: 100%; height:100%;"
    :center="centerName"
    :map-click="mapClick"
    @ready="mapReady"
  >
    <!-- 省市区边界 -->
    <bm-boundary v-if="showBoundary" :name="centerName" :stroke-weight="2" fill-color="" stroke-color="red" @loaded="boundaryLoaded" />

    <!-- 地图控件 轨迹回放-->
    <MapGpsTracePlay v-if="showMapGpsTracePlay" />

    <!-- 覆盖物 -->
    <template v-if="map">
      <template v-for="item in markerList">
        <template v-show="item.show">
          <template v-for="marker in item.overlays">
            <bm-marker
              :key="marker.id + 'marker'"
              :clicking="true"
              title="title - marker"
              :dragging="marker.dragging"
              :position="{lng: marker.lng, lat: marker.lat}"
              @click="markerClick($event,item.type,marker)"
            />
            <bm-label
              :key="marker.id + 'label'"
              :position="{lng: marker.lng, lat: marker.lat}"
              :content="marker.name"
              :label-style="{color: 'red', fontSize : '14px'}"
              :offset="{width: 20, height: -26}"
            />
          </template>
        </template>
      </template>
    </template>

    <!-- 地图控件 绘图工具-->
    <bm-control
      :anchor="anchor"
      @ready="controlReady"
    >
      <div v-if="map" class="tools">
        <el-link
          :underline="false"
          type="primary"
          @click.native="draw(0)"
        >停止绘制</el-link>
        <el-link
          :underline="false"
          type="primary"
          @click.native="draw(1)"
        >
          <i class="el-icon-full-screen" /> 视角
        </el-link>
        <el-link
          :underline="false"
          type="success"
          @click.native="draw(2)"
        >
          <i class="el-icon-location-information" /> 标点 </el-link>
        <el-link
          :underline="false"
          type="success"
          @click.native="draw(3)"
        >
          <i class="el-icon-crop" /> 画面 </el-link>
        <el-link
          :underline="false"
          type="success"
          @click.native="draw(4)"
        >
          <i class="el-icon-minus" /> 画线
        </el-link>
        <el-link
          :underline="false"
          type="danger"
          @click.native="draw(5)"
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
            2、画面、画线操作时,双击完成绘制
          </div>
          <el-link
            :underline="false"
            type="warning"
          >信息提示</el-link>
        </el-tooltip>

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

import MapGpsTracePlay from './mapGpsTracePlay'

export default {
  name: 'CubeMap',
  components: {
    MapGpsTracePlay
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
    showMapGpsTracePlay: {
      type: Boolean,
      default: () => true
    },
    mapClick: {
      type: Boolean,
      default: () => false
    },
    // 点击Marker的时候是否自动导航到最优可视区域
    isSetViewToMarkerClick: {
      type: Boolean,
      default: () => true
    },
    // 绘制的覆盖物是否可以右键
    overlaysCanRightClick: {
      type: Boolean,
      default: () => true
    },
    markerList: {
      type: Array,
      default: () => [{ type: 'layer', overlays: [], labels: [], show: true, showLabels: false }]
    },
    lineList: {
      type: Array,
      default: () => [{ type: 'layer', overlays: [], labels: [], show: true, showLabels: false }]
    },
    polygonList: {
      type: Array, default: () => [{ type: 'layer', overlays: [], labels: [], show: true, showLabels: false }]
    }
  },
  data() {
    return {
      drawType: null,
      map: null,
      styleOptions: {
        strokeColor: 'red', // 边线颜色。
        fillColor: '#3689F3', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.5, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.4, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'dashed' // 边线的样式，solid dashed。
      }
    }
  },
  methods: {
    mapReady({ map, BMap }) {
      // console.log(map)
      this.map = map
      this.map.enableScrollWheelZoom()
      this.$emit('mapReady', map, BMap)
      // this.initDrawingManager(map)
    },
    controlReady(e) {
      this.initDrawingManager(e.map)
    },
    boundaryLoaded(points) {
      this.map && this.map.setViewport(points)
    },
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

      setTimeout(() => {
        // this.initDrawLoadData()
      }, 200)
    },
    overlaycomplete(e) {
      this.drawType = e.drawingMode
      e.overlay.__overLayoutKey__ = e.drawingMode
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
          console.log('Marker')
          this.drawingManager.open()
          // this.drawType = 'Marker'
          // eslint-disable-next-line no-undef
          this.drawingManager.setDrawingMode(BMAP_DRAWING_MARKER)
          break
        case 3:
          console.log('Polygon')
          this.drawingManager.open()
          // this.drawType = 'Polygon'
          // eslint-disable-next-line no-undef
          this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON)
          break
        case 4:
          console.log('Polyline')
          this.drawingManager.open()
          // this.drawType = 'Polyline'
          // eslint-disable-next-line no-undef
          this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE)
          break
        case 5:
          this.$confirm('是否确定删除地图上所有的绘制, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.markerPointList = []
            this.linePointList = []
            this.polygonPointList = []
            this.drawingManager && this.drawingManager.close()
            this.map && this.map.clearOverlays()
            this.$emit('clear')
          }).catch(() => { })
          break
        default:
          break
      }
    },
    markerClick(e, type, marker) {
      if (this.isSetViewToMarkerClick) {
        const { lat, lng } = marker
        this.map && this.map.setViewport([new BMap.Point(lng, lat)])
      }
      this.$emit('markerClick', e, type, marker)
    },
    getBetterViewByOverlays() {
      if (this.map) {
        // console.log(this.map.getOverlays()) 获取地图覆盖物
        const points = this.map.getOverlays() || []
        const pointArray = []
        const pointsList = points.filter(item => item.__overLayoutKey__)
        for (const item of pointsList) {
          if (item.__overLayoutKey__ !== 'marker') {
            if (item.Sn) item.Sn.map(k => pointArray.push(k))
          } else {
            if (item.point) pointArray.push(item.point)
          }
        }
        // console.log(pointsList)
        // console.log(pointArray)

        // eslint-disable-next-line no-undef
        const b = pointArray.map((item) => new BMap.Point(item.lng, item.lat)) || []
        this.map.setViewport(b)

        this.getAllPoints()
      }
    },
    // 获取地图所有覆盖物坐标
    getAllPoints() {
      // "marker"  "polygon" "polyline"
      const markers = []
      const polygons = []
      const polylines = []
      const pointsOnMap = this.map.getOverlays() || []
      if (pointsOnMap.length) {
        for (const item of pointsOnMap) {
          if (item.__overLayoutKey__ === 'marker') {
            markers.push(item.point)
          } else if (item.__overLayoutKey__ === 'polygon') {
            polygons.push(item.Sn)
          } else if (item.__overLayoutKey__ === 'polyline') {
            polylines.push(item.Sn)
          }
        }
      }
      console.log(markers)
      console.log(polygons)
      console.log(polylines)
    }
  }
}
</script>

<style lang="scss" scoped>
.tools {
  height: 40px;
  line-height: 40px;
  background: #ffffff;
  margin: 10px;
  padding: 0 10px;
  box-shadow: 0px 0px 10px rgba(10, 41, 59, 0.1);
}

.el-link {
  display: inline-block;
  margin: 0 10px;
}
</style>
