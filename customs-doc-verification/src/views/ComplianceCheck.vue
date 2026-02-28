<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateRows } from '../components/mockData'

const rows = ref(generateRows(20, 'CP'))
const dialog = reactive({ law: false, execute: false, result: false })
const form = reactive({ lawVersion: '海关法2025', region: '全国' })

const runCheck = () => {
  dialog.execute = false
  dialog.result = true
}

const saveRule = () => {
  dialog.law = false
  ElMessage.success('法规匹配规则已更新')
}
</script>

<template>
  <div class="panel">
    <div class="toolbar">
      <el-button type="primary" @click="dialog.law = true">法规匹配配置</el-button>
      <el-button type="success" @click="dialog.execute = true">执行合规检查</el-button>
      <el-button type="info" @click="dialog.result = true">查看合规结果</el-button>
    </div>

    <div class="module-grid" style="margin-bottom: 16px">
      <div class="chart-box">
        <div class="chart-bar" style="height: 66%" />
        <div class="chart-bar" style="height: 45%" />
        <div class="chart-bar" style="height: 77%" />
        <div class="chart-bar" style="height: 35%" />
        <div class="chart-bar" style="height: 82%" />
        <div class="chart-bar" style="height: 58%" />
      </div>
      <el-statistic title="当日合规率" :value="96.4" suffix="%" />
    </div>

    <el-table :data="rows" border stripe>
      <el-table-column prop="id" label="单证号" />
      <el-table-column prop="company" label="企业" />
      <el-table-column prop="date" label="申报日期" />
      <el-table-column label="法规匹配">
        <template #default="{ $index }">{{ $index % 5 === 0 ? '需人工复核' : '已通过' }}</template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialog.law" title="法规版本管理" width="460px" :close-on-click-modal="false">
      <el-form label-position="top">
        <el-form-item label="法规版本"><el-select v-model="form.lawVersion"><el-option label="海关法2025" value="海关法2025" /><el-option label="进出口条例2026" value="进出口条例2026" /></el-select></el-form-item>
        <el-form-item label="适用区域"><el-input v-model="form.region" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialog.law = false">取消</el-button><el-button type="primary" @click="saveRule">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="dialog.execute" title="提示信息" width="400px" :close-on-click-modal="false">
      <p>将按最新法规库检查税号、贸易管制、申报要素、许可证一致性。</p>
      <template #footer><el-button @click="dialog.execute = false">取消</el-button><el-button type="primary" @click="runCheck">开始</el-button></template>
    </el-dialog>

    <el-dialog v-model="dialog.result" title="检查结果" width="460px" :close-on-click-modal="false">
      <el-result icon="success" title="检查完成" sub-title="20 条记录中 19 条合规，1 条需复核。" />
    </el-dialog>
  </div>
</template>
