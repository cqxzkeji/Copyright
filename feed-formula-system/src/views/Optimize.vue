<template>
  <section class="card">
    <header class="section-header">
      <div>
        <p class="subtitle">共生人工鱼群优化</p>
        <h3>算法求解过程</h3>
      </div>
      <div class="button-row">
        <button class="btn" @click="runOptimization">运行算法</button>
        <button class="btn" @click="openParams">调整参数</button>
        <button class="btn secondary" @click="openBest">查看最优方案</button>
      </div>
    </header>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card stat">
        <p class="label">种群规模</p>
        <div class="hero-number">{{ params.population }}</div>
        <p class="muted">人工鱼群个体数量</p>
      </div>
      <div class="card stat">
        <p class="label">迭代上限</p>
        <div class="hero-number">{{ params.iterations }}</div>
        <div class="progress-bar"><span :style="{ width: params.iterations / 1.2 + '%' }"></span></div>
      </div>
      <div class="card stat">
        <p class="label">当前最优成本</p>
        <div class="hero-number">¥{{ best.cost }}</div>
        <p class="muted">营养达标 {{ best.score }}%</p>
      </div>
    </div>

    <div class="chart-card">
      <h4>迭代收敛曲线</h4>
      <svg viewBox="0 0 320 120" class="line-chart">
        <polyline :points="chartPoints" fill="none" stroke="#2563eb" stroke-width="3" />
      </svg>
      <p class="chart-note">蓝线表示成本下降趋势，随迭代逐步收敛。</p>
    </div>

    <table class="table-grid">
      <thead>
        <tr>
          <th>迭代</th>
          <th>成本</th>
          <th>营养达标%</th>
          <th>活性度</th>
          <th>协同度</th>
          <th>收敛标记</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in records" :key="item.iteration">
          <td>{{ item.iteration }}</td>
          <td>¥{{ item.cost }}</td>
          <td>{{ item.score }}</td>
          <td>{{ item.activity }}</td>
          <td>{{ item.cooperate }}</td>
          <td>
            <span class="tag" :style="{ background: item.converged ? '#dcfce7' : '#e0f2fe', color: item.converged ? '#166534' : '#075985' }">
              {{ item.converged ? '收敛' : '探索' }}
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
      <div v-if="modal.type === 'param'" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <label>种群规模<input v-model.number="params.population" type="number" /></label>
        <label>迭代次数<input v-model.number="params.iterations" type="number" /></label>
        <label>觅食步长<input v-model.number="params.step" type="number" /></label>
        <label>拥挤因子<input v-model.number="params.crowd" type="number" step="0.1" /></label>
      </div>
      <div v-else-if="modal.type === 'run'">
        <p>算法正在运行，融合共生策略...</p>
        <div class="progress-bar"><span :style="{ width: form.progress + '%' }"></span></div>
      </div>
      <div v-else-if="modal.type === 'best'">
        <p>最优配方营养达标 {{ best.score }}%，详情如下：</p>
        <ul>
          <li v-for="item in best.ingredients" :key="item.name">{{ item.name }}：{{ item.ratio }}%</li>
        </ul>
      </div>
      <div class="modal-actions">
        <button class="secondary" @click="modal.open = false">关闭</button>
        <button @click="confirmModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const params = reactive({ population: 50, iterations: 90, step: 0.6, crowd: 0.3 });
const best = reactive({ cost: 2650, score: 93, ingredients: [
  { name: '豆粕', ratio: 18 },
  { name: '鱼粉', ratio: 10 },
  { name: 'DDGS', ratio: 6 },
  { name: '玉米', ratio: 35 },
  { name: '膨化大豆', ratio: 8 },
  { name: '矿物元素', ratio: 2 },
  { name: '油脂', ratio: 5 },
  { name: '添加剂', ratio: 1 }
] });

const records = reactive(
  Array.from({ length: 20 }, (_, i) => ({
    iteration: i + 1,
    cost: Math.round(3200 - i * 25 + (i % 2) * 12),
    score: Math.min(80 + i, 99),
    activity: Math.round(70 + Math.random() * 20),
    cooperate: Math.round(60 + Math.random() * 25),
    converged: i > 13
  }))
);

const modal = reactive({ open: false, title: '', message: '', type: '' });
const form = reactive({ progress: 25 });
let timer = null;

const chartPoints = computed(() => {
  return records
    .map((r, idx) => `${(idx / (records.length - 1)) * 320},${120 - (r.score - 70) * 2}`)
    .join(' ');
});

const runOptimization = () => {
  modal.open = true;
  modal.title = '算法执行';
  modal.message = '启动共生人工鱼群优化，实时输出成本趋势。';
  modal.type = 'run';
  form.progress = 25;
  clearInterval(timer);
  timer = setInterval(() => {
    if (form.progress >= 100) {
      clearInterval(timer);
      best.cost = 2600 + Math.round(Math.random() * 40);
      best.score = 92 + Math.round(Math.random() * 3);
    } else {
      form.progress += 12;
    }
  }, 420);
};

const openParams = () => {
  modal.open = true;
  modal.title = '算法参数设置';
  modal.message = '调整鱼群规模、迭代次数等参数以平衡精度与速度。';
  modal.type = 'param';
};

const openBest = () => {
  modal.open = true;
  modal.title = '最优配方详情';
  modal.message = '根据当前求解结果生成的饲料比例：';
  modal.type = 'best';
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

.line-chart {
  width: 100%;
  height: 120px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
</style>
