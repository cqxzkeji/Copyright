<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>模型优化</h1>
        <p class="muted">执行量化、剪枝与蒸馏，提升推理性能。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openQuant">量化压缩</button>
        <button class="btn secondary" @click="openPrune">结构剪枝</button>
        <button class="btn secondary" @click="openExport">导出推理包</button>
      </div>
      <p class="muted" style="margin-top: 4px">最近导出：{{ lastExport || '未导出' }}</p>
    </div>

    <div class="section-grid">
      <div class="card">
        <div class="card-head">推理延迟分布</div>
        <div class="bar-chart">
          <div v-for="item in latency" :key="item.label" class="bar" :style="{ height: item.value + 'px' }" :data-label="item.label">
            <div class="badge" style="position: absolute; top: 8px; right: 8px">{{ item.ms }}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head">优化记录</div>
        <table class="table">
          <thead>
            <tr><th>任务</th><th>类型</th><th>压缩率</th><th>延迟提升</th><th>体积</th><th>备注</th></tr>
          </thead>
          <tbody>
            <tr v-for="item in optimizations" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.ratio }}</td>
              <td>{{ item.latency }}</td>
              <td>{{ item.size }}</td>
              <td>{{ item.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-if="modal.type === 'quant'" title="量化压缩" @close="closeModal">
      <form class="form-grid">
        <label>精度<select><option>INT8</option><option>FP16</option><option>BF16</option></select></label>
        <label>校准数据比例<input type="number" value="20" /></label>
        <label>保留灵敏层<select><option>LayerNorm</option><option>Embedding</option></select></label>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="startProgress('量化压缩')">开始</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'prune'" title="结构剪枝" @close="closeModal">
      <form class="form-grid">
        <label>剪枝率<input type="number" value="30" /></label>
        <label>策略<select><option>全局稀疏</option><option>通道剪枝</option></select></label>
        <label>蒸馏教师<select><option>Teacher-v1</option><option>Teacher-v2</option></select></label>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeModal">取消</button>
        <button class="btn" @click="startProgress('结构剪枝')">执行</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'export'" title="导出推理包" @close="closeModal">
      <p>导出 ONNX 或 TensorRT 引擎，包含量化参数。</p>
      <template #footer>
        <button class="btn secondary" @click="closeModal">关闭</button>
        <button class="btn" @click="startProgress('导出推理包')">导出</button>
      </template>
    </BaseModal>

    <BaseModal v-if="modal.type === 'progress'" :title="progressTitle" @close="closeModal">
      <p>任务运行中…</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: progress + '%' }"></div></div>
    </BaseModal>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const latency = [
  { label: '原始', value: 140, ms: '38ms' },
  { label: '量化', value: 110, ms: '24ms' },
  { label: '剪枝', value: 100, ms: '21ms' },
  { label: '蒸馏', value: 95, ms: '20ms' },
  { label: '融合', value: 88, ms: '18ms' }
];

const optimizations = ref([
  { name: 'opt-071', type: '量化', ratio: '38%', latency: '-12ms', size: '210MB', note: 'INT8 PTQ' },
  { name: 'opt-072', type: '蒸馏', ratio: '28%', latency: '-9ms', size: '280MB', note: '教师v1' },
  { name: 'opt-073', type: '剪枝', ratio: '32%', latency: '-10ms', size: '240MB', note: '全局稀疏' },
  { name: 'opt-074', type: '量化', ratio: '35%', latency: '-13ms', size: '220MB', note: '对称量化' },
  { name: 'opt-075', type: '蒸馏', ratio: '22%', latency: '-7ms', size: '300MB', note: '多任务蒸馏' },
  { name: 'opt-076', type: '剪枝', ratio: '30%', latency: '-11ms', size: '230MB', note: '通道剪枝' },
  { name: 'opt-077', type: '融合', ratio: '18%', latency: '-6ms', size: '320MB', note: '算子融合' },
  { name: 'opt-078', type: '量化', ratio: '36%', latency: '-12ms', size: '215MB', note: '混合精度' },
  { name: 'opt-079', type: '剪枝', ratio: '29%', latency: '-9ms', size: '245MB', note: '结构剪枝' },
  { name: 'opt-080', type: '蒸馏', ratio: '24%', latency: '-8ms', size: '290MB', note: '序列蒸馏' }
]);

const modal = reactive({ type: '' });
const progress = ref(0);
const progressTitle = ref('任务');
const activeTask = ref('');
const lastExport = ref('');
let timer;

const startProgress = (title) => {
  activeTask.value = title;
  progressTitle.value = title;
  modal.type = 'progress';
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 16);
    if (progress.value === 100) {
      clearInterval(timer);
      setTimeout(() => finalizeTask(title), 320);
    }
  }, 300);
};

const finalizeTask = (title) => {
  if (['量化压缩', '结构剪枝'].includes(title)) {
    const id = `opt-${optimizations.value.length + 71}`;
    optimizations.value.unshift({
      name: id,
      type: title.includes('量化') ? '量化' : '剪枝',
      ratio: `${Math.round(Math.random() * 20 + 20)}%`,
      latency: `-${Math.round(Math.random() * 8 + 6)}ms`,
      size: `${Math.round(Math.random() * 60 + 200)}MB`,
      note: `${title} 完成`
    });
  }
  if (title === '导出推理包') {
    lastExport.value = `export-${Date.now()}`;
  }
  modal.type = 'export';
  activeTask.value = '';
};

const openQuant = () => (modal.type = 'quant');
const openPrune = () => (modal.type = 'prune');
const openExport = () => (modal.type = 'export');

const closeModal = () => {
  modal.type = '';
  clearInterval(timer);
};

onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; }
.card-head { font-weight: 700; margin-bottom: 8px; }
.muted { color: #64748b; }
</style>
