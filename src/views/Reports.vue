<template>
  <div class="grid">
    <div class="card" style="padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <h3 style="margin:0">报告与统计分析</h3>
        <div style="display:flex;gap:8px;">
          <button class="btn primary" @click="open('daily')">生成日报</button>
          <button class="btn" @click="open('weekly')">生成周报</button>
          <button class="btn" @click="open('predict')">趋势预测</button>
        </div>
      </div>
      <div class="grid two" style="margin-top:12px;">
        <div class="card" style="padding:12px;background:#f8fbff;"><b>月均温度：</b>57.8℃</div>
        <div class="card" style="padding:12px;background:#f8fbff;"><b>月均湿度：</b>53.4%</div>
        <div class="card" style="padding:12px;background:#f8fbff;"><b>预警次数：</b>18 次</div>
        <div class="card" style="padding:12px;background:#f8fbff;"><b>稳定运行率：</b>94.7%</div>
      </div>
    </div>

    <div class="card" style="padding:16px;overflow:auto;">
      <table class="data-table">
        <thead><tr><th>日期</th><th>平均温度</th><th>平均湿度</th><th>预警数</th><th>稳定率</th></tr></thead>
        <tbody><tr v-for="r in reportRows" :key="r.date"><td>{{ r.date }}</td><td>{{ r.temp }}</td><td>{{ r.humi }}</td><td>{{ r.warn }}</td><td>{{ r.stable }}</td></tr></tbody>
      </table>
    </div>

    <ModalDialog :visible="modal==='daily'" title="生成日报" confirm-text="生成" @close="modal=''" @confirm="tipIt('日报已生成并归档。')">
      <label>报告日期<input type="date" /></label>
      <label>输出格式<select><option>PDF</option><option>Excel</option></select></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='weekly'" title="生成周报" confirm-text="生成" @close="modal=''" @confirm="tipIt('周报已生成并发送至管理端。')">
      <label>周次<input placeholder="2026年第11周" /></label>
      <label>包含内容<select><option>全部</option><option>仅异常统计</option></select></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='predict'" title="趋势预测分析" confirm-text="开始预测" @close="modal=''" @confirm="tipIt('未来7天趋势预测已完成。')">
      <label>预测周期<select><option>7天</option><option>14天</option><option>30天</option></select></label>
      <label>预测指标<select><option>温湿耦合</option><option>气体浓度</option></select></label>
    </ModalDialog>
    <ModalDialog :visible="tipVisible" title="任务结果" @close="tipVisible=false"><p>{{ tip }}</p></ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const modal = ref('')
const tipVisible = ref(false)
const tip = ref('')
const reportRows = Array.from({ length: 20 }, (_, i) => ({
  date: `2026-03-${String(i + 1).padStart(2, '0')}`,
  temp: (56 + (i % 4) * 0.7).toFixed(1),
  humi: (50 + (i % 6) * 0.8).toFixed(1),
  warn: i % 5,
  stable: `${(93 + (i % 3) * 1.2).toFixed(1)}%`
}))

const open = (name) => (modal.value = name)
const tipIt = (text) => {
  modal.value = ''
  tip.value = text
  tipVisible.value = true
}
</script>
