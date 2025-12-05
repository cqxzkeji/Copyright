<template>
  <div class="login-wrapper">
    <div class="login-card card">
      <h2>机器学习训练与优化平台</h2>
      <p class="muted">请输入账户信息以进入主界面。</p>
      <form class="form-grid" @submit.prevent="handleLogin">
        <label>
          <span>用户名</span>
          <input v-model="form.username" required placeholder="例如：ml-admin" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" required placeholder="不少于6位" />
        </label>
        <label>
          <span>工作区</span>
          <select v-model="form.workspace">
            <option>默认工作区</option>
            <option>实验室A</option>
            <option>实验室B</option>
          </select>
        </label>
      </form>
      <div class="actions">
        <button class="btn" @click="handleLogin">登录</button>
        <button class="btn secondary" @click="showHint = true">查看登录提示</button>
      </div>
    </div>
    <BaseModal v-if="showHint" title="登录提示" @close="showHint = false">
      <p>使用任意用户名和密码即可体验平台功能，本示例不会校验真实账户。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const route = useRoute();
const form = reactive({ username: '', password: '', workspace: '默认工作区' });
const showHint = ref(false);

const handleLogin = () => {
  sessionStorage.setItem('ml-auth', `${form.username}-${Date.now()}`);
  const target = route.query.redirect || '/';
  router.replace(String(target));
};
</script>

<style scoped>
.login-wrapper {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(120deg, #eef2ff, #f7f9fb);
}

.login-card {
  width: min(480px, 100%);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.muted {
  color: #64748b;
  margin-top: -4px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

input,
select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
</style>
