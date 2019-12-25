<!-- 司机管理 新增司机 -->
<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item ref="name" label="姓名" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item ref="mobile" label="手机号" prop="mobile">
        <el-input v-model="addForm.mobile" />
      </el-form-item>
      <el-form-item ref="id_card" label="身份证" prop="id_card">
        <el-input v-model="addForm.id_card" />
      </el-form-item>
      <el-form-item ref="car_number" label="车牌号" prop="car_number">
        <el-input v-model="addForm.car_number" />
      </el-form-item>
      <el-form-item v-show="id" label="是否冻结">
        <el-switch
          v-model="addForm.state"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item ref="type" label="司机类型" prop="type">
        <el-select v-model="addForm.type" filterable placeholder="请选择司机类型" @change="selectToDisabled">
          <el-option
            v-for="item in optionsDriverlist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item ref="card_type" label="开卡类型" prop="card_type">
        <el-select v-model="addForm.card_type" filterable placeholder="请选择开卡类型">
          <el-option
            v-for="item in cardTypeList"
            :key="item.id"
            :label="item.name"
            :disabled="item.disabled"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add, detail, update, QueryDriverCard } from '@/api/driverManagement'
import { validUsername } from '@/utils/validate'
import { getToken } from '@/utils/auth'

export default {
  data() {
    //
    const validateName = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入手机号'))
      } else {
        callback()
      }
    }
    const validateIdCrd = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入身份证号'))
      } else {
        callback()
      }
    }
    const validateType = (rule, value, callback) => {
      if (value.toString() === '') {
        callback(new Error('请选择司机类型'))
      } else {
        callback()
      }
    }
    const validateCardType = (rule, value, callback) => {
      if (value.toString() === '') {
        callback(new Error('请选择开卡类型'))
      } else {
        callback()
      }
    }
    return {
      addForm: {
        name: '',
        mobile: '', // 税号
        id_card: '',
        car_number: '',
        type: '', // 司机类型
        card_type: '', // 开卡类型
        state: false // 是否冻结
      },
      headers: {
        'X-token': getToken()
      },
      addRules: { // 信息规则验证
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        id_card: [{ required: true, trigger: 'blur', validator: validateIdCrd }],
        type: [{ required: true, trigger: 'blur', validator: validateType }],
        card_type: [{ required: true, trigger: 'blur', validator: validateCardType }]
      },
      id: '',
      driver_mobile: '', // 司机手机号 查询用
      optionsDriverlist: [ // 司机类型
        {
          id: 0,
          name: '内部司机'
        },
        {
          id: 1,
          name: '外部司机'
        }
      ],
      cardTypeList: [ // 开卡类型
        {
          id: 0,
          name: '私有卡',
          disabled: false
        },
        {
          id: 1,
          name: '共享卡',
          disabled: false
        }
      ]
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    this.driver_mobile = this.$route.query.mobile || ''
    // 如果id存在是编辑模块
    if (this.id) {
      this.getInfo()
    }
  },
  methods: {
    selectToDisabled() {
      this.$set(this.cardTypeList[1], 'disabled', false)
      if (this.addForm.type === 1) {
        this.$set(this.cardTypeList[1], 'disabled', true)
      }
      this.addForm.card_type = ''
    },
    // 获取详情信息
    async getInfo() {
      const info = await detail({ id: this.id })
      const { name,
        mobile,
        id_card,
        car_number,
        type,
        id } = info.data
      this.addForm = {
        name,
        mobile,
        id_card,
        car_number,
        type,
        state: '',
        id,
        card_type: ''
      }
      this.QueryDriverCard()
    },
    // 提交
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.SubmitFn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    SubmitFn() {
      const Fn = this.id ? update : add
      Fn({ driver: this.addForm }).then(res => {
        this.$message({
          message: (this.id || this.roles === 'company') ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.$router.push({ path: '/driverManagement/list' })
      })
    },
    async QueryDriverCard() {
      const res = await QueryDriverCard({ driver_mobile: this.driver_mobile })
      this.addForm.card_type = res.data.type
      this.addForm.state = res.data.state
      if (this.addForm.type === 1) {
        this.cardTypeList[1].disabled = true
      }
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

