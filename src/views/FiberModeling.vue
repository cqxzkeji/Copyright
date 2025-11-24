<template>
  <div class="module">
    <header class="header">
      <div>
        <p class="eyebrow">纤维素建模与模拟</p>
        <h3>构建甘蔗纤维素纳米成膜三维结构</h3>
      </div>
      <div class="actions">
        <button class="ghost" @click="showUpload = true">导入实验曲线</button>
        <button class="primary" @click="startProgress('运行蒙特卡洛模拟')">运行模拟</button>
        <button class="accent" @click="showDesign = true">生成新结构</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <div class="card-header">
          <h4>成膜实验批次</h4>
          <button class="mini" @click="showDesign = true">调整参数</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>批次</th>
              <th>纤维长度 (µm)</th>
              <th>固含量 (%)</th>
              <th>成膜温度 (℃)</th>
              <th>张力分布</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in batches" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.length }}</td>
              <td>{{ row.solids }}</td>
              <td>{{ row.temperature }}</td>
              <td>
                <div class="bar">
                  <div class="value" :style="{ width: row.tension + '%' }"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          <h4>结构均匀性图示</h4>
          <button class="mini" @click="togglePreview">查看三维预览</button>
        </div>
        <div class="chart">
          <div v-for="(slice, idx) in uniformity" :key="idx" class="slice">
            <span>{{ slice.layer }}</span>
            <div class="bar">
              <div class="value" :style="{ width: slice.uniform + '%' }"></div>
            </div>
            <small>{{ slice.uniform }}%</small>
          </div>
        </div>
      </div>
    </section>

    <ModalDialog v-model="showDesign" title="生成结构设计" @confirm="confirmDesign">
      <form class="form" @submit.prevent>
        <label>纤维平均长度 (µm)
          <input v-model.number="design.length" type="number" min="1" />
        </label>
        <label>纤维取向角 (°)
          <input v-model.number="design.orientation" type="number" min="0" max="90" />
        </label>
        <label>目标膜厚 (nm)
          <input v-model.number="design.thickness" type="number" min="50" />
        </label>
      </form>
    </ModalDialog>

    <ModalDialog v-model="showUpload" title="导入实验曲线" @confirm="confirmUpload">
      <form class="form" @submit.prevent>
        <label>文件名
          <input placeholder="stress-strain.csv" />
        </label>
        <label>曲线类型
          <select>
            <option>拉伸应力</option>
            <option>湿度响应</option>
            <option>孔隙分布</option>
          </select>
        </label>
      </form>
    </ModalDialog>

    <ProgressDialog
      v-model="showProgress"
      :progress="progress"
      title="模型计算"
      :description="progressLabel"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';

const batches = ref([
  { id: 'A01', length: 12.4, solids: 3.2, temperature: 45, tension: 76 },
  { id: 'A02', length: 10.8, solids: 2.8, temperature: 48, tension: 68 },
  { id: 'A03', length: 9.6, solids: 3.4, temperature: 42, tension: 72 },
  { id: 'A04', length: 11.2, solids: 3.1, temperature: 47, tension: 81 },
  { id: 'A05', length: 13.1, solids: 3.5, temperature: 49, tension: 74 }
]);

const uniformity = ref([
  { layer: '上表层', uniform: 86 },
  { layer: '中间层', uniform: 78 },
  { layer: '孔隙区', uniform: 64 },
  { layer: '致密层', uniform: 82 },
  { layer: '底支撑', uniform: 75 }
]);

const showDesign = ref(false);
const showUpload = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const progressLabel = ref('网格划分中...');

const design = reactive({ length: 11, orientation: 45, thickness: 120 });

const confirmDesign = () => {
  startProgress('正在生成结构种子...');
};

const confirmUpload = () => {
  startProgress('校正应力-应变曲线...');
};

const startProgress = (label) => {
  progress.value = 0;
  progressLabel.value = label;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value = Math.min(progress.value + 10, 100);
    if (progress.value === 100) {
      clearInterval(timer);
      setTimeout(() => {
        showProgress.value = false;
      }, 400);
    }
  }, 320);
};

const togglePreview = () => {
  startProgress('渲染三维层析图...');
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

.accent {
  background: linear-gradient(120deg, #22c55e, #a3e635);
  color: #0f172a;
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
  grid-template-columns: 100px 1fr 50px;
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
