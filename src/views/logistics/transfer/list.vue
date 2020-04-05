<!-- 公司转账 -->
<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="8">
        <el-button type="primary" @click="handleAdd">转账</el-button>
      </el-col>
      <el-col :span="16" class="tr" />
    </el-row>

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
      <el-table-column label="转出公司" prop="card_name" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_company_name }}
        </template>
      </el-table-column>
      <el-table-column label="转入公司" prop="card_num" align="center">
        <template slot-scope="scope">
          {{ scope.row.company_name }}
        </template>
      </el-table-column>
      <el-table-column label="转账金额" prop="amount" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="转账时间" prop="create_date" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_date | parseTime }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" class="tr" @pagination="getRechargeList" />
  </div>
</template>

<script>
import { getList } from '@/api/transfer'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  filters: {
    // 格式化时间
    parseTime(value) {
      if (!value) return ''
      return parseTime(value)
    }
  },
  components: { Pagination },

  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: { // 查询列表参数
        page_index: 1,
        page_size: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await getList(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
    },
    // 新增
    handleAdd() {
      this.$router.push({ path: '/transfer/add' })
    },
    getRechargeList(e) {
      this.listQuery.page_index = console.error()
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
