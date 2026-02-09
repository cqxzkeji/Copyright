<template>
  <section>
    <div class="toolbar">
      <button class="btn-primary" @click="modal='form'">远程干预指令</button>
      <button class="btn-success" @click="refreshStatus">刷新状态流</button>
      <button class="btn-warning" @click="modal='tip'">按钮说明</button>
    </div>
    <div class="card"><SimpleBarChart :data="chartData" /></div>
    <div class="card table-wrap" style="margin-top:12px">
      <table><thead><tr><th>设备</th><th>位置</th><th>电量</th><th>速度</th><th>任务进度</th><th>告警</th></tr></thead><tbody>
        <tr v-for="row in rows" :key="row.device"><td>{{ row.device }}</td><td>{{ row.pos }}</td><td>{{ row.battery }}</td><td>{{ row.speed }}</td><td>{{ row.progress }}</td><td>{{ row.warn }}</td></tr>
      </tbody></table>
    </div>
    <ModalDialog v-if="modal==='form'" title="远程干预" @close="modal='none'" @confirm="sendCommand"><label>目标设备</label><input v-model="command.device" /><label>指令内容</label><textarea v-model="command.text" rows="3" /></ModalDialog>
    <ModalDialog v-if="modal==='tip'" title="按钮提示信息" @close="modal='none'" @confirm="modal='none'"><p>远程干预可下发返航、悬停、路径重规划等控制；刷新状态流用于主动拉取最新遥测数据。</p></ModalDialog>
    <ModalDialog v-if="modal==='progress'" title="状态刷新进度" @close="modal='none'" @confirm="modal='none'"><div class="progress"><div class="fill" :style="{width: progress + '%'}"></div></div><p>{{ progress }}% 正在采集最新遥测...</p></ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleBarChart from '../components/SimpleBarChart.vue'
const modal = ref('none')
const progress = ref(0)
const command = reactive({ device: 'UAV-2', text: '切换至备用航线B' })
const chartData = [{ name: '在线率', value: 96 },{ name: '任务完成', value: 72 },{ name: '电量健康', value: 84 },{ name: '链路质量', value: 79 },{ name: '告警处理', value: 67 },{ name: '定位精度', value: 89 }]
const rows = ref(Array.from({ length: 20 }, (_, i) => ({ device: `UAV-${i + 1}`, pos: `N30.${100 + i},E104.${200 + i}`, battery: `${90 - i}%`, speed: `${20 + (i % 5)}km/h`, progress: `${(i * 5) % 100}%`, warn: i % 5 === 0 ? '低风切变' : '无' })))
const sendCommand = () => { rows.value[0] = { ...rows.value[0], warn: `已下发:${command.text.slice(0, 6)}...` }; modal.value = 'none' }
const refreshStatus = () => { modal.value = 'progress'; progress.value = 0; const t = setInterval(() => { progress.value += 25; if (progress.value >= 100) clearInterval(t) }, 150) }
</script>

<style scoped>.progress{height:12px;background:#e2e8f0;border-radius:8px}.fill{height:100%;background:#06b6d4;border-radius:8px}</style>
