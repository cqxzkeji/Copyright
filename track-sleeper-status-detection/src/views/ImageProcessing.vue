<template>
  <div class="grid">
    <section class="card">
      <div class="section-title">
        <h3>图像采集清单</h3>
        <button @click="openUpload">上传采集包</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>采集点</th>
            <th>光照</th>
            <th>模糊度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in images" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.spot }}</td>
            <td>{{ item.light }}</td>
            <td>{{ item.blur }}%</td>
            <td>
              <button @click="preview(item)">预览</button>
              <button @click="markFocus(item)">增强</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <div class="section-title">
        <h3>预处理质量柱状图</h3>
        <button @click="startEnhance">批量锐化</button>
      </div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: item.score + '%' }"
        >
          {{ item.label }}
        </div>
      </div>
      <p class="note">批量锐化通过亮度/清晰度综合评分展示。</p>
    </section>
  </div>

  <div v-if="previewItem" class="modal-backdrop" @click.self="previewItem = null">
    <div class="modal">
      <h3>样本预览 - {{ previewItem.spot }}</h3>
      <div class="preview-box">图像清晰度 {{ previewItem.blur }}%</div>
      <div class="actions-row">
        <button @click="previewItem = null">关闭</button>
        <button @click="runDetection(previewItem)">缺陷检测</button>
      </div>
    </div>
  </div>

  <div v-if="showUpload" class="modal-backdrop" @click.self="showUpload = false">
    <div class="modal">
      <h3>上传采集包</h3>
      <div class="form-grid">
        <input class="input" placeholder="文件名" v-model="uploadForm.name" />
        <input class="input" placeholder="批次号" v-model="uploadForm.batch" />
        <input class="input" placeholder="备注" v-model="uploadForm.note" />
      </div>
      <div class="actions-row">
        <button @click="submitUpload">提交</button>
        <button class="ghost" @click="showUpload = false">取消</button>
      </div>
    </div>
  </div>

  <div v-if="progressModal" class="modal-backdrop" @click.self="progressModal = false">
    <div class="modal">
      <h3>{{ progressTitle }}</h3>
      <div class="progress-bar">
        <div class="fill" :style="{ width: progress + '%' }"></div>
      </div>
      <p>处理进度 {{ progress }}%</p>
      <div class="actions-row">
        <button @click="stepProgress">刷新</button>
        <button class="ghost" @click="progressModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const images = ref([
  { id: 1, spot: '跨区1-左股', light: '充足', blur: 12 },
  { id: 2, spot: '跨区1-右股', light: '略暗', blur: 18 },
  { id: 3, spot: '折返线', light: '均衡', blur: 8 },
  { id: 4, spot: '站台A', light: '强光', blur: 5 },
  { id: 5, spot: '道口B', light: '均衡', blur: 16 },
]);

const chartData = ref([
  { label: '亮度', score: 82 },
  { label: '对比度', score: 76 },
  { label: '锐利度', score: 68 },
  { label: '纹理', score: 74 },
  { label: '边缘', score: 79 },
]);

const previewItem = ref(null);
const progressModal = ref(false);
const progressTitle = ref('');
const progress = ref(25);
const showUpload = ref(false);
const uploadForm = reactive({ name: '', batch: '', note: '' });

const preview = (item) => {
  previewItem.value = item;
};

const markFocus = (item) => {
  alert(`已对 ${item.spot} 应用边缘增强。`);
};

const startEnhance = () => {
  progressTitle.value = '批量锐化运行中';
  progress.value = 25;
  progressModal.value = true;
};

const runDetection = (item) => {
  progressTitle.value = `缺陷检测 - ${item.spot}`;
  progress.value = 30;
  progressModal.value = true;
};

const stepProgress = () => {
  progress.value = Math.min(100, progress.value + 25);
};

const openUpload = () => {
  showUpload.value = true;
};

const submitUpload = () => {
  alert(`已上传批次 ${uploadForm.batch || '未命名'} 的采集包。`);
  showUpload.value = false;
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 14px;
}

.preview-box {
  background: #eef5ff;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: #1d4ed8;
  font-weight: 700;
}

.actions-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.note {
  color: #6b7280;
  margin-top: 6px;
}

.ghost {
  background: #eef2f7;
  color: #1f2937;
  box-shadow: none;
}
</style>
