<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="24" class="tr">
        <el-input
          v-model="listQuery.company_name"
          placeholder="请输入公司名称"
          clearable
          class="ipt-w"
        />
        <el-input
          v-model="listQuery.name"
          placeholder="请输入加注点名称"
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
      <el-table-column label="加注点名称" prop="name" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
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
      <el-table-column label="预付款剩余" prop="advance" align="center">
        <template slot-scope="scope">
          <el-tag class="f16">¥{{ scope.row.advance }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" label="注册时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_date | parseTime }}</span>
        </template>
      </el-table-column>/
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="showRecharge(scope)">充值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" class="tr" @pagination="getList" />

    <el-dialog
      title="预付款充值"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div class="f16">
        <div class="flex"><span>账户名：</span><div>{{ point.card_name }}</div></div>
        <div class="flex"><span>账户卡号：</span><div>{{ point.card_num }}</div></div>
        <div class="flex"><span>充值金额：</span><div><el-input v-model="amount" type="number" placeholder="请输入金额" clearable /></div></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="msg">点击充值后金额将直接充入加注点，请确认实际转账到账后再充值</span><el-button type="primary" @click="recharge">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, rechargeAdd } from '@/api/point'
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
        state: 1,
        page_index: 1,
        page_size: 20,
        company_name: '',
        name: '',
        city: ''
      },
      dialogVisible: false,
      point: {},
      amount: ''
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
    showRecharge(scope) {
      this.point = scope.row
      this.dialogVisible = true
    },
    recharge(scope) {
      if (!this.point.card_num || !this.point.card_name) {
        this.$message({
          message: '请先设置加注点账户名及卡号！',
          type: 'warning'
        })
        return
      }
      this.point.amount = ~~this.amount
      if (this.point.amount <= 0) {
        this.$message({
          message: '请输入正确的金额！',
          type: 'warning'
        })
        return
      }

      rechargeAdd({ recharge: this.point }).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: '充值完成！',
            type: 'success'
          })
          this.getList()
          this.dialogVisible = false
          this.amount = ''
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ipt-w {
  width: 200px;
}
.flex {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.flex span {
  display: block;
  width: 150px;
  text-align: right;
}
.msg {
  font-size: 12px;
  color: red;
  margin-right: 30px;
}
</style>
