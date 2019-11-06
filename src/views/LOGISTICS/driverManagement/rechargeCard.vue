<!-- 充值卡记录 -->
<template>
  <div class="app-container">
    <el-input v-model="listQuery.mobile" placeholder="请输入手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="姓名" prop="driver_name" align="center">
        <template slot-scope="scope">
          {{ scope.row.driver_name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="driver_mobile" align="center">
        <template slot-scope="scope">
          {{ scope.row.driver_mobile }}
        </template>
      </el-table-column>
      <el-table-column label="充值金额" width="110" align="center" prop="amount">
        <template slot-scope="scope">
          {{ scope.row.amount || 0 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_date | parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" class="tr" @pagination="rechargeCard" />
  </div>
</template>

<script>
import { rechargeCard } from '@/api/driverManagement'
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
        page_size: 10,
        mobile: ''
      }
    }
  },
  computed: {
  },
  created() {
    this.rechargeCard()
  },
  methods: {
    // 获取充值记录表
    async rechargeCard() {
      this.listLoading = true
      const res = await rechargeCard(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
    },
    // 搜索公司
    handleFilter() {
      this.listQuery.page_index = 1
      this.rechargeCard()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
