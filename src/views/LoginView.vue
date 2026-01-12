<template>
  <div class="login-page">
    <div class="login-card">
      <h1>钢轨断口灰斑智能识别算法优化系统</h1>
      <p class="subtitle">请输入账号信息进入系统</p>
      <form @submit.prevent="handleLogin">
        <label>
          用户名
          <input v-model="form.username" type="text" placeholder="操作员账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </label>
        <label>
          登录角色
          <select v-model="form.role" required>
            <option value="分析员">分析员</option>
            <option value="维护员">维护员</option>
            <option value="管理员">管理员</option>
          </select>
        </label>
        <button class="btn" type="submit">登录系统</button>
      </form>
      <div class="login-tip">
        默认启用智能识别流程，登录后可在主界面切换功能模块。
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  username: "",
  password: "",
  role: "分析员"
});

const handleLogin = () => {
  router.push("/app/data-collection");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: radial-gradient(circle at top, #edf3ff, #f5f7fb 60%);
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(31, 111, 255, 0.15);
}

h1 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #1b2a46;
}

.subtitle {
  font-size: 14px;
  color: #566583;
  margin-bottom: 20px;
}

form {
  display: grid;
  gap: 14px;
}

label {
  font-size: 13px;
  color: #4b5a78;
  display: grid;
  gap: 6px;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d6def2;
  font-size: 14px;
}

.login-tip {
  margin-top: 16px;
  font-size: 12px;
  color: #7a88a8;
}
</style>
