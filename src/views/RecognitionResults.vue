<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
    <div class="card">
      <div class="section-head">识别预览</div>
      <div class="preview-box">
        <div class="preview original">输入样本</div>
        <div class="preview processed">预测掩膜</div>
      </div>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="showCompare = true">查看对比</button>
        <button class="btn secondary" @click="showNote = true">写备注</button>
      </div>
    </div>
    <div class="card">
      <div class="section-head">结果列表</div>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>预测类别</th>
            <th>置信度</th>
            <th>耗时(ms)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in results" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.label }}</td>
            <td>{{ item.score }}</td>
            <td>{{ item.time }}</td>
          </tr>
        </tbody>
      </table>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="sortByScore">按置信度排序</button>
        <button class="btn secondary" @click="showExport = true">导出</button>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showCompare" title="图像对比" confirm-text="关闭" @confirm="showCompare = false">
    <p>叠加查看以确认边界位置，支持放大。</p>
    <div class="preview-box">
      <div class="preview original">输入</div>
      <div class="preview processed">输出</div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showNote" title="备注" confirm-text="提交" @confirm="submitNote">
    <textarea v-model="note" class="input" rows="4" placeholder="记录复核意见与下一步动作"></textarea>
  </ModalDialog>

  <ModalDialog v-model="showExport" title="导出结果" confirm-text="开始导出" @confirm="exportResult">
    <p>选择导出格式：</p>
    <div class="form-row">
      <label><input type="radio" value="csv" v-model="exportType" /> CSV</label>
      <label><input type="radio" value="json" v-model="exportType" /> JSON</label>
    </div>
    <div class="progress-bar" style="margin-top: 0.75rem;">
      <div class="fill" :style="{ width: exportProgress + '%' }"></div>
    </div>
    <small class="muted">导出进度：{{ exportProgress }}%</small>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const results = ref([
  { id: 'A001', label: '肿瘤', score: 0.91, time: 32 },
  { id: 'A002', label: '正常', score: 0.78, time: 27 },
  { id: 'A003', label: '炎症', score: 0.88, time: 30 },
  { id: 'A004', label: '肿瘤', score: 0.95, time: 29 }
]);
const showCompare = ref(false);
const showNote = ref(false);
const note = ref('');
const showExport = ref(false);
const exportType = ref('csv');
const exportProgress = ref(10);

const sortByScore = () => {
  results.value = [...results.value].sort((a, b) => b.score - a.score);
};

const submitNote = () => {
  note.value = '';
  showNote.value = false;
};

const exportResult = () => {
  exportProgress.value = Math.min(100, exportProgress.value + 30);
};
</script>

<style scoped>
.section-head {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.preview-box {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.preview {
  background: #fff7ed;
  border: 1px dashed #fed7aa;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  color: #f97316;
  font-weight: 700;
}

.preview.processed {
  background: #ecfeff;
  color: #0ea5e9;
  border-color: #bae6fd;
}

.muted {
  color: #6b7280;
}
</style>
