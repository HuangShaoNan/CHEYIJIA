<!-- 公司管理 公司列表 -->
<template>
  <div class="app-container">
		<div class="inline">
			<el-button type="primary" @click="handleAdd">新增司机</el-button>
		</div>
		<div class="inline m-left">
			<el-upload
				class="upload-demo"
				action="/api/uploads/import"
				:headers="headers"
				:on-success= 'uploadSuccess'>
				<el-button size="small" type="primary">导入Excel</el-button>
			</el-upload>
		</div>
		<div class="inline"><el-link href="/excel/driver.xlsx" type="primary">下载模版</el-link></div>
		<div class="m-top">
			<el-input v-model="listQuery.name" placeholder="请输入姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
			<el-input v-model="listQuery.mobile" placeholder="请输入手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
				搜索
			</el-button>
		</div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="margin-top:30px;"
    >
      <el-table-column align="center" prop="id" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
			 <el-table-column label="手机号" prop="mobile" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="身份证" width="110" prop="id_card" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id_card }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" width="110" prop="car_number" align="center">
        <template slot-scope="scope">
          {{ scope.row.car_number }}
        </template>
      </el-table-column>
      <el-table-column label="卡内余额" width="110" align="center" prop="available_amount">
        <template slot-scope="scope">
          {{ scope.row.available_amount || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="已用额度" width="110" align="center" prop="used_amount">
        <template slot-scope="scope">
          {{ scope.row.used_amount || 0 }}
        </template>
      </el-table-column>
			<el-table-column label="司机类型" width="110" align="center" prop="type">
        <template slot-scope="scope">
          {{ DriverType(scope.row.type) }}
        </template>
      </el-table-column>
			<el-table-column label="卡片类型" width="110" align="center" prop="card_type">
				<template slot-scope="scope">
					{{ cardType(scope.row.card_type) }}
				</template>
      </el-table-column>
			<el-table-column class-name="status-col" label="卡片状态" width="110" align="center" prop="state">
			<template slot-scope="scope">
				<el-tag type="" v-if="scope.row.state == 0">正常</el-tag>
				<el-tag type="danger" v-else>冻结</el-tag>
			</template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_date | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button v-if="scope.row.state == 0" type="primary" icon="el-icon-edit" size="small" @click="handleRecharge(scope)">充值</el-button>
          <el-button v-else disabled type="primary" icon="el-icon-edit" size="small" @click="handleRecharge(scope)">充值</el-button>
        </template>
      </el-table-column>
    </el-table>
		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getDriverList" />
  </div>
</template>

<script>
import { getDriverList, rechargeCardAdd } from '@/api/driverManagement'
import { parseTime } from '@/utils/index'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  data() {
    return {
			list: null,
			total: 0,
			listLoading: true,
			listQuery: { // 查询列表参数
        page_index: 1,
				page_size: 10,
				name: '',
				mobile: ''
			},
			headers: {
				'X-token': getToken()
			},
			optionsDriverlist: [
				{
					id: 0,
					name: '内部司机'
				},
				{
					id: 1,
					name: '外部司机'
				}
			],
			cardTypeList: [
				{
					id: 0,
					name: '私有卡'
				},
				{
					id: 1,
					name: '共享卡'
				}
			]
    }
  },
  created() {
    this.getDriverList()
	},
	filters: {
		// 格式化时间
		parseTime (value) {
			if (!value) return ''
			return parseTime(value)
		}
	},
	components: { Pagination },
	computed: {
		// 司机类型
		DriverType() {
			return function (val) {
				return this.optionsDriverlist.find(x => x.id == val).name
       }
		},
		// 开卡类型
		cardType(val) {
			return function (val) {
				return this.cardTypeList.find(x => x.id == val).name
      }
		}
	},
  methods: {
    // 获取公司列表
    async getDriverList() {
      this.listLoading = true
      const res = await getDriverList(this.listQuery)
			this.list = res.data.list || []
			this.total = res.data.total
      this.listLoading = false
    },
    // 新增新公司
    handleAdd() {
      this.$router.push({ path: '/driverManagement/add'})
    },
    // 修改
    handleEdit(scope) {
      this.$router.push({ path: '/driverManagement/add', query: {id: scope.row.id, mobile: scope.row.mobile}  })
		},
		// 搜索公司
		handleFilter() {
			this.listQuery.page_index = 1
			this.getDriverList()
		},
		// 充值
		handleRecharge(scope) {
			let { card_id } = scope.row
			this.$prompt('请输入充值金额', '加注卡充值', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /\S/,
				inputPlaceholder: '请输入充值金额',
				inputErrorMessage: '充值金额不能为空'
			}).then(({ value }) => {
				rechargeCardAdd({card_id, amount: value }).then(() => {
					this.$message({
						type: 'success',
						message: '充值成功!'
					});
					// 更新列表
					this.getDriverList()
					})
      }).catch(() => {

      });
		},
		// 上传excel成功
		uploadSuccess(response, file, fileList) {
			console.log(response, file, fileList)
		}
   }
}
</script>
<style lang="scss" scoped>
	.m-top {
		margin-top: 30px;
	}
	.inline {
		display: inline-block;
	}
	.m-left {
		margin-left: 30px;
	}
</style>
