<template>
  <div class="app-container">
    <el-row v-if="false" type="flex" class="row-bg" justify="space-around">
      <el-col :span="24" class="tr">
        <el-input
          v-model="listQuery.name"
          placeholder="请输入"
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
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="加油站" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="消费金额" prop="amount" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="卡类型" prop="card_type" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.card_type == 0">私有卡</el-tag>
          <el-tag v-else-if="scope.row.card_type == 1">共享卡</el-tag>
          <el-tag v-else>微信支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="state" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 0">未支付</el-tag>
          <el-tag v-else-if="scope.row.state == 1">已支付</el-tag>
          <el-tag v-else type="danger">已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" label="创建时间">
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
import { orderList } from '@/api/point'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  filters: {
    // 格式化时间
    parseTime(value) {
      if (!value) return '不限'
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
        type: 'all',
        point_id: 0
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
      const res = await orderList(this.listQuery)
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
