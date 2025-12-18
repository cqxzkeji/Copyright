<template>
  <div class="login-page" style="min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at 20% 20%, #e0f2ff, transparent 30%), radial-gradient(circle at 80% 0%, #e7f8ef, transparent 28%), #f7fafc;">
    <div class="card" style="width: min(520px, 92vw);">
      <h2 style="margin-top: 0;">农产品网上销售综合服务平台</h2>
      <p style="color: var(--muted); margin-bottom: 18px;">一键登录后管理用户、商品、订单、物流与数据。</p>
      <form class="form-grid" @submit.prevent="handleLogin">
        <div>
          <label>账号</label>
          <input v-model="form.account" placeholder="请输入账号" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" placeholder="请输入密码" type="password" required />
        </div>
        <div>
          <label>身份</label>
          <select v-model="form.role">
            <option value="运营">运营</option>
            <option value="商户">商户</option>
            <option value="客服">客服</option>
          </select>
        </div>
        <div>
          <label>验证码</label>
          <input v-model="form.captcha" placeholder="输入四位验证码" maxlength="4" />
        </div>
      </form>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 14px;">
        <div class="chip-row">
          <span class="chip">安全加固</span>
          <span class="chip">7x24监控</span>
          <span class="chip">多角色</span>
        </div>
        <button @click="handleLogin">进入平台</button>
      </div>
      <p style="color: var(--muted); font-size: 12px; margin-top: 8px;">支持单点登录，登录即视为同意《平台用户协议》。</p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  account: 'admin',
  password: '123456',
  role: '运营',
  captcha: '5689'
});

const handleLogin = () => {
  router.push('/main');
};
</script>
