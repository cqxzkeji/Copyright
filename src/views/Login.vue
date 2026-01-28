<template>
  <div class="login-page">
    <div class="login-card">
      <header>
        <h1>汽车CAE全面分析仿真软件</h1>
        <p>统一入口，快速进入五大模块的仿真工作台。</p>
      </header>
      <form class="login-form" @submit.prevent="openLoginModal">
        <label>
          用户名
          <input v-model="form.username" placeholder="请输入用户名" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <div class="options">
          <label class="checkbox">
            <input v-model="form.remember" type="checkbox" />
            记住设备
          </label>
          <button class="link" type="button" @click="openAssistModal">忘记密码？</button>
        </div>
        <button class="primary" type="submit">登录进入系统</button>
      </form>
    </div>
    <div class="login-preview">
      <img :src="caeVisual" alt="CAE示意图" />
      <div class="preview-info">
        <h2>数字化仿真平台</h2>
        <p>集成结构、动力学、流体、热与声学分析流程，打造高效协同仿真。</p>
        <ul>
          <li>统一数据管理</li>
          <li>快速仿真提交</li>
          <li>实时结果可视化</li>
        </ul>
      </div>
    </div>

    <BaseModal v-if="showLoginModal" title="登录确认" @close="showLoginModal = false">
      <p>请确认使用以下账号进入系统：</p>
      <div class="modal-info">
        <span>用户名：{{ form.username }}</span>
        <span>记住设备：{{ form.remember ? '是' : '否' }}</span>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="showLoginModal = false">返回修改</button>
        <button class="primary" type="button" @click="handleLogin">确认登录</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showAssistModal" title="找回支持" @close="showAssistModal = false">
      <p>请联系系统管理员重置密码，或使用以下方式获取帮助：</p>
      <ul class="assist-list">
        <li>服务邮箱：support@cae-platform.local</li>
        <li>热线电话：400-800-CAE</li>
        <li>工单编号：自动生成后将发送至邮箱</li>
      </ul>
      <template #footer>
        <button class="primary" type="button" @click="showAssistModal = false">了解</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';
import caeVisual from '../assets/cae-visual.svg';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
  remember: true
});

const showLoginModal = ref(false);
const showAssistModal = ref(false);

const openLoginModal = () => {
  showLoginModal.value = true;
};

const openAssistModal = () => {
  showAssistModal.value = true;
};

const handleLogin = () => {
  showLoginModal.value = false;
  router.push('/main');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  align-items: center;
  padding: 40px 6vw;
  background: linear-gradient(135deg, #f8fafc, #e0f2fe);
}

.login-card {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.login-card h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

.login-card p {
  color: #64748b;
  margin-bottom: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #475569;
  gap: 8px;
}

.login-form input {
  padding: 10px 12px;
  border: 1px solid #cbd5f5;
  border-radius: 12px;
  font-size: 14px;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.login-preview {
  display: grid;
  gap: 20px;
  align-content: center;
}

.login-preview img {
  width: 100%;
  border-radius: 24px;
}

.preview-info {
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.preview-info ul {
  margin-top: 12px;
  padding-left: 18px;
  color: #475569;
}

.modal-info {
  margin: 12px 0;
  display: grid;
  gap: 8px;
  color: #1e293b;
}

.assist-list {
  margin-top: 12px;
  padding-left: 18px;
  color: #475569;
}

.ghost {
  border: 1px solid #cbd5f5;
  background: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
