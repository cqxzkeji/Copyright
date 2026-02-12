<template>
  <el-card>
    <template #header>
      <div class="head">
        <span>库存与生产联动</span>
        <div>
          <el-button type="primary" @click="planDialog=true">生成生产计划</el-button>
          <el-button type="warning" @click="warnDialog=true">缺料预警</el-button>
          <el-button @click="tipOpen('库存数据同步完成')">刷新库存</el-button>
        </div>
      </div>
    </template>
    <el-table :data="stocks" border>
      <el-table-column prop="material" label="原料" />
      <el-table-column prop="current" label="当前库存(吨)" />
      <el-table-column prop="safe" label="安全库存(吨)" />
      <el-table-column prop="need" label="未来7天需求(吨)" />
      <el-table-column label="状态">
        <template #default="{row}">
          <el-tag :type="row.current < row.safe ? 'danger' : 'success'">{{ row.current < row.safe ? '预警' : '正常' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"><template #default="{row}"><el-button size="small" @click="tipOpen(`${row.material} 已加入采购申请单`)">申请采购</el-button></template></el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="planDialog" title="生产计划单" width="520" :close-on-click-modal="false">
    <el-form label-width="130px">
      <el-form-item label="生产日期"><el-date-picker type="date" v-model="plan.date" style="width:100%" /></el-form-item>
      <el-form-item label="计划产量(吨)"><el-input v-model="plan.output" /></el-form-item>
      <el-form-item label="执行班组"><el-select v-model="plan.team"><el-option label="A班" value="A" /><el-option label="B班" value="B" /></el-select></el-form-item>
    </el-form>
    <template #footer><el-button @click="planDialog=false">取消</el-button><el-button type="primary" @click="tipOpen('生产计划已下达')">确认下发</el-button></template>
  </el-dialog>

  <el-dialog v-model="warnDialog" title="缺料预警" width="460" :close-on-click-modal="false">
    <el-timeline>
      <el-timeline-item v-for="item in warnings" :key="item">{{ item }}</el-timeline-item>
    </el-timeline>
    <template #footer><el-button type="primary" @click="warnDialog=false">关闭</el-button></template>
  </el-dialog>

  <el-dialog v-model="tipDialog" title="提示" width="360" :close-on-click-modal="false"><p>{{tip}}</p><template #footer><el-button type="primary" @click="tipDialog=false">确定</el-button></template></el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
const planDialog = ref(false)
const warnDialog = ref(false)
const tipDialog = ref(false)
const tip = ref('')
const plan = reactive({ date: '', output: 120, team: 'A' })

const stocks = [
  { material: '玉米', current: 65, safe: 40, need: 52 },
  { material: '豆粕', current: 26, safe: 35, need: 40 },
  { material: '麦麸', current: 18, safe: 20, need: 24 },
  { material: '鱼粉', current: 12, safe: 10, need: 8 },
  { material: '发酵料', current: 16, safe: 18, need: 20 }
]
const warnings = ['豆粕库存低于安全库存9吨', '麦麸预计3天后断料', '发酵料供应周期延长，建议提前采购']
const tipOpen = (text) => { tip.value = text; tipDialog.value = true; planDialog.value = false }
</script>

<style scoped>.head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;}</style>
