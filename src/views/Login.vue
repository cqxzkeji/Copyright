<template>
  <div class="login-page">
    <div class="login-card">
      <h1>消防安全培训与应急演练管理系统</h1>
      <p>请使用企业账号登录，进入安全管理主界面。</p>
      <div class="form-grid">
        <div>
          <label>账号</label>
          <input v-model="form.account" placeholder="请输入账号" />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
        <div>
          <label>登录角色</label>
          <select v-model="form.role">
            <option>安全管理员</option>
            <option>培训负责人</option>
            <option>巡检负责人</option>
          </select>
        </div>
        <div>
          <label>验证码</label>
          <input v-model="form.code" placeholder="6位验证码" />
        </div>
      </div>
      <div class="modal-footer" style="margin-top: 20px;">
        <button class="btn" @click="reset">清空</button>
        <button class="btn primary" @click="login">登录</button>
      </div>
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
  role: '安全管理员',
  code: ''
});

const reset = () => {
  form.account = '';
  form.password = '';
  form.role = '安全管理员';
  form.code = '';
};

const login = () => {
  router.push('/dashboard/training');
};
</script>
