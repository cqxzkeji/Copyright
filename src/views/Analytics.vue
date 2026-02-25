<template>
  <div class="panel">
    <div class="toolbar">
      <button @click="openProgress('正在同步实时行为数据...')">同步实时数据</button>
      <button @click="openInfo('统计报表已导出到下载中心。')">导出报表</button>
      <button @click="openInfo('预测模型已完成训练。')">更新预测模型</button>
    </div>

    <div class="chart-box">
      <svg viewBox="0 0 640 220" role="img" aria-label="播放量图表">
        <line x1="30" y1="190" x2="620" y2="190" stroke="#8ea9dc"/>
        <line x1="30" y1="20" x2="30" y2="190" stroke="#8ea9dc"/>
        <g v-for="(item,index) in chartData" :key="item.day">
          <rect :x="50 + index*55" :y="190 - item.play/120" width="26" :height="item.play/120" fill="#3b82f6" rx="6"/>
          <text :x="52 + index*55" y="206" font-size="11" fill="#334155">{{ item.day }}</text>
        </g>
      </svg>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th>日期</th><th>播放量</th><th>活跃用户</th><th>完播率</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="item in details" :key="item.date">
            <td>{{ item.date }}</td><td>{{ item.play }}</td><td>{{ item.active }}</td><td>{{ item.finish }}</td>
            <td><button class="small" @click="openInfo(`已查看 ${item.date} 详情。`)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :visible="modal.progress" title="进度提示" @close="modal.progress=false">
      <p>{{ message }}</p>
      <div class="bar"><span :style="{width:`${progress}%`}"/></div>
      <p>{{ progress }}%</p>
    </ModalDialog>
    <ModalDialog :visible="modal.info" title="统计提示" @close="modal.info=false"><p>{{ message }}</p></ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const chartData = [
  { day: 'Mon', play: 3200 }, { day: 'Tue', play: 4200 }, { day: 'Wed', play: 3900 },
  { day: 'Thu', play: 5100 }, { day: 'Fri', play: 6200 }, { day: 'Sat', play: 7100 }, { day: 'Sun', play: 6900 }
]

const details = Array.from({ length: 20 }, (_, i) => ({
  date: `2026-01-${String(i + 1).padStart(2, '0')}`,
  play: 3200 + i * 210,
  active: 680 + i * 23,
  finish: `${72 + (i % 8)}%`
}))

const progress = ref(0)
const message = ref('')
const modal = reactive({ progress: false, info: false })

const openInfo = (text) => {
  message.value = text
  modal.info = true
}
const openProgress = (text) => {
  message.value = text
  modal.progress = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 20
    if (progress.value >= 100) clearInterval(timer)
  }, 150)
}
</script>

<style scoped>
.panel{display:grid;gap:14px}.toolbar{display:flex;gap:10px;flex-wrap:wrap}button{border:1px solid #c8d5f0;background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}.chart-box{background:#fff;border:1px solid #dbe6ff;border-radius:12px;padding:12px}.chart-box svg{width:100%;height:240px}.table-wrap{overflow:auto;background:#fff;border:1px solid #dbe6ff;border-radius:12px}table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:10px;border-bottom:1px solid #ebeff8;text-align:left}.small{padding:5px 9px}.bar{height:10px;background:#e5ecff;border-radius:999px;overflow:hidden}.bar span{display:block;height:100%;background:#2563eb}
</style>
