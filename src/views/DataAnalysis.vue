<template>
  <section class="grid2">
    <div class="card">
      <div class="actions">
        <button class="btn" @click="showDimension = true">动态可视化</button>
        <button class="btn secondary" @click="showStrategy = true">教学策略分析</button>
        <button class="btn secondary" @click="exportData">导出分析报告</button>
      </div>
      <table class="table">
        <thead><tr><th>指标</th><th>均值</th><th>趋势</th><th>建议动作</th></tr></thead>
        <tbody><tr v-for="m in metrics" :key="m.index"><td>{{ m.index }}</td><td>{{ m.avg }}</td><td>{{ m.trend }}</td><td>{{ m.action }}</td></tr></tbody>
      </table>
    </div>
    <div class="card">
      <svg viewBox="0 0 360 210" style="width:100%;height:220px">
        <polygon points="180,20 315,90 265,190 95,190 45,90" fill="#e8f0ff" stroke="#8bb2ff"/>
        <polygon points="180,55 275,102 238,172 122,172 85,102" fill="#9fc2ff"/>
      </svg>
      <p>雷达可视化：呈现学习效率、专注度、成果质量、创新能力等综合表现。</p>
    </div>

    <BaseModal v-model="showDimension" title="动态可视化设置">
      <div class="form-row"><label>分析维度</label><select v-model="dimension"><option>成绩趋势</option><option>课程偏好</option><option>学习效率</option></select></div>
      <p>已切换到：{{ dimension }} 维度。</p>
    </BaseModal>

    <BaseModal v-model="showStrategy" title="教学策略建议">
      <p>建议一：对高风险群体采用“短周期-高反馈”教学节奏。</p>
      <p>建议二：增加跨学科项目，提升综合应用能力。</p>
      <p>建议三：基于学习轨迹动态调整课程难度。</p>
    </BaseModal>

    <BaseModal v-model="showHint" title="导出结果"><p>{{ hint }}</p></BaseModal>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const metrics = ref(Array.from({ length: 20 }).map((_, i) => ({
  index: `指标${i + 1}`,
  avg: `${65 + (i * 2) % 30}%`,
  trend: ['上升', '平稳', '波动'][i % 3],
  action: ['加强练习', '维持策略', '重点辅导'][i % 3]
})))
const showDimension = ref(false)
const showStrategy = ref(false)
const showHint = ref(false)
const hint = ref('')
const dimension = ref('成绩趋势')

const exportData = () => {
  hint.value = '分析报告已生成并下载到本地（示例逻辑）。'
  showHint.value = true
}
</script>

<style scoped>
.actions{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px; }
.form-row{ margin-bottom:10px; }
</style>
