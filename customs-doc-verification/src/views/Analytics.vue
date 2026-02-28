<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateRows } from '../components/mockData'

const rows = ref(generateRows(20, 'AN'))
const dialog = reactive({ filter: false, export: false, tips: false })
const form = reactive({ month: '2026-02', department: '总关统计处' })

const applyFilter = () => {
  dialog.filter = false
  ElMessage.success('统计维度已更新')
}

const exportReport = () => {
  dialog.export = false
  ElMessage.success('报告已导出为 PDF')
}
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <el-button type="primary" @click="dialog.filter = true">筛选条件</el-button>
      <el-button type="success" @click="dialog.export = true">导出报告</el-button>
      <el-button @click="dialog.tips = true">指标说明</el-button>
    </div>

    <div class="module-grid" style="margin-bottom: 16px">
      <div class="chart-box">
        <div class="chart-bar" style="height: 24%" />
        <div class="chart-bar" style="height: 38%" />
        <div class="chart-bar" style="height: 52%" />
        <div class="chart-bar" style="height: 66%" />
        <div class="chart-bar" style="height: 80%" />
        <div class="chart-bar" style="height: 92%" />
      </div>
      <el-card>
        <el-statistic title="月度处理总量" :value="12380" />
        <el-statistic title="自动通过率" :value="93.8" suffix="%" />
      </el-card>
    </div>

    <el-table :data="rows" border stripe>
      <el-table-column prop="id" label="单证号" />
      <el-table-column prop="company" label="企业" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="date" label="日期" />
      <el-table-column label="时效(分钟)">
        <template #default="{ $index }">{{ 8 + ($index % 7) }}</template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialog.filter" title="统计筛选" width="460px" :close-on-click-modal="false">
      <el-form label-position="top">
        <el-form-item label="统计月份"><el-input v-model="form.month" /></el-form-item>
        <el-form-item label="归属部门"><el-input v-model="form.department" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialog.filter = false">取消</el-button><el-button type="primary" @click="applyFilter">应用</el-button></template>
    </el-dialog>

    <el-dialog v-model="dialog.export" title="导出设置" width="400px" :close-on-click-modal="false">
      <p>将导出趋势图、业务量统计、风险分布与合规明细。</p>
      <template #footer><el-button @click="dialog.export = false">取消</el-button><el-button type="primary" @click="exportReport">确认导出</el-button></template>
    </el-dialog>

    <el-dialog v-model="dialog.tips" title="提示信息" width="420px" :close-on-click-modal="false">
      <p>支持按口岸、企业、业务类型、监管方式和时间维度进行定制化分析。</p>
      <template #footer><el-button type="primary" @click="dialog.tips = false">知道了</el-button></template>
    </el-dialog>
  </div>
</template>
