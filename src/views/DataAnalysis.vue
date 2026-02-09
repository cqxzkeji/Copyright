<template>
  <section>
    <div class="toolbar">
      <button class="btn-primary" @click="modal='form'">生成健康报告</button>
      <button class="btn-success" @click="startAnalysis">启动数据分析</button>
      <button class="btn-warning" @click="modal='tip'">按钮说明</button>
    </div>
    <div class="card"><SimpleBarChart :data="chartData" /></div>
    <div class="card table-wrap" style="margin-top:12px">
      <table><thead><tr><th>样本编号</th><th>数据类型</th><th>采集时间</th><th>缺陷识别</th><th>温湿度</th><th>结论</th></tr></thead><tbody>
        <tr v-for="row in rows" :key="row.id"><td>{{ row.id }}</td><td>{{ row.type }}</td><td>{{ row.time }}</td><td>{{ row.defect }}</td><td>{{ row.climate }}</td><td>{{ row.result }}</td></tr>
      </tbody></table>
    </div>
    <ModalDialog v-if="modal==='form'" title="健康报告配置" @close="modal='none'" @confirm="createReport"><label>报告周期</label><select v-model="report.cycle"><option>日报</option><option>周报</option><option>月报</option></select><label>分析区域</label><input v-model="report.area" /></ModalDialog>
    <ModalDialog v-if="modal==='tip'" title="按钮提示信息" @close="modal='none'" @confirm="modal='none'"><p>生成健康报告将汇总巡检图像、红外温度和湿度趋势；启动数据分析会触发缺陷识别模型批处理。</p></ModalDialog>
    <ModalDialog v-if="modal==='progress'" title="分析进度" @close="modal='none'" @confirm="modal='none'"><div class="progress"><div class="fill" :style="{width: progress + '%'}"></div></div><p>{{ progress }}% 模型推理进行中...</p></ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleBarChart from '../components/SimpleBarChart.vue'
const modal = ref('none')
const progress = ref(0)
const report = reactive({ cycle: '周报', area: '全网重点线路' })
const chartData = [{ name: '图像', value: 95 },{ name: '视频', value: 72 },{ name: '温度', value: 84 },{ name: '湿度', value: 66 },{ name: '缺陷', value: 77 },{ name: '健康度', value: 81 }]
const rows = ref(Array.from({ length: 20 }, (_, i) => ({ id: `DA-${500 + i}`, type: ['图像', '视频', '红外', '环境'][i % 4], time: `2026-03-${(i % 28) + 1} 1${i % 10}:20`, defect: ['绝缘子裂纹', '无异常', '线夹发热'][i % 3], climate: `${20 + (i % 6)}℃ / ${40 + i}%`, result: ['需复检', '正常', '计划检修'][i % 3] })))
const createReport = () => { rows.value.unshift({ id: `RP-${Date.now().toString().slice(-4)}`, type: report.cycle, time: '刚刚', defect: '自动汇总', climate: report.area, result: '已生成' }); modal.value='none' }
const startAnalysis = () => { modal.value = 'progress'; progress.value = 0; const t = setInterval(() => { progress.value += 20; if (progress.value >= 100) clearInterval(t) }, 130) }
</script>

<style scoped>.progress{height:12px;background:#e2e8f0;border-radius:8px}.fill{height:100%;background:#8b5cf6;border-radius:8px}</style>
