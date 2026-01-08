<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-visual">
        <img :src="heroImage" alt="系统封面" />
        <div class="login-caption">
          <h2>优特钢标准动态制定与销售精准匹配系统</h2>
          <p>支撑标准演进、需求采集、智能匹配与订单执行的一体化平台</p>
        </div>
      </div>
      <div class="login-form">
        <h3>用户登陆</h3>
        <label class="field">
          <span>账号</span>
          <input v-model="form.account" class="input" placeholder="请输入账号" />
        </label>
        <label class="field">
          <span>密码</span>
          <input v-model="form.password" class="input" type="password" placeholder="请输入密码" />
        </label>
        <label class="field">
          <span>所属部门</span>
          <select v-model="form.department" class="input">
            <option>标准技术中心</option>
            <option>销售管理部</option>
            <option>生产协调部</option>
            <option>数据分析室</option>
          </select>
        </label>
        <button class="action-btn" @click="showLoginModal = true">登陆系统</button>
        <div class="tips">
          <span>演示账号：steel-admin</span>
          <span>登录即表示已阅读安全协议</span>
        </div>
      </div>
    </div>

    <AppModal v-model="showLoginModal" title="登陆校验" @confirm="handleLogin">
      <div class="modal-content">
        <p>系统将根据以下信息完成登陆验证：</p>
        <ul>
          <li>账号：{{ form.account || '未填写' }}</li>
          <li>部门：{{ form.department }}</li>
          <li>权限：标准管理 + 智能报价</li>
        </ul>
        <div class="progress-bar">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <p class="status">正在校验权限（{{ progress }}%）...</p>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppModal from '../components/AppModal.vue';

const router = useRouter();
const showLoginModal = ref(false);
const progress = ref(0);
const form = ref({
  account: 'steel-admin',
  password: '123456',
  department: '标准技术中心'
});

const heroImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><defs><linearGradient id="a" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="%23d8e6ff"/><stop offset="1" stop-color="%23f9fbff"/></linearGradient></defs><rect width="600" height="360" fill="url(%23a)"/><circle cx="120" cy="90" r="48" fill="%23b7ccff"/><circle cx="500" cy="80" r="36" fill="%23dbe6ff"/><rect x="90" y="150" width="420" height="150" rx="20" fill="%23ffffff"/><path d="M150 190h300" stroke="%235d8bff" stroke-width="10" stroke-linecap="round"/><path d="M150 230h220" stroke="%239fb7ff" stroke-width="10" stroke-linecap="round"/><path d="M150 270h180" stroke="%239fb7ff" stroke-width="10" stroke-linecap="round"/></svg>';

watch(showLoginModal, (visible) => {
  if (visible) {
    progress.value = 20;
    const timer = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(timer);
      } else {
        progress.value += 20;
      }
    }, 260);
  }
});

const handleLogin = () => {
  showLoginModal.value = false;
  router.push('/main/standard');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.login-card {
  display: grid;
  grid-template-columns: minmax(280px, 1.1fr) minmax(260px, 0.9fr);
  gap: 28px;
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 30px 60px rgba(15, 27, 55, 0.12);
  max-width: 980px;
  width: 100%;
}

.login-visual img {
  width: 100%;
  border-radius: 18px;
}

.login-caption {
  margin-top: 16px;
}

.login-caption h2 {
  margin: 0 0 6px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #4d5b7c;
}

.tips {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #6b7a99;
}

.modal-content ul {
  padding-left: 18px;
  margin: 10px 0 18px;
}

.status {
  margin-top: 8px;
  color: #5d8bff;
}

@media (max-width: 860px) {
  .login-card {
    grid-template-columns: 1fr;
  }
}
</style>
