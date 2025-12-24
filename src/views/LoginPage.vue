<template>
  <div class="login-layout">
    <div class="login-card">
      <h1>登陆农村电商运营系统</h1>
      <p>统筹资源、内容、订单、数据与平台支撑，帮助乡村商家高效运营。</p>
      <form class="form-grid" @submit.prevent="handleLogin">
        <div>
          <label>账号</label>
          <input v-model="form.account" required placeholder="输入手机号/邮箱" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" required type="password" placeholder="输入登陆密码" />
        </div>
        <div class="section-header">
          <button class="btn" type="submit">立即登陆</button>
          <span class="status-pill">在线值守 · 7x12h</span>
        </div>
      </form>
      <div class="summary-grid" style="margin-top: 12px;">
        <div class="card">县域商家覆盖率 86%</div>
        <div class="card">村播达人 340 人</div>
        <div class="card">品牌合作 58 家</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ account: '', password: '' });

const handleLogin = () => {
  router.push('/app/resource');
};
</script>
