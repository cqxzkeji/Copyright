<template>
  <el-container class="layout">
    <el-aside width="230px" class="menu-wrap">
      <div class="logo">无抗饲料系统</div>
      <el-menu router :default-active="route.path" class="menu" unique-opened>
        <el-menu-item index="/main/raw-material">原料信息管理</el-menu-item>
        <el-menu-item index="/main/formula">配方智能推荐</el-menu-item>
        <el-menu-item index="/main/cost">成本核算分析</el-menu-item>
        <el-menu-item index="/main/production">库存与生产管理</el-menu-item>
        <el-menu-item index="/main/analysis">数据统计报表</el-menu-item>
        <el-menu-item index="/main/setting">系统设置</el-menu-item>
      </el-menu>
      <div class="logout-box">
        <el-button type="danger" plain @click="logoutDialog = true">退出登录</el-button>
      </div>
    </el-aside>
    <el-main class="content">
      <router-view />
    </el-main>
  </el-container>

  <el-dialog v-model="logoutDialog" title="确认退出" width="400" :close-on-click-modal="false">
    <p>确认退出当前账号并返回登录页面？</p>
    <template #footer>
      <el-button @click="logoutDialog = false">取消</el-button>
      <el-button type="primary" @click="logout">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const logoutDialog = ref(false)

const logout = () => {
  logoutDialog.value = false
  router.push('/login')
}
</script>

<style scoped>
.layout { min-height: 100vh; background: #f6faff; }
.menu-wrap { background: #fff; border-right: 1px solid #e3ecf5; display: flex; flex-direction: column; }
.logo { height: 64px; line-height: 64px; text-align: center; font-weight: 700; color: #1d4a73; border-bottom: 1px solid #edf2f7; }
.menu { flex: 1; border-right: none; }
.logout-box { padding: 12px; border-top: 1px solid #edf2f7; text-align: center; }
.content { padding: 16px; }
</style>
