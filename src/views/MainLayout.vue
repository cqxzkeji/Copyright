<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">磷吸附剂平台</div>
      <nav>
        <router-link to="/app/raw-material" class="nav-item" active-class="active">原料选择与预处理</router-link>
        <router-link to="/app/adsorbent-preparation" class="nav-item" active-class="active">吸附剂制备</router-link>
        <router-link to="/app/performance-test" class="nav-item" active-class="active">性能测试与评价</router-link>
        <router-link to="/app/adsorption-mechanism" class="nav-item" active-class="active">吸附机制分析</router-link>
        <router-link to="/app/data-analysis" class="nav-item" active-class="active">数据分析与报告生成</router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <div class="subtitle">矿物基磷吸附剂制备与性能评价平台</div>
          <div class="title">功能控制台</div>
        </div>
        <div class="user">
          <span class="badge">在线</span>
          <div class="avatar">实验员</div>
        </div>
      </header>
      <section class="view">
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
  background: var(--bg);
}

.sidebar {
  background: linear-gradient(180deg, #f7faff, #eef4ff);
  padding: 1.25rem 1rem;
  border-right: 1px solid var(--border);
}

.brand {
  font-weight: 800;
  font-size: 18px;
  color: var(--primary);
  margin-bottom: 1.25rem;
}

.nav-item {
  display: block;
  padding: 0.75rem 0.85rem;
  margin-bottom: 0.35rem;
  border-radius: 10px;
  color: #1e2a3b;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-item:hover {
  background: #e4edff;
}

.nav-item.active {
  background: linear-gradient(120deg, var(--primary), var(--accent));
  color: #fff;
  box-shadow: 0 8px 18px rgba(43, 123, 255, 0.3);
}

.content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.topbar {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.subtitle {
  font-size: 13px;
  color: #7b8aab;
}

.title {
  font-size: 20px;
  font-weight: 800;
}

.user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  background: #fff;
  border: 1px solid var(--border);
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  font-weight: 700;
}

.view {
  background: transparent;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    width: 100%;
    gap: 0.35rem;
  }
}
</style>
