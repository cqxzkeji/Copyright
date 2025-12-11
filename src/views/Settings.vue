<template>
  <main class="page">
    <header class="card header">
      <div>
        <h2>系统设置</h2>
        <p>配置录制参数、数字人声音、账号与安全选项</p>
      </div>
      <div class="actions">
        <button @click="openModal('save')">保存设置</button>
        <button class="ghost" @click="openModal('backup')">备份配置</button>
        <button class="ghost" @click="openModal('tip')">提示</button>
      </div>
    </header>

    <div class="card grid two-cols">
      <section>
        <h3>录制参数</h3>
        <div class="form">
          <label>分辨率<select v-model="settings.resolution"><option>1080p</option><option>720p</option><option>4K</option></select></label>
          <label>码率<input v-model="settings.bitrate" type="number" /> Mbps</label>
          <label>自动降噪<select v-model="settings.noise"><option>开启</option><option>关闭</option></select></label>
        </div>
      </section>
      <section>
        <h3>数字人声音</h3>
        <div class="form">
          <label>音色<select v-model="settings.voice"><option>温暖女声</option><option>沉稳男声</option><option>活力童声</option></select></label>
          <label>语速<input v-model="settings.speed" type="range" min="0.5" max="1.5" step="0.1" /></label>
          <label>提示音量<input v-model="settings.volume" type="range" min="0" max="100" /></label>
        </div>
      </section>
    </div>

    <div class="card grid two-cols">
      <section>
        <h3>账号与安全</h3>
        <div class="form">
          <label>通知邮箱<input v-model="settings.email" placeholder="notify@school.edu" /></label>
          <label>二次验证<select v-model="settings.mfa"><option>开启</option><option>关闭</option></select></label>
          <label>访问日志<select v-model="settings.audit"><option>保存 30 天</option><option>保存 90 天</option><option>长期保存</option></select></label>
        </div>
      </section>
      <section>
        <h3>存储与加速</h3>
        <div class="form">
          <label>云端同步<select v-model="settings.cloud"><option>自动</option><option>手动</option></select></label>
          <label>CDN 加速<select v-model="settings.cdn"><option>国内节点</option><option>全球节点</option></select></label>
          <label>备份周期<select v-model="settings.backup"><option>每日</option><option>每周</option><option>每月</option></select></label>
        </div>
      </section>
    </div>

    <Modal v-if="saveModal" title="保存设置" @close="reset" @confirm="confirmSave">
      <p>确认保存所有配置到当前工作区？</p>
    </Modal>

    <Modal v-if="backupModal" title="备份配置" @close="reset" @confirm="confirmBackup">
      <p>正在打包配置文件，上传到云端。</p>
      <div class="progress info"><span style="width: 35%"></span></div>
    </Modal>

    <Modal v-if="tipModal" title="设置提示" @close="reset" :showActions="false">
      <p>所有按钮均弹出 modal，滑块改变语速和音量，表单字段可即时修改。</p>
      <div class="progress info"><span style="width: 60%"></span></div>
      <p>配置完成度 60%，点击保存即可生效。</p>
    </Modal>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const settings = reactive({
  resolution: '1080p',
  bitrate: 8,
  noise: '开启',
  voice: '温暖女声',
  speed: 1,
  volume: 70,
  email: 'notify@school.edu',
  mfa: '开启',
  audit: '保存 30 天',
  cloud: '自动',
  cdn: '国内节点',
  backup: '每日'
});

const saveModal = ref(false);
const backupModal = ref(false);
const tipModal = ref(false);

const openModal = (type) => {
  saveModal.value = type === 'save';
  backupModal.value = type === 'backup';
  tipModal.value = type === 'tip';
};

const reset = () => {
  saveModal.value = false;
  backupModal.value = false;
  tipModal.value = false;
};

const confirmSave = () => {
  alert('设置已保存');
  reset();
};

const confirmBackup = () => {
  alert('备份完成');
  reset();
};
</script>

<style scoped>
.page {
  padding: 24px;
  display: grid;
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

button.ghost {
  background: #fff;
  color: #2563eb;
}

.grid.two-cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.form {
  display: grid;
  gap: 10px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

input[type='range'] {
  accent-color: #2563eb;
}

.progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
}

.progress.info {
  margin-top: 10px;
}
</style>
