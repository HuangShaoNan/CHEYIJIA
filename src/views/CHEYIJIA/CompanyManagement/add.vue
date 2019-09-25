<!-- 公司管理 新增公司 -->
<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item ref="name" label="名称" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item label="税号">
        <el-input v-model="addForm.tax_num" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email" />
      </el-form-item>
      <el-form-item v-show="roles=='admin'" label="是否冻结">
        <el-switch
          v-model="addForm.state"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="上传营业执照">
        <el-upload
          class="upload-demo"
          action="api/uploads?type=img"
          :before-remove="beforeRemove"
          :on-success="handleSuccess"
          list-type="picture"
          :headers="headers"
          multiple
          :limit="3"
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

export default {
  data() {
    //
    const validateName = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      const _reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (!_reg.test(value)) {
        callback(new Error('请输入邮箱地址'))
      } else {
        callback()
      }
    }
    return {
      addForm: {
        name: '',
        tax_num: '', // 税号
        email: '',
        license_url: '',
        state: false // 状态
      },
      headers: {
        'X-token': getToken()
      },
      addRules: { // 信息规则验证
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      },
      id: '',
      fileList: []
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    // 如果id存在是编辑模块 或者是物流公司补充基本资料
    if (this.id || this.roles === 'company') {
      this.getInfo()
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
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
      const { name, license_url, tax_num, email, state, id } = info.data
      this.addForm = {
        name, license_url, tax_num, email, state, id
      }
      this.fileList.push({ name: '', url: license_url })
    },
    // 提交
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.SubmitFn()
          if (this.roles === 'admin') {
            this.$router.push({ path: '/CompanyManagement/list' })
          } else {
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
      const Fn = (this.id || this.roles === 'company') ? update : add
      Fn({ company: this.addForm }).then(res => {
        this.$message({
          message: (this.id || this.roles === 'company') ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.fileList = []
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

