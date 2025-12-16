<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>工业供应链韧性平台</h2>
      <p class="hint">请使用企业账号登录以加载各功能模块。</p>
      <form @submit.prevent="handleLogin">
        <label>
          用户名
          <input v-model="form.username" placeholder="输入工号或邮箱" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </label>
        <button class="btn primary" type="submit">登录</button>
      </form>
      <div class="banner" style="margin-top: 14px;">
        <div>
          <strong>安全提示：</strong> 登录后可访问数据采集、韧性评估、风险预测、预警响应以及系统管理模块。
        </div>
        <button class="btn" @click="showGuidance = true">操作须知</button>
      </div>
    </div>
    <BaseModal v-model="showGuidance" title="登录说明" @confirm="showGuidance = false">
      <p>完成身份验证后，系统会自动加载主界面并在左侧展示功能导航。所有模块均以独立页面在内容窗口展示。</p>
      <ul>
        <li>首次登录后建议先进入“数据采集与整合”配置数据源。</li>
        <li>完成数据更新后，再运行韧性评估与风险预测。</li>
        <li>预警与应对模块支持对风险结果的联动管理。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const showGuidance = ref(false);
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  if (form.username && form.password) {
    localStorage.setItem('resilience-authed', 'true');
    router.push('/');
  }
};
</script>
