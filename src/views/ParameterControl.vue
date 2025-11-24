<template>
  <div class="module">
    <header class="header">
      <div>
        <p class="eyebrow">参数调控与优化</p>
        <h3>调节成膜参数以提升致密度与弹性</h3>
      </div>
      <div class="actions">
        <button class="ghost" @click="showPlan = true">生成优化计划</button>
        <button class="primary" @click="startProgress('运行遗传算法...')">开始优化</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <div class="card-header">
          <h4>关键参数列表</h4>
          <button class="mini" @click="showPlan = true">批量调整</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>参数</th>
              <th>当前值</th>
              <th>推荐范围</th>
              <th>敏感度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="param in parameters" :key="param.name">
              <td>{{ param.name }}</td>
              <td>{{ param.value }}</td>
              <td>{{ param.range }}</td>
              <td>
                <div class="bar">
                  <div class="value" :style="{ width: param.sensitivity + '%' }"></div>
                </div>
              </td>
              <td>
                <button class="mini" @click="editParam(param)">调整</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          <h4>指标目标</h4>
          <button class="mini" @click="showTargets = true">修改目标</button>
        </div>
        <div class="chart">
          <div v-for="target in targets" :key="target.label" class="slice">
            <span>{{ target.label }}</span>
            <div class="bar">
              <div class="value" :style="{ width: target.progress + '%' }"></div>
            </div>
            <small>{{ target.progress }}%</small>
          </div>
        </div>
      </div>
    </section>

    <ModalDialog v-model="showPlan" title="生成优化计划" @confirm="confirmPlan">
      <form class="form" @submit.prevent>
        <label>优化策略
          <select v-model="plan.strategy">
            <option>遗传算法</option>
            <option>粒子群优化</option>
            <option>贝叶斯优化</option>
          </select>
        </label>
        <label>迭代轮次
          <input v-model.number="plan.iterations" type="number" min="10" />
        </label>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showTargets" title="指标目标" @confirm="confirmTargets">
      <form class="form" @submit.prevent>
        <label v-for="target in targets" :key="target.label">
          {{ target.label }} 目标 (%)
          <input type="number" min="0" max="100" v-model.number="target.progress" />
        </label>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showEdit" :title="`调整 ${currentParam?.name}`" @confirm="confirmEdit">
      <form class="form" @submit.prevent>
        <label>新值
          <input v-model="editValue" />
        </label>
      </form>
    </ModalDialog>

    <ProgressDialog
      v-model="showProgress"
      :progress="progress"
      title="算法迭代"
      :description="progressLabel"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';

const parameters = ref([
  { name: '喷涂压力 (kPa)', value: '18', range: '12 - 22', sensitivity: 72 },
  { name: '溶剂比例 (%)', value: '45', range: '40 - 55', sensitivity: 64 },
  { name: '干燥速率 (°C/min)', value: '2.4', range: '1.8 - 2.6', sensitivity: 58 },
  { name: '牵引速度 (mm/s)', value: '15', range: '12 - 18', sensitivity: 70 },
  { name: '辊筒张力 (N)', value: '3.1', range: '2.5 - 3.8', sensitivity: 66 }
]);

const targets = reactive([
  { label: '膜致密度', progress: 78 },
  { label: '拉伸强度', progress: 72 },
  { label: '吸湿响应', progress: 64 },
  { label: '表面均匀性', progress: 81 },
  { label: '透光率', progress: 69 }
]);

const showPlan = ref(false);
const showTargets = ref(false);
const showEdit = ref(false);
const currentParam = ref(null);
const editValue = ref('');
const plan = reactive({ strategy: '遗传算法', iterations: 40 });

const showProgress = ref(false);
const progress = ref(0);
const progressLabel = ref('初始化种群...');

const confirmPlan = () => startProgress('构建优化空间...');
const confirmTargets = () => startProgress('重置指标权重...');

const editParam = (param) => {
  currentParam.value = param;
  editValue.value = param.value;
  showEdit.value = true;
};

const confirmEdit = () => {
  if (currentParam.value) {
    currentParam.value.value = editValue.value;
  }
  startProgress('微调参数曲线...');
  showEdit.value = false;
};

const startProgress = (label) => {
  progress.value = 0;
  progressLabel.value = label;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value = Math.min(progress.value + 12, 100);
    if (progress.value === 100) {
      clearInterval(timer);
      setTimeout(() => {
        showProgress.value = false;
      }, 400);
    }
  }, 260);
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.eyebrow {
  margin: 0;
  color: #6b7280;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

h3 {
  margin: 4px 0 0;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  border-radius: 12px;
  border: 1px solid transparent;
  padding: 10px 14px;
  font-weight: 700;
}

.primary {
  background: linear-gradient(120deg, var(--primary), #60a5fa);
  color: white;
}

.ghost {
  background: #f3f4f6;
  border-color: var(--border);
}

.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 14px;
  display: grid;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mini {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #4f46e5;
  padding: 6px 10px;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.bar {
  width: 100%;
  height: 10px;
  background: #eef2ff;
  border-radius: 999px;
  overflow: hidden;
}

.value {
  height: 100%;
  background: linear-gradient(120deg, #22c55e, #60a5fa);
}

.chart {
  display: grid;
  gap: 8px;
}

.slice {
  display: grid;
  grid-template-columns: 120px 1fr 50px;
  align-items: center;
  gap: 8px;
}

.form {
  display: grid;
  gap: 10px;
}

input, select {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
</style>
