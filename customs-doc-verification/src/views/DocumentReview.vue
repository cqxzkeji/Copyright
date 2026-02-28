<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateRows } from '../components/mockData'

const rows = ref(generateRows(20, 'RV'))
const dialog = reactive({ compare: false, detail: false, tip: false })
const selected = ref(null)
const compareForm = reactive({ version: '2026A', threshold: 95 })

const runCompare = () => {
  dialog.compare = false
  ElMessage.success('自动比对已启动，错误项将高亮显示')
}

const viewDetail = row => {
  selected.value = row
  dialog.detail = true
}
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <el-button type="primary" @click="dialog.compare = true">启动智能比对</el-button>
      <el-button type="warning" @click="dialog.tip = true">审核规则提示</el-button>
    </div>

    <div class="chart-box" style="margin-bottom: 16px">
      <div class="chart-bar" style="height: 40%" />
      <div class="chart-bar" style="height: 70%" />
      <div class="chart-bar" style="height: 55%" />
      <div class="chart-bar" style="height: 83%" />
      <div class="chart-bar" style="height: 61%" />
      <div class="chart-bar" style="height: 72%" />
    </div>

    <el-table :data="rows" border stripe>
      <el-table-column prop="id" label="单证号" />
      <el-table-column prop="company" label="企业" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="status" label="审核结果" />
      <el-table-column label="操作" width="110">
        <template #default="{ row }"><el-button link type="primary" @click="viewDetail(row)">查看</el-button></template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialog.compare" title="比对参数设置" width="420px" :close-on-click-modal="false">
      <el-form label-position="top">
        <el-form-item label="规则版本"><el-select v-model="compareForm.version"><el-option label="2026A" value="2026A" /><el-option label="2026B" value="2026B" /></el-select></el-form-item>
        <el-form-item label="匹配阈值(%)"><el-input-number v-model="compareForm.threshold" :min="80" :max="100" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialog.compare = false">取消</el-button><el-button type="primary" @click="runCompare">执行</el-button></template>
    </el-dialog>

    <el-dialog v-model="dialog.detail" title="单证详情" width="500px" :close-on-click-modal="false">
      <el-descriptions :column="1" border v-if="selected">
        <el-descriptions-item label="单证号">{{ selected.id }}</el-descriptions-item>
        <el-descriptions-item label="企业">{{ selected.company }}</el-descriptions-item>
        <el-descriptions-item label="错误提示">币种字段与发票不一致，请修正后重提。</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="dialog.tip" title="提示信息" width="420px" :close-on-click-modal="false">
      <p>自动比对涵盖 HS 编码、金额、币种、签章、运输方式等 38 项规则。</p>
      <template #footer><el-button type="primary" @click="dialog.tip = false">关闭</el-button></template>
    </el-dialog>
  </div>
</template>
