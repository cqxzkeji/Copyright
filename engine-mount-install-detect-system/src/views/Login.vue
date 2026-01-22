<template>
  <div class="login-page">
    <div class="login-card">
      <div>
        <h1>发动机支架安装与检测系统</h1>
        <p style="color: var(--muted); margin-top: 6px;">
          请使用工艺账号登录，进入主控平台。
        </p>
      </div>
      <div class="info-row">
        <span class="info-pill">实时监测</span>
        <span class="info-pill">标准化装配</span>
        <span class="info-pill">质量闭环</span>
      </div>
      <form @submit.prevent="handleLogin" class="modal-body">
        <label>
          账号
          <input v-model="form.account" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          班组
          <select v-model="form.shift" required>
            <option value="">请选择班组</option>
            <option value="A">A 班</option>
            <option value="B">B 班</option>
            <option value="C">C 班</option>
          </select>
        </label>
        <button class="button" type="submit">进入系统</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  account: '',
  password: '',
  shift: ''
});

const handleLogin = () => {
  if (form.account && form.password && form.shift) {
    router.push('/main');
  }
};
</script>
