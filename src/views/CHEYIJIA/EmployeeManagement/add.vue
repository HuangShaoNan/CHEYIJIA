<!-- 公司管理 新增公司 -->
<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item v-if="!id" ref="company_id" label="所属公司" prop="company_id">
        <el-select v-model="addForm.company_id" filterable placeholder="请选择/搜索所属公司">
          <el-option
            v-for="item in optionslist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item ref="name" label="姓名" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item ref="mobile" label="手机号" prop="mobile">
        <el-input v-model="addForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item v-if="!id" ref="password" label="密码" prop="password">
        <el-input v-model="addForm.password" placeholder="请输入密码/字母/数字/下划线" show-password />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item v-if="id" label="是否冻结">
        <el-switch
          v-model="addForm.state"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item v-if="!id" label="发送短信通知">
        <el-switch
          v-model="addForm.sms"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add, update, getInfo } from '@/api/EmployeeManagement'
import { getName } from '@/api/base'
import { validUsername, validPasswd } from '@/utils/validate'
export default {
  data() {
    // 验证姓名
    const validateName = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    // 验证手机号
    const validateMobile = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validatePassword = (rule, value, callback) => {
      if (!validPasswd(value)) {
        callback(new Error('请输入正确密码'))
      } else {
        callback()
      }
    }
    // 验证所属公司
    const validateCompanyId = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请选择所属公司'))
      } else {
        callback()
      }
    }
    return {
      addForm: {
        name: '',
        mobile: '', // 手机号
        email: '',
        password: '',
        company_id: '', // 所属公司
        state: 0, // 状态
        sms: 1
      },
      addRules: { // 信息规则验证
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        company_id: [{ required: true, trigger: 'blur', validator: validateCompanyId }]
      },
      optionslist: [], // 所属公司列表
      id: ''
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    this.getName()
    // 如果id存在是编辑
    if (this.id) {
      this.getInfo()
    }
  },
  methods: {
    // 获取详情信息
    async getInfo() {
      const info = await getInfo({ id: this.id })
      const { name, mobile, email, password, state, id } = info.data
      this.addForm = {
        name, mobile, email, password, state, id
      }
    },
    // 提交
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.SubmitFn()
          this.$router.push({ path: '/EmployeeManagement/list' })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    SubmitFn() {
      const Fn = this.id ? update : add
      Fn({ user: this.addForm }).then(res => {
        this.$message({
          message: this.id ? '修改成功' : '添加成功',
          type: 'success'
        })
      })
    },
    // 取消
    onCancel() {
      this.$router.go(-1)
    },
    // 获取物流公司列表
    async getName() {
      const res = await getName()
      this.optionslist = res.data
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

