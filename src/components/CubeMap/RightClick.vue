<template>
  <transition name="el-zoom-in-top">
    <ul
      v-if="visible"
      v-clickOutside="clickOutside"
      :style="{left:left+'px',top:top+'px'}"
      class="contextmenu"
    >
      <li v-if="drawType!=='Marker'" @click.stop="handlerContextmenu(1)"> 编辑 </li>
      <li @click.stop="handlerContextmenu(0)"> 删除 </li>
    </ul>
  </transition>
</template>

<script>
export default {
  name: 'RightClick',
  directives: {
    clickOutside: {
      bind(el, binding) {
        function clickHandler(e) {
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
            return false
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e)
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = clickHandler
        document.addEventListener('click', clickHandler)
      },
      update() { },
      unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__)
        delete el.__vueClickOutside__
      }
    }
  },
  props: {
    drawType: {
      type: String,
      default: () => ''
    },
    map: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0
    }
  },
  methods: {
    clickOutside() {

    },
    handlerContextmenu(type) {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
