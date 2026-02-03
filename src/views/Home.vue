<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>智能语音识别与实时翻译系统</h1>
      <p>请使用账号登录后进入主界面。</p>
      <div class="auth-form">
        <label>
          账号
          <input v-model="form.account" class="input" placeholder="输入账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" class="input" type="password" placeholder="输入密码" />
        </label>
        <label>
          登录角色
          <select v-model="form.role" class="select">
            <option>系统管理员</option>
            <option>翻译专员</option>
            <option>运维工程师</option>
          </select>
        </label>
        <div class="auth-actions">
          <button class="button" @click="openLogin">登录</button>
          <button class="button secondary" @click="openReset">重置输入</button>
        </div>
      </div>
    </div>

    <BaseModal v-if="showLogin" title="登录确认" @close="showLogin = false">
      <p>请确认登录并启用实时语音服务。</p>
      <label>
        动态验证码
        <input v-model="form.code" class="input" placeholder="输入短信验证码" />
      </label>
      <div class="modal-actions">
        <span class="button" @click="confirmLogin">确认登录</span>
        <span class="button ghost" @click="showLogin = false">稍后再说</span>
      </div>
    </BaseModal>

    <BaseModal v-if="showReset" title="重置输入" @close="showReset = false">
      <p>将清空当前输入的账号信息。</p>
      <div class="modal-actions">
        <span class="button" @click="resetForm">确定重置</span>
        <span class="button ghost" @click="showReset = false">取消</span>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const showLogin = ref(false);
const showReset = ref(false);
const form = reactive({
  account: '',
  password: '',
  role: '系统管理员',
  code: ''
});

const openLogin = () => {
  showLogin.value = true;
};

const openReset = () => {
  showReset.value = true;
};

const confirmLogin = () => {
  showLogin.value = false;
  router.push('/dashboard');
};

const resetForm = () => {
  form.account = '';
  form.password = '';
  form.role = '系统管理员';
  form.code = '';
  showReset.value = false;
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbe7ff, #f9fbff);
  padding: 24px;
}

.auth-card {
  width: min(460px, 90vw);
  background: #ffffff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(39, 64, 118, 0.18);
}

.auth-card h1 {
  margin-top: 0;
  font-size: 22px;
  color: #1b2a41;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 10px;
}
</style>
