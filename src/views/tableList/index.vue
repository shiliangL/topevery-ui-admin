<!--
 * @Author: shiliangL
 * @Date: 2020-05-29 16:04:23
 * @LastEditTime: 2020-05-29 17:04:10
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/src/views/tableList/index.vue
-->
<template>
  <div class="page">
    <cube-Table-List :config="config" />
  </div>
</template>

<script>
export default {
  name: 'TableList',
  data() {
    return {
      config: {
        method: 'get',
        url: '/api/tableList/list',
        search: {
          data: [
            [
              {
                type: 'cubeSelectTree',
                value: null,
                key: 'sectionId',
                config: {
                  keyName: 'label',
                  keyCode: 'value',
                  url: `/map/getSectionTree`,
                  focusOnload: false, // 是否多次加载（是否获取焦点就加载）
                  placeholder: '请选择标段',
                  treeDefaultProps: {
                    children: 'children',
                    label: 'label'
                  }
                }
              },
              { type: 'search', name: '查询' },
              { type: 'reset', name: '重置' }
            ],
            [
              { type: 'add', name: '新增', action: () => this.add() }
            ]
          ]
        },
        table: {
          prefixHeight: 0,
          tableHeight: 250,
          calcTableHeight: true, // 是否开启表格自动高度计算
          columns: [
            { label: '选择', type: 'selection' },
            { label: '序号', type: 'index' },
            { label: '作者', key: 'author' },
            { label: '标题', key: 'title' },
            {
              label: '操作',
              key: 'drawNum',
              render: (h, parmas) => {
                const { row } = parmas
                return (
                  <div class='flex-table-cell'>
                    <div class='btn-text' onClick={() => this.handlerType(0, row)}>详情</div>
                    <div class='btn-text' onClick={() => this.handlerType(1, row)}>编辑</div>
                  </div>
                )
              }
            }
          ]
        }
      }

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
