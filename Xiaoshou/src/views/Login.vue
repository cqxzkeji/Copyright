<template>
  <div class="login-wrapper">
    <div class="login-card card">
      <header>
        <h1>优特钢销售管理</h1>
        <p>请输入账号登录，体验自适应亮色界面</p>
      </header>
      <form class="form-grid" @submit.prevent="handleLogin">
        <label>
          <span>账号</span>
          <input v-model="form.username" class="input" placeholder="销售员 / 管理员" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" class="input" placeholder="••••••" />
        </label>
        <label>
          <span>验证码</span>
          <div class="code-row">
            <input v-model="form.code" class="input" placeholder="输入 9527" />
            <span class="badge">9527</span>
          </div>
        </label>
        <div class="flex-between" style="grid-column: 1 / -1;">
          <label class="remember">
            <input v-model="remember" type="checkbox" />记住我
          </label>
          <button class="btn" type="submit">立即登录</button>
        </div>
      </form>
    </div>

    <div v-if="showModal" class="overlay">
      <div class="modal">
        <header>
          <h3>欢迎回来</h3>
          <button class="btn secondary" @click="showModal = false">关闭</button>
        </header>
        <p>正在验证身份，请稍候…</p>
        <div class="progress-bar">
          <span :style="{ width: progress + '%' }"></span>
        </div>
        <footer>
          <button class="btn" @click="proceed">进入系统</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '', code: '' });
const remember = ref(true);
const showModal = ref(false);
const progress = ref(20);

onMounted(() => {
  const timer = setInterval(() => {
    progress.value = progress.value >= 90 ? 90 : progress.value + 10;
  }, 400);
  return () => clearInterval(timer);
});

const handleLogin = () => {
  if (!form.username || !form.password || form.code !== '9527') {
    alert('请完整填写信息并输入正确验证码。');
    return;
  }
  showModal.value = true;
};

const proceed = () => {
  progress.value = 100;
  setTimeout(() => {
    router.push('/');
  }, 300);
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
}

.login-card {
  width: min(640px, 96vw);
}

header h1 {
  margin: 0 0 6px;
}

header p {
  margin: 0;
  color: #4d6a8c;
}

label {
  display: grid;
  gap: 6px;
  color: #1f3b5a;
}

.code-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4d6a8c;
}
</style>
