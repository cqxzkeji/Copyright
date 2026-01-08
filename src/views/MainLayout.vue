<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand__logo">优特钢</div>
        <p>销售需求分析与标准定制生成系统</p>
      </div>
      <nav class="menu">
        <router-link to="/dashboard/customer" class="menu__item">客户需求分析</router-link>
        <router-link to="/dashboard/customization" class="menu__item">产品标准与定制</router-link>
        <router-link to="/dashboard/quote-order" class="menu__item">销售报价与订单</router-link>
        <router-link to="/dashboard/inventory" class="menu__item">库存与生产调度</router-link>
        <router-link to="/dashboard/data-analysis" class="menu__item">数据分析与决策</router-link>
      </nav>
      <div class="sidebar__footer">
        <span>当前账户：销售专员</span>
        <button class="logout" @click="goLogin">退出登录</button>
      </div>
    </aside>

    <main class="content">
      <header class="content__header">
        <div>
          <h1>主界面</h1>
          <p>实时聚焦客户、标准、库存与决策数据</p>
        </div>
        <div class="content__actions">
          <button class="pill">今日订单 38</button>
          <button class="pill">库存预警 4</button>
          <button class="pill">交付达成率 96%</button>
        </div>
      </header>

      <section class="content__body">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #fff;
  border-right: 1px solid var(--border);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand__logo {
  background: var(--primary);
  color: #fff;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.brand p {
  margin-top: 12px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.4;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu__item {
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  background: transparent;
  transition: 0.2s ease;
}

.menu__item.router-link-active {
  background: #eef2ff;
  color: var(--primary);
}

.sidebar__footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
  color: var(--muted);
}

.logout {
  background: #fee2e2;
  color: #b91c1c;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
}

.content {
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  gap: 20px;
}

.content__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  background: #fff;
  padding: 20px 24px;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.content__header h1 {
  font-size: 22px;
  margin-bottom: 4px;
}

.content__header p {
  color: var(--muted);
  font-size: 13px;
}

.content__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill {
  background: #f1f5f9;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.content__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .sidebar__footer {
    flex-direction: row;
    align-items: center;
  }
}
</style>
