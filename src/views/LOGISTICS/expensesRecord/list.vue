<!-- 司机消费记录 -->
<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">新增司机</el-button>
    <el-input v-model="listQuery.name" placeholder="请输入姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="姓名" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="tax_num" align="center">
        <template slot-scope="scope">
          {{ scope.row.tax_num }}
        </template>
      </el-table-column>
      <el-table-column label="身份证" width="110" prop="id_card" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id_card }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" width="110" prop="car_number" align="center">
        <template slot-scope="scope">
          {{ scope.row.car_number }}
        </template>
      </el-table-column>
      <el-table-column label="卡内余额" width="110" align="center" prop="available_amount">
        <template slot-scope="scope">
          {{ scope.row.available_amount || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="已用额度" width="110" align="center" prop="used_amount">
        <template slot-scope="scope">
          {{ scope.row.used_amount || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="司机类型" width="110" align="center" prop="type">
        <template slot-scope="scope">
          {{ DriverType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="卡片类型" width="110" align="center" prop="card_id">
        <template slot-scope="scope">
          {{ cardType(scope.row.card_id || 2) }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="卡片状态" width="110" align="center" prop="state">
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" class="tr" @pagination="getDriverList" />
  </div>
</template>

<script>
import { getDriverList } from '@/api/driverManagement'
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
        name: '',
        mobile: ''
      },
      optionsDriverlist: [
        {
          id: 0,
          name: '内部司机'
        },
        {
          id: 1,
          name: '外部司机'
        }
      ],
      cardTypeList: [
        {
          id: 0,
          name: '私有卡'
        },
        {
          id: 1,
          name: '共享卡'
        },
        {
          id: 2,
          name: '未开卡'
        }
      ]
    }
  },
  computed: {
    // 司机类型
    DriverType() {
      return function(val) {
        return this.optionsDriverlist.find(x => x.id === val).name
      }
    },
    // 开卡类型
    cardType(val) {
      return function(val) {
        return this.cardTypeList.find(x => x.id === val).name
      }
    }
  },
  created() {
    this.getDriverList()
  },
  methods: {
    // 获取公司列表
    async getDriverList() {
      this.listLoading = true
      const res = await getDriverList(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
    },
    // 新增新公司
    handleAdd() {
      this.$router.push({ path: '/driverManagement/add' })
    },
    // 修改
    handleEdit(scope) {
      this.$router.push({ path: '/driverManagement/add', query: { id: scope.row.id }})
    },
    // 搜索公司
    handleFilter() {
      this.listQuery.page_index = 1
      this.getDriverList()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
