<template>
  <div class="grid">
    <div class="card" style="padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <h3 style="margin:0">实时采集面板</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn primary" @click="open('start')">开始采集</button>
          <button class="btn" @click="open('calibrate')">传感器校准</button>
          <button class="btn" @click="open('threshold')">阈值设置</button>
          <button class="btn" @click="open('export')">导出采样</button>
        </div>
      </div>
      <div class="grid two" style="margin-top:14px;">
        <div class="card" style="padding:12px;background:#f8fbff;"><b>温度：</b>{{ latest.temperature }}℃</div>
        <div class="card" style="padding:12px;background:#f8fbff;"><b>湿度：</b>{{ latest.humidity }}%</div>
        <div class="card" style="padding:12px;background:#f8fbff;"><b>氧气：</b>{{ latest.oxygen }}%</div>
        <div class="card" style="padding:12px;background:#f8fbff;"><b>氨气：</b>{{ latest.ammonia }}ppm</div>
      </div>
    </div>

    <div class="card" style="padding:16px;overflow:auto;">
      <table class="data-table">
        <thead><tr><th>#</th><th>时间</th><th>温度(℃)</th><th>湿度(%)</th><th>氧气(%)</th><th>氨气(ppm)</th><th>状态</th></tr></thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td><td>{{ row.time }}</td><td>{{ row.temperature }}</td><td>{{ row.humidity }}</td><td>{{ row.oxygen }}</td><td>{{ row.ammonia }}</td>
            <td :class="row.statusClass">{{ row.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :visible="modal==='start'" title="启动采集任务" confirm-text="启动" @close="modal=''" @confirm="save('采集任务已启动')">
      <label>采集频率<select v-model="form.frequency"><option>5秒</option><option>10秒</option><option>30秒</option></select></label>
      <label>采集区域<input v-model="form.zone" /></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='calibrate'" title="传感器校准" confirm-text="开始校准" @close="modal=''" @confirm="save('校准任务下发成功')">
      <label>设备编号<input v-model="form.sensor" placeholder="SEN-01" /></label>
      <label>校准模式<select v-model="form.mode"><option>自动校准</option><option>手动校准</option></select></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='threshold'" title="阈值设置" confirm-text="保存" @close="modal=''" @confirm="save('阈值更新完成')">
      <label>温度上限<input v-model="form.tempMax" type="number" /></label>
      <label>湿度下限<input v-model="form.humiMin" type="number" /></label>
    </ModalDialog>
    <ModalDialog :visible="modal==='export'" title="导出采样数据" confirm-text="导出" @close="modal=''" @confirm="save('数据导出任务已加入队列')">
      <label>导出时间段<input type="date" /></label>
      <label>文件类型<select><option>Excel</option><option>CSV</option></select></label>
    </ModalDialog>
    <ModalDialog :visible="tipVisible" title="执行结果" @close="tipVisible=false">
      <p>{{ tip }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const modal = ref('')
const tip = ref('')
const tipVisible = ref(false)
const form = ref({ frequency: '10秒', zone: 'A区', sensor: 'SEN-01', mode: '自动校准', tempMax: 65, humiMin: 40 })

const rows = Array.from({ length: 24 }, (_, i) => {
  const t = 56 + (i % 5)
  const h = 50 + (i % 8)
  const a = 10 + (i % 6)
  const status = t > 59 ? '关注' : '正常'
  return {
    id: i + 1,
    time: `2026-03-12 08:${String(i).padStart(2, '0')}`,
    temperature: t,
    humidity: h,
    oxygen: (18.2 + (i % 4) * 0.2).toFixed(1),
    ammonia: a,
    status,
    statusClass: status === '正常' ? 'status-ok' : 'status-warn'
  }
})
const latest = computed(() => rows[0])

const open = (name) => (modal.value = name)
const save = (message) => {
  modal.value = ''
  tip.value = message
  tipVisible.value = true
}
</script>
