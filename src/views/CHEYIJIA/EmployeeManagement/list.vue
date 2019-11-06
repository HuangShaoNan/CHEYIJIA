<!-- 公司员工管理 模块 -->
<!-- 公司管理 公司列表 -->
<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="12">
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
      </el-col>
      <el-col :span="12" class="tr">
        <el-select v-model="listQuery.company_id" filterable placeholder="请选择">
          <el-option
            label="全部公司/模糊搜索"
            :value="''"
          />
          <el-option
            v-for="item in optionslist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
          <el-option
            label="车易加"
            :value="'0'"
          />
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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
      <el-table-column label="姓名" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="所属公司" width="110" prop="company_id" align="center">
        <template slot-scope="scope">
          <span>{{ companyId(scope.row.company_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="用户状态" width="110" align="center" prop="state">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 0" type="">正常</el-tag>
          <el-tag v-else type="danger">冻结</el-tag>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" class="tr" @pagination="getList" />
  </div>
</template>

<script>
import { getList } from '@/api/EmployeeManagement'
import { getName } from '@/api/base'
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
        company_id: '' // 所属公司标识
      },
      optionslist: []
    }
  },
  computed: {
    // 物流公司列表查询过滤
    companyId() {
      return function(val) {
        let curCom = null
        if (this.optionslist.length > 0) {
          curCom = this.optionslist.find(x => x.id === val)
        }
        return curCom ? curCom.name : '车易加'
      }
    },
    elTag(state) {
      return state === 0 ? '' : 'danger'
    }
  },
  created() {
    this.getList()
    this.getName()
  },
  mounted() {

  },
  methods: {
    // 获取公司列表
    async getList() {
      this.listLoading = true
      const res = await getList(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
    },
    // 新增新公司
    handleAdd() {
      this.$router.push({ path: '/EmployeeManagement/add' })
    },
    // 修改
    handleEdit(scope) {
      this.$router.push({ path: '/EmployeeManagement/edit', query: { id: scope.row.id }})
    },
    // 搜索公司
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
    },
    // 获取物流公司列表
    async getName() {
      const res = await getName()
      this.optionslist = res.data
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
