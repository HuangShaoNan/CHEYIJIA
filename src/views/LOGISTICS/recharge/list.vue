<!-- 公司账号充值 -->
<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">充值</el-button>
    <el-select v-model="listQuery.state" filterable placeholder="请选择充值状态">
      <el-option
        v-for="item in optionsState"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <el-select v-model="listQuery.write_invoice" filterable placeholder="请选择是否开票">
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
      <el-table-column label="发票状态" prop="write_invoive" align="center">
        <template slot-scope="scope">
          <el-tag type="">{{ scope.row.write_invoice == 0 ? '未开票' : scope.row.write_invoice == 1 ? '申请中' : '已开发票' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="企业税号" prop="tax_num" align="center">
        <template slot-scope="scope">
          {{ scope.row.tax_num }}
        </template>
      </el-table-column>
      <el-table-column label="快递名称" prop="express_name" align="center">
        <template slot-scope="scope">
          {{ scope.row.express }}
        </template>
      </el-table-column>
      <el-table-column label="快递单号" width="110" prop="express_num" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.express_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值时间" prop="create_date" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_date | parseTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <!-- 开票状态未开票和申请中 充值状态成功 才可开票  -->
          <el-button type="primary" :disabled="(scope.row.state !== 1 || scope.row.write_invoice == 2 || scope.row.write_invoice == 1 )" size="small" @click="openInvoice(scope)">开票</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getRechargeList" />
  </div>
</template>

<script>
import { getRechargeList, openInvoice } from '@/api/recharge'
import { detail } from '@/api/CompanyManagement'
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
        state: '', // 充值状态
        write_invoice: '' // 是否开发票
      },
      enterpriseName: '', // 企业名称
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

  },
  created() {
    this.getRechargeList()
    this.getInfo()
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
    openInvoice(scope) {
      const { id } = scope.row
      const h = this.$createElement
      this.$prompt('请输入企业税号', '开具发票', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputPlaceholder: '请输入企业税号',
        inputErrorMessage: '企业税号不能为空',
        message: h('p', null, [
          h('span', null, '企业名称： '),
          h('i', { style: 'color: teal' }, `${this.enterpriseName}`)
        ])
      }).then(({ value }) => {
        openInvoice({ recharge_id: id, tax_num: value }).then(() => {
          this.$message({
            type: 'success',
            message: '开票成功!'
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
    // 新增充值
    handleAdd() {
      this.$router.push({ path: '/recharge/add' })
    },
    // 获取企业信息
    async getInfo() {
      const res = await detail()
      console.log(res)
      this.enterpriseName = res.data.name
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
