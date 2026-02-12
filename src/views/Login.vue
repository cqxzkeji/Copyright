<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <h2>无抗养殖饲料配方智能推荐与成本核算系统</h2>
      <el-form :model="form" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="登录角色">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="场长" value="manager" />
            <el-option label="营养师" value="nutrition" />
            <el-option label="采购员" value="buyer" />
          </el-select>
        </el-form-item>
        <el-button type="primary" class="full" @click="login">登录系统</el-button>
      </el-form>
    </el-card>

    <el-dialog v-model="dialogVisible" title="登录提示" width="420px" :close-on-click-modal="false">
      <div>{{ dialogMessage }}</div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmLogin">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dialogVisible = ref(false)
const dialogMessage = ref('')

const form = reactive({ username: '', password: '', role: 'manager' })

const login = () => {
  if (!form.username || !form.password) {
    dialogMessage.value = '请输入完整的用户名和密码后再登录。'
    dialogVisible.value = true
    return
  }
  dialogMessage.value = `欢迎 ${form.username}，确认进入系统主界面吗？`
  dialogVisible.value = true
}

const confirmLogin = () => {
  dialogVisible.value = false
  if (form.username && form.password) {
    router.push('/main')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f0f7ff 0%, #fefbf3 100%);
  padding: 20px;
}
.login-card { width: min(460px, 95vw); border-radius: 18px; }
h2 { color: #20496e; margin-bottom: 16px; font-size: 22px; }
.full { width: 100%; }
</style>
