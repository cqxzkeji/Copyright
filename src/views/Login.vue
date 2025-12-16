<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const error = reactive({ message: '' });

const submit = () => {
  if (!form.username || !form.password) {
    error.message = '请输入用户名与密码';
    return;
  }
  localStorage.setItem('bdv_user', JSON.stringify({ name: form.username }));
  router.push('/dashboard');
};
</script>

<template>
  <div
    style="min-height: 100vh; display: grid; place-items: center; background: linear-gradient(120deg, #e0f2fe, #ffffff)"
  >
    <div class="card" style="width: min(420px, 92%); border: 1px solid #e2e8f0">
      <div class="section-header">
        <div>
          <h2 style="margin: 0">企业业务数据可视化展示系统</h2>
          <p style="color: #64748b">请先登录以进入主界面</p>
        </div>
        <span class="tag">亮色 · 自适应</span>
      </div>
      <div class="form-grid" style="margin-top: 14px">
        <label>
          用户名
          <input v-model="form.username" placeholder="输入用户名" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入密码" />
        </label>
      </div>
      <div style="margin-top: 16px; display: flex; gap: 10px">
        <button style="flex: 1" @click="submit">登录</button>
        <button class="ghost" style="flex: 1" @click="() => { form.username=''; form.password=''; }">重置</button>
      </div>
      <p v-if="error.message" style="color: #b91c1c; margin-top: 12px">{{ error.message }}</p>
    </div>
  </div>
</template>
