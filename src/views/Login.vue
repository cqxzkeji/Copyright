<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="badge">数字化作品共享</div>
      <h1>欢迎登录</h1>
      <p class="subtitle">登录后即可进入主界面，开启作品展示与协作。</p>
      <form class="grid" style="gap: 10px;" @submit.prevent="goHome">
        <div class="form-field">
          <label>账号</label>
          <input v-model="form.account" placeholder="请输入账号" required />
        </div>
        <div class="form-field">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <button type="submit">登录系统</button>
      </form>
      <div class="chip-row" style="margin-top: 14px;">
        <span class="tag">支持 SSO</span>
        <span class="tag">双因素校验</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ account: '', password: '' });

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 20% 20%, rgba(31, 142, 250, 0.08), transparent 35%),
    radial-gradient(circle at 80% 0%, rgba(245, 165, 36, 0.08), transparent 30%),
    var(--bg);
  padding: 24px;
}

.login-card {
  width: min(520px, 100%);
}

.subtitle {
  color: var(--muted);
  margin-top: -6px;
}
</style>
