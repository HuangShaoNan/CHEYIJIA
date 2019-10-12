<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item ref="card_name" label="账户名" prop="card_name">
        <el-input v-model="addForm.card_name" />
      </el-form-item>
      <el-form-item ref="card_num" label="转账卡号" prop="card_num">
        <el-input v-model="addForm.card_num" />
      </el-form-item>
      <el-form-item ref="amount" label="转账金额" prop="amount">
        <el-input v-model="addForm.amount" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { rechargeAdd } from '@/api/recharge'
import { getToken } from '@/utils/auth'

export default {
  data() {
    //
    const validateCardName = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入转账账户名'))
      } else {
        callback()
      }
    }
    const validateCardNum = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入转账卡号'))
      } else {
        callback()
      }
    }
    const validateAmount = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入充值金额'))
      } else {
        callback()
      }
    }
    return {
      addForm: {
        card_name: '',
        card_num: '',
        amount: '',
        recharge_img: ''
      },
      headers: {
        'X-token': getToken()
      },
      addRules: { // 信息规则验证
        card_name: [{ required: true, trigger: 'blur', validator: validateCardName }],
        card_num: [{ required: true, trigger: 'blur', validator: validateCardNum }],
        amount: [{ required: true, trigger: 'blur', validator: validateAmount }]
      },
      id: '',
      fileList: []
    }
  },
  computed: {
  },
  created() {

  },
  methods: {
    // 提交
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          rechargeAdd({ recharge: this.addForm }).then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$router.push({ path: '/recharge/list' })
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
.line{
  text-align: center;
}
</style>

