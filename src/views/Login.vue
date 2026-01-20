<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>果蔬生长数据分析系统</h1>
        <p>统一身份认证 / 角色选择</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div>
          <label class="label" for="account">账号</label>
          <input id="account" v-model="form.account" class="input" placeholder="请输入账号" />
        </div>
        <div>
          <label class="label" for="password">密码</label>
          <input id="password" v-model="form.password" class="input" type="password" placeholder="请输入密码" />
        </div>
        <div>
          <label class="label" for="role">角色</label>
          <select id="role" v-model="form.role" class="input">
            <option value="管理员">管理员</option>
            <option value="数据分析师">数据分析师</option>
            <option value="巡检员">巡检员</option>
            <option value="种植负责人">种植负责人</option>
          </select>
        </div>
        <button class="btn" type="submit">登录并进入系统</button>
        <div class="login-tip">
          <span class="badge">温馨提示</span>
          <span>首次登录需完成设备绑定与数据权限授权。</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  account: 'demo_admin',
  password: '******',
  role: '管理员'
});

const handleLogin = () => {
  router.push('/main');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: radial-gradient(circle at top, #e0f2fe, #f8fafc 60%);
}

.login-card {
  width: min(480px, 100%);
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
}

.login-header h1 {
  margin: 0 0 6px;
  font-size: 24px;
}

.login-header p {
  margin: 0 0 24px;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-tip {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: #475569;
}
</style>
