<template>
  <div class="module">
    <header class="header">
      <div>
        <p class="eyebrow">成膜性能评估</p>
        <h3>评估甘蔗纤维素纳米膜的机械与成膜表现</h3>
      </div>
      <div class="actions">
        <button class="ghost" @click="showPlan = true">制定评估计划</button>
        <button class="primary" @click="startProgress('启动膜层稳态评估')">开始评估</button>
        <button class="accent" @click="showAlert = true">生成改进建议</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <div class="card-header">
          <h4>膜层性能概览</h4>
          <button class="mini" @click="showPlan = true">调整方案</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>样品</th>
              <th>拉伸强度 (MPa)</th>
              <th>透气率 (g/m²·24h)</th>
              <th>附着力 (N/25mm)</th>
              <th>光泽度 (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in samples" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.tensile }}</td>
              <td>{{ row.breathability }}</td>
              <td>{{ row.adhesion }}</td>
              <td>
                <div class="bar">
                  <div class="value" :style="{ width: row.gloss + '%' }"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          <h4>稳定性与耐候性</h4>
          <button class="mini" @click="showStability = true">推演场景</button>
        </div>
        <div class="chart">
          <div v-for="(item, idx) in stability" :key="idx" class="slice">
            <span>{{ item.label }}</span>
            <div class="bar">
              <div class="value" :style="{ width: item.score + '%' }"></div>
            </div>
            <small>{{ item.score }}%</small>
          </div>
        </div>
      </div>
    </section>

    <section class="grid single">
      <div class="card">
        <div class="card-header">
          <h4>缺陷与改进指令</h4>
          <button class="mini" @click="startProgress('导出评估报告')">导出报告</button>
        </div>
        <ul class="actions-list">
          <li v-for="action in actions" :key="action.title">
            <div>
              <p class="action-title">{{ action.title }}</p>
              <small class="muted">{{ action.detail }}</small>
            </div>
            <button class="ghost" @click="openAction(action.title)">执行</button>
          </li>
        </ul>
      </div>
    </section>

    <ModalDialog v-model="showPlan" title="制定评估计划" @confirm="confirmPlan">
      <form class="form" @submit.prevent>
        <label>目标膜厚 (nm)
          <input v-model.number="plan.thickness" type="number" min="50" />
        </label>
        <label>测试环境
          <select v-model="plan.environment">
            <option>常温常湿</option>
            <option>高温高湿</option>
            <option>低温干燥</option>
          </select>
        </label>
        <label>循环次数
          <input v-model.number="plan.cycles" type="number" min="1" />
        </label>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showStability" title="耐候性推演" @confirm="confirmStability">
      <form class="form" @submit.prevent>
        <label>紫外剂量 (J/cm²)
          <input v-model.number="stabilityForm.uv" type="number" min="0" />
        </label>
        <label>湿热时间 (h)
          <input v-model.number="stabilityForm.humidity" type="number" min="0" />
        </label>
        <label>机械循环 (次)
          <input v-model.number="stabilityForm.cycles" type="number" min="0" />
        </label>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showAlert" title="生成改进建议" @confirm="confirmAlert">
      <form class="form" @submit.prevent>
        <label>关注指标
          <select v-model="alertTarget">
            <option>附着力</option>
            <option>透气率</option>
            <option>膜层光泽</option>
          </select>
        </label>
        <label>备注
          <input v-model="alertNote" placeholder="例如：提升对油性底材的附着力" />
        </label>
      </form>
    </ModalDialog>

    <ProgressDialog
      v-model="showProgress"
      :progress="progress"
      title="评估进行中"
      :description="progressLabel"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';

const samples = ref([
  { id: 'NF-01', tensile: 72, breathability: 820, adhesion: 18.4, gloss: 78 },
  { id: 'NF-02', tensile: 68, breathability: 910, adhesion: 17.5, gloss: 74 },
  { id: 'NF-03', tensile: 75, breathability: 760, adhesion: 19.1, gloss: 82 },
  { id: 'NF-04', tensile: 70, breathability: 840, adhesion: 18.0, gloss: 76 },
  { id: 'NF-05', tensile: 73, breathability: 890, adhesion: 18.7, gloss: 80 }
]);

const stability = ref([
  { label: '热循环保形', score: 86 },
  { label: '紫外耐候', score: 78 },
  { label: '湿热黏附', score: 74 },
  { label: '弯折抗裂', score: 82 },
  { label: '储存稳定', score: 88 }
]);

const actions = ref([
  { title: '提升膜-基界面附着', detail: '建议提高浆料固含与表面活化时间，验证剪切黏度窗口。' },
  { title: '改善透气与防护平衡', detail: '调整纤维取向与孔径分布，测试不同烘干梯度方案。' },
  { title: '增强耐紫外性能', detail: '引入抗氧化助剂并优化膜厚梯度，记录老化前后差异。' },
  { title: '降低卷曲残余应力', detail: '降低张力区间并增加缓冷段，监测残余应变释放。' },
  { title: '提升光泽与透明度', detail: '优化分散超声时间，筛选低折射差添加剂。' }
]);

const showPlan = ref(false);
const showStability = ref(false);
const showAlert = ref(false);
const showProgress = ref(false);
const progress = ref(12);
const progressLabel = ref('准备设备与样品');
const alertTarget = ref('附着力');
const alertNote = ref('');

const plan = reactive({
  thickness: 120,
  environment: '常温常湿',
  cycles: 3
});

const stabilityForm = reactive({
  uv: 1.5,
  humidity: 24,
  cycles: 500
});

const startProgress = (label) => {
  progress.value = 10;
  progressLabel.value = label;
  showProgress.value = true;
  const steps = [32, 58, 84, 100];
  let idx = 0;
  const timer = setInterval(() => {
    progress.value = steps[idx];
    progressLabel.value = `${label} · 进度 ${progress.value}%`;
    idx += 1;
    if (idx === steps.length) {
      clearInterval(timer);
    }
  }, 800);
};

const confirmPlan = () => {
  showPlan.value = false;
  startProgress('应用新的评估计划');
};

const confirmStability = () => {
  showStability.value = false;
  startProgress('推演耐候场景');
};

const confirmAlert = () => {
  showAlert.value = false;
  startProgress(`生成关于${alertTarget.value}的改进建议`);
};

const openAction = (title) => {
  startProgress(`执行：${title}`);
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 18px;
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
}

h3 {
  margin: 4px 0 0;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.button-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 14px;
}

.grid.single {
  grid-template-columns: 1fr;
}

.card {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  padding: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-header h4 {
  margin: 0;
}

.actions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.actions-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.action-title {
  margin: 0;
  font-weight: 700;
}

.muted {
  color: #6b7280;
}

.bar {
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.value {
  height: 100%;
  background: linear-gradient(120deg, var(--primary), var(--secondary));
}

.table-actions {
  display: flex;
  gap: 8px;
}

.chart {
  display: grid;
  gap: 10px;
}

.slice {
  display: grid;
  grid-template-columns: 160px 1fr 60px;
  align-items: center;
  gap: 8px;
}

.table-actions button,
.actions-list button,
.actions button {
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 10px 12px;
  background: #f9fafb;
  color: #111827;
}

.primary {
  background: linear-gradient(120deg, var(--primary), #60a5fa);
  color: white;
  border: none;
}

.accent {
  background: linear-gradient(120deg, #34d399, #22c55e);
  color: #fff;
  border: none;
}

.ghost {
  background: #f3f4f6;
}

.mini {
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 12px;
}

@media (max-width: 720px) {
  .slice {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, auto);
  }
}
</style>
