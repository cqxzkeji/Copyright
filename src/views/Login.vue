<template>
  <div class="login-wrapper">
    <div class="login-card card">
      <h1>畜禽饲料配比优化与营养分析系统</h1>
      <p class="sub">请登录以进入主界面</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <label>账号</label>
        <input v-model="form.username" type="text" placeholder="输入账号" required />
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="输入密码" required />
        <div class="actions">
          <button type="submit">登录</button>
          <button class="ghost" type="button" @click="showHint = true">忘记密码</button>
        </div>
      </form>
    </div>
    <ModalDialog v-model="showHint" title="联系管理员" subtitle="密码重置流程">
      <p>请联系饲料实验室管理员重置密码，或使用备用账户登录。</p>
    </ModalDialog>
    <ModalDialog v-model="showError" title="登录失败">
      <p>账号或密码不能为空，请重新输入。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const form = reactive({ username: '', password: '' });
const router = useRouter();
const showHint = ref(false);
const showError = ref(false);

const handleLogin = () => {
  if (!form.username || !form.password) {
    showError.value = true;
    return;
  }
  localStorage.setItem('lfos-auth', 'true');
  router.push('/feed-formula');
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
}

.login-card {
  width: min(520px, 100%);
  text-align: center;
  border-radius: 16px;
  border: 1px solid var(--border);
}

h1 {
  margin: 0 0 8px;
}

.sub {
  margin: 0 0 20px;
  color: var(--muted);
}

.login-form {
  display: grid;
  gap: 10px;
  text-align: left;
}

.login-form input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #f8fafc;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}
</style>
