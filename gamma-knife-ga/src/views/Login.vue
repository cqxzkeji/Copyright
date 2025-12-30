<template>
  <div class="login-shell">
    <div class="login-panel">
      <h1>伽马刀遗传算法计划系统</h1>
      <p class="muted">请使用授权账户登陆以继续</p>
      <form class="grid" @submit.prevent="login">
        <label>
          <span>账号</span>
          <input v-model="form.user" required placeholder="输入工号或邮箱" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.pass" type="password" required placeholder="输入密码" />
        </label>
        <button type="submit">登陆</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ user: '', pass: '' })

function login() {
  router.push('/main')
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 30px;
}

.login-panel {
  width: min(520px, 100%);
  background: #fff;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(30, 136, 229, 0.18);
}

.muted {
  color: #5f6a7a;
  margin-top: 0;
}

label span {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}
</style>
