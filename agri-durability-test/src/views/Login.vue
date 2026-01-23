<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <img
          alt="设备示意图"
          src="https://images.unsplash.com/photo-1503437313881-503a91226402?auto=format&fit=crop&w=400&q=80"
        />
        <div>
          <h1>农业机械连接板耐久性测试系统</h1>
          <p>连接板参数与耐久分析一体化平台</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          用户名
          <input v-model="form.username" type="text" placeholder="请输入用户名" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          角色
          <select v-model="form.role">
            <option>测试工程师</option>
            <option>可靠性分析师</option>
            <option>设备管理员</option>
          </select>
        </label>
        <button class="primary" type="submit">登录系统</button>
      </form>
      <div class="tips">
        <span>今日排程：3 套连接板耐久试验</span>
        <span>系统状态：数据采集正常</span>
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
  role: "测试工程师"
});

const handleLogin = () => {
  router.push("/dashboard/param");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  background: linear-gradient(135deg, #eaf2ff 0%, #f9fbff 45%, #e8f7ff 100%);
}

.login-card {
  width: min(820px, 95vw);
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(24, 45, 96, 0.12);
}

.brand {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 28px;
}

.brand img {
  width: 110px;
  height: 110px;
  border-radius: 16px;
  object-fit: cover;
}

.brand h1 {
  font-size: 24px;
  color: #1c2a4a;
  margin-bottom: 6px;
}

.brand p {
  color: #5c6f91;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  color: #42526b;
  font-weight: 600;
}

input,
select {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d6deea;
  background: #f8faff;
}

.primary {
  margin-top: 6px;
  border: none;
  background: #2b77f3;
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}

.tips {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  color: #7384a3;
  font-size: 14px;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
