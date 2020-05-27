<template>
  <div class="dashboard-container">
    <component
      :is="currentRole"
      v-if="false"
    />

    <el-form
      ref="dynamicValidateForm"
      :model="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
    >
      <el-form-item
        prop="email"
        label="邮箱"
        :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]"
      >
        <el-input v-model="dynamicValidateForm.email" />
      </el-form-item>

      <el-form-item
        prop="url"
        label="url"
        :rules="[{ required: false, type: 'string', pattern: /^[a-zA-Z]+$/, message: 'key为大小写字母组合', trigger: ['change'] }]"
      >
        <el-input v-model.trim="dynamicValidateForm.url" />
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :key="domain.key"
        :label="'域名' + index"
        :prop="'domains.' + index + '.value'"
        :rules="{
          required: true, message: '域名不能为空', trigger: 'blur'
        }"
      >
        <el-input v-model="domain.value" />
        <el-button @click.prevent="removeDomain(domain)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('dynamicValidateForm')"
        >提交</el-button>
        <el-button @click="addDomain">新增域名</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: '',
        url: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    }
  }
}
</script>
