<template>
  <div class="module">
    <div class="toolbar">
      <button @click="showForm = true" title="创建调度任务">新建调度</button>
      <button @click="openProgress" title="启动算法优化">路线优化</button>
      <button @click="showTip = true" title="查看说明">按钮提示</button>
    </div>
    <SimpleChart title="24小时运输效率走势" :values="[28, 40, 33, 45, 50, 62, 58, 74, 68, 82]" />
    <table>
      <thead><tr><th>计划编号</th><th>车辆</th><th>司机</th><th>起终点</th><th>预计时长</th></tr></thead>
      <tbody>
        <tr v-for="row in plans" :key="row.id"><td>{{ row.id }}</td><td>{{ row.truck }}</td><td>{{ row.driver }}</td><td>{{ row.route }}</td><td>{{ row.duration }}</td></tr>
      </tbody>
    </table>

    <ModalDialog :visible="showForm" title="新建运输调度" @close="showForm = false">
      <form class="form">
        <input placeholder="任务名称" />
        <input placeholder="起点-终点" />
        <input placeholder="车辆编号" />
      </form>
    </ModalDialog>
    <ModalDialog :visible="showProgress" title="自动路线优化中" @close="showProgress = false">
      <p>当前进度：{{ progress }}%</p>
      <div class="bar"><span :style="{ width: progress + '%' }"></span></div>
    </ModalDialog>
    <ModalDialog :visible="showTip" title="按钮提示" @close="showTip = false">
      <p>动态调度引擎已按实时路况和历史时效完成推荐，可一键发布。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleChart from '../components/SimpleChart.vue'

const plans = Array.from({ length: 20 }, (_, i) => ({
  id: `TP-${1000 + i}`,
  truck: `粤A${(3000 + i).toString().padStart(4, '0')}`,
  driver: `调度员${i + 1}`,
  route: `仓库${(i % 5) + 1} → 门店${(i % 8) + 1}`,
  duration: `${4 + (i % 6)}小时`
}))

const showForm = ref(false)
const showProgress = ref(false)
const showTip = ref(false)
const progress = ref(0)
let timer

const openProgress = () => {
  showProgress.value = true
  progress.value = 0
  clearInterval(timer)
  timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) clearInterval(timer)
  }, 120)
}
</script>

<style scoped>
.module { display: grid; gap: 14px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 10px; }
button { border: none; padding: 8px 14px; border-radius: 8px; background: #dff0ff; }
table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; }
th, td { border-bottom: 1px solid #eef4fc; padding: 10px; text-align: left; }
.form { display: grid; gap: 10px; }
input { padding: 10px; border-radius: 8px; border: 1px solid #d4e4fb; }
.bar { height: 14px; background: #e8f2ff; border-radius: 999px; overflow: hidden; }
.bar span { display: block; height: 100%; background: linear-gradient(135deg,#2f8cff,#69c3ff); }
</style>
