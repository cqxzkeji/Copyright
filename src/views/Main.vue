<template>
  <div class="layout">
    <aside class="sidebar card">
      <div class="logo">膨润土磷管理</div>
      <nav>
        <button class="nav-btn" :class="{ active: isActive('adsorption') }" @click="go('adsorption')">磷吸附</button>
        <button class="nav-btn" :class="{ active: isActive('remediation') }" @click="go('remediation')">吸附修复</button>
        <button class="nav-btn" :class="{ active: isActive('recovery') }" @click="go('recovery')">资源化管理</button>
        <button class="nav-btn" :class="{ active: isActive('analysis') }" @click="go('analysis')">数据分析</button>
        <button class="nav-btn" :class="{ active: isActive('settings') }" @click="go('settings')">系统设置</button>
      </nav>
      <div class="sidebar-actions">
        <button class="btn" @click="showLogout = true">退出</button>
      </div>
    </aside>
    <main class="content">
      <router-view />
    </main>

    <div v-if="showLogout" class="modal-backdrop" @click.self="showLogout = false">
      <div class="modal">
        <header>
          <span>确认退出</span>
          <button class="btn" @click="showLogout = false">关闭</button>
        </header>
        <p>确认退出当前账号并返回登录页？</p>
        <footer>
          <button class="btn" @click="showLogout = false">取消</button>
          <button class="btn primary" @click="logout">退出登录</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();
const showLogout = ref(false);

const go = (path) => {
  router.push(`/main/${path}`);
};

const isActive = (name) => route.path.includes(name);

const logout = () => {
  localStorage.removeItem('bentonite-auth');
  router.replace('/login');
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  padding: 18px;
  gap: 16px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo {
  font-weight: 800;
  font-size: 20px;
}

.nav-btn {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-weight: 700;
  color: #0f172a;
  text-align: left;
  transition: 0.2s ease;
}

.nav-btn.active, .nav-btn:hover {
  background: linear-gradient(90deg, #dbeafe, #e0f2fe);
  border-color: #bfdbfe;
}

.content {
  width: 100%;
}

.sidebar-actions {
  margin-top: auto;
  display: flex;
  gap: 10px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .nav-btn {
    flex: 1 1 calc(50% - 12px);
  }
  .sidebar-actions {
    width: 100%;
  }
}
</style>
