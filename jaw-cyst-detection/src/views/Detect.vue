<template>
  <div class="card">
    <div class="section-title">辅助检测分析</div>
    <p class="muted">对 CT 影像自动识别颌骨囊肿并输出检测框、置信度与分型建议。</p>
    <div class="toolbar">
      <button @click="showSelect = true">选择影像检测</button>
      <button @click="startBatch">批量检测</button>
      <button @click="showExport = true">导出检测结果</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>患者</th>
          <th>疑似囊肿</th>
          <th>置信度</th>
          <th>体积估计</th>
          <th>建议</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in detectList" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.patient }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.score }}%</td>
          <td>{{ row.volume }} cm³</td>
          <td>{{ row.tip }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-model="showSelect" title="选择影像检测" confirm-text="开始检测" @confirm="confirmDetect">
    <label>影像编号
      <input v-model="detectForm.id" placeholder="CT-009" />
    </label>
    <label>使用模型
      <select v-model="detectForm.model">
        <option>YOLOv5s-囊肿版</option>
        <option>YOLOv5m-增强版</option>
      </select>
    </label>
  </BaseModal>

  <BaseModal v-model="showBatch" title="批量检测进度" confirm-text="后台执行" @confirm="() => (showBatch = false)">
    <p>正在对选定批次的 25 例 CT 影像执行推理。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: batchProgress + '%' }"></div>
    </div>
    <p class="muted">{{ batchProgress }}% 已完成</p>
  </BaseModal>

  <BaseModal v-model="showExport" title="导出检测结果" confirm-text="立即导出" @confirm="exportResult">
    <label>导出格式
      <select v-model="exportForm.format">
        <option>JSON 报告</option>
        <option>DICOM RT</option>
        <option>CSV 摘要</option>
      </select>
    </label>
    <label>包含内容
      <textarea rows="3" v-model="exportForm.fields" placeholder="检测框坐标、置信度、分型、体积"></textarea>
    </label>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const detectList = reactive(
  Array.from({ length: 20 }).map((_, i) => ({
    id: `CT-${String(i + 31).padStart(3, '0')}`,
    patient: `病例${i + 1}`,
    type: i % 2 === 0 ? '牙源性囊肿' : '角化囊肿',
    score: (75 + (i % 5) * 3).toFixed(1),
    volume: (0.6 + i * 0.05).toFixed(2),
    tip: i % 3 === 0 ? '建议口腔外科会诊' : '等待复核'
  }))
);

const detectForm = reactive({ id: '', model: 'YOLOv5s-囊肿版' });
const exportForm = reactive({ format: 'JSON 报告', fields: '检测框坐标、置信度、分型、体积' });

const showSelect = ref(false);
const showBatch = ref(false);
const showExport = ref(false);
const batchProgress = ref(0);
let timer;

const confirmDetect = () => {
  alert(`开始检测 ${detectForm.id || '新影像'}，使用 ${detectForm.model}`);
  showSelect.value = false;
};

const startBatch = () => {
  showBatch.value = true;
  batchProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    batchProgress.value = Math.min(100, batchProgress.value + 12);
    if (batchProgress.value >= 100) clearInterval(timer);
  }, 500);
};

const exportResult = () => {
  showExport.value = false;
  alert(`已导出为 ${exportForm.format}`);
};
</script>
