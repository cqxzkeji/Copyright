<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-hero">
        <h1>智能驱控式精准操控机器臂控制系统</h1>
        <p>集中化设备接入、精准轨迹规划与安全防护，一站式完成智能驱控管理。</p>
        <img src="/src/assets/arm-diagram.svg" alt="机器人臂示意图" />
      </div>
      <div class="login-form">
        <h2>用户登录</h2>
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="输入用户名" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入密码" />
        </label>
        <label>
          认证方式
          <select v-model="form.method">
            <option value="local">本地认证</option>
            <option value="ldap">LDAP 目录认证</option>
            <option value="token">安全令牌</option>
          </select>
        </label>
        <button class="primary" type="button" @click="openModal('login')">登录</button>
        <div class="action-row">
          <button class="ghost" type="button" @click="openModal('reset')">忘记密码</button>
          <button class="ghost" type="button" @click="openModal('notice')">登录提示</button>
        </div>
      </div>
    </div>
    <BaseModal
      v-if="activeModal"
      :title="modalTitle"
      :show-footer="activeModal !== 'progress'"
      @close="closeModal"
      @confirm="confirmModal"
    >
      <template v-if="activeModal === 'login'">
        <p>请确认本次登录信息，将会初始化设备模型并跳转到主界面。</p>
        <div class="modal-grid">
          <label>
            使用场景
            <select v-model="modalForm.scene">
              <option value="生产线">生产线调度</option>
              <option value="实验室">实验室调试</option>
              <option value="维护中心">维护中心</option>
            </select>
          </label>
          <label>
            默认权限模板
            <select v-model="modalForm.role">
              <option value="驱控管理员">驱控管理员</option>
              <option value="轨迹工程师">轨迹工程师</option>
              <option value="运维观察员">运维观察员</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'reset'">
        <p>填写下列信息后，我们会将重置验证码发送到您的绑定邮箱。</p>
        <div class="modal-grid">
          <label>
            工号
            <input v-model="modalForm.staffId" type="text" placeholder="例如 ARM-2024" />
          </label>
          <label>
            邮箱
            <input v-model="modalForm.email" type="email" placeholder="name@company.com" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'notice'">
        <p>系统已启用双因素认证与权限隔离，请在登录后完成设备指纹校验。</p>
        <ul>
          <li>建议使用专用网络环境以保证通讯稳定。</li>
          <li>首次登录需同步设备清单与任务模板。</li>
          <li>异常登录将触发安全审计。</li>
        </ul>
      </template>
      <template v-else-if="activeModal === 'progress'">
        <p>正在初始化设备接入环境与驱控服务，请稍候。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p>已完成 {{ progress }}%</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const form = reactive({
  account: 'operator',
  password: '********',
  method: 'local'
});

const modalForm = reactive({
  scene: '生产线',
  role: '驱控管理员',
  staffId: '',
  email: ''
});

const activeModal = ref('');
const progress = ref(68);

const modalTitle = computed(() => {
  const titleMap = {
    login: '登录确认',
    reset: '找回密码',
    notice: '登录提示',
    progress: '初始化进度'
  };
  return titleMap[activeModal.value] || '';
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const confirmModal = () => {
  if (activeModal.value === 'login') {
    activeModal.value = 'progress';
    setTimeout(() => {
      progress.value = 100;
      router.push('/main');
      activeModal.value = '';
      progress.value = 68;
    }, 800);
    return;
  }
  closeModal();
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.login-card {
  display: grid;
  grid-template-columns: minmax(280px, 1.1fr) minmax(260px, 0.9fr);
  gap: 24px;
  background: #ffffff;
  padding: 28px;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(24, 40, 84, 0.16);
  max-width: 1100px;
  width: 100%;
}

.login-hero img {
  width: 100%;
  border-radius: 16px;
  margin-top: 18px;
}

.login-hero h1 {
  font-size: 28px;
  margin-bottom: 12px;
}

.login-hero p {
  color: #536078;
  line-height: 1.6;
}

.login-form {
  display: grid;
  gap: 16px;
  align-content: start;
}

.login-form h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #dbe2ee;
  background: #f8fafc;
}

.primary {
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.action-row {
  display: flex;
  justify-content: space-between;
}

.ghost {
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
}

.modal-grid {
  display: grid;
  gap: 12px;
}

.progress {
  width: 100%;
  background: #e5eefc;
  border-radius: 8px;
  overflow: hidden;
  height: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

@media (max-width: 900px) {
  .login-card {
    grid-template-columns: 1fr;
  }
}
</style>
