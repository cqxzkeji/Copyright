<template>
  <div class="login-page">
    <div class="login-card">
      <h2>智能化数据库管理与监控系统</h2>
      <p>统一入口，安全登录后进入智能运维控制台。</p>
      <form class="form-grid" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          登录方式
          <select v-model="form.mode">
            <option value="password">账号密码</option>
            <option value="otp">动态令牌</option>
            <option value="sso">企业单点</option>
          </select>
        </label>
        <button class="primary-button" type="submit">登录进入系统</button>
      </form>
      <AppModal v-model="showNotice" title="登录提示">
        <p>已完成安全校验，正在跳转到主控制台。</p>
        <div class="modal-actions">
          <button class="primary-button" type="button" @click="confirmLogin">确认进入</button>
        </div>
      </AppModal>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppModal from '../components/AppModal.vue';

const router = useRouter();
const showNotice = ref(false);
const form = reactive({
  username: '',
  password: '',
  mode: 'password'
});

const handleLogin = () => {
  showNotice.value = true;
};

const confirmLogin = () => {
  showNotice.value = false;
  router.push('/app');
};
</script>
