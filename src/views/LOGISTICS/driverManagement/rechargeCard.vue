<!-- 充值卡记录 -->
<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="24" class="tr">
        <el-input v-model="listQuery.mobile" placeholder="请输入手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="margin-top:30px;"
    >
      <el-table-column
        type="selection"
        width="55"
      />
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
    <div>
      <el-button style="float: left; margin-top: 30px" type="primary" icon="el-icon-document" @click="exportExc">导出Excel</el-button>
      <pagination v-show="total>0" :total="total" :page-sizes="[20, 50, 100, 200]" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" class="tr" @pagination="rechargeCard" />
    </div>
  </div>
</template>

<script>
import { rechargeCard, rechargeExport } from '@/api/driverManagement'
import { parseTime, toast } from '@/utils/index'
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
        page_size: 20,
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
    async exportExc() {
      let selIds = this.$refs.multipleTable.selection
      if (selIds.length === 0) {
        toast('请勾选要导出的行')
        return
      }
      selIds = selIds.map(i => i.id)
      const loading = this.$loading({
        lock: true,
        text: '正在导出数据。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const res = await rechargeExport({ ids: selIds.join(',') })

      setTimeout(() => {
        location.href = res.url
        loading.close()
      }, 4000)
    },
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
