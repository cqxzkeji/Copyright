<template>
  <section>
    <div class="toolbar">
      <button class="btn-primary" @click="modal='form'">设置安全阈值</button>
      <button class="btn-success" @click="runCheck">执行安全巡检</button>
      <button class="btn-warning" @click="modal='tip'">按钮说明</button>
    </div>
    <div class="card"><SimpleBarChart :data="chartData" /></div>
    <div class="card table-wrap" style="margin-top:12px">
      <table><thead><tr><th>规则编号</th><th>安全距离</th><th>风速阈值</th><th>环境状态</th><th>冲突预测</th><th>处置建议</th></tr></thead><tbody>
        <tr v-for="row in rows" :key="row.id"><td>{{ row.id }}</td><td>{{ row.distance }}</td><td>{{ row.wind }}</td><td>{{ row.env }}</td><td>{{ row.predict }}</td><td>{{ row.action }}</td></tr>
      </tbody></table>
    </div>
    <ModalDialog v-if="modal==='form'" title="安全阈值配置" @close="modal='none'" @confirm="applyThreshold"><label>最小安全距离(米)</label><input type="number" v-model="safe.distance" /><label>最大作业风速(m/s)</label><input type="number" v-model="safe.wind" /></ModalDialog>
    <ModalDialog v-if="modal==='tip'" title="按钮提示信息" @close="modal='none'" @confirm="modal='none'"><p>设置安全阈值用于约束飞行与车载路径；执行安全巡检将计算碰撞概率并自动下发避障建议。</p></ModalDialog>
    <ModalDialog v-if="modal==='progress'" title="安全扫描进度" @close="modal='none'" @confirm="modal='none'"><div class="progress"><div class="fill" :style="{width: progress + '%'}"></div></div><p>{{ progress }}% 正在扫描飞行环境...</p></ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleBarChart from '../components/SimpleBarChart.vue'
const modal = ref('none')
const progress = ref(0)
const safe = reactive({ distance: 30, wind: 12 })
const chartData = [{ name: '避障成功', value: 98 },{ name: '冲突告警', value: 61 },{ name: '路径安全', value: 87 },{ name: '环境适航', value: 73 },{ name: '应急响应', value: 92 },{ name: '合规率', value: 95 }]
const rows = ref(Array.from({ length: 20 }, (_, i) => ({ id: `SC-${200 + i}`, distance: `${25 + (i % 5)}m`, wind: `${10 + (i % 6)}m/s`, env: ['正常', '阵风', '降雨预警'][i % 3], predict: ['低', '中', '高'][i % 3], action: ['保持航线', '减速巡航', '绕行/返航'][i % 3] })))
const applyThreshold = () => { rows.value[0] = { ...rows.value[0], distance: `${safe.distance}m`, wind: `${safe.wind}m/s`, action: '已按新阈值执行' }; modal.value='none' }
const runCheck = () => { modal.value = 'progress'; progress.value = 0; const t = setInterval(() => { progress.value += 20; if (progress.value >= 100) clearInterval(t) }, 120) }
</script>

<style scoped>.progress{height:12px;background:#e2e8f0;border-radius:8px}.fill{height:100%;background:#ef4444;border-radius:8px}</style>
