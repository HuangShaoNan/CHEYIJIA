<!-- 公司员工管理 模块 -->
<template>
  <div class="app-container">
    <div class="tr">
      <el-select v-model="listQuery.company_id" filterable placeholder="">
        <el-option
          label="请选择/搜索所属公司"
          :value="''"
        />
        <el-option
          v-for="item in optionslist"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="listQuery.state" filterable placeholder="">
        <el-option
          label="请选择充值状态"
          :value="''"
        />
        <el-option
          v-for="item in optionsState"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="listQuery.write_invoice" filterable placeholder="">
        <el-option
          label="请选择开票状态"
          :value="''"
        />
        <el-option
          v-for="item in optionsInvoice"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

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

      <el-table-column label="转账账户名" prop="card_name" align="center">
        <template slot-scope="scope">
          {{ scope.row.card_name }}
        </template>
      </el-table-column>
      <el-table-column label="转账卡号" prop="card_num" align="center">
        <template slot-scope="scope">
          {{ scope.row.card_num }}
        </template>
      </el-table-column>
      <el-table-column label="充值金额" prop="amount" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="充值状态" width="110" align="center" prop="state">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 0" type="">充值中</el-tag>
          <el-tag v-else-if="scope.row.state == 1" type="success">已充值</el-tag>
          <el-tag v-else type="danger">充值失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="转账截图" width="110" align="center" prop="recharge_img">
        <template slot-scope="scope">
          <el-link v-if="scope.row.recharge_img" target="_blank" :href="scope.row.recharge_img">查看<i class="el-icon-view el-icon--right" /> </el-link>
        </template>
      </el-table-column>
      <el-table-column label="企业税号" prop="tax_num" align="center">
        <template slot-scope="scope">
          {{ scope.row.tax_num }}
        </template>
      </el-table-column>
      <el-table-column label="发票状态" prop="write_invoice" align="center">
        <template slot-scope="scope">
          <el-tag type="">{{ scope.row.write_invoice == 0 ? '未开票' : scope.row.write_invoice == 1 ? '申请中' : '已开发票' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发票快递信息" prop="express_name" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.express }}</div>
          <span>{{ scope.row.express_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属公司" width="110" prop="c_id" align="center">
        <template slot-scope="scope">
          <span>{{ companyId(scope.row.c_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值时间" prop="create_date" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_date | parseTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.state == 1" type="primary" size="small" @click="verify(scope)">确认充值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getRechargeList" />
  </div>
</template>

<script>
import { getRechargeList, verify } from '@/api/recharge'
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
        company_id: '', // 所属公司标识
        state: '', // 充值状态
        write_invoice: '' // 是否开发票
      },
      optionslist: [], // 所属公司列表
      optionsState: [
        {
          id: 0,
          name: '充值中'
        },
        {
          id: 1,
          name: '已充值'
        },
        {
          id: 2,
          name: '充值失败'
        }
      ], // 充值状态
      optionsInvoice: [
        {
          id: 0,
          name: '未开票'
        },
        {
          id: 1,
          name: '申请开票'
        },
        {
          id: 2,
          name: '已开票'
        }
      ]
    }
  },
  computed: {
    // 物流公司列表查询过滤
    companyId() {
      return function(val) {
        return this.optionslist.length > 0 ? this.optionslist.find(x => x.id === val).name : '--'
      }
    }
  },
  created() {
    this.getName()
    this.getRechargeList()
  },
  mounted() {

  },
  methods: {
    // 获取公司列表
    async getRechargeList() {
      this.listLoading = true
      const res = await getRechargeList(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
    },
    // 确认充值
    verify(scope) {
      const { amount, id } = scope.row
      this.$confirm('是否确认充值?', `充值金额为${amount}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        verify({ recharge_id: id }).then(() => {
          this.$message({
            type: 'success',
            message: '充值成功!'
          })
          // 更新列表
          this.getRechargeList()
        })
      }).catch(() => {

      })
    },
    // 搜索公司
    handleFilter() {
      this.listQuery.page_index = 1
      this.getRechargeList()
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
