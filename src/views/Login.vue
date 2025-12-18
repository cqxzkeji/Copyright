<template>
  <div class="login">
    <div class="panel">
      <div class="hero">
        <h1>农产品供应链协同管理</h1>
        <p>统一协同采购、物流、分析与权限配置，助力鲜活农产品快速上架。</p>
      </div>
      <form class="form" @submit.prevent="goMain">
        <label>
          账号
          <input v-model="user" type="text" placeholder="输入账号" required />
        </label>
        <label>
          密码
          <input v-model="password" type="password" placeholder="输入密码" required />
        </label>
        <div class="actions">
          <button class="btn" type="submit">立即登录</button>
          <button class="btn outline" type="button" @click="showTip = true">登录提示</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showTip" class="modal-overlay" @click.self="showTip = false">
    <div class="modal">
      <h3>提示</h3>
      <p>演示环境默认允许任意账号密码直接登录。</p>
      <div class="actions">
        <button class="btn" @click="showTip = false">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref('');
const password = ref('');
const showTip = ref(false);

const goMain = () => {
  if (user.value && password.value) {
    router.push('/main');
  }
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: radial-gradient(circle at 20% 20%, rgba(58, 134, 255, 0.2), transparent 32%),
    radial-gradient(circle at 80% 0%, rgba(255, 190, 11, 0.25), transparent 28%),
    var(--bg);
}

.panel {
  background: var(--card);
  padding: 26px;
  border-radius: 18px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border);
}

.hero h1 {
  margin: 0 0 8px;
}

.hero p {
  margin: 0 0 18px;
  color: var(--muted);
}

.form {
  display: grid;
  gap: 14px;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 700;
}

input {
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #f8fafc;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

@media (max-width: 480px) {
  .actions {
    flex-direction: column;
  }
}
</style>
