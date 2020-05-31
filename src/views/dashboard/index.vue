<!--
 * @Author: shiliangL
 * @Date: 2020-05-27 09:43:51
 * @LastEditTime: 2020-05-31 17:58:40
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/src/views/dashboard/index.vue
-->
<template>
  <div class="dashboard page">
    <el-button
      type="primary"
      @click="clickTe"
    >测试</el-button>
    <CubeMap
      ref="cubeMap"
      :preview-mode="previewMode"
      center-name="深圳市"
      :is-ediing.sync="isEdiing"
      :polygon-list.sync="polygon"
      :line-list.sync="lineList"
      :marker-list.sync="markerList"
      @mapReady="mapReady"
    />
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
      isEdiing: false,
      previewMode: false,
      currentRole: 'adminDashboard',
      polygon: [],
      markerList: [],
      lineList: [[{ 'lng': 113.7953605281912, 'lat': 22.693182786037532 }, { 'lng': 113.80139714121626, 'lat': 22.69818411075214 }, { 'lng': 113.81009273854997, 'lat': 22.694783230039796 }, { 'lng': 113.8125361295363, 'lat': 22.702651804631582 }, { 'lng': 113.80103781901238, 'lat': 22.70525233468092 }, { 'lng': 113.80843985641215, 'lat': 22.705519052887134 }]]
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

    setTimeout(_ => {
      this.polygon = [[{ 'lng': 113.8226420665203, 'lat': 22.699317710437782 }, { 'lng': 113.81750375900492, 'lat': 22.69251592054844 }, { 'lng': 113.82267799874069, 'lat': 22.69151562851968 }, { 'lng': 113.82594783079593, 'lat': 22.695550094515674 }], [{ 'lng': 113.83142749440492, 'lat': 22.69098214193093 }, { 'lng': 113.83275698655925, 'lat': 22.69371626674597 }, { 'lng': 113.83304444432234, 'lat': 22.694416460566078 }, { 'lng': 113.83433800425628, 'lat': 22.694449803038648 }, { 'lng': 113.83516444532519, 'lat': 22.69461651527842 }, { 'lng': 113.83588308973293, 'lat': 22.69508330845809 }, { 'lng': 113.83584715751255, 'lat': 22.69615025825616 }, { 'lng': 113.83563156419022, 'lat': 22.69768398386497 }, { 'lng': 113.8345535975786, 'lat': 22.697784008844813 }, { 'lng': 113.83394274983202, 'lat': 22.697817350488343 }, { 'lng': 113.83264918989808, 'lat': 22.69731722497345 }, { 'lng': 113.8323257999146, 'lat': 22.69678375572182 }, { 'lng': 113.83171495216801, 'lat': 22.695783495211124 }, { 'lng': 113.83070884999717, 'lat': 22.695149993066714 }, { 'lng': 113.83070884999717, 'lat': 22.694349775596304 }, { 'lng': 113.83045732445446, 'lat': 22.69368292409282 }, { 'lng': 113.83002613780981, 'lat': 22.692982726480754 }, { 'lng': 113.8291996967409, 'lat': 22.692349211236703 }, { 'lng': 113.82912783230013, 'lat': 22.69148229083831 }, { 'lng': 113.82797800124774, 'lat': 22.69098214193093 }, { 'lng': 113.8308885110991, 'lat': 22.69004852569662 }]]
    }, 0)
  },
  methods: {
    mapReady(map, BMap) {
      this.map = map
      setTimeout(_ => { this.$refs['cubeMap'].getBetterViewByOverlays() }, 2000)
    },
    clickTe() {
      console.log('x')
      this.previewMode = !this.previewMode
      console.log(JSON.stringify(this.polygon))
      console.log(JSON.stringify(this.lineList), 'lineList')
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
