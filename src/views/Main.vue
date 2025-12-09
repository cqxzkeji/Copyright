<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">钙基膨润土 · 磷去除</div>
      <nav>
        <router-link to="/main/wastewater">废水采集与预处理</router-link>
        <router-link to="/main/adsorption">吸附处理</router-link>
        <router-link to="/main/removal">磷去除与处理</router-link>
        <router-link to="/main/analysis">数据分析与报告</router-link>
        <router-link to="/main/management">管理与控制</router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <div class="title">膨润土矿物吸附磷废水处理控制台</div>
          <p class="desc">登陆后自动载入功能模块，侧栏切换模块进入内容窗口</p>
        </div>
        <div class="user">
          <div class="avatar">L</div>
          <div>
            <div class="name">实验室用户</div>
            <small class="role">在线</small>
          </div>
        </div>
      </header>
      <section class="module">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: #eef2ff;
}

.sidebar {
  background: #ffffffd9;
  backdrop-filter: blur(6px);
  padding: 24px 18px;
  border-right: 1px solid #e2e8f0;
  display: grid;
  gap: 18px;
}

.logo {
  font-weight: 800;
  color: #0f172a;
  line-height: 1.4;
}

nav {
  display: grid;
  gap: 10px;
}

nav a {
  padding: 12px 14px;
  border-radius: 12px;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-weight: 600;
  transition: all 0.2s;
}

nav a.router-link-active {
  background: linear-gradient(120deg, #93c5fd, #bfdbfe);
  color: #0b1b3b;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
}

.content {
  padding: 20px 26px 28px;
  background: linear-gradient(180deg, #f8fbff 0%, #fff 100%);
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 16px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 6px;
}

.desc {
  color: #475569;
  margin: 0;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e293b;
}

.avatar {
  background: linear-gradient(135deg, #60a5fa, #a5b4fc);
  color: #fff;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-weight: 800;
}

.module {
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    grid-auto-flow: column;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow-x: auto;
  }
}
</style>
