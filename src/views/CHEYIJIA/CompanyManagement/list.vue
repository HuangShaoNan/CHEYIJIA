<!-- 公司管理 公司列表 -->
<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新增新公司</el-button>
		<el-input v-model="listQuery.name" placeholder="请输入公司名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
		<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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
      <el-table-column label="名称" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
			 <el-table-column label="企业税号" prop="tax_num" align="center">
        <template slot-scope="scope">
          {{ scope.row.tax_num }}
        </template>
      </el-table-column>
      <el-table-column label="可用额度" width="110" prop="available_amount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.available_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已用额度" width="110" align="center" prop="used_amount">
        <template slot-scope="scope">
          {{ scope.row.used_amount }}
        </template>
      </el-table-column>
			<el-table-column class-name="status-col" label="营业执照" width="110" align="center" prop="license_url">
        <template slot-scope="scope">
					<el-link v-if="scope.row.license_url" target="_blank" :href="scope.row.license_url">查看<i class="el-icon-view el-icon--right"></i> </el-link>
					<el-link v-else >未上传</el-link>
        </template>
      </el-table-column>
			<el-table-column class-name="status-col" label="状态" width="110" align="center" prop="state">
			<template slot-scope="scope">
				<span>{{ scope.row.state == 0 ? '正常' : '冻结' }}</span>
			</template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_date | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getCompanyMg" />
  </div>
</template>

<script>
import { getList } from '@/api/CompanyManagement'
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
				name: '' // 公司名称
			}
    }
  },
  created() {
    this.getCompanyMg()
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
    async getCompanyMg() {
      this.listLoading = true
      const res = await getList(this.listQuery)
			this.list = res.data.list || []
			this.total = res.data.total
      this.listLoading = false
    },
    // 新增新公司
    handleAdd() {
      this.$router.push({ path: '/CompanyManagement/add'})
    },
    // 修改
    handleEdit(scope) {
      this.$router.push({ path: '/CompanyManagement/edit', query: {id: scope.row.id}  })
		},
		// 搜索公司
		handleFilter() {
			this.listQuery.page_index = 1
			this.getCompanyMg()
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
