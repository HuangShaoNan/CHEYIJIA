<!-- 公司员工管理 模块 -->
<!-- 公司管理 公司列表 -->
<template>
  <div class="app-container">
    <div class="tr">
      <el-select v-model="listQuery.company_id" filterable placeholder="请选择/搜索所属公司" @change="handleFilter">
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
      <el-select v-model="listQuery.write_invoice" filterable placeholder="请选择开票状态" @change="handleFilter">
        <el-option
          label="申请开票"
          :value="1"
        />
        <el-option
          label="已开发票"
          :value="2"
        />
      </el-select>
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
      <el-table-column label="公司名称" width="110" prop="c_id" align="center">
        <template slot-scope="scope">
          <span>{{ companyId(scope.row.c_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司地址" prop="write_invoice" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="企业税号" prop="tax_num" align="center">
        <template slot-scope="scope">
          {{ scope.row.tax_num }}
        </template>
      </el-table-column>
      <el-table-column label="开票金额" prop="amount" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="NAME" align="center">
        <template slot-scope="scope">
          {{ scope.row.NAME }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="NAME" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="发票快递信息" prop="express_name" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.express_name }}</div>
          <span>{{ scope.row.express_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="create_date" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_date | parseTime }}
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.write_invoice === 1" align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.write_invoice === 1" type="primary" size="small" @click="verify(scope)">开票</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getInvoiceList" />

    <el-dialog title="发票快递信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="快递名称" :label-width="formLabelWidth" class="ipt-w">
          <el-input v-model="form.express_name" />
        </el-form-item>
        <el-form-item label="快递单号" :label-width="formLabelWidth" class="ipt-w">
          <el-input v-model="form.express_num" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="verifyInvoice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getInvoiceList, verifyInvoice } from '@/api/openInvoice'
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
        page_size: 10,
        company_id: '', // 所属公司标识
        write_invoice: 1
      },
      optionslist: [], // 所属公司列表
      dialogFormVisible: false,
      form: {
        express_name: '',
        express_num: ''
      },
      formLabelWidth: '220px',
      recharge_id: ''
    }
  },
  computed: {
    // 物流公司列表查询过滤
    companyId() {
      return function(val) {
        return this.optionslist.find(x => x.id === val).name
      }
    }
  },
  created() {
    this.getName()
  },
  mounted() {
    this.getInvoiceList()
  },
  methods: {
    // 获取公司列表
    async getInvoiceList() {
      this.listLoading = true
      const res = await getInvoiceList(this.listQuery)
      this.list = res.data.list || []
      this.total = res.data.total
      this.listLoading = false
    },
    // 确认开票
    verify(scope) {
      this.dialogFormVisible = true
      this.recharge_id = scope.row.id
    },
    verifyInvoice() {
      const { express_name, express_num } = this.form
      if (express_name === '' || express_num === '') {
        this.$message({
          type: 'warning',
          message: '请输入快递名称及单号!'
        })
        return
      }

      verifyInvoice({ recharge_id: this.recharge_id, express_name, express_num }).then(() => {
        this.$message({
          type: 'success',
          message: '开票成功!'
        })
        this.form.express_name = ''
        this.form.express_num = ''
        // 更新列表
        this.getInvoiceList()
      })
      this.dialogFormVisible = false
    },
    // 搜索公司
    handleFilter() {
      this.listQuery.page_index = 1
      this.getInvoiceList()
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
.ipt-w {
  width: 500px;
}
</style>
