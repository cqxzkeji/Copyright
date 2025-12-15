<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="flex-between">
        <div>
          <h2>平台登录</h2>
          <p class="muted">统一登录验证后加载各功能模块</p>
        </div>
        <button class="ghost" @click="showHint = true">查看登录规则</button>
      </div>
      <form class="grid" style="gap: 12px;" @submit.prevent="handleLogin">
        <div>
          <label>账户</label>
          <input v-model="form.user" placeholder="输入用户名" required />
        </div>
        <div>
          <label>密码</label>
          <input type="password" v-model="form.pass" placeholder="输入密码" required />
        </div>
        <div class="flex-between" style="gap: 12px;">
          <label class="muted">登录后自动跳转到总览</label>
          <button type="submit">登录</button>
        </div>
      </form>
    </div>

    <div v-if="showHint" class="modal-overlay" @click.self="showHint = false">
      <div class="modal">
        <div class="modal-header">
          <h3>登录提示</h3>
          <button class="ghost" @click="showHint = false">关闭</button>
        </div>
        <p>使用任意账户密码即可体验，系统会创建演示会话并跳转到主界面。</p>
        <div class="modal-actions">
          <button class="ghost" @click="showHint = false">我知道了</button>
        </div>
      </div>
    </div>

    <div v-if="showResult" class="modal-overlay" @click.self="showResult = false">
      <div class="modal">
        <div class="modal-header">
          <h3>登录成功</h3>
          <button class="ghost" @click="showResult = false">关闭</button>
        </div>
        <p>欢迎 {{ form.user }}，正在载入功能模块…</p>
        <div class="progress">
          <div class="progress-bar" style="width: 100%; background: var(--primary);"></div>
        </div>
        <div class="modal-actions">
          <button @click="redirect">立即进入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ user: 'admin', pass: '123456' });
const showHint = ref(false);
const showResult = ref(false);

const handleLogin = () => {
  localStorage.setItem('msdfp-authed', '1');
  localStorage.setItem('msdfp-user', form.user);
  showResult.value = true;
};

const redirect = () => {
  showResult.value = false;
  router.push('/dashboard');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, #eef2ff, transparent 40%), var(--bg);
  padding: 20px;
}

.login-card {
  width: min(480px, 95vw);
}

.muted { color: var(--muted); }

label { display: block; margin-bottom: 6px; color: var(--muted); }
</style>
