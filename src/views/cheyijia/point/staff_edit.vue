<!-- 加油站 -->
<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item ref="name" label="姓名" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="addForm.mobile" />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="addForm.manager">
          <el-radio :label="0">管理员</el-radio>
          <el-radio :label="1">员工</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="addForm.state">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">冻结</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { staffAdd, staffUpdate, staffInfo } from '@/api/point'

export default {
  data() {
    const vName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }
    const vMobile = (rule, value, callback) => {
      const _reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!_reg.test(value)) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    return {
      addForm: {
        name: '',
        mobile: '',
        manager: 0,
        state: 0,
        id: '',
        point_id: 0
      },
      addRules: { // 信息规则验证
        name: [{ required: true, trigger: 'blur', validator: vName }],
        mobile: [{ required: true, trigger: 'blur', validator: vMobile }]
      }
    }
  },
  created() {
    this.addForm.point_id = this.$route.query.point_id || 0
    this.addForm.id = this.$route.query.id || ''

    this.addForm.id && this.getInfo()
  },
  methods: {
    // 获取详情信息
    async getInfo() {
      const info = await staffInfo({ id: this.addForm.id })
      this.addForm = info.data
    },
    // 提交
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          const Fn = this.addForm.id ? staffUpdate : staffAdd
          Fn({ data: this.addForm }).then(res => {
            this.$message({
              message: this.addForm.id ? '修改成功' : '添加成功',
              type: 'success'
            })
            this.$router.push('stafflist')
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
.disable_but {
  background-color:#a0cfff;
}
.line{
  text-align: center;
}
</style>

