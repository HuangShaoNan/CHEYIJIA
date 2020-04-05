<!-- 公司管理 新增公司 -->
<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item v-if="isCompany" label="企业余额">
        <div class="amount-num">￥{{ available_amount }}</div>
      </el-form-item>
      <el-form-item v-show="roles=='admin' && !id" label="是否分公司">
        <el-switch
          v-model="child"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item v-show="child === 1" label="选择总公司">
        <el-select
          v-model="parentCom"
          filterable
          remote
          reserve-keyword
          placeholder="请输入公司名称搜索"
          :remote-method="getList"
          :loading="loading"
        >
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item ref="name" label="名称" prop="name">
        <el-input v-model="addForm.name" :disabled="isCompany" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="addForm.address" />
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
      <el-form-item :label="(isCompany ? '' : '上传') + '营业执照'">
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
          :disabled="isCompany"
        >
          <el-button v-if="!isCompany" size="small" type="primary">点击上传</el-button>
          <div v-if="!isCompany" slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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
import { add, detail, update, getList } from '@/api/CompanyManagement'
import { getToken } from '@/utils/auth'
import { toast } from '@/utils/index'
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
      child: 0,
      addForm: {
        name: '',
        address: '',
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
      fileList: [],
      isCompany: false,
      available_amount: 0,
      listQuery: { // 查询列表参数
        page_index: 1,
        page_size: 10,
        name: '' // 公司名称
      },
      loading: false,
      parentCom: '',
      list: []
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    this.isCompany = this.roles[0] === 'company'

    // 如果id存在是编辑模块 或者是物流公司补充基本资料
    if (this.id || this.isCompany) {
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
    async getList(e) {
      this.listQuery.name = e
      this.loading = true
      const res = await getList(this.listQuery)
      this.list = res.data.list || []
      this.loading = false
    },
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
      const { name, license_url, tax_num, email, state, id, address, available_amount } = info.data
      this.available_amount = available_amount
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
          if (this.roles[0] !== 'admin') {
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
      let parent = ''
      if (this.child === 1 && !this.id) {
        if (!this.parentCom) {
          toast('请选择总公司！')
          return
        }
        parent = this.parentCom
      }
      Fn({ company: this.addForm, parent }).then(res => {
        this.$message({
          message: (this.id || this.roles[0] === 'company') ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.fileList = []
        this.roles[0] === 'admin' && this.$router.push('list')
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
.amount-num {
  color: red;
  font-size: 30px;
}
.disable_but {
  background-color:#a0cfff;
}
.line{
  text-align: center;
}
</style>

