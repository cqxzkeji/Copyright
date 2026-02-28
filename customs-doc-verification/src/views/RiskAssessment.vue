<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateRows } from '../components/mockData'

const rows = ref(generateRows(20, 'RK'))
const dialog = reactive({ alert: false, report: false, progress: false })
const progress = ref(0)
const report = reactive({ level: '中风险', recipient: 'risk@customs.gov.cn' })

const startScan = () => {
  dialog.progress = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 20
    if (progress.value >= 100) {
      clearInterval(timer)
      ElMessage.success('风险扫描完成，发现 3 条高风险记录')
    }
  }, 180)
}

const sendReport = () => {
  dialog.report = false
  ElMessage.success('风险报告已发送')
}
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <el-button type="danger" @click="dialog.alert = true">查看预警策略</el-button>
      <el-button type="primary" @click="startScan">执行风险扫描</el-button>
      <el-button @click="dialog.report = true">生成评估报告</el-button>
    </div>

    <el-table :data="rows" border stripe>
      <el-table-column prop="id" label="单证号" />
      <el-table-column prop="company" label="企业" />
      <el-table-column prop="type" label="类别" />
      <el-table-column label="风险分" width="100">
        <template #default="{ $index }">{{ 55 + ($index % 40) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" />
    </el-table>

    <el-dialog v-model="dialog.alert" title="预警提示" width="460px" :close-on-click-modal="false">
      <el-alert title="规则命中：高频改单 + 敏感商品 + 低申报价" type="warning" :closable="false" show-icon />
      <p style="margin-top: 10px">建议立即复核企业资质、交易对手及历史通关异常记录。</p>
    </el-dialog>

    <el-dialog v-model="dialog.report" title="报告生成" width="460px" :close-on-click-modal="false">
      <el-form label-position="top">
        <el-form-item label="风险级别"><el-select v-model="report.level"><el-option label="高风险" value="高风险" /><el-option label="中风险" value="中风险" /></el-select></el-form-item>
        <el-form-item label="接收邮箱"><el-input v-model="report.recipient" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialog.report = false">取消</el-button><el-button type="primary" @click="sendReport">发送</el-button></template>
    </el-dialog>

    <el-dialog v-model="dialog.progress" title="扫描进度" width="420px" :close-on-click-modal="false">
      <el-progress :percentage="progress" status="success" />
    </el-dialog>
  </div>
</template>
