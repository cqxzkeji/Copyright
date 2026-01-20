<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>大数据实时流计算与可视化分析软件</h1>
        <p>统一接入、实时计算、智能可视化与监控告警</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          数据中心
          <select v-model="form.region" required>
            <option value="华北">华北实时中心</option>
            <option value="华东">华东计算中心</option>
            <option value="华南">华南容灾中心</option>
          </select>
        </label>
        <div class="form-actions">
          <button class="primary" type="submit">登陆并进入系统</button>
          <button class="ghost" type="button" @click="openReset">重置输入</button>
        </div>
      </form>
      <div class="login-footer">
        <span>登录即代表你已授权数据接入与运行监控能力。</span>
      </div>
    </div>
  </div>

  <Modal v-model="showProgress" title="登录验证中">
    <p>正在验证账号并初始化实时流环境，请稍候。</p>
    <div class="progress-space">
      <ProgressBar :progress="progress" />
    </div>
  </Modal>

  <Modal v-model="showReset" title="确认重置">
    <p>将清空当前输入的账号和密码。</p>
    <template #footer>
      <button class="ghost" type="button" @click="showReset = false">取消</button>
      <button class="primary" type="button" @click="confirmReset">确认重置</button>
    </template>
  </Modal>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';
import ProgressBar from '../components/ProgressBar.vue';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
  region: '华北'
});

const showProgress = ref(false);
const showReset = ref(false);
const progress = ref(0);
let timer;

const handleLogin = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 15;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
      router.push('/app/ingest');
    }
  }, 220);
};

const openReset = () => {
  showReset.value = true;
};

const confirmReset = () => {
  form.username = '';
  form.password = '';
  form.region = '华北';
  showReset.value = false;
};

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: radial-gradient(circle at top, #dbeafe, #f8fafc 60%);
}

.login-card {
  width: min(520px, 100%);
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #0f172a;
}

.login-header p {
  margin: 0 0 24px;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-form label {
  display: grid;
  gap: 8px;
  font-weight: 600;
  color: #1f2937;
}

.login-form input,
.login-form select {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 10px 12px;
  font-size: 14px;
  background: #f8fafc;
}

.form-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary {
  border: none;
  background: #2563eb;
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  border: 1px solid #cbd5f5;
  background: #ffffff;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #1d4ed8;
}

.login-footer {
  margin-top: 20px;
  color: #94a3b8;
  font-size: 13px;
}

.progress-space {
  margin-top: 16px;
}
</style>
