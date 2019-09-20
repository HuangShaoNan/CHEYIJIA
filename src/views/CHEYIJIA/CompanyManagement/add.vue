<!-- 公司管理 新增公司 -->
<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item label="名称" ref="name" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
			<el-form-item label="税号">
        <el-input v-model="addForm.tax_num" />
      </el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="addForm.email" />
      </el-form-item>
      <el-form-item label="是否冻结">
        <el-switch
					v-model="addForm.state"
					:active-value= "1"
					:inactive-value= "0"/>
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
					:on-exceed="handleExceed">
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
import { add } from '@/api/CompanyManagement'
import { getToken } from '@/utils/auth'
export default {
  data() {
		//
    const validateName = (rule, value, callback) => {
      if ((value == '')) {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
		}
		 const validateEmail = (rule, value, callback) => {
			 let _reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
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
				state: false, // 状态
			},
			headers: {
				'X-token': getToken()
			},
			addRules: { // 信息规则验证
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
      },
    }
	},
	created() {
	},
  methods: {
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${ file.name }？`);
		},
		// 上传成功
		handleSuccess(response, file, fileList) {
			let { url } = response
			this.addForm.license_url = url
		},
		// 提交
    onSubmit() {
			 this.$refs.addForm.validate(valid => {
        if (valid) {
					add({company: this.addForm}).then(res => {
					this.$message({
						message: '添加成功',
						type: 'success'
					})
					this.$router.push({ path: '/CompanyManagement/list' })
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


