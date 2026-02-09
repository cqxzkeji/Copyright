<template>
  <section>
    <div class="toolbar">
      <button class="btn-primary" @click="modal='form'">分配协同编队</button>
      <button class="btn-success" @click="startSync">启动协同联控</button>
      <button class="btn-warning" @click="modal='tip'">按钮说明</button>
    </div>
    <div class="card"><SimpleBarChart :data="chartData" /></div>
    <div class="card table-wrap" style="margin-top:12px">
      <table><thead><tr><th>编队</th><th>无人机组</th><th>作业车</th><th>任务类型</th><th>通信延时</th><th>协同状态</th></tr></thead><tbody>
        <tr v-for="row in rows" :key="row.team"><td>{{ row.team }}</td><td>{{ row.drones }}</td><td>{{ row.vehicle }}</td><td>{{ row.type }}</td><td>{{ row.delay }}</td><td>{{ row.status }}</td></tr>
      </tbody></table>
    </div>
    <ModalDialog v-if="modal==='form'" title="协同编队分配" @close="modal='none'" @confirm="assignTeam">
      <label>任务类型</label><select v-model="form.type"><option>红外巡检</option><option>激光点云</option><option>故障复核</option></select>
      <label>参与无人机数量</label><input type="number" v-model="form.count" min="1" max="8" />
    </ModalDialog>
    <ModalDialog v-if="modal==='tip'" title="按钮提示信息" @close="modal='none'" @confirm="modal='none'"><p>分配协同编队会动态匹配异构无人机；启动协同联控将开启队形保持与路径互让机制。</p></ModalDialog>
    <ModalDialog v-if="modal==='progress'" title="协同联控状态" @close="modal='none'" @confirm="modal='none'"><div class="progress"><div class="fill" :style="{width: progress + '%'}"></div></div><p>{{ progress }}% 通信链路建立中...</p></ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleBarChart from '../components/SimpleBarChart.vue'
const modal = ref('none')
const progress = ref(0)
const form = reactive({ type: '红外巡检', count: 3 })
const chartData = [{ name: '编队A', value: 88 },{ name: '编队B', value: 70 },{ name: '编队C', value: 92 },{ name: '编队D', value: 64 },{ name: '编队E', value: 77 },{ name: '编队F', value: 83 }]
const rows = ref(Array.from({ length: 20 }, (_, i) => ({ team: `TEAM-${i + 1}`, drones: `UAV-${(i % 7) + 1}/UAV-${(i % 7) + 2}`, vehicle: `CAR-${(i % 4) + 1}`, type: ['红外巡检', '激光点云', '故障复核'][i % 3], delay: `${10 + (i % 8)}ms`, status: ['已同步', '任务切换', '联控中'][i % 3] })))
const assignTeam = () => { rows.value.unshift({ team: `TEAM-${rows.value.length + 1}`, drones: `UAV-1~UAV-${form.count}`, vehicle: 'CAR-1', type: form.type, delay: '9ms', status: '联控中' }); modal.value = 'none' }
const startSync = () => { modal.value = 'progress'; progress.value = 0; const t = setInterval(() => { progress.value += 20; if (progress.value >= 100) clearInterval(t) }, 140) }
</script>

<style scoped>.progress{height:12px;background:#e2e8f0;border-radius:8px}.fill{height:100%;background:#22c55e;border-radius:8px}</style>
