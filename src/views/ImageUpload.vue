<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
    <div class="card">
      <div class="section-head">上传入口</div>
      <p class="muted">支持批量上传，自动校验文件类型与尺寸。</p>
      <div class="drop-zone">
        <p>拖拽图片到此处或点击选择</p>
        <div class="actions">
          <button class="btn" @click="openPicker">选择文件</button>
          <button class="btn secondary" @click="showGuide = true">上传说明</button>
        </div>
      </div>
      <div class="form-row two-col">
        <div>
          <label>数据集标签</label>
          <input class="input" v-model="uploadForm.label" placeholder="如：病理切片" />
        </div>
        <div>
          <label>标注来源</label>
          <input class="input" v-model="uploadForm.source" placeholder="科室/设备" />
        </div>
      </div>
      <div class="actions" style="margin-top: 1rem;">
        <button class="btn" @click="startUpload">模拟上传</button>
        <button class="btn secondary" @click="showMeta = true">填写元数据</button>
      </div>
    </div>
    <div class="card">
      <div class="section-head">批次记录</div>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>数量</th>
            <th>标签</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in batches" :key="item.id">
            <td>#{{ item.id }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.label }}</td>
            <td><span class="badge">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
      <div class="progress-bar" style="margin-top: 0.5rem;">
        <div class="fill" :style="{ width: progress + '%' }"></div>
      </div>
      <small class="muted">上传进度：{{ progress }}%</small>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="showLog = true">查看日志</button>
        <button class="btn secondary" @click="clearBatches">清空记录</button>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showGuide" title="上传说明" confirm-text="关闭" @confirm="showGuide = false">
    <p>1. 支持 JPG/PNG/TIF，单张不超过 10MB。</p>
    <p>2. 可附带标签及采集设备信息，便于后续数据分析。</p>
  </ModalDialog>

  <ModalDialog v-model="showMeta" title="元数据" confirm-text="保存" @confirm="saveMeta">
    <div class="form-row">
      <label>拍摄设备</label>
      <input v-model="uploadForm.device" class="input" placeholder="如：Nikon DS-Fi3" />
      <label>备注</label>
      <textarea v-model="uploadForm.note" class="input" rows="3" placeholder="说明与质控策略"></textarea>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showLog" title="上传日志" confirm-text="关闭" @confirm="showLog = false">
    <ul>
      <li v-for="log in logs" :key="log" style="margin: 0.2rem 0;">{{ log }}</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const uploadForm = reactive({ label: '组织切片', source: '显微镜A1', device: '', note: '' });
const batches = ref([
  { id: 1001, count: 12, label: '肺部CT', status: '已完成' },
  { id: 1002, count: 22, label: '脑MRI', status: '上传中' },
  { id: 1003, count: 18, label: '皮肤镜', status: '待上传' }
]);
const progress = ref(36);
const showGuide = ref(false);
const showMeta = ref(false);
const showLog = ref(false);
const logs = ref([
  '10:01 校验批次 1001 完成',
  '10:05 批次 1002 开始上传',
  '10:07 成功上传 6/22',
  '10:09 网络加速已开启'
]);

const openPicker = () => {
  showGuide.value = true;
};

const startUpload = () => {
  progress.value = Math.min(100, progress.value + 10);
  logs.value.push(`模拟上传进度：${progress.value}%`);
};

const clearBatches = () => {
  batches.value = [];
  progress.value = 0;
};

const saveMeta = () => {
  logs.value.push(`记录元数据：设备 ${uploadForm.device || '未填'}, 备注 ${uploadForm.note || '无'}`);
  showMeta.value = false;
};
</script>

<style scoped>
.section-head {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.muted {
  color: #6b7280;
}

.drop-zone {
  border: 1px dashed #cbd5e1;
  padding: 1.25rem;
  border-radius: 12px;
  background: #f8fbff;
  text-align: center;
  color: #64748b;
}
</style>
