<!--
 * @Author: shiliangL
 * @Date: 2017-10-03 19:17:30
 * @LastEditTime: 2020-06-06 16:39:29
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/src/components/LayoutPane/multipane.vue
-->
<template>
  <div
    :class="classnames"
    :style="{ cursor, userSelect }"
    @mousedown="onMouseDown"
  >
    <slot />
  </div>
</template>

<script src="./multipane.js"></script>

<style lang="scss">
.multipane {
  display: flex;

  &.layout-h {
    flex-direction: column;
  }

  &.layout-v {
    flex-direction: row;
  }
}

.multipane > div {
  position: relative;
  z-index: 1;
}

.multipane-resizer {
  display: block;
  position: relative;
  z-index: 2;
}

.layout-h > .multipane-resizer {
  width: 100%;
  height: 10px;
  margin-top: -10px;
  top: 5px;
  cursor: row-resize;
}

.layout-v > .multipane-resizer {
  width: 10px;
  height: 100%;
  margin-left: -10px;
  left: 5px;
  overflow: hidden;
  cursor: col-resize;
}
</style>
