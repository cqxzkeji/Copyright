<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">SS</div>
        <div>
          <strong>优特钢</strong>
          <p>标准匹配系统</p>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/main/standard" class="menu-item" active-class="active">标准管理</router-link>
        <router-link to="/main/demand" class="menu-item" active-class="active">需求采集</router-link>
        <router-link to="/main/match" class="menu-item" active-class="active">匹配方案</router-link>
        <router-link to="/main/order" class="menu-item" active-class="active">报价订单</router-link>
        <router-link to="/main/analytics" class="menu-item" active-class="active">数据分析</router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="action-btn secondary" @click="showLogout = true">安全退出</button>
      </div>
    </aside>

    <main class="content">
      <header class="topbar">
        <div class="title-group">
          <h1>优特钢标准动态制定与销售精准匹配系统</h1>
          <span>亮色自适应 · 五大功能模块</span>
        </div>
        <div class="user">
          <img :src="avatar" alt="用户头像" />
          <div>
            <strong>钢研管理员</strong>
            <p>在线 · 14:08更新</p>
          </div>
        </div>
      </header>
      <section class="view">
        <router-view />
      </section>
    </main>

    <AppModal v-model="showLogout" title="确认退出" @confirm="handleLogout">
      <p>系统已保存当前模块数据，是否确认退出登陆？</p>
    </AppModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppModal from '../components/AppModal.vue';

const router = useRouter();
const showLogout = ref(false);
const avatar =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect width="72" height="72" rx="24" fill="%23e6efff"/><circle cx="36" cy="30" r="14" fill="%2390b2ff"/><rect x="18" y="44" width="36" height="18" rx="9" fill="%2390b2ff"/></svg>';

const handleLogout = () => {
  showLogout.value = false;
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
  background: #ffffff;
  border-right: 1px solid #edf1f7;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2f6df6, #8fb1ff);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.brand p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6b7a99;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 600;
  color: #4f5f82;
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease;
}

.menu-item.active,
.menu-item:hover {
  background: #f0f5ff;
  color: #2f6df6;
}

.sidebar-footer {
  margin-top: auto;
}

.content {
  display: flex;
  flex-direction: column;
  padding: 24px 28px 40px;
  gap: 20px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.title-group h1 {
  margin: 0;
  font-size: 22px;
}

.title-group span {
  font-size: 13px;
  color: #6b7a99;
}

.user {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(15, 27, 55, 0.08);
}

.user img {
  width: 48px;
  height: 48px;
}

.user p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6b7a99;
}

.view {
  flex: 1;
}

@media (max-width: 980px) {
  .layout {
    grid-template-columns: 200px 1fr;
  }
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    padding: 20px;
  }
}
</style>
