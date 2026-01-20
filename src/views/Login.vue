<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>多维度企业信息整合采集平台</h1>
        <p>请登录后进入管理控制台</p>
      </div>
      <form class="login-form" @submit.prevent="openLoginModal">
        <label>
          企业账号
          <input v-model="form.account" class="input" placeholder="请输入企业账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" class="input" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          验证方式
          <select v-model="form.auth">
            <option value="sms">短信验证码</option>
            <option value="token">动态令牌</option>
            <option value="email">邮箱验证</option>
          </select>
        </label>
        <button type="submit" class="primary">登录并进入</button>
      </form>
    </div>

    <div v-if="showModal" class="modal-mask">
      <div class="modal">
        <div class="modal-header">
          <strong>登录提示</strong>
          <button class="secondary" @click="showModal = false">关闭</button>
        </div>
        <div class="modal-body">
          <p>账号 {{ form.account }} 已完成身份核验，请进入主界面。</p>
          <div class="progress">
            <span :style="{ width: '100%' }"></span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="primary" @click="goMain">进入平台</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  account: '华东数据中心',
  password: '123456',
  auth: 'sms'
});
const showModal = ref(false);

const openLoginModal = () => {
  showModal.value = true;
};

const goMain = () => {
  showModal.value = false;
  router.push('/main');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 45%, #f1f5f9 100%);
}

.login-card {
  width: min(420px, 92vw);
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
}

.login-header h1 {
  font-size: 22px;
  margin: 0 0 8px;
}

.login-header p {
  margin: 0 0 20px;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 12px;
}

.login-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.login-form button {
  margin-top: 8px;
}
</style>
