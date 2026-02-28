<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import flowImage from '../assets/flow.svg'
import { generateRows } from '../components/mockData'

const rows = ref(generateRows(20, 'UP'))
const dialog = reactive({ form: false, progress: false, info: false })
const progress = ref(0)
const form = reactive({ type: '', source: '' })

const openProgress = () => {
  dialog.progress = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(timer)
      ElMessage.success('批量导入完成')
    }
  }, 150)
}

const submitForm = () => {
  dialog.form = false
  ElMessage.success('单证上传任务已创建')
}
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <el-button type="primary" @click="dialog.form = true">上传单证</el-button>
      <el-button @click="openProgress">批量导入</el-button>
      <el-button type="success" @click="dialog.info = true">完整性校验说明</el-button>
    </div>

    <div class="module-grid" style="margin-bottom: 16px">
      <el-image :src="flowImage" fit="cover" style="width: 100%; border-radius: 10px" />
      <div class="chart-box">
        <div class="chart-bar" style="height: 28%" />
        <div class="chart-bar" style="height: 35%" />
        <div class="chart-bar" style="height: 49%" />
        <div class="chart-bar" style="height: 63%" />
        <div class="chart-bar" style="height: 78%" />
        <div class="chart-bar" style="height: 54%" />
      </div>
    </div>

    <el-table :data="rows" border stripe>
      <el-table-column prop="id" label="单证号" />
      <el-table-column prop="company" label="企业" />
      <el-table-column prop="type" label="单证类型" />
      <el-table-column prop="date" label="上传日期" />
      <el-table-column prop="status" label="状态" />
    </el-table>

    <el-dialog v-model="dialog.form" title="上传与导入配置" width="460px" :close-on-click-modal="false">
      <el-form :model="form" label-position="top">
        <el-form-item label="单证类型"><el-select v-model="form.type" placeholder="选择类型"><el-option label="报关单" value="报关单" /><el-option label="发票" value="发票" /></el-select></el-form-item>
        <el-form-item label="导入来源"><el-input v-model="form.source" placeholder="本地目录或FTP地址" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialog.form = false">取消</el-button><el-button type="primary" @click="submitForm">确认</el-button></template>
    </el-dialog>

    <el-dialog v-model="dialog.progress" title="导入进度" width="420px" :close-on-click-modal="false">
      <el-progress :percentage="progress" :stroke-width="18" />
    </el-dialog>

    <el-dialog v-model="dialog.info" title="提示信息" width="420px" :close-on-click-modal="false">
      <p>系统会自动检查文件哈希、必填字段、签章和编码格式，确保文件完整与合法。</p>
      <template #footer><el-button type="primary" @click="dialog.info = false">我知道了</el-button></template>
    </el-dialog>
  </div>
</template>
