<template>
  <div class="login-page">
    <div class="panel">
      <h1>平台登陆</h1>
      <p class="hint">请输入账户信息以进入主界面</p>
      <form class="form" @submit.prevent="submit">
        <label>
          账号
          <input v-model="username" placeholder="admin" required />
        </label>
        <label>
          密码
          <input v-model="password" placeholder="••••••" type="password" required />
        </label>
        <button type="submit" class="primary">登陆</button>
      </form>
      <button class="secondary" @click="showTips = true">操作提示</button>
    </div>

    <BaseModal v-if="showTips" title="登陆提示" @close="showTips = false">
      <p>演示账号无需校验，随意输入即可进入主界面。</p>
      <div class="modal-actions">
        <button class="primary" @click="showTips = false">好的</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from './components/BaseModal.vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const showTips = ref(false);

const submit = () => {
  router.push('/');
};
</script>

<style scoped>
.login-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #e0ecff, #f7f9ff 35%),
    radial-gradient(circle at 80% 10%, #e1f4ff, #f7f9ff 32%);
  padding: 20px;
}

.panel {
  width: min(420px, 92vw);
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 18px 48px rgba(59, 130, 246, 0.15);
}

.hint {
  color: #6b7280;
  margin-top: 6px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
  color: #374151;
}

input {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  border: none;
  color: white;
  padding: 12px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
}

.secondary {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
}

.modal-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
