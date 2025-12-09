<template>
  <div class="login-shell">
    <div class="login-card card">
      <div class="header">
        <h1>膨润土磷吸附修复与资源化管理系统</h1>
        <p>请登录以管理各模块数据</p>
      </div>
      <form class="form" @submit.prevent="handleLogin">
        <label>
          <span>用户名</span>
          <input v-model="form.username" type="text" required placeholder="输入用户名" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" required placeholder="输入密码" />
        </label>
        <div class="actions">
          <button class="btn primary" type="submit">登录</button>
          <button class="btn" type="button" @click="openTip">登录说明</button>
        </div>
      </form>
    </div>

    <div v-if="showTip" class="modal-backdrop" @click.self="showTip = false">
      <div class="modal">
        <header>
          <span>登录提示</span>
          <button class="btn" @click="showTip = false">关闭</button>
        </header>
        <p>默认使用 demo / 123456 登录，登录后可在系统设置中修改密码策略。</p>
        <footer>
          <button class="btn primary" @click="showTip = false">我知道了</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: 'demo', password: '123456' });
const showTip = ref(false);

const handleLogin = () => {
  if (form.username && form.password) {
    localStorage.setItem('bentonite-auth', 'true');
    router.push('/main');
  }
};

const openTip = () => {
  showTip.value = true;
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}

.login-card {
  width: min(420px, 90vw);
  text-align: center;
}

.header h1 {
  margin: 0 0 8px;
}

.header p {
  margin: 0 0 24px;
  color: #6b7280;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 15px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
