<template>
  <div class="login-page">
    <div class="login-card">
      <h1>优特钢定制销售技术标准管理软件</h1>
      <p>请使用授权账号登录后进入主界面。</p>
      <form @submit.prevent="handleLogin">
        <div class="section" style="padding: 16px;">
          <label>账号</label>
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </div>
        <div class="section" style="padding: 16px;">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <button class="btn" type="submit">登录并进入主界面</button>
      </form>
      <div class="section" style="margin-top: 16px;">
        <div class="section-title">登录提示</div>
        <ul style="margin: 0; padding-left: 18px; color: var(--muted); font-size: 13px;">
          <li>建议使用企业账号进行统一登录。</li>
          <li>登录后将自动加载五大功能模块。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  username: '',
  password: ''
});

const handleLogin = () => {
  router.push('/app/customer');
};
</script>
