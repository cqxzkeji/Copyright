<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-title">智慧农业管理系统</div>
      <p style="color: var(--muted);">
        土壤、气象、作物数据一站式管理，进入系统后可查看实时监控与运营分析。
      </p>
      <div class="form-field">
        <label>账号</label>
        <input v-model="form.username" type="text" placeholder="请输入账号" />
      </div>
      <div class="form-field">
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="请输入密码" />
      </div>
      <div class="form-field">
        <label>登录角色</label>
        <select v-model="form.role">
          <option>系统管理员</option>
          <option>生产主管</option>
          <option>数据分析师</option>
        </select>
      </div>
      <button class="button-primary" type="button" @click="login">登录并进入主界面</button>
      <div class="card" style="background: #f8fafc; box-shadow: none;">
        <div style="display: flex; justify-content: space-between; color: var(--muted); font-size: 13px;">
          <span>今日在线设备：86 台</span>
          <span>已完成巡检：24 次</span>
        </div>
      </div>
    </div>
  </div>
  <BaseModal
    :open="showTip"
    title="登录提醒"
    @close="showTip = false"
    @confirm="confirmLogin"
  >
    <p>欢迎 {{ form.username || '用户' }}，即将进入系统主界面。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const showTip = ref(false);
const form = reactive({
  username: '',
  password: '',
  role: '系统管理员'
});

const login = () => {
  showTip.value = true;
};

const confirmLogin = () => {
  showTip.value = false;
  router.push('/app');
};
</script>
