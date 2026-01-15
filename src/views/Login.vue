<template>
  <div class="login-page">
    <div class="login-card">
      <h1>广告设计生产与发布管理平台</h1>
      <p class="subtitle">统一创意、生产、投放、分析与系统管理</p>
      <form class="login-form" @submit.prevent="openLoginModal">
        <label>
          账号
          <input v-model="form.account" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          登录方式
          <select v-model="form.method">
            <option value="password">密码登录</option>
            <option value="otp">短信验证码</option>
            <option value="sso">企业 SSO</option>
          </select>
        </label>
        <button class="primary" type="submit">登录并进入系统</button>
        <button class="ghost" type="button" @click="openTipModal">查看登录提示</button>
      </form>
    </div>

    <Modal v-if="showLogin" title="登录校验中" @close="showLogin = false">
      <p>正在核验账号信息并加载主界面。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: loginProgress + '%' }"></div>
      </div>
      <p>当前进度：{{ loginProgress }}%</p>
      <template #footer>
        <button class="ghost" type="button" @click="showLogin = false">取消</button>
        <button class="primary" type="button" @click="finishLogin">进入系统</button>
      </template>
    </Modal>

    <Modal v-if="showTip" title="登录提示" @close="showTip = false">
      <ul>
        <li>支持密码、短信验证码、企业单点登录。</li>
        <li>首次登录默认进入创意与设计模块。</li>
        <li>若忘记密码，请联系管理员重置。</li>
      </ul>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';

const router = useRouter();
const form = ref({
  account: '',
  password: '',
  method: 'password'
});
const showLogin = ref(false);
const showTip = ref(false);
const loginProgress = ref(65);

const openLoginModal = () => {
  loginProgress.value = 65;
  showLogin.value = true;
};

const openTipModal = () => {
  showTip.value = true;
};

const finishLogin = () => {
  showLogin.value = false;
  router.push('/main/creative');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff, #f8fafc);
  padding: 24px;
}

.login-card {
  width: min(420px, 90vw);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

h1 {
  margin: 0 0 8px;
  font-size: 22px;
}

.subtitle {
  margin: 0 0 20px;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #334155;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.primary {
  background: #2563eb;
  border: none;
  color: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  border: 1px dashed #94a3b8;
  background: #fff;
  color: #475569;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}
</style>
