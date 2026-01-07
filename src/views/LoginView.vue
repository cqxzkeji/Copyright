<template>
  <div class="login-page">
    <div class="login-card">
      <div>
        <h2>优特钢多客户定制销售匹配系统</h2>
        <p style="margin:8px 0 0; color:#5b6b8a;">请登录后进入主界面。</p>
      </div>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.account" placeholder="请输入账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
        <label>
          角色
          <select v-model="form.role">
            <option value="销售">销售</option>
            <option value="排产">排产</option>
            <option value="品质">品质</option>
            <option value="管理">管理</option>
          </select>
        </label>
        <button class="primary-button" type="submit">登录系统</button>
      </form>
      <div style="font-size:12px; color:#8091b1;">演示账号：demo / 123456</div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  account: 'demo',
  password: '123456',
  role: '销售'
});

const handleLogin = () => {
  router.push('/customer');
};
</script>
