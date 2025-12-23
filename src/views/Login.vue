<template>
  <div class="login-page">
    <div class="login-panel">
      <div class="login-brand">
        <div class="logo">乡村</div>
        <div>
          <div class="title">农村电商综合服务管理平台</div>
          <div class="subtitle">整合订单、物流、营销与服务</div>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div>
          <label>账号</label>
          <input v-model="form.username" type="text" placeholder="请输入运营账号" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <div>
          <label>登录身份</label>
          <select v-model="form.role">
            <option>平台管理员</option>
            <option>乡镇服务站长</option>
            <option>物流协同专员</option>
          </select>
        </div>
        <button class="btn" type="submit">登录进入主界面</button>
      </form>
      <div class="login-footer">
        <span class="badge">智慧乡村 · 亮色自适应布局</span>
        <button class="btn secondary" type="button" @click="openHelp">登录提示</button>
      </div>
    </div>
    <BaseModal :open="helpOpen" title="登录提示" :on-close="closeHelp">
      <p>输入任意账号即可体验系统。登录后自动跳转至综合数据看板。</p>
      <p>建议使用“平台管理员”角色体验全量功能。</p>
      <template #footer>
        <button class="btn" @click="closeHelp">明白了</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const helpOpen = ref(false);
const form = reactive({
  username: '',
  password: '',
  role: '平台管理员'
});

const handleLogin = () => {
  router.push('/dashboard');
};

const openHelp = () => {
  helpOpen.value = true;
};

const closeHelp = () => {
  helpOpen.value = false;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe, #eef2ff, #fef9c3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-panel {
  width: min(480px, 100%);
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: linear-gradient(135deg, #60a5fa, #22d3ee);
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
}

.title {
  font-size: 18px;
  font-weight: 700;
}

.subtitle {
  font-size: 12px;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 12px;
}

.login-form label {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.login-form input,
.login-form select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
