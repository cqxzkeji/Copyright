<template>
  <section class="card">
    <header class="section-header">
      <div>
        <p class="subtitle">方案评估分析</p>
        <h3>成本与营养达标率对比</h3>
      </div>
      <div class="button-row">
        <button class="btn" @click="openRecheck">重新评估</button>
        <button class="btn" @click="openReport">生成图表报告</button>
        <button class="btn secondary" @click="openBenchmark">与历史方案对比</button>
      </div>
    </header>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card stat">
        <p class="label">平均成本</p>
        <div class="hero-number">¥{{ averageCost }}</div>
        <p class="muted">样本量 {{ plans.length }} 份方案</p>
      </div>
      <div class="card stat">
        <p class="label">营养达标率</p>
        <div class="hero-number">{{ passRate }}%</div>
        <div class="progress-bar"><span :style="{ width: passRate + '%' }"></span></div>
      </div>
      <div class="card stat">
        <p class="label">成本区间</p>
        <div class="hero-number">¥{{ minCost }} - ¥{{ maxCost }}</div>
        <p class="muted">覆盖全部评估方案</p>
      </div>
    </div>

    <div class="chart-card">
      <h4>方案分布</h4>
      <div class="chart" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
        <div v-for="plan in plans.slice(0,6)" :key="plan.name" class="bar-row">
          <span>{{ plan.name }}</span>
          <div class="bar">
            <span :style="{ width: plan.score + '%' }"></span>
          </div>
          <span class="value">{{ plan.score }}%</span>
        </div>
      </div>
    </div>

    <table class="table-grid">
      <thead>
        <tr>
          <th>方案</th>
          <th>成本</th>
          <th>达标率%</th>
          <th>蛋白%</th>
          <th>能量</th>
          <th>风险评分</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plan in plans" :key="plan.name">
          <td>{{ plan.name }}</td>
          <td>¥{{ plan.cost }}</td>
          <td>{{ plan.score }}</td>
          <td>{{ plan.protein }}</td>
          <td>{{ plan.energy }}</td>
          <td>
            <span class="tag" :style="{ background: plan.risk < 30 ? '#dcfce7' : '#fef3c7', color: plan.risk < 30 ? '#166534' : '#92400e' }">
              {{ plan.risk < 30 ? '安全' : '需关注' }} {{ plan.risk }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <div v-if="modal.open" class="modal-mask">
    <div class="modal-card">
      <h3>{{ modal.title }}</h3>
      <p class="muted">{{ modal.message }}</p>
      <div v-if="modal.type === 'report'" class="alert-info">将导出包含曲线、表格、提示的 PDF 报告。</div>
      <div v-else-if="modal.type === 'recheck'">
        <p>重新评估 3 个指标组...</p>
        <div class="progress-bar"><span :style="{ width: form.progress + '%' }"></span></div>
      </div>
      <div v-else-if="modal.type === 'benchmark'">
        <ul>
          <li v-for="item in benchmark" :key="item.label">{{ item.label }}：{{ item.value }}</li>
        </ul>
      </div>
      <div class="modal-actions">
        <button class="secondary" @click="modal.open = false">取消</button>
        <button @click="confirmModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const plans = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    name: `方案 ${i + 1}`,
    cost: 2550 + i * 15,
    score: 82 + (i % 6),
    protein: 31 + (i % 3),
    energy: 12 + (i % 4) * 0.1,
    risk: 18 + (i % 5) * 6
  }))
);

const benchmark = reactive([
  { label: '去年同配方成本', value: '¥2780' },
  { label: '历史最低成本', value: '¥2520' },
  { label: '历史最高达标率', value: '96%' }
]);

const modal = reactive({ open: false, title: '', message: '', type: '' });
const form = reactive({ progress: 20 });
let timer = null;

const averageCost = computed(() => Math.round(plans.reduce((s, p) => s + p.cost, 0) / plans.length));
const minCost = computed(() => Math.min(...plans.map(p => p.cost)));
const maxCost = computed(() => Math.max(...plans.map(p => p.cost)));
const passRate = computed(() => Math.round((plans.filter(p => p.score >= 85).length / plans.length) * 100));

const openReport = () => {
  modal.open = true;
  modal.title = '生成评估报告';
  modal.message = '导出图表报告用于团队审核。';
  modal.type = 'report';
};

const openRecheck = () => {
  modal.open = true;
  modal.title = '重新评估';
  modal.message = '重新计算指标达标率，刷新数据表。';
  modal.type = 'recheck';
  form.progress = 20;
  clearInterval(timer);
  timer = setInterval(() => {
    if (form.progress >= 100) {
      clearInterval(timer);
    } else {
      form.progress += 20;
    }
  }, 300);
};

const openBenchmark = () => {
  modal.open = true;
  modal.title = '历史对比';
  modal.message = '对比历史成本与达标率，提示稳定度。';
  modal.type = 'benchmark';
};

const confirmModal = () => {
  modal.open = false;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.button-row {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.label {
  margin: 0;
  color: #475569;
}

.muted {
  color: #6b7280;
}
</style>
