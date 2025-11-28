<template>
  <div class="login-wrap">
    <div class="panel card">
      <div class="brand">
        <div class="logo">ARM</div>
        <div>
          <h1>高精度智能驱动机械臂</h1>
          <p>综合管理系统 · 安全登陆</p>
        </div>
      </div>
      <form class="grid" @submit.prevent="submit">
        <label class="form-group">
          <span>账号</span>
          <input v-model="form.username" placeholder="工程师工号" required />
        </label>
        <label class="form-group">
          <span>密码</span>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            minlength="6"
            required
          />
        </label>
        <button class="btn" type="submit">登陆系统</button>
      </form>
      <p class="helper">如遇登录异常，请联系安全管理员确认权限。</p>
    </div>
    <div v-if="showHint" class="modal-backdrop" @click.self="showHint = false">
      <div class="modal-panel">
        <h3>登陆提示</h3>
        <p>验证通过，正在跳转到主控工作台。</p>
        <div class="footer">
          <button class="btn secondary" @click="showHint = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: 'arm-admin', password: '12345678' });
const showHint = ref(false);

const submit = () => {
  if (!form.username || !form.password) return;
  showHint.value = true;
  setTimeout(() => {
    router.push('/main');
  }, 600);
};
</script>

<style scoped>
.login-wrap {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 32px 18px;
}

.panel {
  width: min(440px, 100%);
  display: grid;
  gap: 18px;
}

.brand {
  display: flex;
  gap: 14px;
  align-items: center;
}

.logo {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(140deg, #22c55e, #4f46e5);
  color: #ffffff;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 22px;
}

p {
  margin: 6px 0 0;
  color: #475569;
}

.helper {
  font-size: 13px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
