<template>
  <section class="grid" style="grid-template-columns: 2fr 1fr; align-items: start;">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>吸附实验记录</h2>
          <p>记录膨润土对不同水样的磷吸附效率</p>
        </div>
        <div class="section-actions">
          <button class="btn primary" @click="openForm">录入实验</button>
          <button class="btn" @click="openBatch">批量监测</button>
          <button class="btn" @click="openNotice">安全提示</button>
        </div>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th>样品编号</th>
            <th>初始浓度(mg/L)</th>
            <th>吸附后浓度(mg/L)</th>
            <th>去除率</th>
            <th>搅拌速度(r/min)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in adsorptionData" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.initial }}</td>
            <td>{{ row.after }}</td>
            <td>{{ row.rate }}%</td>
            <td>{{ row.speed }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <header class="section-header">
        <div>
          <h2>磷吸附曲线</h2>
          <p>不同投加量下的去除率模拟</p>
        </div>
        <button class="btn" @click="openChartTip">查看说明</button>
      </header>
      <div class="chart">
        <div
          v-for="point in chartPoints"
          :key="point.dosage"
          class="bar"
          :style="{ height: `${point.rate}%` }"
        >
          <span>{{ point.dosage }}g/L</span>
          <strong>{{ point.rate }}%</strong>
        </div>
      </div>
    </div>
  </section>

  <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
    <div class="modal">
      <header>
        <span>录入吸附实验</span>
        <button class="btn" @click="showForm = false">关闭</button>
      </header>
      <form class="form" @submit.prevent="submitExperiment">
        <label>样品编号<input v-model="form.id" required /></label>
        <label>初始浓度<input v-model.number="form.initial" type="number" required /></label>
        <label>吸附后浓度<input v-model.number="form.after" type="number" required /></label>
        <label>搅拌速度<input v-model.number="form.speed" type="number" required /></label>
        <footer>
          <button class="btn" type="button" @click="showForm = false">取消</button>
          <button class="btn primary" type="submit">保存记录</button>
        </footer>
      </form>
    </div>
  </div>

  <div v-if="showBatch" class="modal-backdrop" @click.self="showBatch = false">
    <div class="modal">
      <header>
        <span>批量监测</span>
        <button class="btn" @click="showBatch = false">关闭</button>
      </header>
      <p>正在同步在线水质监测数据，完成后自动刷新表格。</p>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${batchProgress}%` }"></div>
      </div>
      <footer>
        <button class="btn primary" @click="simulateBatch">重新模拟</button>
      </footer>
    </div>
  </div>

  <div v-if="showNotice" class="modal-backdrop" @click.self="showNotice = false">
    <div class="modal">
      <header>
        <span>操作提醒</span>
        <button class="btn" @click="showNotice = false">关闭</button>
      </header>
      <ul>
        <li>建议使用 200 r/min 以上搅拌速度保持悬浮。</li>
        <li>投加后 30 分钟内完成取样测定。</li>
        <li>为防止铝盐干扰，可同步记录水样 pH。</li>
      </ul>
      <footer>
        <button class="btn primary" @click="showNotice = false">已阅</button>
      </footer>
    </div>
  </div>

  <div v-if="showChartTip" class="modal-backdrop" @click.self="showChartTip = false">
    <div class="modal">
      <header>
        <span>曲线说明</span>
        <button class="btn" @click="showChartTip = false">关闭</button>
      </header>
      <p>柱高表示去除率，建议保持投加量在 0.6~1.0 g/L 以兼顾经济性与稳定性。</p>
      <footer>
        <button class="btn primary" @click="showChartTip = false">确定</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const adsorptionData = ref([
  { id: 'S-01', initial: 2.4, after: 0.4, rate: 83, speed: 200 },
  { id: 'S-02', initial: 3.1, after: 0.6, rate: 81, speed: 220 },
  { id: 'S-03', initial: 1.8, after: 0.2, rate: 89, speed: 180 },
  { id: 'S-04', initial: 4.5, after: 0.9, rate: 80, speed: 210 },
  { id: 'S-05', initial: 5.2, after: 1.3, rate: 75, speed: 230 },
  { id: 'S-06', initial: 6.0, after: 1.1, rate: 82, speed: 240 },
  { id: 'S-07', initial: 2.9, after: 0.5, rate: 83, speed: 190 },
  { id: 'S-08', initial: 3.7, after: 0.7, rate: 81, speed: 205 },
  { id: 'S-09', initial: 4.0, after: 0.8, rate: 80, speed: 215 },
  { id: 'S-10', initial: 2.2, after: 0.3, rate: 86, speed: 200 }
]);

const chartPoints = ref([
  { dosage: 0.4, rate: 68 },
  { dosage: 0.6, rate: 78 },
  { dosage: 0.8, rate: 85 },
  { dosage: 1.0, rate: 88 },
  { dosage: 1.2, rate: 90 }
]);

const showForm = ref(false);
const showBatch = ref(false);
const showNotice = ref(false);
const showChartTip = ref(false);
const batchProgress = ref(35);
const form = reactive({ id: '', initial: '', after: '', speed: '' });

const openForm = () => (showForm.value = true);
const openBatch = () => {
  showBatch.value = true;
  simulateBatch();
};
const openNotice = () => (showNotice.value = true);
const openChartTip = () => (showChartTip.value = true);

const simulateBatch = () => {
  batchProgress.value = 0;
  const step = () => {
    if (batchProgress.value < 100) {
      batchProgress.value += 20;
      setTimeout(step, 250);
    }
  };
  step();
};

const submitExperiment = () => {
  const rate = Number(((1 - form.after / form.initial) * 100).toFixed(0));
  adsorptionData.value = [
    { id: form.id, initial: form.initial, after: form.after, rate, speed: form.speed },
    ...adsorptionData.value
  ];
  showForm.value = false;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 12px;
  align-items: end;
}

.bar {
  background: linear-gradient(180deg, #bfdbfe, #3b82f6);
  border-radius: 12px 12px 8px 8px;
  color: #0f172a;
  position: relative;
  padding: 12px 8px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 160px;
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
  display: block;
  margin-top: auto;
  color: #fff;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
}

input {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}
</style>
