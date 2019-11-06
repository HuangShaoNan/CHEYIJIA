<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="24" class="tr">
        <el-input
          v-model="listQuery.point_name"
          placeholder="请输入加注点名称"
          clearable
          class="ipt-w"
        />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList(1)">
          搜索
        </el-button>
      </el-col>
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
      <el-table-column label="加注点名称" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.point_name }}
        </template>
      </el-table-column>
      <el-table-column label="账户名" prop="card_name" align="center">
        <template slot-scope="scope">
          {{ scope.row.card_name }}
        </template>
      </el-table-column>
      <el-table-column label="卡号" prop="card_num" align="center">
        <template slot-scope="scope">
          {{ scope.row.card_num }}
        </template>
      </el-table-column>
      <el-table-column label="充值用户" width="110" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="充值金额" prop="amount" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="充值前金额" prop="before_amount" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.before_amount }}
        </template>
      </el-table-column>
      <el-table-column label="充值后金额" prop="after_amount" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.after_amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" label="充值时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_date | parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" class="tr" @pagination="getList" />
  </div>
</template>

<script>
import { rechargeList } from '@/api/point'
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
        page_size: 20,
        point_name: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList(page) {
      page === 1 && (this.listQuery.page_index = 1)
      this.listLoading = true
      const res = await rechargeList(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.ipt-w {
  width: 200px;
}
</style>
