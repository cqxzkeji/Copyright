<template>
  <div class="grid grid-2">
    <div class="card">
      <div class="section-title">实时环境概览</div>
      <canvas ref="chartRef" height="220"></canvas>
    </div>
    <div class="card">
      <div class="section-title">快速操作</div>
      <div class="actions-row">
        <button class="btn" @click="openForm">采集配置</button>
        <button class="btn secondary" @click="openProgress">启动采集</button>
        <button class="btn ghost" @click="openInfo">按钮提示</button>
      </div>
      <div class="grid grid-3" style="margin-top: 16px;">
        <div class="metric">
          <h4>当前温度</h4>
          <p>22.6°C</p>
        </div>
        <div class="metric">
          <h4>当前湿度</h4>
          <p>68%</p>
        </div>
        <div class="metric">
          <h4>CO₂浓度</h4>
          <p>640 ppm</p>
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="section-title">迷宫式与高位种植采集明细</div>
    <table class="table">
      <thead>
        <tr>
          <th>采集点</th>
          <th>温度</th>
          <th>湿度</th>
          <th>光照</th>
          <th>CO₂</th>
          <th>水分</th>
          <th>营养液</th>
          <th>时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.zone }}</td>
          <td>{{ item.temp }}°C</td>
          <td>{{ item.humidity }}%</td>
          <td>{{ item.light }} lx</td>
          <td>{{ item.co2 }} ppm</td>
          <td>{{ item.moisture }}%</td>
          <td>{{ item.nutrient }}</td>
          <td>{{ item.time }}</td>
          <td>
            <button class="btn ghost" @click="openRow(item)">查看</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="采集配置" @close="showForm = false">
    <form class="form-grid">
      <div>
        <label>采集区域</label>
        <select v-model="form.zone">
          <option>迷宫A区</option>
          <option>迷宫B区</option>
          <option>高位C区</option>
          <option>高位D区</option>
        </select>
      </div>
      <div>
        <label>采集频率</label>
        <input v-model="form.frequency" placeholder="例如：5分钟/次" />
      </div>
      <div>
        <label>采集指标</label>
        <input v-model="form.metrics" placeholder="温度、湿度、光照" />
      </div>
      <div>
        <label>备注</label>
        <textarea v-model="form.note" rows="3" placeholder="填写本次采集说明"></textarea>
      </div>
    </form>
    <template #footer>
      <button class="btn secondary" @click="showForm = false">取消</button>
      <button class="btn" @click="saveForm">保存配置</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="采集任务进度" @close="closeProgress">
    <p style="margin-bottom: 12px;">正在同步 12 个采集节点数据，请稍候...</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p style="margin-top: 12px; color: #5a6b8c;">完成率 {{ progress }}%</p>
    <template #footer>
      <button class="btn" @click="closeProgress">结束查看</button>
    </template>
  </BaseModal>

  <BaseModal :show="showInfo" title="按钮提示" @close="showInfo = false">
    <p>{{ infoText }}</p>
    <template #footer>
      <button class="btn" @click="showInfo = false">好的</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { Chart } from 'chart.js/auto'
import BaseModal from '../components/BaseModal.vue'

const chartRef = ref(null)
let chartInstance

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  zone: index % 2 === 0 ? '迷宫A区' : '高位C区',
  temp: (21 + index * 0.2).toFixed(1),
  humidity: 60 + (index % 5) * 2,
  light: 18000 + index * 120,
  co2: 550 + index * 4,
  moisture: 45 + (index % 4) * 3,
  nutrient: index % 2 === 0 ? '标准液' : '高钾液',
  time: `2024-05-1${Math.floor(index / 2)} 0${index % 9}:30`
}))

const showForm = ref(false)
const showProgress = ref(false)
const showInfo = ref(false)
const infoText = ref('')
const progress = ref(0)
let progressTimer

const form = reactive({
  zone: '迷宫A区',
  frequency: '5分钟/次',
  metrics: '温度、湿度、光照、CO₂',
  note: ''
})

const openForm = () => {
  showForm.value = true
}

const saveForm = () => {
  infoText.value = `已保存 ${form.zone} 的采集配置，频率 ${form.frequency}。`
  showForm.value = false
  showInfo.value = true
}

const openProgress = () => {
  showProgress.value = true
  progress.value = 0
  if (progressTimer) clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    progress.value = Math.min(progress.value + 8, 100)
    if (progress.value === 100) {
      clearInterval(progressTimer)
    }
  }, 300)
}

const closeProgress = () => {
  showProgress.value = false
  if (progressTimer) clearInterval(progressTimer)
}

const openInfo = () => {
  infoText.value = '采集数据覆盖迷宫式与高位种植区域，支持分区实时对比。'
  showInfo.value = true
}

const openRow = (item) => {
  infoText.value = `${item.zone} 当前温度 ${item.temp}°C，湿度 ${item.humidity}%。`
  showInfo.value = true
}

onMounted(() => {
  if (!chartRef.value) return
  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
      datasets: [
        {
          label: '温度(°C)',
          data: [20.4, 21.1, 22.3, 23.0, 22.6, 22.1],
          borderColor: '#2f7cf6',
          backgroundColor: 'rgba(47, 124, 246, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: '湿度(%)',
          data: [72, 70, 68, 66, 67, 69],
          borderColor: '#56c5ff',
          backgroundColor: 'rgba(86, 197, 255, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  if (progressTimer) {
    clearInterval(progressTimer)
  }
})
</script>

<style scoped>
.actions-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.metric {
  background: #f7f9ff;
  border-radius: 14px;
  padding: 14px;
}

.metric h4 {
  font-size: 13px;
  color: #5a6b8c;
}

.metric p {
  font-size: 18px;
  font-weight: 700;
  margin-top: 6px;
}
</style>
