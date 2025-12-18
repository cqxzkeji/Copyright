<template>
  <div class="login-shell">
    <div class="login-card">
      <div>
        <p class="badge">农产品电商 · 安全登陆</p>
        <h2 style="margin: 8px 0 16px;">登陆后台</h2>
        <p style="color:#475569;margin-bottom:20px;">登陆后可管理商品、库存、订单、用户与数据统计。</p>
      </div>
      <form @submit.prevent="handleLogin" class="form-grid">
        <label>
          账号
          <input v-model="form.account" placeholder="请输入手机号/邮箱" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          角色
          <select v-model="form.role" required>
            <option value="">选择角色</option>
            <option>运营专员</option>
            <option>仓储管理员</option>
            <option>财务经理</option>
          </select>
        </label>
      </form>
      <div class="section-header" style="margin-top: 16px;">
        <div class="tag-row">
          <span class="badge" style="background:#dcfce7;color:#166534;">安全加密</span>
          <span class="badge" style="background:#e0f2fe;color:#0ea5e9;">多角色权限</span>
        </div>
        <button class="primary-btn" type="button" @click="handleLogin">立即登陆</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ account: '', password: '', role: '' });

const handleLogin = () => {
  if (form.account && form.password && form.role) {
    router.push('/main/product');
  }
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at 20% 20%, #e0f2fe, transparent 30%),
    radial-gradient(circle at 80% 0%, #fef9c3, transparent 32%),
    #f8fafc;
}

.login-card {
  width: min(640px, 100%);
  background: #fff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  border: 1px solid #e2e8f0;
}
</style>
