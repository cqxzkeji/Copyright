<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="onSubmit">
      <h2>创新创业项目全流程资源管理系统</h2>
      <p>请输入账号信息登录系统</p>
      <label>账号</label>
      <input v-model="form.username" required placeholder="admin" />
      <label>密码</label>
      <input v-model="form.password" required type="password" placeholder="******" />
      <button class="btn" type="submit">登录</button>
    </form>
    <ModalDialog :visible="showTip" title="登录结果" :showConfirm="false" @close="showTip=false">
      <p>{{ tip }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const showTip = ref(false)
const tip = ref('')

function onSubmit() {
  if (form.username && form.password) {
    localStorage.setItem('pms-auth', 'true')
    tip.value = '登录成功，正在跳转主界面。'
    showTip.value = true
    setTimeout(() => router.push('/dashboard/project-setup'), 600)
  }
}
</script>

<style scoped>
.login-page { min-height: 100vh; display: grid; place-items: center; background: linear-gradient(140deg, #eff6ff, #ddebff); }
.login-card { width: min(420px, 92vw); background: #fff; padding: 26px; border-radius: 14px; box-shadow: 0 12px 35px rgba(38,81,166,.2); display: grid; gap: 10px; }
h2 { margin: 0; font-size: 22px; }
p { margin: 0 0 8px; color: #5973a7; }
</style>
