<template>
  <div class="module-shell">
    <header>
      <div>
        <h3>数据监控与反馈</h3>
        <p>跟踪关键指标、AB 实验与用户反馈，闭环迭代推荐策略。</p>
      </div>
      <div class="actions">
        <button @click="showReport = true">导出报表</button>
        <button class="primary" @click="showFeedback = true">同步反馈</button>
      </div>
    </header>
    <section class="monitor-grid">
      <article class="chart-card">
        <h4>核心指标走势</h4>
        <svg viewBox="0 0 220 120">
          <path d="M0 90 L40 70 L80 72 L120 44 L160 48 L200 30" fill="none" stroke="#22c55e" stroke-width="3" />
          <path d="M0 110 L40 104 L80 98 L120 90 L160 84 L200 80" fill="none" stroke="#ef4444" stroke-width="3" />
        </svg>
      </article>
      <article class="feedback-card">
        <h4>用户反馈摘要</h4>
        <ul>
          <li v-for="item in feedback" :key="item.user">
            <strong>{{ item.user }}</strong>
            <p>{{ item.comment }}</p>
            <small>{{ item.channel }}</small>
          </li>
        </ul>
      </article>
    </section>
    <section class="table-wrapper">
      <h4>AB 实验一览</h4>
      <table>
        <thead>
          <tr>
            <th>实验</th>
            <th>目标</th>
            <th>曝光</th>
            <th>提升</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exp in experiments" :key="exp.name">
            <td>{{ exp.name }}</td>
            <td>{{ exp.goal }}</td>
            <td>{{ exp.impression }}</td>
            <td :style="{ color: exp.lift > 0 ? '#16a34a' : '#ef4444' }">{{ exp.lift }}%</td>
            <td>
              <button @click="selectExperiment(exp)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
  <BaseModal v-model:open="showReport" title="报表导出">
    <p>已将 30 日指标报表生成，可在邮箱或下载中心查看。</p>
  </BaseModal>
  <BaseModal v-model:open="showFeedback" title="反馈同步">
    <p>用户反馈同步至算法引擎成功，召回策略将自动调整。</p>
  </BaseModal>
  <BaseModal v-model:open="showExperiment" :title="activeExperiment?.name || '实验详情'">
    <p>目标：{{ activeExperiment?.goal }}</p>
    <p>曝光：{{ activeExperiment?.impression }}</p>
    <p>提升：{{ activeExperiment?.lift }}%</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const feedback = [
  { user: '核心用户 A', comment: '新增的兴趣标签非常准确', channel: 'App 内' },
  { user: '体验官 B', comment: '推送更加及时，希望继续优化夜间模式', channel: 'Push' },
  { user: '体验官 C', comment: '长文推荐相关性提升明显', channel: 'Email' }
]

const experiments = [
  { name: 'EXP-CTR-041', goal: '提升首页 CTR', impression: '14.6M', lift: 3.6 },
  { name: 'EXP-Content-018', goal: '强化内容多样性', impression: '9.1M', lift: 1.4 },
  { name: 'EXP-Rank-007', goal: '减少冷启动损失', impression: '4.6M', lift: -0.7 }
]

const showReport = ref(false)
const showFeedback = ref(false)
const showExperiment = ref(false)
const activeExperiment = ref(null)

const selectExperiment = (exp) => {
  activeExperiment.value = exp
  showExperiment.value = true
}
</script>

<style scoped>
.module-shell {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 0.8rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  background: #e2e8f0;
}

button.primary {
  background: linear-gradient(135deg, #10b981, #22d3ee);
  color: #fff;
}

.monitor-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.chart-card,
.feedback-card {
  flex: 1;
  min-width: 240px;
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
}

.feedback-card ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
}

.table-wrapper {
  background: #f9fafb;
  border-radius: 20px;
  padding: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  text-align: left;
  padding: 0.6rem;
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:last-child td {
  border-bottom: none;
}

td button {
  background: transparent;
  border: 1px dashed #0ea5e9;
  color: #0ea5e9;
}
</style>
