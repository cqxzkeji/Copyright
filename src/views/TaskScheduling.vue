<template>
  <section>
    <div class="toolbar">
      <button class="btn-primary" @click="openForm">新建调度任务</button>
      <button class="btn-success" @click="openProgress">执行优化计算</button>
      <button class="btn-warning" @click="openTip">按钮说明</button>
    </div>
    <div class="grid-2">
      <div class="card">
        <SimpleBarChart :data="chartData" />
      </div>
      <div class="card">
        <p>今日计划架次：{{ rows.length }}</p>
        <p>高优任务：8</p>
        <p>天气风险点：3</p>
      </div>
    </div>
    <div class="card table-wrap" style="margin-top:12px">
      <table>
        <thead><tr><th>任务编号</th><th>区域</th><th>优先级</th><th>无人机</th><th>作业车</th><th>状态</th></tr></thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id"><td>{{ row.id }}</td><td>{{ row.area }}</td><td>{{ row.priority }}</td><td>{{ row.drone }}</td><td>{{ row.vehicle }}</td><td>{{ row.status }}</td></tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-if="modal==='form'" title="新建调度任务" @close="modal='none'" @confirm="saveTask">
      <div class="form-grid"><label>巡检区域</label><input v-model="form.area" /><label>任务优先级</label><select v-model="form.priority"><option>高</option><option>中</option><option>低</option></select></div>
    </ModalDialog>
    <ModalDialog v-if="modal==='tip'" title="按钮提示信息" @close="modal='none'" @confirm="modal='none'">
      <p>“新建调度任务”用于录入巡检需求；“执行优化计算”会综合电网负荷、天气和设备状态生成最优路径。</p>
    </ModalDialog>
    <ModalDialog v-if="modal==='progress'" title="优化进度" @close="modal='none'" @confirm="modal='none'">
      <div class="progress"><div class="fill" :style="{width: progress + '%'}"></div></div>
      <p>{{ progress }}% 路径求解中...</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleBarChart from '../components/SimpleBarChart.vue'
const modal = ref('none')
const progress = ref(0)
const form = reactive({ area: '南区-220kV线路', priority: '高' })
const chartData = [
  { name: '东区', value: 78 },{ name: '南区', value: 90 },{ name: '西区', value: 65 },{ name: '北区', value: 82 },{ name: '山区', value: 58 },{ name: '城区', value: 74 }
]
const rows = ref(Array.from({ length: 20 }, (_, i) => ({ id: `TS-${100 + i}`, area: `巡检片区${i + 1}`, priority: ['高', '中', '低'][i % 3], drone: `UAV-${(i % 8) + 1}`, vehicle: `CAR-${(i % 5) + 1}`, status: ['待执行', '执行中', '已完成'][i % 3] })))
const openForm = () => (modal.value = 'form')
const openTip = () => (modal.value = 'tip')
const openProgress = () => { modal.value = 'progress'; progress.value = 0; const timer = setInterval(() => { progress.value += 10; if (progress.value >= 100) clearInterval(timer) }, 160) }
const saveTask = () => { rows.value.unshift({ id: `TS-${Date.now().toString().slice(-4)}`, area: form.area, priority: form.priority, drone: 'UAV-1', vehicle: 'CAR-1', status: '待执行' }); modal.value='none' }
</script>

<style scoped>.form-grid{display:grid;gap:8px}.progress{height:12px;background:#e2e8f0;border-radius:8px}.fill{height:100%;background:#3b82f6;border-radius:8px}</style>
