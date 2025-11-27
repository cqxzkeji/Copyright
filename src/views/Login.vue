<template>
  <div class="login-wrap">
    <div class="login-card card">
      <div class="header">
        <div>
          <p class="tag">消防安全一体化平台</p>
          <h1>登录消防安全培训与应急演练管理系统</h1>
          <p class="sub">统一入口，集中管理培训、演练、知识库、人员与数据分析。</p>
        </div>
        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f692.svg" alt="消防" />
      </div>
      <form class="form-grid" @submit.prevent="handleLogin">
        <div>
          <label>账号</label>
          <input v-model="form.username" placeholder="输入账号" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </div>
        <div>
          <label>角色</label>
          <select v-model="form.role" required>
            <option value="">选择角色</option>
            <option value="admin">安全主管</option>
            <option value="trainer">培训负责人</option>
            <option value="inspector">检查督导</option>
          </select>
        </div>
      </form>
      <div class="actions">
        <button class="ghost-btn" type="button" @click="showTip = true">忘记密码？</button>
        <button class="primary-btn" type="button" @click="handleLogin">立即登录</button>
      </div>
    </div>

    <div v-if="showTip" class="modal-backdrop" @click.self="showTip = false">
      <div class="modal-card">
        <h3>联系管理员重置密码</h3>
        <p>请联系消防安全管理员或使用企业统一认证重置密码。</p>
        <div class="flex-between" style="margin-top: 12px; gap: 8px;">
          <button class="ghost-btn" @click="showTip = false">知道了</button>
          <button class="secondary-btn" @click="simulateProcess">提交重置申请</button>
        </div>
      </div>
    </div>

    <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
      <div class="modal-card">
        <h3>提交中</h3>
        <p>正在向管理员发送重置申请…</p>
        <div class="progress-bar" style="margin-top: 10px;">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="margin-top: 8px; font-weight: 700;">{{ progress }}%</p>
        <div class="flex-between" style="margin-top: 10px;">
          <button class="ghost-btn" @click="showProgress = false">关闭</button>
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
  username: '',
  password: '',
  role: ''
});
const showTip = ref(false);
const showProgress = ref(false);
const progress = ref(0);

const simulateProcess = () => {
  showProgress.value = true;
  progress.value = 30;
  setTimeout(() => {
    progress.value = 80;
    setTimeout(() => {
      progress.value = 100;
    }, 600);
  }, 600);
};

const handleLogin = () => {
  if (!form.username || !form.password || !form.role) {
    showTip.value = true;
    return;
  }
  router.push('/app');
};
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 16px;
}

.login-card {
  width: min(960px, 100%);
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.95), #eef2ff);
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.header img {
  width: 110px;
}

h1 {
  margin: 6px 0;
}

.sub {
  color: #4b5563;
  margin: 6px 0 0;
}

.tag {
  display: inline-block;
  padding: 6px 12px;
  background: #ecfeff;
  color: #0ea5e9;
  border-radius: 999px;
  font-weight: 700;
  margin: 0;
}

.actions {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header img {
    width: 80px;
  }
}
</style>
