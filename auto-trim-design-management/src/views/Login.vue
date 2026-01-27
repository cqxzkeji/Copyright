<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="brand">
        <img :src="banner" alt="系统标识" />
        <h1>汽车内外饰工程设计管理系统</h1>
        <p>统一承载项目、零部件、变更与验证数据，提升协同效率。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          企业/租户
          <select v-model="form.tenant">
            <option>智驾内外饰中心</option>
            <option>高端平台事业部</option>
            <option>新能源造型工程院</option>
          </select>
        </label>
        <label>
          账号
          <input v-model="form.username" placeholder="输入工号或邮箱" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入登录密码" />
        </label>
        <div class="actions">
          <button class="primary" type="submit">登录并进入</button>
          <button class="ghost" type="button" @click="helpModal = true">登录指引</button>
        </div>
      </form>
    </div>
  </div>
  <BaseModal v-model="helpModal" title="登录指引">
    <ul class="tips">
      <li>选择对应业务租户后，输入工号即可模拟登录。</li>
      <li>首次进入会自动跳转到主界面并加载各功能模块。</li>
      <li>如需权限申请，请联系内外饰工程IT管理员。</li>
    </ul>
    <template #footer>
      <button class="primary" type="button" @click="helpModal = false">我已知晓</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const helpModal = ref(false);
const form = reactive({
  tenant: '智驾内外饰中心',
  username: '',
  password: ''
});

const banner =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="220"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%23cfe8ff" offset="0"/><stop stop-color="%23ffffff" offset="1"/></linearGradient></defs><rect width="640" height="220" rx="18" fill="url(%23g)"/><circle cx="520" cy="70" r="46" fill="%239ad0ff"/><rect x="60" y="60" width="360" height="24" rx="12" fill="%2380bfff"/><rect x="60" y="110" width="260" height="18" rx="9" fill="%23b3d9ff"/><rect x="60" y="150" width="300" height="14" rx="7" fill="%23d7ecff"/></svg>';

const handleLogin = () => {
  router.push('/main/project');
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at top, #f0f6ff, #ffffff 70%);
}

.login-card {
  width: min(980px, 95vw);
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 30px 80px rgba(30, 64, 175, 0.12);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.brand img {
  width: 100%;
  border-radius: 18px;
  margin-bottom: 16px;
}

.brand h1 {
  font-size: 26px;
  margin-bottom: 8px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #1f2a44;
  gap: 8px;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #dbe3f0;
  background: #f9fbff;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
}

.ghost {
  background: #eef4ff;
  color: #1d4ed8;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
}

.tips {
  margin: 0;
  padding-left: 18px;
  line-height: 1.8;
}
</style>
