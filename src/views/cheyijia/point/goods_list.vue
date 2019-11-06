<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="24" class="tr">
        <el-input
          v-model="listQuery.name"
          placeholder="请输入商品名称"
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
      <el-table-column label="加注点" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.point_name }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="price" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.price + ' / ' + scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stock" align="center">
        <template slot-scope="scope">
          {{ scope.row.stock }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="start_time" label="有效期开始时间">
        <template slot-scope="scope">
          <span>{{ scope.row.start_time | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="end_time" label="有效期结束时间">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 0">正常</el-tag>
          <el-tag v-else type="danger">已下架</el-tag>
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
import { goodsList } from '@/api/point'
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
        name: '',
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
      const res = await goodsList(this.listQuery)
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
