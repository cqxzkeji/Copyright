<template>
  <section class="grid" style="grid-template-columns: 1.5fr 1fr; align-items: start;">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>修复投加计划</h2>
          <p>分批次追踪膨润土投加与修复进展</p>
        </div>
        <div class="section-actions">
          <button class="btn primary" @click="showSchedule = true">新增计划</button>
          <button class="btn" @click="showProgress = true">查看进度</button>
          <button class="btn" @click="openAlert">风险提示</button>
        </div>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>地点</th>
            <th>投加量(t)</th>
            <th>状态</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan.batch">
            <td>{{ plan.batch }}</td>
            <td>{{ plan.site }}</td>
            <td>{{ plan.dosage }}</td>
            <td><span class="badge">{{ plan.status }}</span></td>
            <td>{{ plan.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <header class="section-header">
        <div>
          <h2>修复指标</h2>
          <p>在线追踪水质关键指标变化</p>
        </div>
        <button class="btn" @click="showIndicator = true">指标说明</button>
      </header>
      <div class="chart">
        <div v-for="item in indicators" :key="item.label" class="bar" :style="{ height: `${item.value}%` }">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}%</strong>
        </div>
      </div>
    </div>
  </section>

  <div v-if="showSchedule" class="modal-backdrop" @click.self="showSchedule = false">
    <div class="modal">
      <header>
        <span>新增修复计划</span>
        <button class="btn" @click="showSchedule = false">关闭</button>
      </header>
      <form class="form" @submit.prevent="addPlan">
        <label>批次编号<input v-model="form.batch" required /></label>
        <label>地点<input v-model="form.site" required /></label>
        <label>投加量(t)<input v-model.number="form.dosage" type="number" required /></label>
        <label>负责人<input v-model="form.owner" required /></label>
        <footer>
          <button class="btn" type="button" @click="showSchedule = false">取消</button>
          <button class="btn primary" type="submit">保存</button>
        </footer>
      </form>
    </div>
  </div>

  <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
    <div class="modal">
      <header>
        <span>修复进度</span>
        <button class="btn" @click="showProgress = false">关闭</button>
      </header>
      <p>正在核验现场数据回传与采样报告。</p>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <footer>
        <button class="btn primary" @click="simulateProgress">刷新进度</button>
      </footer>
    </div>
  </div>

  <div v-if="showAlert" class="modal-backdrop" @click.self="showAlert = false">
    <div class="modal">
      <header>
        <span>风险提示</span>
        <button class="btn" @click="showAlert = false">关闭</button>
      </header>
      <p>近期降雨量偏高，请确认投加区排水沟畅通，必要时减缓投加速率。</p>
      <footer>
        <button class="btn primary" @click="showAlert = false">已知晓</button>
      </footer>
    </div>
  </div>

  <div v-if="showIndicator" class="modal-backdrop" @click.self="showIndicator = false">
    <div class="modal">
      <header>
        <span>指标解释</span>
        <button class="btn" @click="showIndicator = false">关闭</button>
      </header>
      <ul>
        <li>TP 去除率＞75% 视为达标。</li>
        <li>浊度提升不应超过 5 NTU。</li>
        <li>溶解氧保持在 6 mg/L 以上以避免厌氧。</li>
      </ul>
      <footer>
        <button class="btn primary" @click="showIndicator = false">了解</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const plans = ref([
  { batch: 'R-01', site: '上游取水口', dosage: 1.2, status: '执行中', owner: '张杰' },
  { batch: 'R-02', site: '湿地进水口', dosage: 0.9, status: '执行中', owner: '刘颖' },
  { batch: 'R-03', site: '一号沉淀池', dosage: 1.5, status: '完成', owner: '王晨' },
  { batch: 'R-04', site: '二号沉淀池', dosage: 1.1, status: '完成', owner: '李想' },
  { batch: 'R-05', site: '河道 2km', dosage: 0.8, status: '计划中', owner: '周敏' },
  { batch: 'R-06', site: '河道 3km', dosage: 0.6, status: '计划中', owner: '陈辉' },
  { batch: 'R-07', site: '湖面西区', dosage: 1.4, status: '执行中', owner: '赵云' },
  { batch: 'R-08', site: '湖面东区', dosage: 1.3, status: '计划中', owner: '冯倩' },
  { batch: 'R-09', site: '补水泵站', dosage: 0.7, status: '完成', owner: '马兰' },
  { batch: 'R-10', site: '生态浮岛', dosage: 0.5, status: '执行中', owner: '袁青' }
]);

const indicators = ref([
  { label: 'TP 去除', value: 82 },
  { label: '浊度控制', value: 74 },
  { label: '溶解氧', value: 91 },
  { label: '叶绿素 a', value: 66 }
]);

const showSchedule = ref(false);
const showProgress = ref(false);
const showAlert = ref(false);
const showIndicator = ref(false);
const progress = ref(45);
const form = reactive({ batch: '', site: '', dosage: '', owner: '' });

const addPlan = () => {
  plans.value = [
    { batch: form.batch, site: form.site, dosage: form.dosage, status: '计划中', owner: form.owner },
    ...plans.value
  ];
  showSchedule.value = false;
};

const simulateProgress = () => {
  progress.value = 0;
  const loop = () => {
    if (progress.value < 100) {
      progress.value += 15;
      setTimeout(loop, 220);
    }
  };
  loop();
};

const openAlert = () => (showAlert.value = true);
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  gap: 6px;
}

input {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  align-items: end;
}

.bar {
  background: linear-gradient(180deg, #c7d2fe, #6366f1);
  border-radius: 12px 12px 8px 8px;
  color: #0f172a;
  position: relative;
  padding: 12px 8px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: inset 0 -6px 12px rgba(255, 255, 255, 0.35);
}

.bar span {
  position: absolute;
  top: 8px;
  left: 8px;
  font-weight: 700;
}

.bar strong {
  text-align: center;
  color: #fff;
}
</style>
