<!-- 公司管理 新增公司 -->
<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item label="转账账户名" ref="card_name" prop="card_name">
        <el-input v-model="addForm.card_name" />
      </el-form-item>
			<el-form-item label="转账卡号" ref="card_num" prop="card_num">
        <el-input v-model="addForm.card_num" />
      </el-form-item>
			<el-form-item label="转账金额" ref="amount" prop="amount">
				<el-input v-model="addForm.amount" />
      </el-form-item>
			<el-form-item label="上传转账截图" ref="recharge_img" prop="recharge_img">
        <el-upload
					class="upload-demo"
					action="api/uploads?type=img"
					:before-remove="beforeRemove"
					:on-success="handleSuccess"
					list-type="picture"
					:headers="headers"
					multiple
					:limit="1"
					:file-list="fileList"
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
import { rechargeAdd } from '@/api/recharge'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  data() {
		//
    const validateCardName = (rule, value, callback) => {
      if ((value == '')) {
        callback(new Error('请输入转账账户名'))
      } else {
        callback()
      }
		}
		const validateCardNum = (rule, value, callback) => {
			if ((value == '')) {
				callback(new Error('请输入转账卡号'))
			} else {
				callback()
      }
		}
		const validateAmount = (rule, value, callback) => {
			if ((value == '')) {
				callback(new Error('请输入充值金额'))
			} else {
				callback()
			}
		}
		const validateRechargeImg = (rule, value, callback) => {
			if ((value == '')) {
				callback(new Error('请上传转账截图'))
			} else {
				callback()
			}
		}
    return {
      addForm: {
        card_name: '',
				card_num: '',
				amount: '',
				recharge_img: '',
			},
			headers: {
				'X-token': getToken()
			},
			addRules: { // 信息规则验证
        card_name: [{ required: true, trigger: 'blur', validator: validateCardName }],
        card_num: [{ required: true, trigger: 'blur', validator: validateCardNum }],
        amount: [{ required: true, trigger: 'blur', validator: validateAmount }],
        recharge_img: [{ required: true, trigger: 'blur', validator: validateRechargeImg }],
			},
			id: '',
			fileList: []
    }
	},
	created() {

	},
	computed: {
  },
  methods: {
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${ file.name }？`);
		},
		// 上传成功
		handleSuccess(response, file, fileList) {
			let { url } = response
			this.addForm.recharge_img = url
		},
		// 提交
    onSubmit() {
			 this.$refs.addForm.validate(valid => {
        if (valid) {
					rechargeAdd({recharge: this.addForm}).then(() => {
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


