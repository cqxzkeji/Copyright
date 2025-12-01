<template>
  <div>
    <div class="card header-card">
      <div>
        <h2>融合算法与结果计算</h2>
        <p>执行 Transformer 融合层，输出矢量化结果与置信区间。</p>
      </div>
      <div class="btn-group">
        <button class="primary-btn" @click="startFusion">执行融合</button>
        <button class="primary-btn" @click="openTune">权重调整</button>
        <button class="primary-btn" @click="openExport">导出报告</button>
      </div>
    </div>

    <div class="card">
      <h3>融合批次</h3>
      <table>
        <thead>
          <tr>
            <th>批次</th>
            <th>Transformer 层</th>
            <th>融合权重</th>
            <th>RMSE</th>
            <th>一致性</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="batch in batches" :key="batch.id">
            <td>{{ batch.id }}</td>
            <td>{{ batch.layer }}</td>
            <td>{{ batch.weight }}</td>
            <td>{{ batch.rmse }}</td>
            <td>{{ batch.consistency }}%</td>
            <td><span class="chip">{{ batch.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3>误差分布</h3>
      <div class="chart-row">
        <div v-for="err in errorBins" :key="err.label" class="chart-bar" :style="{ height: err.value + 'px' }" :title="err.label"></div>
      </div>
    </div>

    <div v-if="fusionModal" class="modal-backdrop" @click.self="fusionModal = false">
      <div class="modal-content">
        <h3>融合执行</h3>
        <p>正在迭代 Transformer 多头注意力...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: fusionProgress + '%' }"></div>
        </div>
        <p v-if="fusionProgress === 100">完成：结果已写入批次列表。</p>
      </div>
    </div>

    <div v-if="tuneModal" class="modal-backdrop" @click.self="tuneModal = false">
      <div class="modal-content">
        <h3>权重调整</h3>
        <div class="form-grid">
          <label>视觉权重</label>
          <input v-model.number="tuneForm.vision" type="number" />
          <label>雷达权重</label>
          <input v-model.number="tuneForm.radar" type="number" />
          <label>点云权重</label>
          <input v-model.number="tuneForm.lidar" type="number" />
          <label>时间窗口(ms)</label>
          <input v-model.number="tuneForm.window" type="number" />
        </div>
        <div class="btn-row">
          <button class="primary-btn" @click="applyTune">应用</button>
          <button class="secondary" @click="tuneModal = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="exportModal" class="modal-backdrop" @click.self="exportModal = false">
      <div class="modal-content">
        <h3>导出报告</h3>
        <p>选择导出格式以便上传至运维平台。</p>
        <div class="btn-row">
          <button class="primary-btn" @click="exportReport('PDF')">导出 PDF</button>
          <button class="primary-btn" @click="exportReport('CSV')">导出 CSV</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const batches = ref([
  { id: 'B-01', layer: 'encoder-4', weight: '0.6/0.4', rmse: 0.12, consistency: 96, status: '完成' },
  { id: 'B-02', layer: 'encoder-6', weight: '0.55/0.45', rmse: 0.14, consistency: 95, status: '运行中' },
  { id: 'B-03', layer: 'decoder-2', weight: '0.52/0.48', rmse: 0.10, consistency: 97, status: '完成' },
  { id: 'B-04', layer: 'decoder-3', weight: '0.58/0.42', rmse: 0.11, consistency: 96, status: '完成' },
  { id: 'B-05', layer: 'encoder-8', weight: '0.60/0.40', rmse: 0.13, consistency: 95, status: '排队' },
  { id: 'B-06', layer: 'fusion-head', weight: '0.62/0.38', rmse: 0.09, consistency: 98, status: '完成' },
  { id: 'B-07', layer: 'fusion-head', weight: '0.64/0.36', rmse: 0.08, consistency: 99, status: '完成' },
  { id: 'B-08', layer: 'decoder-5', weight: '0.57/0.43', rmse: 0.12, consistency: 96, status: '运行中' },
  { id: 'B-09', layer: 'encoder-10', weight: '0.59/0.41', rmse: 0.15, consistency: 94, status: '排队' },
  { id: 'B-10', layer: 'fusion-head', weight: '0.61/0.39', rmse: 0.09, consistency: 98, status: '完成' },
  { id: 'B-11', layer: 'encoder-12', weight: '0.63/0.37', rmse: 0.16, consistency: 93, status: '排队' },
  { id: 'B-12', layer: 'decoder-1', weight: '0.56/0.44', rmse: 0.11, consistency: 96, status: '完成' }
]);

const errorBins = ref([
  { label: '0.05', value: 150 },
  { label: '0.07', value: 130 },
  { label: '0.09', value: 120 },
  { label: '0.11', value: 110 },
  { label: '0.13', value: 90 }
]);

const fusionModal = ref(false);
const tuneModal = ref(false);
const exportModal = ref(false);
const fusionProgress = ref(0);
const tuneForm = reactive({ vision: 0.6, radar: 0.3, lidar: 0.1, window: 120 });
let fusionTimer;

const startFusion = () => {
  fusionModal.value = true;
  fusionProgress.value = 0;
  fusionTimer = setInterval(() => {
    if (fusionProgress.value >= 100) {
      clearInterval(fusionTimer);
    } else {
      fusionProgress.value += 20;
    }
  }, 240);
};

const openTune = () => {
  tuneModal.value = true;
};

const openExport = () => {
  exportModal.value = true;
};

const applyTune = () => {
  batches.value.unshift({
    id: `B-${batches.value.length + 21}`,
    layer: 'fusion-head',
    weight: `${tuneForm.vision}/${tuneForm.radar}`,
    rmse: 0.1,
    consistency: 97,
    status: '运行中'
  });
  tuneModal.value = false;
};

const exportReport = (type) => {
  exportModal.value = false;
  alert(`已触发 ${type} 报告导出`);
};
</script>

<style scoped>
.header-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 12px 0;
}

.btn-row {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.secondary {
  background: #e5e7eb;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
}
</style>
