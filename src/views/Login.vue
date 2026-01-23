<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-title">系统登录</div>
      <p class="login-desc">商业楼宇多业态工程竣工联合验收管理系统</p>
      <div class="form">
        <label class="label">
          账号
          <input v-model="form.account" class="input" placeholder="请输入账号" />
        </label>
        <label class="label">
          密码
          <input v-model="form.password" class="input" type="password" placeholder="请输入密码" />
        </label>
        <label class="label">
          角色
          <select v-model="form.role" class="select">
            <option value="项目负责人">项目负责人</option>
            <option value="验收主管">验收主管</option>
            <option value="多部门代表">多部门代表</option>
          </select>
        </label>
        <div class="action-group">
          <button class="primary-btn" type="button" @click="openModal('login')">登录</button>
          <button class="secondary-btn" type="button" @click="openModal('reset')">重置</button>
          <button class="secondary-btn" type="button" @click="openModal('tip')">提示信息</button>
        </div>
      </div>
    </div>
    <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="activeModal === 'login'">
        <p>确认以 <strong>{{ form.account || '未填写' }}</strong> 登录，角色为 <strong>{{ form.role }}</strong> 吗？</p>
        <div class="login-progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="progress-text">登录准备进度 {{ progress }}%</p>
      </template>
      <template v-else-if="activeModal === 'reset'">
        <p>即将清空登录表单并恢复默认角色。</p>
      </template>
      <template v-else>
        <p>请使用统一账号体系登录，系统将自动加载验收计划与协同任务。</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const form = ref({
  account: '',
  password: '',
  role: '项目负责人'
});
const activeModal = ref('');
const progress = ref(65);

const modalTitleMap = {
  login: '登录确认',
  reset: '重置表单',
  tip: '登录提示'
};

const modalTitle = computed(() => modalTitleMap[activeModal.value] || '提示');

function openModal(type) {
  activeModal.value = type;
  if (type === 'login') {
    progress.value = 65;
    const timer = setInterval(() => {
      progress.value = Math.min(progress.value + 7, 100);
      if (progress.value === 100) {
        clearInterval(timer);
      }
    }, 180);
  }
}

function closeModal() {
  activeModal.value = '';
}

function confirmModal() {
  if (activeModal.value === 'reset') {
    form.value = { account: '', password: '', role: '项目负责人' };
  }
  if (activeModal.value === 'login') {
    router.push('/main');
  }
  closeModal();
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: linear-gradient(135deg, #eff6ff, #fdf2f8);
}

.login-card {
  width: min(420px, 100%);
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
}

.label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
  margin-bottom: 16px;
}

.login-progress {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  margin-top: 16px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #38bdf8, #34d399);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
}
</style>
