<!-- 加注点 -->
<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item ref="name" label="名称" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item label="省市">
        <el-select v-model="checkArea" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in areaData[0]"
            :key="item.id"
            :label="item.fullname"
            :value="index"
          />
        </el-select>
        <el-select v-model="checkCity" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in cityData"
            :key="item.id"
            :label="item.fullname"
            :value="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="addForm.address" class="ipt-address" />&nbsp; <el-link type="primary" icon="el-icon-map-location">地图选点</el-link>
        <div>经纬度：{{ addForm.lng }} &nbsp; {{ addForm.lat }}</div>
      </el-form-item>
      <el-form-item label="加注点照片">
        <el-upload
          class="upload-demo"
          action="/api/uploads?type=img"
          :before-remove="beforeRemove"
          :on-success="handleSuccess"
          list-type="picture"
          :headers="headers"
          :limit="1"
          :file-list="fileList"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="收款账户号">
        <el-input v-model="addForm.card_num" />
      </el-form-item>
      <el-form-item label="收款账户名">
        <el-input v-model="addForm.card_name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="addForm.state">
          <el-radio :label="0">待审核</el-radio>
          <el-radio :label="1">已审核</el-radio>
          <el-radio :label="2">冻结</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司名称">
        <el-input v-model="addForm.company_name" />
      </el-form-item>
      <el-form-item label="负责人" prop="staff_name">
        <el-input v-model="addForm.staff_name" />
      </el-form-item>
      <el-form-item label="负责人电话" prop="staff_mobile">
        <el-input v-model="addForm.staff_mobile" />
      </el-form-item>
      <el-form-item label="营业执照">
        <el-upload
          class="upload-demo"
          action="/api/uploads?type=img"
          :before-remove="beforeRemove"
          :on-success="handleSuccess"
          list-type="picture"
          :headers="headers"
          :limit="1"
          :file-list="fileList"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add, detail, update } from '@/api/CompanyManagement'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
const district = import('@/assets/js/district.js')

export default {
  data() {
    const vName = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    const vAddress = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入地址'))
      } else {
        callback()
      }
    }
    const vStaff = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入负责人'))
      } else {
        callback()
      }
    }
    const vStaffMobile = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入负责人电话'))
      } else {
        callback()
      }
    }
    return {
      areaData: [[]],
      cityData: [],
      checkArea: '',
      checkCity: '',
      addForm: {
        name: '',
        address: '',
        staff_name: '',
        staff_mobile: '',
        state: 0
      },
      headers: {
        'X-token': getToken()
      },
      addRules: { // 信息规则验证
        name: [{ required: true, trigger: 'blur', validator: vName }],
        address: [{ required: true, trigger: 'blur', validator: vAddress }],
        staff_name: [{ required: true, trigger: 'blur', validator: vStaff }],
        staff_mobile: [{ required: true, trigger: 'blur', validator: vStaffMobile }]
      },
      id: '',
      fileList: []
    }
  },
  watch: {
    checkArea() {
      if (this.checkArea !== '') {
        const area = this.areaData[0][this.checkArea]
        this.cityData = this.areaData[1].slice(area.cidx[0], area.cidx[1])
        this.checkCity = ''
      }
    }
  },
  created() {
    this.id = this.$route.query.id || ''

    this.id && this.getInfo()
    district.then(res => {
      this.areaData = res.default
    })
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传${fileList.length}张图片，请删除后再上传！`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      const { url } = response
      this.addForm.license_url = url
    },
    // 获取详情信息
    async getInfo() {
      const info = await detail({ id: this.id })
      const { name, license_url, tax_num, email, state, id, address } = info.data
      this.addForm = {
        name, license_url, tax_num, email, state, id, address
      }
      this.fileList.push({ name: '', url: license_url })
    },
    // 提交
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.SubmitFn()
          if (this.roles !== 'admin') {
            // 刷新详情
            this.getInfo()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    SubmitFn() {
      const Fn = (this.id || this.roles[0] === 'company') ? update : add
      Fn({ company: this.addForm }).then(res => {
        this.$message({
          message: (this.id || this.roles[0] === 'company') ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.fileList = []
        this.id && this.$router.push('list')
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
.ipt-address {
  width: 394px;
}
.disable_but {
  background-color:#a0cfff;
}
.line{
  text-align: center;
}
</style>

