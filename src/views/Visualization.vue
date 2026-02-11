<template>
  <div class="grid">
    <div class="card" style="padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <h3 style="margin:0">运行趋势图</h3>
        <div style="display:flex;gap:8px;">
          <button class="btn" @click="open('refresh')">刷新视图</button>
          <button class="btn" @click="open('compare')">历史对比</button>
          <button class="btn primary" @click="open('screen')">大屏模式</button>
        </div>
      </div>
      <svg viewBox="0 0 600 220" style="width:100%;margin-top:12px;background:#f8fbff;border-radius:10px;">
        <polyline points="20,180 90,160 160,130 230,120 300,100 370,110 440,90 510,80 580,70" fill="none" stroke="#2563eb" stroke-width="4" />
        <polyline points="20,170 90,150 160,150 230,140 300,130 370,120 440,115 510,110 580,100" fill="none" stroke="#0ea5e9" stroke-width="4" />
      </svg>
      <p style="margin:8px 0 0;color:#64748b">蓝线：温度趋势；青线：湿度趋势。</p>
    </div>

    <div class="card" style="padding:16px;overflow:auto;">
      <table class="data-table">
        <thead><tr><th>时刻</th><th>温度</th><th>湿度</th><th>氧气</th><th>评估</th></tr></thead>
        <tbody><tr v-for="item in points" :key="item.time"><td>{{ item.time }}</td><td>{{ item.temp }}</td><td>{{ item.humi }}</td><td>{{ item.o2 }}</td><td :class="item.cls">{{ item.state }}</td></tr></tbody>
      </table>
    </div>

    <ModalDialog :visible="modal==='refresh'" title="刷新配置" confirm-text="刷新" @close="modal=''" @confirm="tipIt('实时图表已刷新。')">
      <label>刷新周期<select><option>5秒</option><option>15秒</option><option>30秒</option></select></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='compare'" title="历史对比" confirm-text="生成对比" @close="modal=''" @confirm="tipIt('历史趋势对比图已生成。')">
      <label>对比日期<input type="date" /></label>
      <label>指标<select><option>温度</option><option>湿度</option><option>气体浓度</option></select></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='screen'" title="大屏显示" confirm-text="启用" @close="modal=''" @confirm="tipIt('大屏模式已启用。')">
      <p>启用后图表将自动全屏并进入轮播展示。</p>
    </ModalDialog>
    <ModalDialog :visible="tipVisible" title="提示" @close="tipVisible=false"><p>{{ tip }}</p></ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const modal = ref('')
const tipVisible = ref(false)
const tip = ref('')
const points = Array.from({ length: 20 }, (_, i) => ({
  time: `T${i + 1}`,
  temp: 54 + (i % 6),
  humi: 47 + (i % 9),
  o2: (18.1 + (i % 5) * 0.2).toFixed(1),
  state: i % 7 === 0 ? '预警' : '正常',
  cls: i % 7 === 0 ? 'status-warn' : 'status-ok'
}))

const open = (name) => (modal.value = name)
const tipIt = (text) => {
  modal.value = ''
  tip.value = text
  tipVisible.value = true
}
</script>
