<template>
  <section class="grid2">
    <div class="card">
      <div class="actions">
        <button class="btn" @click="runMonitor">实时监控</button>
        <button class="btn secondary" @click="showReport = true">查看报表</button>
        <button class="btn secondary" @click="showHintMsg('已根据预警调整学习计划。')">反馈调整</button>
      </div>
      <table class="table">
        <thead><tr><th>学生</th><th>课程完成率</th><th>作业提交率</th><th>风险等级</th></tr></thead>
        <tbody><tr v-for="i in list" :key="i.name"><td>{{ i.name }}</td><td>{{ i.course }}%</td><td>{{ i.hw }}%</td><td>{{ i.risk }}</td></tr></tbody>
      </table>
    </div>
    <div class="card">
      <svg viewBox="0 0 350 200" style="width:100%;height:220px">
        <path d="M10 160 Q80 70 160 120 T340 90" stroke="#4d80ff" fill="none" stroke-width="4"/>
        <path d="M10 180 L340 180" stroke="#d8e5ff"/>
      </svg>
      <p>学习进度曲线：用于观察阶段性学习波动。</p>
    </div>

    <BaseModal v-model="showProgress" title="监控执行中">
      <div class="bar"><div class="fill" :style="{width: progress + '%'}"></div></div>
      <p>已分析 {{ progress }}%</p>
    </BaseModal>

    <BaseModal v-model="showReport" title="学习报表">
      <p>当前班级平均课程完成率：79%，重点关注学生 4 人，建议安排辅导答疑。</p>
      <p>建议：本周增加实验课练习与课后巩固测验。</p>
    </BaseModal>

    <BaseModal v-model="showHint" title="反馈信息"><p>{{ hint }}</p></BaseModal>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const list = ref(Array.from({ length: 21 }).map((_, i) => ({
  name: `学生${i + 1}`,
  course: 62 + (i * 3) % 35,
  hw: 60 + (i * 5) % 35,
  risk: ['低', '中', '高'][i % 3]
})))
const showProgress = ref(false)
const progress = ref(0)
const showReport = ref(false)
const showHint = ref(false)
const hint = ref('')

const runMonitor = () => {
  showProgress.value = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 8
    if (progress.value >= 100) {
      clearInterval(timer)
      showProgress.value = false
      hint.value = '实时监控完成，已自动更新学业预警名单。'
      showHint.value = true
    }
  }, 100)
}
const showHintMsg = (msg) => { hint.value = msg; showHint.value = true }
</script>

<style scoped>
.actions{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px; }
.bar{ height:12px; background:#e5eeff; border-radius:99px; overflow:hidden; }
.fill{ height:100%; background:linear-gradient(90deg,#7db1ff,#4d80ff); }
</style>
