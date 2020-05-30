<!--
 * @Author: shiliangL
 * @Date: 2020-05-27 09:43:51
 * @LastEditTime: 2020-05-30 19:01:13
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/src/views/dashboard/index.vue
-->
<template>
  <div class="dashboard page">
    <el-button type="primary" @click="clickTe">测试</el-button>
    <CubeMap
      ref="cubeMap"
      class="cubeMap"
      :polygon-list.sync="polygon"
      @mapReady="mapReady"
      @markerClick="markerClick"
    >
      <template slot="bm-overlay">
        <!-- <bm-view :style="{height:'calc(100% - 40px)'}" /> -->
        <div class="text-box">
          <p style="padding: 0 10px;">以下是使用 `bm-view` 组件渲染的百度地图实例</p>
        </div>
      </template>
    </CubeMap>
    <component
      :is="currentRole"
      v-if="false"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CubeMap from '@/components/CubeMap'
// import points from './json/area.json'
import { polygonPoints } from './json/polygonPoints.json'

console.log(polygonPoints)

// import { on } from '@/utils/tools'

export default {
  name: 'Dashboard',
  components: {
    CubeMap
  },
  data() {
    return {
      autosize: '',
      currentRole: 'adminDashboard',
      polygon: [[{ 'lng': 113.82349433387273, 'lat': 22.69045644757896 }, { 'lng': 113.82509331767996, 'lat': 22.68779728122396 }, { 'lng': 113.82615331818138, 'lat': 22.688180737905242 }, { 'lng': 113.82707857285635, 'lat': 22.688572529468072 }, { 'lng': 113.82706958980125, 'lat': 22.690631500585894 }]],
      markerList: [
        {
          type: 'peopleOverLay',
          overlays: [
            {
              'iconType': 2,
              'id': 'FC75B196-01CB-43C2-82E4-977DB8953703',
              'lat': 22.57863,
              'lng': 113.882209,
              'name': '粤BGL503',
              'sectionId': 'A89B561C-7E88-4770-9243-1961FAFFBDA6',
              'type': 1,
              'typeName': '高压清洗车'
            }
          ],
          labels: [],
          show: true,
          showLabels: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  watch: {
    polygon: {
      deep: true,
      handler(list) {
        console.log(list, 'update')
      }
    }
  },
  created() {
    // console.log(process.env, 'dev')
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  methods: {
    mapReady(map, BMap) {
      this.map = map
      setTimeout(_ => { this.$refs['cubeMap'].getBetterViewByOverlays() }, 2000)
    },
    clickTe() {
      console.log('x')
      console.log(JSON.stringify(this.polygon))
    },
    markerClick(e, t, m) {
      console.log(e, t, m)
      // this.map && this.map.removeOverlay(this.polygon)
      // const pointList = []
      // const profilePoints = points.data.profilePoints[0]
      // for (const item of profilePoints) {
      //   pointList.push(new BMap.Point(item.lng, item.lat))
      // }
      // this.polygon = new BMap.Polygon(pointList, { strokeColor: 'red', strokeWeight: 2, strokeOpacity: 0.5 })
      // on(this.polygon, 'dblclick', function() {
      //   console.log('xxx')
      //   // this.enableEditing()
      // })
      // on(this.polygon, 'contextmenu', function() {
      //   console.log('xxx')
      //   // this.disableEditing()
      // })
      // this.map.addOverlay(this.polygon)

      const linePoints = [
        [
          {
            'lat': 22.57863,
            'lng': 113.882209
          },
          {
            'lat': 22.578242,
            'lng': 113.882807
          },
          {
            'lat': 22.578221,
            'lng': 113.882798
          }
        ]
      ]

      linePoints.forEach(itemArr => {
        const list = itemArr.map(item => new BMap.Point(item.lng, item.lat))
        const polyline = new BMap.Polyline(list, { strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5 })
        this.map.addOverlay(polyline)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  height: calc(100vh - 94px);
}
</style>
