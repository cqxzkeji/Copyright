<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <span class="tag">CAE 智能平台</span>
        <h1>汽车CAE智能分析管理系统</h1>
        <p>统一管理有限元、碰撞、动力学与热流体仿真任务。</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="input-field">
          <label>账号</label>
          <input v-model="form.account" placeholder="请输入工程账号" required />
        </div>
        <div class="input-field">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入登录密码" required />
        </div>
        <div class="input-field">
          <label>角色</label>
          <select v-model="form.role">
            <option>仿真工程师</option>
            <option>项目主管</option>
            <option>性能分析师</option>
          </select>
        </div>
        <button class="btn" type="submit">登录进入</button>
      </form>
      <div class="login-footer">
        <div>
          <strong>当前环境：</strong>轻量云端计算集群
        </div>
        <div>
          <strong>系统状态：</strong>正常运行 · 12台求解节点在线
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  account: 'cae.engineer',
  password: 'password',
  role: '仿真工程师',
});

const handleLogin = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fb, #eaf1ff 40%, #fdfcff);
}

.login-card {
  width: min(480px, 100%);
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 24px 60px rgba(30, 58, 138, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-header h1 {
  font-size: 24px;
  margin-top: 12px;
}

.login-header p {
  margin-top: 8px;
  color: #5e6d7e;
}

.login-footer {
  display: grid;
  gap: 8px;
  font-size: 13px;
  color: #6b7a90;
}
</style>
