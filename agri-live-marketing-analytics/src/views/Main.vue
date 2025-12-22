<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">AG</div>
        <div>
          <h2>农产品直播</h2>
          <p>营销数据分析</p>
        </div>
      </div>
      <nav class="menu">
        <RouterLink to="/main/dashboard" class="menu-item" active-class="active">直播营销看板</RouterLink>
        <RouterLink to="/main/live-manage" class="menu-item" active-class="active">数据接入与治理</RouterLink>
        <RouterLink to="/main/anchor-manage" class="menu-item" active-class="active">主播与内容分析</RouterLink>
        <RouterLink to="/main/order-manage" class="menu-item" active-class="active">商品与活动分析</RouterLink>
        <RouterLink to="/main/data-analysis" class="menu-item" active-class="active">投放与智能策略</RouterLink>
        <RouterLink to="/main/system-setting" class="menu-item" active-class="active">系统设置</RouterLink>
      </nav>
      <div class="user">
        <span>数据分析师</span>
        <button class="btn" @click="showTip = true">退出提示</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h1>农产品直播营销数据分析系统</h1>
          <p>数据接入、监控与策略协同的统一工作台</p>
        </div>
        <div class="status">
          <div>
            <strong>{{ currentDate }}</strong>
            <span>数据更新频率：5分钟</span>
          </div>
          <button class="btn primary" @click="showNotice = true">查看公告</button>
        </div>
      </header>
      <section class="workspace">
        <RouterView />
      </section>
    </main>
    <BaseModal :show="showTip" title="退出提示" @close="showTip = false">
      <p>系统将自动保存当前筛选条件。确认退出侧边栏操作？</p>
    </BaseModal>
    <BaseModal :show="showNotice" title="今日公告" @close="showNotice = false">
      <ul class="notice">
        <li>新接入“农场直营”数据源，数据延迟低于2分钟。</li>
        <li>智能投放策略已同步最新节日活动模板。</li>
        <li>主播内容评分引入互动弹幕热度系数。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const showTip = ref(false);
const showNotice = ref(false);

const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
});
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.sidebar {
  background: #ffffff;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-right: 1px solid #eef0f6;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 48px;
  height: 48px;
  background: #377dff;
  color: #fff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.brand h2 {
  margin: 0;
  font-size: 18px;
}

.brand p {
  margin: 0;
  color: #7b889f;
  font-size: 12px;
}

.menu {
  display: grid;
  gap: 10px;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 12px;
  color: #506083;
  background: transparent;
}

.menu-item.active {
  background: #e8f0ff;
  color: #2a5bd7;
  font-weight: 600;
}

.user {
  margin-top: auto;
  display: grid;
  gap: 12px;
  color: #6b7a99;
}

.content {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.topbar h1 {
  margin: 0;
  font-size: 22px;
}

.topbar p {
  margin: 6px 0 0;
  color: #6b7a99;
  font-size: 14px;
}

.status {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7a99;
}

.status div {
  display: grid;
  gap: 4px;
  font-size: 12px;
}

.workspace {
  flex: 1;
  display: block;
}

.notice {
  margin: 0;
  padding-left: 18px;
  color: #3b4766;
  display: grid;
  gap: 6px;
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .menu {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .content {
    padding: 24px;
  }
}
</style>
