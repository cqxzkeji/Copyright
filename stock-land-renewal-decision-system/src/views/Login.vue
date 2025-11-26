<template>
  <div class="login-shell">
    <div class="login-card card">
      <div class="hero">
        <div>
          <p class="eyebrow">存量用地决策支持系统</p>
          <h1>欢迎登录</h1>
          <p class="muted">统一入口，快速进入评估与更新主界面</p>
        </div>
        <div class="sparkles">✨</div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" required placeholder="输入用户名" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" required placeholder="输入密码" />
        </label>
        <div class="meta-row">
          <label class="remember">
            <input v-model="form.remember" type="checkbox" />
            记住账号
          </label>
          <a class="muted" href="#" @click.prevent="showHint = true">忘记密码？</a>
        </div>
        <button class="action-btn" type="submit">进入系统</button>
      </form>
    </div>

    <div v-if="showHint" class="modal-mask" @click.self="showHint = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>温馨提示</h3>
          <button class="action-btn secondary" @click="showHint = false">关闭</button>
        </div>
        <p>请联系系统管理员重置密码或使用统一认证入口。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: 'planner', password: '123456', remember: true });
const showHint = ref(false);

const handleLogin = () => {
  router.push('/main');
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(circle at 10% 20%, rgba(94, 164, 255, 0.15), transparent 30%),
    radial-gradient(circle at 90% 30%, rgba(255, 179, 71, 0.15), transparent 25%),
    #f2f6ff;
}

.login-card {
  width: min(960px, 100%);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: center;
}

.hero {
  background: linear-gradient(145deg, #2e8bff, #7bc5ff);
  color: #fff;
  padding: 24px;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
}

.sparkles {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 32px;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1.5px;
  opacity: 0.8;
}

.muted {
  color: #5c6d82;
}

.login-form {
  display: grid;
  gap: 12px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  font-weight: 700;
  color: #334155;
}

.login-form input {
  margin-top: 6px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
}

@media (max-width: 900px) {
  .login-card {
    grid-template-columns: 1fr;
  }
}
</style>
