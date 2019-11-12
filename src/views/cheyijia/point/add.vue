<!-- 加注点 -->
<template>
  <div class="app-container">
    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
      <el-form-item ref="name" label="名称" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item label="省市">
        <el-select v-model="checkArea" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in areaData[0]"
            :key="item.id"
            :label="item.fullname"
            :value="index"
          />
        </el-select>
        <el-select v-model="checkCity" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in cityData"
            :key="item.id"
            :label="item.fullname"
            :value="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="addForm.address" class="ipt-address" />&nbsp; <el-link type="primary" icon="el-icon-map-location" @click="showMap">定位获取经纬度</el-link>
        <div>经度：{{ addForm.lng || '--' }} &nbsp; 纬度：{{ addForm.lat || '--' }}</div>
      </el-form-item>
      <el-form-item label="加注点照片">
        <el-upload
          class="upload-demo"
          action="/api/uploads?type=img"
          :on-success="photoSuccess"
          :on-remove="photoRemove"
          list-type="picture"
          :headers="headers"
          :limit="1"
          :file-list="photo"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="收款账户号">
        <el-input v-model="addForm.card_num" />
      </el-form-item>
      <el-form-item label="收款账户名">
        <el-input v-model="addForm.card_name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="addForm.state">
          <el-radio :label="0">待审核</el-radio>
          <el-radio :label="1">已审核</el-radio>
          <el-radio :label="2">冻结</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司名称">
        <el-input v-model="addForm.company_name" />
      </el-form-item>
      <el-form-item label="负责人" prop="staff_name">
        <el-input v-model="addForm.staff_name" />
      </el-form-item>
      <el-form-item label="手机号" prop="staff_mobile">
        <el-input v-model="addForm.staff_mobile" />
      </el-form-item>
      <el-form-item label="营业执照">
        <el-upload
          class="upload-demo"
          action="/api/uploads?type=img"
          :on-success="licenseSuccess"
          :on-remove="licenseRemove"
          list-type="picture"
          :headers="headers"
          :limit="1"
          :file-list="license"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="加注点定位"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <div>
        <div class="map-content">
          <div>
            <el-input v-model="addForm.address" class="ipt-address" @input="showMap" />
            经度：{{ addForm.lng || '--' }} &nbsp; 纬度：{{ addForm.lat || '--' }}
          </div>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
        <div id="mymap" class="baidu-map" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, detail, edit } from '@/api/point'
import { getToken } from '@/utils/auth'
const district = import('@/assets/js/district.js')
import { MP } from '@/utils/map.js'

