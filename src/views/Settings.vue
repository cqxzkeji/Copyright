<template>
  <div class="page">
    <header class="page-header">
      <div>
        <p class="eyebrow">系统设置</p>
        <h2>参数与偏好</h2>
      </div>
      <div class="btns">
        <button class="primary" @click="showSave = true">保存设置</button>
        <button @click="showReset = true">恢复默认</button>
        <button @click="showAbout = true">关于系统</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <h3>调度参数</h3>
        <label>最大并发<input v-model.number="config.concurrent" type="number" /></label>
        <label>失败重试<input v-model.number="config.retry" type="number" /></label>
      </div>
      <div class="card">
        <h3>安全策略</h3>
        <label>双因素认证<select v-model="config.mfa"><option>开启</option><option>关闭</option></select></label>
        <label>密码有效期<select v-model="config.password"><option>90 天</option><option>180 天</option><option>360 天</option></select></label>
      </div>
      <div class="card">
        <h3>通知偏好</h3>
        <label>邮件推送<select v-model="config.email"><option>开启</option><option>关闭</option></select></label>
        <label>短信推送<select v-model="config.sms"><option>开启</option><option>关闭</option></select></label>
      </div>
    </section>

    <BaseModal v-if="showSave" title="保存设置" @close="showSave = false">
      <p>确认将当前配置保存为平台默认？</p>
      <div class="modal-actions">
        <button class="primary" @click="showSave = false">保存</button>
        <button @click="showSave = false">取消</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showReset" title="恢复默认" @close="showReset = false">
      <p>将还原所有参数为出厂默认值。</p>
      <div class="modal-actions">
        <button class="primary" @click="showReset = false">确认</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showAbout" title="关于系统" @close="showAbout = false">
      <p>云计算资源调度与性能监控平台，提供统一调度、监控、告警与配置能力。</p>
      <div class="modal-actions">
        <button class="primary" @click="showAbout = false">关闭</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from './components/BaseModal.vue';

const config = reactive({
  concurrent: 5,
  retry: 3,
  mfa: '开启',
  password: '180 天',
  email: '开启',
  sms: '关闭'
});

const showSave = ref(false);
const showReset = ref(false);
const showAbout = ref(false);
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 18px 20px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.08);
}

.btns button {
  margin-left: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
}

.eyebrow {
  color: #6b7280;
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #374151;
}

input,
select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.modal-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
