<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">🌾 农村电商平台</div>
      <nav>
        <router-link to="/info" active-class="active">信息服务</router-link>
        <router-link to="/products" active-class="active">商品撮合</router-link>
        <router-link to="/orders" active-class="active">订单物流</router-link>
        <router-link to="/analysis" active-class="active">数据分析</router-link>
        <router-link to="/system" active-class="active">系统管理</router-link>
      </nav>
      <button class="secondary-btn" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <header class="top-bar">
        <div>
          <h2 style="margin:0;">乡村数智运营驾驶舱</h2>
          <p style="margin:2px 0 0;color:#5c6c80;">加载模块到内容窗口，保持界面简洁无额外信息提示</p>
        </div>
        <div class="metric-grid" style="width:420px;">
          <div class="metric-card">
            <div style="color:#5c6c80;font-size:13px;">今日访问</div>
            <div style="font-size:20px;font-weight:700;">3,248</div>
            <div class="progress-bar" style="margin-top:6px;"><span style="width:68%;"></span></div>
          </div>
          <div class="metric-card">
            <div style="color:#5c6c80;font-size:13px;">成交转化</div>
            <div style="font-size:20px;font-weight:700;">12.6%</div>
            <div class="progress-bar" style="margin-top:6px;"><span style="width:42%;"></span></div>
          </div>
        </div>
      </header>
      <section class="module-area">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const logout = () => router.push('/login');
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e5ecf5;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  font-weight: 800;
  color: #1f2a44;
  font-size: 18px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

nav a {
  padding: 10px 12px;
  border-radius: 10px;
  color: #42526b;
}

nav a:hover,
nav a.active {
  background: linear-gradient(135deg, #e8f2ff, #f4fbff);
  color: #22507c;
  font-weight: 700;
}

.content {
  padding: 18px 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.module-area {
  background: transparent;
}
</style>
