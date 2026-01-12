<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div>
        <div class="login-title">智能日报系统</div>
        <div class="login-subtitle">请使用企业账号登录以访问日报流程管理与指标统计功能</div>
      </div>
      <div class="form-grid">
        <div>
          <label>账号</label>
          <input v-model="form.account" placeholder="输入账号或工号" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="输入密码" />
        </div>
        <div>
          <label>部门</label>
          <select v-model="form.dept">
            <option value="运营中心">运营中心</option>
            <option value="数据中台">数据中台</option>
            <option value="技术研发">技术研发</option>
            <option value="财务管理">财务管理</option>
          </select>
        </div>
      </div>
      <button class="btn" type="button" @click="submitLogin">登录并进入系统</button>
      <div style="font-size: 12px; color: #6b7a99;">
        登录后将自动进入主界面，支持亮色自适应布局。
      </div>
    </div>
    <BaseModal v-if="showModal" title="登录校验" @close="closeModal">
      <p>账号校验通过，正在加载权限与日报流程。</p>
      <div style="margin-top: 12px;" class="progress">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <template #actions>
        <button class="btn" type="button" @click="closeModal">确认进入</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const showModal = ref(false);
const progress = ref(68);
const form = ref({
  account: '',
  password: '',
  dept: '运营中心'
});

const submitLogin = () => {
  showModal.value = true;
  progress.value = 68;
  const timer = setInterval(() => {
    progress.value = Math.min(progress.value + 8, 100);
    if (progress.value === 100) {
      clearInterval(timer);
    }
  }, 180);
};

const closeModal = () => {
  showModal.value = false;
  router.push('/app/daily');
};
</script>
