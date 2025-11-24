<template>
  <div class="module">
    <header class="header">
      <div>
        <p class="eyebrow">材料分析与测试</p>
        <h3>对成膜样品进行性能与稳定性分析</h3>
      </div>
      <div class="actions">
        <button class="ghost" @click="showUpload = true">上传测试数据</button>
        <button class="primary" @click="startProgress('分析红外光谱...')">开始分析</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <div class="card-header">
          <h4>批次检测数据</h4>
          <button class="mini" @click="showUpload = true">导入</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>厚度 (nm)</th>
              <th>致密度 (%)</th>
              <th>透光率 (%)</th>
              <th>弹性恢复</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sample in samples" :key="sample.id">
              <td>{{ sample.id }}</td>
              <td>{{ sample.thickness }}</td>
              <td>{{ sample.density }}</td>
              <td>{{ sample.transparency }}</td>
              <td>
                <div class="bar">
                  <div class="value" :style="{ width: sample.elasticity + '%' }"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          <h4>稳定性曲线</h4>
          <button class="mini" @click="startProgress('拟合降解曲线...')">拟合曲线</button>
        </div>
        <div class="chart">
          <div v-for="curve in curves" :key="curve.label" class="slice">
            <span>{{ curve.label }}</span>
            <div class="bar">
              <div class="value" :style="{ width: curve.value + '%' }"></div>
            </div>
            <small>{{ curve.value }}%</small>
          </div>
        </div>
      </div>
    </section>

    <ModalDialog v-model="showUpload" title="上传测试数据" @confirm="confirmUpload">
      <form class="form" @submit.prevent>
        <label>数据文件
          <input placeholder="fft-ir.xlsx" />
        </label>
        <label>测试类型
          <select>
            <option>FTIR</option>
            <option>AFM 粗糙度</option>
            <option>热重分析</option>
          </select>
        </label>
      </form>
    </ModalDialog>

    <ProgressDialog
      v-model="showProgress"
      :progress="progress"
      title="分析进度"
      :description="progressLabel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';

const samples = ref([
  { id: 'T01', thickness: 120, density: 92, transparency: 88, elasticity: 76 },
  { id: 'T02', thickness: 118, density: 90, transparency: 85, elasticity: 71 },
  { id: 'T03', thickness: 132, density: 89, transparency: 87, elasticity: 74 },
  { id: 'T04', thickness: 126, density: 91, transparency: 86, elasticity: 79 },
  { id: 'T05', thickness: 122, density: 93, transparency: 89, elasticity: 82 }
]);

const curves = ref([
  { label: '耐洗涤循环', value: 82 },
  { label: '温湿稳定', value: 76 },
  { label: '紫外稳定', value: 69 },
  { label: '氧化耐受', value: 71 },
  { label: '储存耐久', value: 74 }
]);

const showUpload = ref(false);
const showProgress = ref(false);
const progress = ref(0);
const progressLabel = ref('准备处理...');

const confirmUpload = () => startProgress('上传并清洗数据...');

const startProgress = (label) => {
  progress.value = 0;
  progressLabel.value = label;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value = Math.min(progress.value + 14, 100);
    if (progress.value === 100) {
      clearInterval(timer);
      setTimeout(() => {
        showProgress.value = false;
      }, 400);
    }
  }, 280);
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
