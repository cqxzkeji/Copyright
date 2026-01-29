<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">档</div>
        <div>
          <strong>教学档案系统</strong>
          <span>Digital Archive</span>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/dashboard/archive" class="menu-item">档案数字化管理</router-link>
        <router-link to="/dashboard/category" class="menu-item">分类与标签管理</router-link>
        <router-link to="/dashboard/permission" class="menu-item">权限控制与审计</router-link>
        <router-link to="/dashboard/search" class="menu-item">档案查询与检索</router-link>
        <router-link to="/dashboard/export" class="menu-item">共享与导出</router-link>
      </nav>
      <div class="sidebar-footer">
        <span>在线用户：128</span>
        <span>存储占用：68%</span>
      </div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <h2>欢迎回来，教学档案管理员</h2>
          <p>今日待处理任务：12 条 | 扫描队列：3 项</p>
        </div>
        <div class="actions">
          <button class="ghost" type="button" @click="openModal('notice')">消息中心</button>
          <button class="primary" type="button" @click="openModal('logout')">退出系统</button>
        </div>
      </header>
      <section class="content">
        <router-view />
      </section>
    </main>
    <BaseModal :open="activeModal === 'notice'" title="消息中心" @close="closeModal">
      <ul class="notice-list">
        <li>扫描任务“2024-春季课程评价”已完成OCR处理。</li>
        <li>标签“实习实践”本周新增 18 份档案。</li>
        <li>权限审批：教务处批量导出申请待处理。</li>
      </ul>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">稍后查看</button>
        <button class="primary" type="button" @click="closeModal">标记已读</button>
      </template>
    </BaseModal>
    <BaseModal :open="activeModal === 'logout'" title="退出确认" @close="closeModal">
      <p>确认退出系统？未保存的操作将自动保存为草稿。</p>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <router-link class="primary" to="/" @click="closeModal">确认退出</router-link>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: #f1f5f9;
}

.sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: bold;
}

.brand span {
  display: block;
  color: #94a3b8;
  font-size: 12px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 12px 16px;
  border-radius: 12px;
  color: #334155;
  background: #f8fafc;
}

.menu-item.router-link-active {
  background: #e0f2fe;
  color: #1d4ed8;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.main {
  flex: 1;
  padding: 24px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.topbar h2 {
  margin: 0;
  font-size: 20px;
}

.topbar p {
  margin: 6px 0 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
}

.primary,
.ghost,
.secondary {
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e2e8f0;
  color: #0f172a;
}

.ghost {
  background: #e2e8f0;
  color: #0f172a;
}

.content {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  min-height: 70vh;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.notice-list {
  padding-left: 18px;
  margin: 0;
  display: grid;
  gap: 8px;
}

@media (max-width: 1024px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .main {
    padding: 20px;
  }
}
</style>
