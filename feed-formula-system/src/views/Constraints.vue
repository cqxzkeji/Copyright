<template>
  <section class="card">
    <header class="section-header">
      <div>
        <p class="subtitle">目标与约束设置</p>
        <h3>营养指标与成本约束</h3>
      </div>
      <div class="button-row">
        <button class="btn" @click="openAdd">新增指标</button>
        <button class="btn" @click="openApply">应用约束模板</button>
        <button class="btn secondary" @click="openSimulate">快速成本预估</button>
      </div>
    </header>

    <div class="chart-card">
      <div class="chart" role="img" aria-label="指标达成度"> 
        <div v-for="metric in progress" :key="metric.name" class="bar-row">
          <span>{{ metric.name }}</span>
          <div class="bar">
            <span :style="{ width: metric.value + '%'}"></span>
          </div>
          <span class="value">{{ metric.value }}%</span>
        </div>
      </div>
      <div class="chart-note">使用蓝色柱表示当前配方达成度，目标均为 100%。</div>
    </div>

    <table class="table-grid">
      <thead>
        <tr>
          <th>指标</th>
          <th>目标</th>
          <th>下限</th>
          <th>上限</th>
          <th>权重</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in constraints" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.target }}</td>
          <td>{{ item.min }}</td>
          <td>{{ item.max }}</td>
          <td>{{ item.weight }}</td>
          <td>{{ item.note }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <div v-if="modal.open" class="modal-mask">
    <div class="modal-card">
      <h3>{{ modal.title }}</h3>
      <p class="muted">{{ modal.message }}</p>
      <div v-if="modal.type === 'add'" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <label>指标<input v-model="form.name" placeholder="赖氨酸" /></label>
        <label>目标<input v-model.number="form.target" type="number" /></label>
        <label>下限<input v-model.number="form.min" type="number" /></label>
        <label>上限<input v-model.number="form.max" type="number" /></label>
        <label>权重<input v-model.number="form.weight" type="number" /></label>
      </div>
      <div v-else-if="modal.type === 'template'">
        <p class="alert-info">已加载示例模板，包含幼鱼、育肥、产卵三种场景。</p>
      </div>
      <div v-else-if="modal.type === 'simulate'">
        <p>成本预估中，生成 500 次抽样...</p>
        <div class="progress-bar"><span :style="{ width: form.progress + '%' }"></span></div>
      </div>
      <div class="modal-actions">
        <button class="secondary" @click="modal.open = false">取消</button>
        <button @click="confirmModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const constraints = reactive([
  { name: '粗蛋白', target: 32, min: 30, max: 35, weight: 0.3, note: '核心营养' },
  { name: '能量(ME)', target: 12.2, min: 11.8, max: 12.6, weight: 0.24, note: '千兆焦/公斤' },
  { name: '赖氨酸', target: 1.4, min: 1.3, max: 1.6, weight: 0.18, note: '必需氨基酸' },
  { name: '蛋氨酸', target: 0.55, min: 0.5, max: 0.6, weight: 0.12, note: '含硫氨基酸' },
  { name: '苏氨酸', target: 0.9, min: 0.82, max: 1.0, weight: 0.1, note: '维持生长' },
  { name: '色氨酸', target: 0.22, min: 0.2, max: 0.25, weight: 0.05, note: '调节应激' },
  { name: '钙', target: 1.2, min: 1.0, max: 1.4, weight: 0.06, note: '骨骼健康' },
  { name: '磷', target: 0.9, min: 0.75, max: 1.0, weight: 0.05, note: '配合钙' },
  { name: '钠', target: 0.2, min: 0.18, max: 0.24, weight: 0.03, note: '电解平衡' },
  { name: '氯', target: 0.3, min: 0.25, max: 0.35, weight: 0.03, note: '电解平衡' },
  { name: '粗纤维', target: 4.5, min: 3.5, max: 5.5, weight: 0.04, note: '饲料适口' },
  { name: '粗脂肪', target: 6, min: 5, max: 7, weight: 0.04, note: '能量补充' },
  { name: '水分', target: 12, min: 10, max: 13, weight: 0.02, note: '储存安全' },
  { name: '灰分', target: 10, min: 8, max: 12, weight: 0.02, note: '质量控制' },
  { name: '成本', target: 2750, min: 2600, max: 2900, weight: 0.21, note: '目标成本' },
  { name: '代谢能蛋白比', target: 0.38, min: 0.35, max: 0.4, weight: 0.07, note: '能蛋平衡' },
  { name: '钙磷比', target: 1.3, min: 1.1, max: 1.4, weight: 0.06, note: '骨骼比例' },
  { name: '消化能', target: 13.2, min: 12.8, max: 13.6, weight: 0.08, note: '消化效率' },
  { name: '适口性评分', target: 85, min: 75, max: 95, weight: 0.05, note: '现场经验值' },
  { name: '霉菌毒素', target: 0.02, min: 0, max: 0.05, weight: 0.05, note: '安全控制' },
  { name: '微量元素满足度', target: 95, min: 90, max: 100, weight: 0.05, note: '锌铁铜锰' }
]);

const progress = reactive([
  { name: '营养达标', value: 88 },
  { name: '成本贴合', value: 92 },
  { name: '风险控制', value: 84 },
  { name: '适口性', value: 86 }
]);

const modal = reactive({ open: false, title: '', message: '', type: '' });
const form = reactive({ name: '', target: 0, min: 0, max: 0, weight: 0, progress: 35 });
let timer = null;

const openAdd = () => {
  modal.open = true;
  modal.title = '新增营养指标';
  modal.message = '补充目标后将同步到算法求解。';
  modal.type = 'add';
};

const openApply = () => {
  modal.open = true;
  modal.title = '套用模板';
  modal.message = '套用育肥阶段模板，并在当前表格中高亮更新。';
  modal.type = 'template';
};

const openSimulate = () => {
  modal.open = true;
  modal.title = '成本预估';
  modal.message = '随机模拟原料波动，给出成本区间。';
  modal.type = 'simulate';
  form.progress = 35;
  clearInterval(timer);
  timer = setInterval(() => {
    if (form.progress >= 100) {
      clearInterval(timer);
    } else {
      form.progress += 15;
    }
  }, 350);
};

const confirmModal = () => {
  if (modal.type === 'add' && form.name) {
    constraints.push({
      name: form.name,
      target: form.target,
      min: form.min,
      max: form.max,
      weight: form.weight,
      note: '用户自定义'
    });
  }
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

.chart-card {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.chart {
  display: grid;
  gap: 0.6rem;
}

.bar-row {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  gap: 0.5rem;
  align-items: center;
}

.bar {
  background: #e5edff;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  background: linear-gradient(120deg, #60a5fa, #2563eb);
}

.value {
  font-weight: 700;
  color: #1d4ed8;
}

.chart-note {
  margin-top: 0.5rem;
  color: #6b7280;
}

.muted {
  color: #6b7280;
}
</style>
