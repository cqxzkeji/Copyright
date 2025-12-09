<template>
  <section class="grid" style="grid-template-columns: 1.4fr 1fr; align-items: start;">
    <div class="card">
      <header class="section-header">
        <div>
          <h2>资源化利用清单</h2>
          <p>跟踪膨润土吸附后的磷资源回收与利用去向</p>
        </div>
        <div class="section-actions">
          <button class="btn primary" @click="showReuseForm = true">新增去向</button>
          <button class="btn" @click="showReminder = true">利用提醒</button>
        </div>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>含磷量(%)</th>
            <th>利用方式</th>
            <th>去向</th>
            <th>运输</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reuseList" :key="item.batch">
            <td>{{ item.batch }}</td>
            <td>{{ item.phosphorus }}</td>
            <td>{{ item.method }}</td>
            <td>{{ item.destination }}</td>
            <td>{{ item.transport }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <header class="section-header">
        <div>
          <h2>资源利用进度</h2>
          <p>不同利用类型的完成比例</p>
        </div>
        <button class="btn" @click="showProgressModal = true">刷新模拟</button>
      </header>
      <div class="chart">
        <div v-for="progress in reuseProgress" :key="progress.label" class="bar" :style="{ height: `${progress.value}%` }">
          <span>{{ progress.label }}</span>
          <strong>{{ progress.value }}%</strong>
        </div>
      </div>
    </div>
  </section>

  <div v-if="showReuseForm" class="modal-backdrop" @click.self="showReuseForm = false">
    <div class="modal">
      <header>
        <span>新增资源化去向</span>
        <button class="btn" @click="showReuseForm = false">关闭</button>
      </header>
      <form class="form" @submit.prevent="addReuse">
        <label>批次<input v-model="form.batch" required /></label>
        <label>含磷量(%)<input v-model.number="form.phosphorus" type="number" required /></label>
        <label>利用方式<input v-model="form.method" required /></label>
        <label>去向<input v-model="form.destination" required /></label>
        <label>运输方式<input v-model="form.transport" required /></label>
        <footer>
          <button class="btn" type="button" @click="showReuseForm = false">取消</button>
          <button class="btn primary" type="submit">保存</button>
        </footer>
      </form>
    </div>
  </div>

  <div v-if="showReminder" class="modal-backdrop" @click.self="showReminder = false">
    <div class="modal">
      <header>
        <span>利用提醒</span>
        <button class="btn" @click="showReminder = false">关闭</button>
      </header>
      <p>请确保运输车厢密闭，减少磷流失，农田施用需提前完成土壤检测。</p>
      <footer>
        <button class="btn primary" @click="showReminder = false">我已知晓</button>
      </footer>
    </div>
  </div>

  <div v-if="showProgressModal" class="modal-backdrop" @click.self="showProgressModal = false">
    <div class="modal">
      <header>
        <span>刷新进度</span>
        <button class="btn" @click="showProgressModal = false">关闭</button>
      </header>
      <p>模拟推送最新的资源化执行情况。</p>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progressValue}%` }"></div>
      </div>
      <footer>
        <button class="btn primary" @click="simulateProgress">开始刷新</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const reuseList = ref([
  { batch: 'C-01', phosphorus: 2.1, method: '农田还田', destination: '东岸稻田', transport: '密闭卡车' },
  { batch: 'C-02', phosphorus: 1.8, method: '堆肥掺混', destination: '有机肥厂', transport: '封闭车' },
  { batch: 'C-03', phosphorus: 2.4, method: '建材掺合', destination: '砖厂', transport: '托盘车' },
  { batch: 'C-04', phosphorus: 1.5, method: '农田还田', destination: '北侧菜地', transport: '密闭卡车' },
  { batch: 'C-05', phosphorus: 2.0, method: '堆肥掺混', destination: '堆肥车间', transport: '封闭车' },
  { batch: 'C-06', phosphorus: 1.9, method: '园林基质', destination: '园林中心', transport: '托盘车' },
  { batch: 'C-07', phosphorus: 2.3, method: '农田还田', destination: '南岸农田', transport: '密闭卡车' },
  { batch: 'C-08', phosphorus: 1.7, method: '建材掺合', destination: '水泥厂', transport: '封闭车' },
  { batch: 'C-09', phosphorus: 2.2, method: '园林基质', destination: '苗圃', transport: '托盘车' },
  { batch: 'C-10', phosphorus: 1.6, method: '堆肥掺混', destination: '农废处理站', transport: '密闭卡车' }
]);

const reuseProgress = ref([
  { label: '农田还田', value: 72 },
  { label: '堆肥掺混', value: 64 },
  { label: '建材掺合', value: 48 },
  { label: '园林基质', value: 58 }
]);

const showReuseForm = ref(false);
const showReminder = ref(false);
const showProgressModal = ref(false);
const progressValue = ref(20);
const form = reactive({ batch: '', phosphorus: '', method: '', destination: '', transport: '' });

const addReuse = () => {
  reuseList.value = [
    {
      batch: form.batch,
      phosphorus: form.phosphorus,
      method: form.method,
      destination: form.destination,
      transport: form.transport
    },
    ...reuseList.value
  ];
  showReuseForm.value = false;
};

const simulateProgress = () => {
  progressValue.value = 0;
  const step = () => {
    if (progressValue.value < 100) {
      progressValue.value += 18;
      setTimeout(step, 240);
    }
  };
  step();
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

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  align-items: end;
}

.bar {
  background: linear-gradient(180deg, #fde68a, #f97316);
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
