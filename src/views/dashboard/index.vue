<!--
 * @Author: shiliangL
 * @Date: 2020-05-27 09:43:51
 * @LastEditTime: 2020-05-28 15:37:16
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/src/views/dashboard/index.vue
-->
<template>
  <div class="dashboard">

    <CubeMap class="cubeMap" :marker-list="markerList" @mapReady="mapReady" @markerClick="markerClick">
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
import points from './json/area.json'
import { on } from '@/utils/tools'

export default {
  name: 'Dashboard',
  components: {
    CubeMap
  },
  data() {
    return {
      autosize: '',
      currentRole: 'adminDashboard',
      markerList: [
        {
          type: 'peopleOverLay',
          overlays: [
            {
              'iconType': 2,
              'id': 'FC75B196-01CB-43C2-82E4-977DB8953703',
              'lat': 22.642504411498177,
              'lng': 113.84449905288676,
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
  created() {
    // console.log(process.env, 'dev')
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  methods: {
    mapReady(map, BMap) {
      this.map = map
    },
    markerClick(e, t, m) {
      console.log(e, t, m)
      this.map && this.map.removeOverlay(this.polygon)
      const pointList = []
      const profilePoints = points.data.profilePoints[0]
      for (const item of profilePoints) {
        pointList.push(new BMap.Point(item.lng, item.lat))
      }
      this.polygon = new BMap.Polygon(pointList, { strokeColor: 'red', strokeWeight: 2, strokeOpacity: 0.5 })
      on(this.polygon, 'dblclick', function() {
        console.log('xxx')
        // this.enableEditing()
      })
      on(this.polygon, 'contextmenu', function() {
        console.log('xxx')
        // this.disableEditing()
      })
      this.map.addOverlay(this.polygon)
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