export default {
  data() {
    const vName = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    const vAddress = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入地址'))
      } else {
        callback()
      }
    }
    const vStaff = (rule, value, callback) => {
      if ((value === '')) {
        callback(new Error('请输入负责人'))
      } else {
        callback()
      }
    }
    const vStaffMobile = (rule, value, callback) => {
      const _reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!_reg.test(value)) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    return {
      areaData: [[]],
      cityData: [],
      checkArea: '',
      checkCity: '',
      addForm: {
        name: '',
        address: '',
        staff_name: '',
        staff_mobile: '',
        state: 0,
        lng: '',
        lat: ''
      },
      headers: {
        'X-token': getToken()
      },
      addRules: { // 信息规则验证
        name: [{ required: true, trigger: 'blur', validator: vName }],
        address: [{ required: true, trigger: 'blur', validator: vAddress }],
        staff_name: [{ required: true, trigger: 'blur', validator: vStaff }],
        staff_mobile: [{ required: true, trigger: 'blur', validator: vStaffMobile }]
      },
      id: '',
      photo: [],
      license: [],
      dialogVisible: false
    }
  },
  watch: {
    checkArea() {
      if (this.checkArea !== '') {
        const area = this.areaData[0][this.checkArea]
        this.cityData = this.areaData[1].slice(area.cidx[0], area.cidx[1])
        this.checkCity = ''
      }
    }
  },
  created() {
    this.id = this.$route.query.id || ''

    district.then(res => {
      this.areaData = res.default
    })

    this.id && this.getInfo()
  },
  mounted() {
    MP().then(BMap => {
      console.log(BMap)
    })
  },
  methods: {
    // 获取详情信息
    async getInfo() {
      const info = await detail({ id: this.id })
      this.addForm = info.data
      info.data.photo && this.photo.push({ name: '', url: info.data.photo })
      info.data.license_url && this.license.push({ name: '', url: info.data.license_url })

      const cityPath = JSON.parse(info.data.city_path || 'null')
      if (cityPath) {
        this.checkArea = this.areaData[0].findIndex(item => item.id === cityPath[0].code)
        setTimeout(() => {
          this.checkCity = this.cityData.findIndex(item => item.id === cityPath[1].code)
        }, 200)
      }
    },
    // 提交
    onSubmit() {
      const area = this.getAreaMsg()
      const city = this.getCityMsg()
      if (!area || !city || !this.addForm.address) {
        this.$message.warning('请选择省市输入详细地址')
        return
      }
      if (!this.addForm.lng || !this.addForm.lng) {
        this.$message.warning('请点击定位获取经纬度')
        return
      }

      this.addForm.photo = ''
      this.addForm.license_url = ''
      this.photo.length && (this.addForm.photo = this.photo[0].response ? this.photo[0].response.url : this.photo[0].url)
      this.license.length && (this.addForm.license_url = this.license[0].response ? this.license[0].response.url : this.license[0].url)

      this.addForm.city = city.fullname
      this.addForm.city_path = JSON.stringify([{
        code: area.id, name: area.fullname, pinyin: area.pinyin
      }, {
        code: city.id, name: city.fullname, pinyin: city.pinyin
      }])

      this.$refs.addForm.validate(valid => {
        if (valid) {
          const Fn = this.id ? edit : add
          Fn({ data: this.addForm, create_type: 0 }).then(res => {
            this.$message({
              message: this.id ? '修改成功' : '添加成功',
              type: 'success'
            })
            this.$router.push('list')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传成功
    photoSuccess(response, file, fileList) {
      this.photo = fileList
    },
    licenseSuccess(response, file, fileList) {
      this.license = fileList
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传${fileList.length}张图片，请删除后再上传！`)
    },
    photoRemove(file, fileList) {
      this.photo.length = 0
    },
    licenseRemove(file, fileList) {
      this.license.length = 0
    },
    // 取消
    onCancel() {
      this.$router.go(-1)
    },
    showMap() {
      const area = this.getAreaMsg()
      const city = this.getCityMsg()
      if (!area || !city || !this.addForm.address) {
        this.$message.warning('请选择省市输入详细地址')
        return
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        const BMap = window.BMap
        var map = new BMap.Map('mymap')
        map.addControl(new BMap.NavigationControl())
        var point = new BMap.Point(city.location.lng, city.location.lat)
        map.centerAndZoom(point, 12)
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder()
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(`${area.fullname}${city.fullname}${this.addForm.address}`, (point) => {
          console.log('位置：', point)
          if (point) {
            map.centerAndZoom(point, 16)
            map.addOverlay(new BMap.Marker(point))
            const p = this.bd_decrypt(point.lng, point.lat)
            this.addForm.lng = p.lng
            this.addForm.lat = p.lat
          } else {
            alert('您选择地址没有解析到结果!')
          }
        }, city.fullname)
      })
    },
    // 百度经纬度转高德经纬度
    bd_decrypt(bd_lng, bd_lat) {
      var X_PI = Math.PI * 3000.0 / 180.0
      var x = bd_lng - 0.0065
      var y = bd_lat - 0.006
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
      var gg_lng = z * Math.cos(theta)
      var gg_lat = z * Math.sin(theta)
      return { lng: gg_lng, lat: gg_lat }
    },
    getAreaMsg() {
      return this.checkArea !== '' ? this.areaData[0][this.checkArea] : ''
    },
    getCityMsg() {
      return this.checkCity !== '' ? this.cityData[this.checkCity] : ''
    }
  }
}
</script>

<style scoped>
.ipt-address {
  width: 394px;
}
.disable_but {
  background-color:#a0cfff;
}
.line{
  text-align: center;
}
.baidu-map {
  margin-top: 10px;
  width: 100%;
  height: 500px;
}
.map-content {
  display: flex;
  justify-content: space-between;
}
</style>

