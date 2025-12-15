<template>
  <div class="login-wrap">
    <div class="welcome card">
      <h1>智能信息服务与数据处理系统</h1>
      <p>统一的数据采集、处理、服务与可视化平台</p>
      <form @submit.prevent="submit" class="form">
        <label>账号
          <input v-model="form.username" required placeholder="请输入账号" />
        </label>
        <label>密码
          <input v-model="form.password" type="password" required placeholder="请输入密码" />
        </label>
        <div class="actions">
          <button type="submit">立即登录</button>
          <button type="button" class="ghost" @click="showGuide = true">查看指南</button>
        </div>
      </form>
    </div>
    <modal-dialog v-model="showGuide" title="平台使用指南">
      <ol>
        <li>使用左侧导航进入模块，无需再次登录。</li>
        <li>所有操作均会提供弹窗提示和进度反馈。</li>
        <li>建议在桌面端浏览器访问获得最佳体验。</li>
      </ol>
    </modal-dialog>
    <modal-dialog v-model="showProgress" title="正在校验账户" width="420px">
      <p>正在安全校验登录信息，请稍候...</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </modal-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const showProgress = ref(false);
const showGuide = ref(false);
const progress = ref(35);

const submit = () => {
  showProgress.value = true;
  progress.value = 35;
  const timer = setInterval(() => {
    progress.value += 15;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
      router.push('/app');
    }
  }, 300);
};
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(120deg, #e5f2ff 0%, #f8fbff 100%);
}

.welcome {
  max-width: 480px;
  width: 100%;
  text-align: center;
}

h1 {
  margin: 0 0 8px;
}

.form {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

label {
  text-align: left;
  font-weight: 700;
  color: #374151;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border: 1px solid #d7deea;
  border-radius: 10px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

button.ghost {
  background: #eef2f7;
  color: #1f2933;
}
</style>
