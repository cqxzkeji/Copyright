<template>
  <div class="module">
    <div class="toolbar">
      <button @click="showForm = true" title="新建应急预案">创建预案</button>
      <button @click="showProgress = true" title="启动应急流程">应急处理</button>
      <button @click="showTip = true" title="按钮提示">按钮提示</button>
    </div>
    <SimpleChart title="异常事件告警数量趋势" :values="[15, 22, 18, 25, 30, 28, 34, 31, 27, 20]" />
    <table>
      <thead><tr><th>事件ID</th><th>类型</th><th>级别</th><th>触发时间</th><th>处理状态</th></tr></thead>
      <tbody><tr v-for="item in rows" :key="item.id"><td>{{ item.id }}</td><td>{{ item.type }}</td><td>{{ item.level }}</td><td>{{ item.time }}</td><td>{{ item.status }}</td></tr></tbody>
    </table>

    <ModalDialog :visible="showForm" title="新增异常应急预案" @close="showForm = false">
      <form class="form"><input placeholder="异常类型" /><input placeholder="通知人员" /><input placeholder="响应SLA(分钟)" /></form>
    </ModalDialog>
    <ModalDialog :visible="showProgress" title="应急处理进度" @close="showProgress = false"><p>已自动通知调度中心、司机、客户，并生成处理工单。</p></ModalDialog>
    <ModalDialog :visible="showTip" title="按钮提示" @close="showTip = false"><p>事件识别模型正在持续分析轨迹偏离、延误和环境异常。</p></ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
import SimpleChart from '../components/SimpleChart.vue'

const types = ['延迟', '事故', '温度异常', '路线偏离']
const rows = Array.from({ length: 20 }, (_, i) => ({
  id: `AL-${8000 + i}`,
  type: types[i % types.length],
  level: ['低', '中', '高'][i % 3],
  time: `2026-04-${(i % 28) + 1} ${((i * 2) % 24).toString().padStart(2, '0')}:30`,
  status: i % 4 === 0 ? '处理中' : '已关闭'
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
