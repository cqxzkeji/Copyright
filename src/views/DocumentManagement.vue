<template>
  <div class="panel">
    <div class="flex space-between" style="margin-bottom: 12px">
      <div>
        <h2 style="margin: 0">文档与报告管理</h2>
        <p class="page-sub">集中存储验收资料、报告模板与整改回执</p>
      </div>
      <div class="flex" style="gap: 10px">
        <button @click="generateReport">生成周报</button>
        <button class="secondary" @click="triggerUpload">上传资料</button>
        <input ref="fileInput" type="file" accept="application/pdf,image/*" style="display: none" @change="handleUpload" />
      </div>
    </div>

    <div class="card-grid">
      <div v-for="doc in documents" :key="doc.id" class="panel">
        <div class="flex space-between">
          <div>
            <p style="margin: 0; font-weight: 700">{{ doc.name }}</p>
            <p class="page-sub">类型：{{ doc.type }} ｜ 版本：{{ doc.version }}</p>
          </div>
          <span class="badge tag-blue">{{ doc.size }}</span>
        </div>
        <p class="page-sub">更新时间：{{ doc.updated }}</p>
        <div class="flex" style="gap: 8px">
          <button @click="openModal(`预览：${doc.name}`)">预览</button>
          <button class="secondary" @click="share(doc)">共享</button>
        </div>
      </div>
    </div>

    <ModalDialog
      v-model="showModal"
      :title="modalTitle"
      :message="modalMessage"
      :progress="progress"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const documents = reactive([
  { id: 1, name: 'B3 泵房防水验收记录', type: '验收表单', version: 'V1.2', size: '1.4MB', updated: '2024-05-18' },
  { id: 2, name: '裙楼大堂石材复检报告', type: '监理报告', version: 'V0.9', size: '2.1MB', updated: '2024-05-17' },
  { id: 3, name: '地下车库照明整改照片', type: '影像资料', version: 'V1.0', size: '18张', updated: '2024-05-16' },
]);

const fileInput = ref(null);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const progress = ref(null);

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  documents.unshift({
    id: Date.now(),
    name: file.name,
    type: '新上传',
    version: 'V1.0',
    size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    updated: new Date().toISOString().slice(0, 10),
  });
  openModal('上传完成');
};

const openModal = (title, withProgress = false) => {
  modalTitle.value = title;
  modalMessage.value = '已同步至团队共享盘。';
  progress.value = withProgress ? 0 : null;
  showModal.value = true;
  if (withProgress) {
    const timer = setInterval(() => {
      progress.value += 20;
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 220);
  }
};

const share = (doc) => {
  openModal(`已共享：${doc.name}`);
};

const generateReport = () => {
  modalTitle.value = '生成周报';
  modalMessage.value = '汇总项目进展、缺陷闭环与照片附件...';
  progress.value = 0;
  showModal.value = true;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      clearInterval(timer);
      modalMessage.value = '周报已生成并推送给相关负责人。';
    }
  }, 220);
};
</script>
