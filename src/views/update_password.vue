<template>
  <div class="app-container"><br><br>
    <el-form ref="form" :model="form" :rules="addRules" label-width="120px">
      <el-form-item ref="password" label="原密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item ref="newPassword" label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" />
      </el-form-item>
      <el-form-item ref="qrPassword" label="确认密码" prop="qrPassword">
        <el-input v-model="form.qrPassword" type="password" />
      </el-form-item>
      <el-form-item><br><br>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { update } from '@/api/EmployeeManagement'
import { getToken } from '@/utils/auth'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    const newPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    const qrPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    return {
      form: {
        password: '',
        newPassword: '',
        qrPassword: ''
      },
      headers: {
        'X-token': getToken()
      },
      addRules: { // 信息规则验证
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: newPassword }],
        qrPassword: [{ required: true, trigger: 'blur', validator: qrPassword }]
      },
      fileList: []
    }
  },
  created() {

  },
  methods: {
    // 提交
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          update({ user: this.form }).then(() => {
            this.$message({
              message: '密码修改成功',
              type: 'success'
            })
            this.onCancel()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    onCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.app-container {
  width: 500px;
}
</style>

