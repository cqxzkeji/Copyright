<template>
  <div class="certification">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>证书管理</h2>
          <p>统一管理绿色、有机、地理标志等证书</p>
        </div>
        <button class="primary" @click="openCertification">新增证书</button>
      </div>
      <ul class="certificate-list">
        <li v-for="item in certificates" :key="item.id">
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.type }} · 有效期至 {{ item.validTo }}</p>
          </div>
          <button class="ghost" @click="reviewCertificate(item)">年审</button>
        </li>
      </ul>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>合规事项</h2>
          <p>查看即将到期的检测与认证提醒</p>
        </div>
        <button class="secondary" @click="uploadMaterial">上传材料</button>
      </div>
      <div class="remind-list">
        <div class="remind-card" v-for="item in reminders" :key="item.title">
          <h3>{{ item.title }}</h3>
          <p>{{ item.detail }}</p>
          <small>{{ item.time }}</small>
        </div>
      </div>
    </section>

    <ModalDialog
      :show="showCertification"
      title="新增认证"
      confirm-text="保存证书"
      @close="showCertification = false"
      @confirm="saveCertification"
    >
      <div class="form-grid">
        <label>证书名称<input v-model="form.name" /></label>
        <label>类型<input v-model="form.type" /></label>
        <label>有效期<input v-model="form.validTo" /></label>
      </div>
    </ModalDialog>

    <ModalDialog
      :show="!!activeCertificate"
      title="年审安排"
      confirm-text="确认安排"
      @close="activeCertificate = null"
      @confirm="activeCertificate = null"
    >
      <p>{{ activeCertificate?.name }} 将在 {{ activeCertificate?.validTo }} 到期。</p>
      <p>请在 30 天内完成资料更新，系统会推送提醒。</p>
    </ModalDialog>

    <ModalDialog
      :show="showUpload"
      title="材料上传中"
      confirm-text="后台上传"
      @close="showUpload = false"
      @confirm="showUpload = false"
    >
      <p>正在上传现场检测照片，当前进度 {{ uploadProgress }}%。</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: uploadProgress + '%' }"></div>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const certificates = ref([
  { id: 1, name: 'AA 级绿色食品证书', type: '绿色食品', validTo: '2024-12-31' },
  { id: 2, name: '有机认证证书', type: '有机', validTo: '2025-03-15' }
]);

const reminders = [
  { title: '农残检测', detail: '批次 HN2024030101 需上传复检报告', time: '剩余 5 天' },
  { title: '有机认证监督审核', detail: '提交生产记录与投入品台账', time: '剩余 12 天' }
];

const showCertification = ref(false);
const showUpload = ref(false);
const form = reactive({ name: '', type: '', validTo: '' });
const activeCertificate = ref(null);
const uploadProgress = ref(20);

const openCertification = () => {
  showCertification.value = true;
};

const saveCertification = () => {
  if (!form.name) return;
  certificates.value.push({ id: Date.now(), name: form.name, type: form.type, validTo: form.validTo });
  showCertification.value = false;
  form.name = '';
  form.type = '';
  form.validTo = '';
};

const reviewCertificate = (cert) => {
  activeCertificate.value = cert;
};

const uploadMaterial = () => {
  showUpload.value = true;
  uploadProgress.value = 20;
  const timer = setInterval(() => {
    if (uploadProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    uploadProgress.value += 20;
  }, 400);
};
</script>

<style scoped>
.certification {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
}

.panel {
  flex: 1 1 45%;
  background: #f8fafc;
  border-radius: 20px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.certificate-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.certificate-list li {
  background: #fff;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remind-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.remind-card {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
}

.primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.secondary {
  background: #0ea5e9;
  color: #fff;
}

.ghost {
  background: #ecfccb;
  color: #4d7c0f;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
}

.progress-inner {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
}

@media (max-width: 1024px) {
  .panel {
    flex: 1 1 100%;
  }
}
</style>
