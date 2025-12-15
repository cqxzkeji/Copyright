<template>
  <div style="display: grid; place-items: center; min-height: 100vh; padding: 20px;">
    <div class="card" style="width: 100%; max-width: 420px; text-align: center;">
      <div style="margin-bottom: 12px; color: #2563eb; font-weight: 800; font-size: 18px;">网络业务监测与运行分析系统</div>
      <p style="color: #6b7280; margin-top: 0;">请登录以访问各功能模块</p>
      <form @submit.prevent="onSubmit" style="margin-top: 10px; text-align: left;">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="form.username" placeholder="输入用户名" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </div>
        <button class="primary-btn" style="width: 100%;" type="submit">登录</button>
      </form>
      <div class="progress-bar" style="margin-top: 16px;">
        <div class="progress-inner" :style="{ width: '45%' }"></div>
      </div>
      <small style="color: #9ca3af;">安全检测加载中...</small>
    </div>
  </div>

  <div v-if="showModal" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">欢迎登录</div>
      <div class="modal-body">{{ modalMessage }}</div>
      <div class="modal-footer">
        <button class="primary-btn" @click="closeModal">开始使用</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const showModal = ref(false);
const modalMessage = ref('');

const onSubmit = () => {
  modalMessage.value = `欢迎 ${form.username}，正在验证凭证...`;
  showModal.value = true;
  setTimeout(() => {
    localStorage.setItem('authUser', form.username || '运维用户');
    router.push('/dashboard');
  }, 800);
};

const closeModal = () => {
  showModal.value = false;
};
</script>
