<template>
  <div class="login-shell">
    <div class="login-card card">
      <div class="badge">跨时空多模态学生心理数据分析</div>
      <h1 style="margin: 8px 0 4px;">欢迎登录</h1>
      <p style="color: #6b7280;">请输入凭证以加载主界面所有功能模块。</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="学号 / 工号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <div class="button-group" style="margin-top: 4px;">
          <button class="btn" type="submit">登录</button>
          <button class="btn ghost" type="button" @click="showHint = true">安全提示</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showHint" class="modal-overlay" @click.self="showHint = false">
    <div class="modal">
      <h3>安全提示</h3>
      <p>请确认已获得授权后再登录，登录成功会直接跳转至数据分析仪表板。</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn" @click="showHint = false">好的</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ account: '', password: '' });
const showHint = ref(false);

const handleLogin = () => {
  if (form.account && form.password) {
    router.push('/dashboard');
  }
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eef2ff, #d9f2ff);
  padding: 24px;
}

.login-card {
  width: min(520px, 100%);
}

.login-form {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.login-form input {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
}
</style>
