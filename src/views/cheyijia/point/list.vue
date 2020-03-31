<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="7">
        <el-button type="primary" @click="handleAdd">新增加油站</el-button>
      </el-col>
      <el-col :span="17" class="tr">
        <el-input
          v-model="listQuery.company_name"
          placeholder="请输入公司名称"
          clearable
          class="ipt-w"
        />
        <el-input
          v-model="listQuery.name"
          placeholder="请输入加油站名称"
          clearable
          class="ipt-w"
        />
        <el-input
          v-model="listQuery.city"
          placeholder="请输入城市"
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
      <el-table-column label="加油站名称" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="加油站照片" prop="name" align="center">
        <template slot-scope="scope">
          <el-link v-if="scope.row.photo" :href="scope.row.photo" type="primary" target="_black" icon="el-icon-view">查看</el-link>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="mobile" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="公司名称" width="110" prop="company_id" align="center">
        <template slot-scope="scope">
          {{ scope.row.company_name }}
        </template>
      </el-table-column>
      <el-table-column label="营业执照" prop="name" align="center">
        <template slot-scope="scope">
          <el-link v-if="scope.row.license_url" :href="scope.row.license_url" target="_black" type="primary" icon="el-icon-view">查看</el-link>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="mobile" align="center">
        <template slot-scope="scope">
          {{ scope.row.staff_name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center">
        <template slot-scope="scope">
          {{ scope.row.staff_mobile }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center" prop="state">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 0" type="">待审核</el-tag>
          <el-tag v-else-if="scope.row.state == 1" type="">已审核</el-tag>
          <el-tag v-else type="danger">冻结</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="预付款剩余" prop="advance" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.advance }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" label="注册时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_date | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-link :href="'#/servicePoint/stafflist?id=' + scope.row.id">
            <el-button type="primary" icon="el-icon-user-solid" size="small">员工</el-button>
          </el-link>
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" class="tr" @pagination="getList" />
  </div>
</template>

<script>
import { list } from '@/api/point'
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
        company_name: '',
        name: '',
        city: ''
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
      const res = await list(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
    },
    // 新增
    handleAdd() {
      this.$router.push({ path: '/servicePoint/add' })
    },
    // 修改
    handleEdit(scope) {
      this.$router.push({ path: '/servicePoint/edit', query: { id: scope.row.id }})
    }
  }
}
</script>
<style lang="scss" scoped>
.ipt-w {
  width: 200px;
}
</style>
