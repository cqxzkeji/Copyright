<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="brand-icon">链</div>
        <div>
          <h1>农地抵押贷款信息管理系统</h1>
          <p>基于区块链的可信农地金融协同平台</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="field">
          机构编号
          <input v-model="form.org" class="input" placeholder="请输入机构编号" required />
        </label>
        <label class="field">
          用户账号
          <input v-model="form.user" class="input" placeholder="请输入账号" required />
        </label>
        <label class="field">
          登录密码
          <input v-model="form.password" class="input" type="password" placeholder="请输入密码" required />
        </label>
        <label class="field">
          登录角色
          <select v-model="form.role" class="input" required>
            <option value="">请选择</option>
            <option value="bank">银行信贷</option>
            <option value="village">村集体</option>
            <option value="guarantee">担保机构</option>
            <option value="regulator">监管部门</option>
          </select>
        </label>
        <button class="button" type="submit">登录进入工作台</button>
      </form>
      <div class="login-footer">
        <span class="tag">多方协同</span>
        <span class="tag">联盟链存证</span>
        <span class="tag">监管穿透</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  org: 'HN-001',
  user: 'operator',
  password: '******',
  role: 'bank'
});

const handleLogin = () => {
  router.push('/main/dashboard');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  width: min(520px, 100%);
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.15);
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.brand-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, #3b82f6, #22d3ee);
  display: grid;
  place-items: center;
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
}

h1 {
  font-size: 20px;
}

p {
  color: #64748b;
  font-size: 14px;
}

.login-form {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.login-footer {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
}
</style>
