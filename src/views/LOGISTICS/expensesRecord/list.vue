<!-- 司机消费记录 -->
<template>
  <div class="app-container">
    <div class="tr">
      <el-input v-model="listQuery.name" placeholder="请输入姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.mobile" placeholder="请输入手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

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
      <el-table-column label="加油站" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="司机姓名" prop="driver_name" align="center">
        <template slot-scope="scope">
          {{ scope.row.driver_name }}
        </template>
      </el-table-column>
      <el-table-column label="司机手机" prop="driver_mobile" align="center">
        <template slot-scope="scope">
          {{ scope.row.driver_mobile }}
        </template>
      </el-table-column>
      <el-table-column label="消费金额" width="110" align="center" prop="available_amount">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="卡片类型" width="110" align="center" prop="card_type">
        <template slot-scope="scope">
          {{ cardType(scope.row.card_type) }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号" prop="driver_mobile" align="center">
        <template slot-scope="scope">
          {{ scope.row.car_number }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" label="消费时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_date | parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button style="float: left; margin-top: 30px" type="primary" icon="el-icon-document" @click="exportExc">导出Excel</el-button>
      <pagination v-show="total>0" :page-sizes="[20, 50, 100, 200]" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" class="tr" @pagination="getDriverList" />
    </div>
  </div>
</template>

<script>
import { orderList, exportOrder } from '@/api/point'
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
      list: [],
      total: 0,
      listLoading: true,
      listQuery: { // 查询列表参数
        page_index: 1,
        page_size: 20,
        type: 'company',
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
      const res = await exportOrder({ ids: selIds.join(',') })

      setTimeout(() => {
        location.href = res.url
        loading.close()
      }, 4000)
    },
    // 获取公司列表
    async getDriverList() {
      this.listLoading = true
      const res = await orderList(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
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
