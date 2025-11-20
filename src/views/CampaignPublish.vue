<template>
  <div class="module-wrapper">
    <header>
      <h3>广告投放与发布</h3>
      <p>规划投放日程、预算与素材组合，实时查看排期健康度。</p>
    </header>

    <section class="plan-board">
      <div class="plan-card" v-for="plan in plans" :key="plan.name">
        <h4>{{ plan.name }}</h4>
        <p>预算：{{ plan.budget }} ｜ 覆盖：{{ plan.coverage }}</p>
        <div class="progress">
          <div class="progress-inner" :style="{ width: plan.progress + '%' }"></div>
        </div>
        <button @click="emit('open-modal', '排期详情', plan.name + ' 的投放排期已展示。')">查看排期</button>
      </div>
    </section>

    <section class="controls">
      <label>
        每日预算 (万元)
        <input type="range" min="10" max="80" v-model="budget" />
        <strong>{{ budget }} 万</strong>
      </label>
      <label>
        竞价策略
        <select v-model="strategy">
          <option value="oCPC">oCPC</option>
          <option value="oCPM">oCPM</option>
          <option value="手动出价">手动出价</option>
        </select>
      </label>
    </section>

    <div class="actions">
      <button @click="emit('show-progress', '推送投放', '正在推送计划至媒体渠道…')">立即推送</button>
      <button @click="emit('open-modal', '预算提醒', '当前预算较高，建议关注 ROI 波动。')">预算提醒</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['open-modal', 'show-progress'])

const budget = ref(45)
const strategy = ref('oCPC')

const plans = ref([
  { name: '618 预热', budget: '30w', coverage: '华东+华南', progress: 75 },
  { name: '夏季新品', budget: '50w', coverage: '全国', progress: 52 },
  { name: '会员日', budget: '20w', coverage: '华北', progress: 90 }
])
</script>

<style scoped>
.module-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plan-board {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.plan-card {
  flex: 1 1 220px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress {
  background: #f3f4f6;
  border-radius: 999px;
  height: 10px;
}

.progress-inner {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #38bdf8, #6366f1);
}

.plan-card button {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  background: #2563eb;
  color: #fff;
}

.controls {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

label {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input[type='range'] {
  width: 100%;
}

select {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  color: #fff;
}

.actions button:first-child {
  background: #10b981;
}

.actions button:last-child {
  background: #f59e0b;
}
</style>
