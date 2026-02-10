<template>
  <div class="login-wrap">
    <div class="login-box card">
      <h2>多元数据融合高校学业规划系统</h2>
      <p>请登录后进入学业规划主界面</p>
      <div class="form-row">
        <label>账号</label>
        <input v-model="form.username" class="input" placeholder="请输入账号" />
      </div>
      <div class="form-row">
        <label>密码</label>
        <input v-model="form.password" type="password" class="input" placeholder="请输入密码" />
      </div>
      <button class="btn" @click="openLoginConfirm">登录</button>
    </div>
    <BaseModal v-model="showConfirm" title="登录确认">
      <p>确认使用账号 <strong>{{ form.username || '未填写' }}</strong> 登录系统？</p>
      <template #footer>
        <button class="btn secondary" @click="showConfirm = false">取消</button>
        <button class="btn" @click="login">确认登录</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '../components/BaseModal.vue'

const router = useRouter()
const showConfirm = ref(false)
const form = reactive({ username: '', password: '' })

const openLoginConfirm = () => { showConfirm.value = true }
const login = () => {
  localStorage.setItem('academic-token', JSON.stringify({ user: form.username || 'student' }))
  showConfirm.value = false
  router.push('/dashboard/data-collection')
}
</script>

<style scoped>
.login-wrap { min-height:100vh; display:grid; place-items:center; padding:20px; }
.login-box { width:min(460px,95vw); }
h2 { margin:0 0 6px; color:#284fa9; }
p { color:#6f7b95; margin-bottom:16px; }
.form-row{ margin-bottom:12px; }
label { font-size:13px; color:#586380; display:block; margin-bottom:6px; }
</style>
