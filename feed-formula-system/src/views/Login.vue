<template>
  <div class="login-wrapper">
    <div class="login-panel card">
      <div class="login-hero">
        <h1>共生人工鱼群饲料配方优化</h1>
        <p>登陆后管理原料、约束、算法优化、方案评估及结果发布。</p>
        <div class="chip-list">
          <span class="chip">营养平衡</span>
          <span class="chip">成本敏感</span>
          <span class="chip">算法求解</span>
          <span class="chip">报表导出</span>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          用户名
          <input v-model="form.username" placeholder="输入用户名" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </label>
        <div class="login-actions">
          <label class="remember">
            <input v-model="form.remember" type="checkbox" /> 记住登录状态
          </label>
          <button class="btn" type="submit">登录系统</button>
          <button class="btn secondary" type="button" @click="openHelper">快速体验</button>
        </div>
      </form>
    </div>

    <div v-if="modal.open" class="modal-mask">
      <div class="modal-card">
        <h3>{{ modal.title }}</h3>
        <p style="margin: 0.5rem 0 1rem">{{ modal.message }}</p>
        <div v-if="modal.type === 'helper'" class="alert-info">
          已为您填充示例账号，提交后自动进入主界面。
        </div>
        <div class="modal-actions">
          <button class="secondary" @click="modal.open = false">取消</button>
          <button @click="confirmModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '', remember: true });
const modal = reactive({ open: false, title: '', message: '', type: '' });

const openHelper = () => {
  modal.open = true;
  modal.title = '快速体验';
  modal.message = '将自动填入体验账号，确认即可预览全部功能模块。';
  modal.type = 'helper';
};

const handleLogin = () => {
  modal.open = true;
  modal.title = '登录校验';
  modal.message = form.username && form.password
    ? '信息校验通过，点击确定进入系统。'
    : '请填写用户名和密码以继续。';
  modal.type = 'login';
};

const confirmModal = () => {
  if (modal.type === 'helper') {
    form.username = 'demo_admin';
    form.password = 'feed1234';
    modal.open = false;
  } else if (form.username && form.password) {
    modal.open = false;
    router.push('/main');
  } else {
    modal.open = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 1.5rem;
  background: radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.08), transparent 25%),
    radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.12), transparent 25%),
    linear-gradient(180deg, #eef2ff 0%, #f8fbff 55%, #f0f9ff 100%);
}

.login-panel {
  width: min(840px, 100%);
  display: grid;
  gap: 1.25rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.login-hero h1 {
  margin: 0;
  color: #1d4ed8;
}

.login-hero p {
  margin: 0.35rem 0 0;
  color: #334155;
}

.login-form {
  display: grid;
  gap: 0.75rem;
}

label {
  display: grid;
  gap: 0.35rem;
  color: #0f172a;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.login-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.remember {
  font-weight: 500;
}
</style>
