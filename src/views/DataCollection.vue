<template>
  <section>
    <div class="toolbar">
      <button class="btn" @click="showForm = true">新增数据源</button>
      <button class="btn" @click="startProgress('正在接入实时流')">接入实时流</button>
      <button class="btn" @click="showTip = true">按钮提示</button>
    </div>

    <div class="chart-card">
      <h3>实时接入吞吐量（MB/s）</h3>
      <div class="bar-chart">
        <div v-for="item in chartData" :key="item.name" class="bar-item">
          <span>{{ item.name }}</span>
          <div class="bar"><i :style="{ width: item.value + '%' }"></i></div>
          <b>{{ item.value }}</b>
        </div>
      </div>
    </div>

    <table class="data-table">
      <thead><tr><th>ID</th><th>数据源</th><th>类型</th><th>状态</th><th>延迟(ms)</th></tr></thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.type }}</td><td>{{ row.status }}</td><td>{{ row.delay }}</td>
        </tr>
      </tbody>
    </table>

    <ModalDialog v-model="showForm" title="新增数据源" :show-confirm="true" @confirm="submitForm">
      <div class="form-grid">
        <label>数据源名称<input v-model="form.name" /></label>
        <label>接入类型<select v-model="form.type"><option>数据库</option><option>API</option><option>文件</option></select></label>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showTip" title="按钮提示">
      <p>通过“新增数据源”可创建连接，“接入实时流”将展示接入进度并自动监控同步状态。</p>
    </ModalDialog>

    <ModalDialog v-model="showProgress" :title="progressText">
      <div class="progress-wrap">
        <div class="progress"><i :style="{ width: progress + '%' }"></i></div>
        <p>{{ progress }}%</p>
      </div>
    </ModalDialog>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const showForm = ref(false)
const showTip = ref(false)
const showProgress = ref(false)
const progress = ref(0)
const progressText = ref('执行中')
const form = reactive({ name: '', type: '数据库' })
const chartData = [
  { name: 'MySQL', value: 82 }, { name: 'PostgreSQL', value: 67 }, { name: 'CRM API', value: 59 }, { name: '日志文件', value: 73 }
]
const rows = Array.from({ length: 20 }, (_, i) => ({
  id: `DC-${1001 + i}`,
  name: `数据源-${i + 1}`,
  type: ['数据库', 'API', '文件'][i % 3],
  status: i % 2 === 0 ? '正常' : '同步中',
  delay: 80 + i * 3
}))

const submitForm = () => {
  showForm.value = false
  startProgress('新增数据源校验中')
}

const startProgress = (text) => {
  progressText.value = text
  progress.value = 0
  showProgress.value = true
  const timer = setInterval(() => {
    progress.value += 20
    if (progress.value >= 100) clearInterval(timer)
  }, 250)
}
</script>
