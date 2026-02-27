<template>
  <div class="module">
    <div class="toolbar">
      <button @click="showForm = true" title="添加追踪设备">绑定设备</button>
      <button @click="showProgress = true" title="刷新定位">定位刷新</button>
      <button @click="showTip = true" title="按钮提示">按钮提示</button>
    </div>
    <SimpleChart title="在途货物实时定位热度" :values="[35, 38, 42, 48, 45, 52, 57, 60, 58, 66]" />
    <table>
      <thead><tr><th>货物ID</th><th>当前位置</th><th>温度</th><th>湿度</th><th>状态</th></tr></thead>
      <tbody><tr v-for="item in rows" :key="item.id"><td>{{ item.id }}</td><td>{{ item.pos }}</td><td>{{ item.temp }}℃</td><td>{{ item.humi }}%</td><td>{{ item.status }}</td></tr></tbody>
    </table>

    <ModalDialog :visible="showForm" title="绑定追踪设备" @close="showForm = false">
      <form class="form"><input placeholder="货物ID" /><input placeholder="设备编号(GPS/RFID)" /><input placeholder="责任人" /></form>
    </ModalDialog>
    <ModalDialog :visible="showProgress" title="实时刷新中" @close="showProgress = false">
      <p>已更新20条定位数据与传感器状态。</p>
    </ModalDialog>
    <ModalDialog :visible="showTip" title="按钮提示" @close="showTip = false">
      <p>预警机制：当温湿度超阈值或停留超时，系统会自动触发异常事件。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleChart from '../components/SimpleChart.vue'

const rows = Array.from({ length: 20 }, (_, i) => ({
  id: `GD-${5000 + i}`,
  pos: `城市节点-${(i % 10) + 1}`,
  temp: 2 + (i % 8),
  humi: 50 + (i % 20),
  status: i % 6 === 0 ? '预警中' : '正常'
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
