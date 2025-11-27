<template>
  <div class="login-shell">
    <div class="light-card login-card">
      <div class="login-header">
        <div>
          <p class="badge">消防安全隐患智能检测与预警系统</p>
          <h1>安全运营中心</h1>
          <p>统一账户登陆以进入主界面。</p>
        </div>
        <img src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons-png/shield-lock.png" alt="login" />
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <label class="form-row">
          <span>用户名</span>
          <input v-model="form.username" placeholder="ops_admin" required />
        </label>
        <label class="form-row">
          <span>密码</span>
          <input type="password" v-model="form.password" placeholder="••••••" required />
        </label>
        <div class="login-actions">
          <button type="button" class="secondary-btn" @click="showHint">显示提示</button>
          <button type="submit" class="primary-btn">登录</button>
        </div>
      </form>
    </div>

    <div v-if="hint" class="modal-backdrop" @click.self="hint = false">
      <div class="modal">
        <h3>登录提示</h3>
        <p>使用任意账户即可体验，登陆后将跳转到功能主界面。</p>
        <footer>
          <button class="primary-btn" @click="hint = false">知道了</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const hint = ref(false);

const showHint = () => {
  hint.value = true;
};

const handleLogin = () => {
  router.push({ name: 'dashboard', query: { user: form.username || '访客' } });
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 16px;
  background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08), transparent 35%),
    radial-gradient(circle at 80% 10%, rgba(16, 185, 129, 0.12), transparent 30%),
    #f8fafc;
}

.login-card {
  width: min(900px, 100%);
  padding: 30px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
}

.login-header img {
  width: 160px;
  opacity: 0.85;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

@media (max-width: 720px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .login-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
