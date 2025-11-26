<template>
  <div class="grid grid-2">
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">方案编排</div>
          <h3>拆除重建模拟设计</h3>
        </div>
        <div class="actions">
          <button class="btn btn-outline" @click="startRun">运行模拟</button>
          <button class="btn btn-primary" @click="openCreate">创建方案</button>
        </div>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th>方案名</th>
            <th>阶段</th>
            <th>成本(万)</th>
            <th>收益(万)</th>
            <th>净收益</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.name">
            <td>{{ plan.name }}</td>
            <td>{{ plan.phase }}</td>
            <td>{{ plan.cost }}</td>
            <td>{{ plan.return }}</td>
            <td>{{ plan.return - plan.cost }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">进度对比</div>
          <h3>情景收益图</h3>
        </div>
        <button class="btn btn-outline" @click="openReport">导出报告</button>
      </header>
      <div class="chart">
        <div v-for="plan in plans" :key="plan.name" class="chart-row">
          <div class="label">{{ plan.name }}</div>
          <div class="chart-bar">
            <div class="fill" :style="{ width: `${plan.return / 3}%` }"></div>
          </div>
          <span class="value">{{ plan.return }}万</span>
        </div>
      </div>
    </div>
  </div>
  <BaseModal v-if="showCreate" title="创建方案" @close="showCreate = false" :actions="createActions">
    <form class="modal-form" @submit.prevent>
      <label>方案名</label>
      <input v-model="newPlan.name" required />
      <label>阶段</label>
      <input v-model="newPlan.phase" required />
      <label>成本(万)</label>
      <input v-model.number="newPlan.cost" type="number" min="0" />
      <label>收益(万)</label>
      <input v-model.number="newPlan.return" type="number" min="0" />
    </form>
  </BaseModal>
  <BaseModal v-if="showReport" title="方案导出" @close="showReport = false" :actions="reportActions">
    <p>导出成功，已生成亮色图表版 PDF。</p>
  </BaseModal>
  <BaseModal v-if="showProgress" title="模拟计算中" @close="showProgress = false">
    <p>正在模拟不同拆除节奏，动态计算投资回收期...</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
    <p class="muted">{{ progress }}%</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const plans = reactive([
  { name: '核心片区优先', phase: '拆除一期', cost: 3200, return: 5200 },
  { name: '交通导向型', phase: '综合施工', cost: 2800, return: 4700 },
  { name: '商住平衡型', phase: '封顶调试', cost: 2600, return: 4300 },
  { name: '安置优先型', phase: '竣工验收', cost: 2100, return: 3600 },
  { name: '慢行友好型', phase: '公共配套', cost: 1800, return: 3200 }
]);

const showCreate = ref(false);
const showReport = ref(false);
const showProgress = ref(false);
const progress = ref(12);
const newPlan = reactive({ name: '', phase: '拆除一期', cost: 2000, return: 3000 });

const createActions = [
  { label: '取消', onClick: () => (showCreate.value = false) },
  {
    label: '提交方案',
    primary: true,
    onClick: () => {
      plans.push({ ...newPlan });
      Object.assign(newPlan, { name: '', phase: '拆除一期', cost: 2000, return: 3000 });
      showCreate.value = false;
    }
  }
];

const reportActions = [{ label: '好的', primary: true, onClick: () => (showReport.value = false) }];

const startRun = () => {
  showProgress.value = true;
  progress.value = 12;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 18);
    if (progress.value >= 100) clearInterval(timer);
  }, 450);
};

const openCreate = () => (showCreate.value = true);
const openReport = () => (showReport.value = true);
</script>

<style scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.actions {
  display: flex;
  gap: 8px;
}

.chart {
  display: grid;
  gap: 12px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 3fr 0.6fr;
  align-items: center;
  gap: 10px;
}

.chart-bar {
  background: rgba(45, 123, 255, 0.1);
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(120deg, #2d7bff, #ffb347);
}

.label {
  font-weight: 600;
}

.value {
  font-weight: 700;
}

.modal-form {
  display: grid;
  gap: 10px;
}

input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(45, 123, 255, 0.3);
}

.muted {
  color: var(--muted);
}
</style>
