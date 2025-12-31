<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-left">
        <h1>港口作业调度优化</h1>
        <p>基于遗传算法的智能港口排程，覆盖资源、任务、优化、执行与分析全流程。</p>
        <ul>
          <li>敏捷装卸 | 智能分配 | 可视协同</li>
          <li>班组/设备/船期全景可视</li>
          <li>多方案求解与可复现参数</li>
        </ul>
      </div>
      <div class="login-form">
        <h2>登录平台</h2>
        <form @submit.prevent="handleLogin" class="form-grid">
          <div class="input-group">
            <label>租户</label>
            <select v-model="tenant" required>
              <option value="">选择租户</option>
              <option>东港码头</option>
              <option>南岸集司</option>
            </select>
          </div>
          <div class="input-group">
            <label>用户名</label>
            <input v-model="username" required placeholder="planner" />
          </div>
          <div class="input-group">
            <label>密码</label>
            <input type="password" v-model="password" required placeholder="••••••" />
          </div>
          <button class="btn" type="submit">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tenant = ref('');
const username = ref('');
const password = ref('');

const handleLogin = () => {
  if (tenant.value && username.value && password.value) {
    router.push('/main/base-data');
  }
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 24px 54px rgba(22, 77, 155, 0.18);
  width: min(980px, 100%);
}

.login-left h1 {
  margin: 0 0 12px;
}

.login-left ul {
  padding-left: 18px;
  color: #345;
}

.login-form {
  background: linear-gradient(135deg, #f5fbff, #f9f3ff);
  padding: 18px;
  border-radius: 18px;
}

.login-form h2 {
  margin-top: 0;
}
</style>
