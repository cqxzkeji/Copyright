<template>
  <div class="grid grid-2">
    <div class="card">
      <div class="section-title">生长趋势图</div>
      <canvas ref="growthChartRef" height="220"></canvas>
    </div>
    <div class="card">
      <div class="section-title">分区对比</div>
      <canvas ref="compareChartRef" height="220"></canvas>
    </div>
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">生长监测操作</div>
    <div class="actions-row">
      <button class="btn" @click="openForm">添加观测记录</button>
      <button class="btn secondary" @click="openProgress">生成生长报告</button>
      <button class="btn ghost" @click="openInfo">按钮提示</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">监测记录列表</div>
    <table class="table">
      <thead>
        <tr>
          <th>记录编号</th>
          <th>区域</th>
          <th>株高(cm)</th>
          <th>叶片数</th>
          <th>果实数</th>
          <th>健康评分</th>
          <th>日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in records" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.zone }}</td>
          <td>{{ item.height }}</td>
          <td>{{ item.leaf }}</td>
          <td>{{ item.fruit }}</td>
          <td>{{ item.health }}</td>
          <td>{{ item.date }}</td>
          <td>
            <button class="btn ghost" @click="openRow(item)">查看</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="添加观测记录" @close="showForm = false">
    <form class="form-grid">
      <div>
        <label>监测区域</label>
        <select v-model="form.zone">
          <option>迷宫A区</option>
          <option>迷宫B区</option>
          <option>高位C区</option>
          <option>高位D区</option>
        </select>
      </div>
      <div>
        <label>株高(cm)</label>
        <input v-model="form.height" placeholder="请输入株高" />
      </div>
      <div>
        <label>叶片数</label>
        <input v-model="form.leaf" placeholder="请输入叶片数" />
      </div>
      <div>
        <label>果实数</label>
        <input v-model="form.fruit" placeholder="请输入果实数" />
      </div>
      <div>
        <label>备注</label>
        <textarea v-model="form.note" rows="3" placeholder="填写生长表现"></textarea>
      </div>
    </form>
    <template #footer>
      <button class="btn secondary" @click="showForm = false">取消</button>
      <button class="btn" @click="saveForm">保存记录</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="报告生成进度" @close="closeProgress">
    <p style="margin-bottom: 12px;">正在汇总本周生长趋势与环境数据...</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p style="margin-top: 12px; color: #5a6b8c;">完成率 {{ progress }}%</p>
    <template #footer>
      <button class="btn" @click="closeProgress">完成</button>
    </template>
  </BaseModal>

  <BaseModal :show="showInfo" title="按钮提示" @close="showInfo = false">
    <p>{{ infoText }}</p>
    <template #footer>
      <button class="btn" @click="showInfo = false">我知道了</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Chart } from 'chart.js/auto'
import BaseModal from '../components/BaseModal.vue'

const growthChartRef = ref(null)
const compareChartRef = ref(null)
let growthChart
let compareChart

const records = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `GR-${String(index + 1).padStart(3, '0')}`,
  zone: index % 2 === 0 ? '迷宫A区' : '高位C区',
  height: (18 + index * 0.4).toFixed(1),
  leaf: 6 + (index % 5),
  fruit: 4 + (index % 4),
  health: 80 + (index % 6),
  date: `2024-05-${String(index + 1).padStart(2, '0')}`
}))

const showForm = ref(false)
const showProgress = ref(false)
const showInfo = ref(false)
const infoText = ref('')
const progress = ref(0)
let progressTimer

const form = reactive({
  zone: '迷宫A区',
  height: '24.5',
  leaf: '8',
  fruit: '5',
  note: ''
})

const openForm = () => {
  showForm.value = true
}

const saveForm = () => {
  infoText.value = `已记录 ${form.zone} 株高 ${form.height}cm 的生长数据。`
  showForm.value = false
  showInfo.value = true
}

const openProgress = () => {
  showProgress.value = true
  progress.value = 0
  if (progressTimer) clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    progress.value = Math.min(progress.value + 12, 100)
    if (progress.value === 100) clearInterval(progressTimer)
  }, 260)
}

const closeProgress = () => {
  showProgress.value = false
  if (progressTimer) clearInterval(progressTimer)
}

const openInfo = () => {
  infoText.value = '图表展示不同区域的生长趋势，支持周度对比分析。'
  showInfo.value = true
}

const openRow = (item) => {
  infoText.value = `${item.zone} 于 ${item.date} 健康评分 ${item.health}。`
  showInfo.value = true
}

onMounted(() => {
  if (growthChartRef.value) {
    growthChart = new Chart(growthChartRef.value, {
      type: 'line',
      data: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [
          {
            label: '株高(cm)',
            data: [18, 19.2, 20.3, 21.8, 22.5, 23.1, 24.0],
            borderColor: '#2f7cf6',
            backgroundColor: 'rgba(47, 124, 246, 0.2)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        plugins: { legend: { position: 'bottom' } }
      }
    })
  }

  if (compareChartRef.value) {
    compareChart = new Chart(compareChartRef.value, {
      type: 'bar',
      data: {
        labels: ['迷宫A区', '迷宫B区', '高位C区', '高位D区'],
        datasets: [
          {
            label: '平均健康评分',
            data: [86, 84, 88, 85],
            backgroundColor: ['#2f7cf6', '#56c5ff', '#7ed6a8', '#f8c04e']
          }
        ]
      },
      options: {
        plugins: { legend: { position: 'bottom' } }
      }
    })
  }
})

onBeforeUnmount(() => {
  if (growthChart) growthChart.destroy()
  if (compareChart) compareChart.destroy()
  if (progressTimer) clearInterval(progressTimer)
})
</script>

<style scoped>
.actions-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
