<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
    <div class="card">
      <div class="section-head">预处理选项</div>
      <div class="form-row">
        <label><input type="checkbox" v-model="options.denoise" /> 去噪</label>
        <label><input type="checkbox" v-model="options.normalize" /> 亮度归一化</label>
        <label><input type="checkbox" v-model="options.resize" /> 自适应缩放</label>
        <label><input type="checkbox" v-model="options.augment" /> 数据增强</label>
      </div>
      <div class="form-row two-col">
        <div>
          <label>目标尺寸(px)</label>
          <input class="input" v-model="options.size" />
        </div>
        <div>
          <label>增强幅度(0-1)</label>
          <input class="input" v-model="options.augmentLevel" />
        </div>
      </div>
      <div class="actions" style="margin-top: 1rem;">
        <button class="btn" @click="apply">应用预处理</button>
        <button class="btn secondary" @click="showPreview = true">查看预览</button>
      </div>
    </div>
    <div class="card">
      <div class="section-head">处理队列</div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>操作</th>
            <th>进度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(step, index) in steps" :key="step.name">
            <td>{{ index + 1 }}</td>
            <td>{{ step.name }}</td>
            <td>
              <div class="progress-bar">
                <div class="fill" :style="{ width: step.progress + '%' }"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="simulate">模拟执行</button>
        <button class="btn secondary" @click="reset">重置队列</button>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showPreview" title="效果预览" confirm-text="确认" @confirm="showPreview = false">
    <p>已应用：{{ applied.join('、') || '无' }}</p>
    <div class="preview-box">
      <div class="preview original">原图</div>
      <div class="preview processed">处理后</div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const options = reactive({ denoise: true, normalize: true, resize: true, augment: false, size: '512', augmentLevel: '0.3' });
const steps = ref([
  { name: '去噪', progress: 45 },
  { name: '归一化', progress: 60 },
  { name: '自适应缩放', progress: 35 }
]);
const applied = ref([]);
const showPreview = ref(false);

const apply = () => {
  applied.value = [];
  if (options.denoise) applied.value.push('去噪');
  if (options.normalize) applied.value.push('亮度归一化');
  if (options.resize) applied.value.push(`缩放至 ${options.size}px`);
  if (options.augment) applied.value.push(`增强x${options.augmentLevel}`);
  showPreview.value = true;
};

const simulate = () => {
  steps.value = steps.value.map((step) => ({ ...step, progress: Math.min(100, step.progress + 15) }));
};

const reset = () => {
  steps.value = steps.value.map((step) => ({ ...step, progress: 0 }));
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
  gap: 1rem;
  margin-top: 0.75rem;
}

.preview {
  background: #eff6ff;
  border: 1px dashed #bfdbfe;
  border-radius: 12px;
  padding: 1.2rem;
  text-align: center;
  color: #2563eb;
  font-weight: 700;
}

.preview.processed {
  background: #ecfeff;
  color: #0891b2;
}
</style>
