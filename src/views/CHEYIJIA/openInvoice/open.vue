<!-- 公司员工管理 模块 -->
<!-- 公司管理 公司列表 -->
<template>
  <div class="app-container">
		<el-select v-model="listQuery.company_id" filterable placeholder="请选择/搜索所属公司">
			<el-option
				v-for="item in optionslist"
				:key="item.id"
				:label="item.name"
				:value="item.id">
			</el-option>
		</el-select>
		<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
			搜索
		</el-button>
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
			<el-table-column label="所属公司" width="110" prop="c_id" align="center">
        <template slot-scope="scope">
          <span>{{ companyId(scope.row.c_id) }}</span>
        </template>
      </el-table-column>

			<el-table-column label="开票金额" prop="amount" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
			<el-table-column label="姓名" prop="NAME" align="center">
        <template slot-scope="scope">
          {{ scope.row.NAME }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="create_date" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_date | parseTime  }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="verify(scope)">开票</el-button>
        </template>
      </el-table-column>
    </el-table>
		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getInvoiceList" />
  </div>
</template>

<script>
import { getInvoiceList, verifyInvoice } from '@/api/openInvoice'
import { getName } from '@/api/base'
import { parseTime } from '@/utils/index'
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
				company_id: '' // 所属公司标识
			},
			optionslist: [] // 所属公司列表
    }
  },
  created() {
		this.getInvoiceList()
		this.getName()
	},
	mounted() {

	},
	computed: {
		// 物流公司列表查询过滤
		companyId() {
			return function (val) {
				return this.optionslist.find(x => x.id == val).name
       }
		}
	},
	filters: {
		// 格式化时间
		parseTime (value) {
			if (!value) return ''
			return parseTime(value)
		}
	},
	components: { Pagination },
  methods: {
    // 获取公司列表
    async getInvoiceList() {
      this.listLoading = true
      const res = await getInvoiceList(this.listQuery)
			this.list = res.data.list || []
			this.total = res.data.total
			this.listLoading = false
    },
    // 确认充值
    verify(scope) {
			let { id, express_name, express_num} = scope.row
			this.$confirm('是否确认开票?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
					verifyInvoice({recharge_id: id,express_name, express_num }).then(() => {
						this.$message({
							type: 'success',
							message: '开票成功!'
						});
						// 更新列表
						this.getInvoiceList()
					})

        }).catch(() => {

        });
		},
		// 搜索公司
		handleFilter() {
			this.listQuery.page_index = 1
			this.getInvoiceList()
		},
		// 获取物流公司列表
		async getName() {
			let res = await getName()
			this.optionslist = res.data
		}
  }
}
</script>
<style lang="scss" scoped>

</style>
