<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="7">
        <el-button type="primary" @click="handleAdd">新增员工</el-button>
      </el-col>
      <el-col :span="17" class="tr">
        <el-input
          v-model="listQuery.name"
          placeholder="请输入员工姓名"
          clearable
          class="ipt-w"
        />
        <el-input
          v-model="listQuery.mobile"
          placeholder="请输入员工手机"
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
      <el-table-column align="center" prop="id" label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="加注点" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.point_name }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="company_id" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="类型" align="center" prop="manager">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.manager == 0" type="">管理员</el-tag>
          <el-tag v-else type="danger">员工</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 0" type="">正常</el-tag>
          <el-tag v-else type="danger">冻结</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" label="注册时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_date | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { staff } from '@/api/point'
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
        name: '',
        mobile: '',
        point_id: 0
      }
    }
  },
  created() {
    this.listQuery.point_id = this.$route.query.id || 0

    this.getList()
  },
  methods: {
    // 获取列表
    async getList(page) {
      page === 1 && (this.listQuery.page_index = 1)
      this.listLoading = true
      const res = await staff(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
    },
    // 新增
    handleAdd() {
      this.$router.push({ path: 'staffadd', query: { point_id: this.listQuery.point_id }})
    },
    // 修改
    handleEdit(scope) {
      this.$router.push({ path: 'staffedit', query: { id: scope.row.id }})
    }
  }
}
</script>
<style lang="scss" scoped>
.ipt-w {
  width: 200px;
}
</style>
