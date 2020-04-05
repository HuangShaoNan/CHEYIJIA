<!-- 公司转账 -->
<template>
  <div class="app-container" style="width: 500px">
    <div v-if="list.length === 0" style="padding: 100px 0; color:#666; text-align: center; line-height: 30px;">无总公司或分公司，无法转账<br>如需添加分公司请联系车易加客服~</div>
    <el-form v-else label-width="120px">
      <el-form-item label="转入公司">
        <el-select v-model="cid" placeholder="请选择">
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转账金额">
        <el-input v-model="amount" type="number" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { transferAdd, getComList } from '@/api/transfer'

export default {
  data() {
    return {
      id: '',
      cid: '',
      amount: '',
      list: []
    }
  },
  created() {
    getComList({ page_index: 1, page_size: 100 }).then(res => {
      this.list = res.data.list
    })
  },
  methods: {
    // 提交
    onSubmit() {
      if (!this.cid) {
        this.$message({
          message: '请选择转账公司',
          type: 'warning'
        })
        return
      }
      if (parseFloat(this.amount) > 0) {
        transferAdd({ cid: this.cid, amount: this.amount }).then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({ path: 'list' })
        })
      } else {
        this.$message({
          message: '转账金额无效',
          type: 'warning'
        })
        return
      }
    },
    // 取消
    onCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

