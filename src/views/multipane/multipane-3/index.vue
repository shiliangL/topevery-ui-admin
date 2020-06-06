<!--
 * @Author: shiliangL
 * @Date: 2020-06-06 15:39:29
 * @LastEditTime: 2020-06-06 18:56:42
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/src/views/multipane/multipane-3/index.vue
-->
<template>
  <div class="page">
    <multipane
      class="custom-resizer"
      layout="vertical"
      @paneResizeStart="paneResizeStart"
      @paneResizeStop="paneResizeStop"
    >
      <div
        ref="leftPane"
        class="pane multipane-page"
        :style="{ width: '40%' }"
      >
        <div>
          <h6 class="title is-6">Pane 1</h6>
        </div>
      </div>
      <multipane-resizer>
        <div
          class="resizer-bar"
          :class="leftIsCollapse?'right':'left'"
          @click.stop="resizer2Left"
        />
      </multipane-resizer>
      <div
        class="pane multipane-page"
        :style="{ flexGrow: 1 }"
      >
        <div>
          <CubeMap
            ref="cubeMap"
            center-name="深圳市"
            :is-ediing.sync="isEdiing"
            :polygon-list.sync="polygon"
            :line-list.sync="lineList"
            :marker-list.sync="markerList"
          />
        </div>
      </div>
    </multipane>
  </div>
</template>

<script>

import { Multipane, MultipaneResizer } from '@/components/LayoutPane'
import CubeMap from '@/components/CubeMap'

export default {
  components: {
    CubeMap,
    Multipane,
    MultipaneResizer
  },
  data() {
    return {
      isEdiing: false,
      polygon: [],
      lineList: [],
      markerList: [],
      leftIsCollapse: false,
      rightIsCollapse: false
    }
  },
  methods: {
    resizer2Left(e) {
      this.leftIsCollapse = !this.leftIsCollapse
      const leftPane = this.$refs['leftPane']
      this.leftIsCollapse ? leftPane.style.width = '0px' : leftPane.style.width = '50%'
    },
    resizer2Right(e) {
      this.rightIsCollapse = !this.rightIsCollapse
      const rightPane = this.$refs['rightPane']
      this.rightIsCollapse ? rightPane.style.width = '0px' : rightPane.style.width = '300px'
    },
    paneResizeStart() {
      this.$nextTick().then((_) => {
        const resizePane = this.$el.querySelectorAll('.multipane-page') || []
        for (const item of resizePane) {
          item.style.transition = 'all .0s'
        }
      })
    },
    paneResizeStop() {
      this.$nextTick().then((_) => {
        const resizePane = this.$el.querySelectorAll('.multipane-page') || []
        for (const item of resizePane) {
          item.style.transition = 'all .22s'
        }
      })
    }
  }
}
</script>

<style lang="scss">

.custom-resizer {
  width: 100%;
  height: calc(100vh - 110px);
}

.custom-resizer > .pane {
  text-align: left;
  overflow: hidden;
  background: #eee;
  border: 1px solid #ccc;
  transition: all .22s;
}
.custom-resizer > .multipane-resizer {
  margin: 0;
  left: 0;
  width: 4px;
  position: relative;
  .resizer-bar {
    display: block;
    width: 100%;
    height: 40px;
    position: absolute;
    z-index: 999;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -2px;
    background: #bbb;
    &.left {
      cursor: w-resize;
    }
    &.right {
      cursor: e-resize;
    }
  }
}
</style>
