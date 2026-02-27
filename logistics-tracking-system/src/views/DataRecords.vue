<template>
  <div class="module">
    <div class="toolbar">
      <button @click="showForm = true" title="新增日志">新增日志</button>
      <button @click="showProgress = true" title="归档记录">归档处理</button>
      <button @click="showTip = true" title="按钮提示">按钮提示</button>
    </div>
    <SimpleChart title="温湿度记录波动图" :values="[20, 25, 32, 30, 36, 44, 40, 52, 48, 60]" />
    <table>
      <thead><tr><th>记录ID</th><th>时间戳</th><th>温度</th><th>湿度</th><th>记录人</th></tr></thead>
      <tbody><tr v-for="item in rows" :key="item.id"><td>{{ item.id }}</td><td>{{ item.time }}</td><td>{{ item.temp }}℃</td><td>{{ item.humi }}%</td><td>{{ item.user }}</td></tr></tbody>
    </table>

    <ModalDialog :visible="showForm" title="新增运输日志" @close="showForm = false">
      <form class="form"><input placeholder="记录内容" /><input placeholder="记录人" /><input placeholder="设备标签" /></form>
    </ModalDialog>
    <ModalDialog :visible="showProgress" title="归档进度" @close="showProgress = false"><p>批量归档完成，20条记录已入库并通过审计。</p></ModalDialog>
    <ModalDialog :visible="showTip" title="按钮提示" @close="showTip = false"><p>系统支持高效检索，可按时间、车辆、人员、异常标签快速查询。</p></ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleChart from '../components/SimpleChart.vue'

const rows = Array.from({ length: 20 }, (_, i) => ({
  id: `DR-${2000 + i}`,
  time: `2026-03-${(i % 28) + 1} ${(i % 24).toString().padStart(2, '0')}:00`,
  temp: 4 + (i % 10),
  humi: 45 + (i % 30),
  user: `记录员${i + 1}`
}))

const showForm = ref(false)
const showProgress = ref(false)
const showTip = ref(false)
</script>

<style scoped>
.module { display: grid; gap: 14px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 10px; }
button { border: none; padding: 8px 14px; border-radius: 8px; background: #dff0ff; }
table { width: 100%; border-collapse: collapse; background: #fff; }
th, td { border-bottom: 1px solid #eef4fc; padding: 10px; text-align: left; }
.form { display: grid; gap: 10px; }
input { padding: 10px; border-radius: 8px; border: 1px solid #d4e4fb; }
</style>
