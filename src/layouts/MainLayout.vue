<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="logo">MgoShort</div>
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/main/upload">上传管理</el-menu-item>
        <el-menu-item index="/main/play">展示播放</el-menu-item>
        <el-menu-item index="/main/interaction">互动评论</el-menu-item>
        <el-menu-item index="/main/search">搜索分类</el-menu-item>
        <el-menu-item index="/main/analytics">统计分析</el-menu-item>
      </el-menu>
      <el-button text type="danger" @click="logout">退出登录</el-button>
    </el-aside>
    <el-container>
      <el-main class="main"><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const logout = () => {
  localStorage.removeItem('mgoshort-login')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f7f9fc;
}
.aside {
  background: #fff;
  border-right: 1px solid #edf1f7;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.logo {
  font-size: 24px;
  font-weight: 700;
  color: #409eff;
  margin: 8px 0 12px;
}
.main {
  padding: 18px;
}
</style>
