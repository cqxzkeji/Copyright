<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="logo">仓储管理平台</div>
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/dashboard/inventory">库存管理</el-menu-item>
        <el-menu-item index="/dashboard/inout">入库与出库</el-menu-item>
        <el-menu-item index="/dashboard/orders">订单跟踪调度</el-menu-item>
        <el-menu-item index="/dashboard/analysis">数据分析报表</el-menu-item>
        <el-menu-item index="/dashboard/alerts">预警异常管理</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <el-button @click="showTip">通知</el-button>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const showTip = () => ElMessageBox.alert('系统运行正常，任务队列持续同步中。', '系统通知')

const logout = async () => {
  await ElMessageBox.confirm('确认退出当前账号？', '提示', { type: 'warning' })
  localStorage.removeItem('warehouse-auth')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f6f9fc;
}
.aside {
  background: #ffffff;
  border-right: 1px solid #e6edf7;
}
.logo {
  padding: 20px;
  font-size: 18px;
  font-weight: 700;
  color: #3578e5;
}
.header {
  background: #fff;
  border-bottom: 1px solid #e6edf7;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}
.main {
  padding: 16px;
}
</style>
