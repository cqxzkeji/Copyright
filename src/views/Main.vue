<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="logo">再开发控制台</div>
      <nav>
        <button :class="navClass('planning')" @click="go('planning')">项目立项与规划</button>
        <button :class="navClass('progress')" @click="go('progress')">过程进度追踪</button>
        <button :class="navClass('spatial')" @click="go('spatial')">空间数据与地图</button>
        <button :class="navClass('performance')" @click="go('performance')">绩效评估与分析</button>
        <button :class="navClass('archive')" @click="go('archive')">档案管理与监管</button>
      </nav>
    </aside>
    <main class="content">
      <header class="top-bar">
        <div>
          <h2>城市空间再开发过程追踪与绩效分析系统</h2>
          <p class="muted">亮色、自适应布局，聚合全生命周期监管能力</p>
        </div>
        <div class="user-box">
          <div class="avatar">UR</div>
          <div>
            <div class="name">更新专员</div>
            <div class="muted">城市更新管理平台</div>
          </div>
        </div>
      </header>
      <section class="module-panel">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const go = (path) => router.push(`/main/${path}`)

const navClass = (path) => ({
  active: route.path.includes(path)
})
</script>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #2563eb, #22d3ee);
  color: white;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.logo {
  font-weight: 800;
  font-size: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  text-align: center;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.sidebar button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  color: white;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  text-align: left;
}

.sidebar button.active,
.sidebar button:hover {
  background: #fff;
  color: #1f2937;
}

.content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-bar {
  background: var(--panel);
  padding: 18px;
  border-radius: 14px;
  box-shadow: var(--shadow);
  border: 1px solid #e5ecff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.muted {
  color: #6b7280;
  font-size: 14px;
}

.user-box {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(120deg, #a855f7, #6366f1);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.module-panel {
  background: var(--panel);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow);
  border: 1px solid #eaf0ff;
}

@media (max-width: 900px) {
  .shell {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  .sidebar nav {
    width: 100%;
  }
}
</style>
