<template>
  <div class="layout" style="grid-template-columns: 1fr; place-items:center; background:linear-gradient(120deg,#e0eeff,#f9fbff);">
    <div class="surface" style="width:min(520px,94vw);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div>
          <div class="badge">V1.0</div>
          <h2 style="margin:6px 0 4px;">双码联动工程现场精细化数据采集系统</h2>
          <p style="color:var(--muted);">请登录以管理双码标识、现场采集与追溯</p>
        </div>
        <div style="width:68px; height:68px; border-radius:18px; background:var(--primary-light); display:flex; align-items:center; justify-content:center; color:var(--primary); font-weight:800;">双码</div>
      </div>
      <form @submit.prevent="login">
        <div class="form-grid">
          <label>
            <div>账号</div>
            <input v-model="form.username" placeholder="工号/手机号" required />
          </label>
          <label>
            <div>密码</div>
            <input type="password" v-model="form.password" placeholder="请输入密码" required />
          </label>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
          <label style="display:flex; gap:6px; align-items:center; color:var(--muted);">
            <input type="checkbox" v-model="remember" style="width:auto;" /> 记住登录
          </label>
          <button type="submit">登录</button>
        </div>
      </form>
      <div v-if="error" style="margin-top:10px; color:#b91c1c;">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const remember = ref(true)
const error = ref('')

const login = () => {
  if (!form.username || !form.password) {
    error.value = '请输入账号与密码'
    return
  }
  error.value = ''
  router.push('/dashboard')
}
</script>
