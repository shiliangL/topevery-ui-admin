<!--
 * @Author: shiliangL
 * @Date: 2020-06-06 15:38:49
 * @LastEditTime: 2020-06-06 17:32:03
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/src/views/multipane/multipane-1/index.vue
-->
<template>
  <div class="page">
    <multipane class="vertical-panes" layout="vertical">
      <div class="pane" :style="{ width: '25%' }">
        <div>
          <h6 class="title is-6">Pane 1</h6>
          <p class="subtitle is-6">Fixed width.</p>
          <p>
            <small>
              <strong>Configured with:</strong><br>
              minWidth: 100px<br>
              width: 150px<br>
            </small>
          </p>
        </div>
      </div>
      <multipane-resizer />
      <div class="pane" :style="{ width: '25%' }">
        <div>
          <h6 class="title is-6">Pane 2</h6>
          <p class="subtitle is-6">Fluid width.</p>
          <p>
            <small>
              <strong>Configured with:</strong><br>
              width: 25%<br>
            </small>
          </p>
        </div>
      </div>
      <multipane-resizer />
      <div class="pane" :style="{ flexGrow: 1 }">
        <div>
          <h6 class="title is-6">Pane 3</h6>
          <p class="subtitle is-6">Takes remaining available space.</p>

          <p>
            <small>
              <strong>Configured with:</strong><br>
              flex-grow: 1<br>
            </small>
          </p>
        </div>
      </div>
    </multipane>
  </div>
</template>

<script>

import { Multipane, MultipaneResizer } from '@/components/LayoutPane'

export default {
  components: {
    Multipane,
    MultipaneResizer
  }
}
</script>

<style>
.vertical-panes {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
}

.vertical-panes > .pane {
  text-align: left;
  padding: 15px;
  overflow: hidden;
  background: #eee;
}

.vertical-panes > .pane ~ .pane {
  border-left: 1px solid #ccc;
}
</style>
