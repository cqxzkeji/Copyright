<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon">TRIM</div>
        <div>
          <h2>内外饰工程</h2>
          <p>设计管理系统</p>
        </div>
      </div>
      <nav class="menu">
        <router-link
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="menu-item"
        >
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div>
          <strong>当前租户</strong>
          <p>智驾内外饰中心</p>
        </div>
        <button type="button" class="ghost" @click="showNotice = true">系统公告</button>
      </div>
    </aside>
    <section class="main">
      <header class="topbar">
        <div>
          <h1>{{ currentTitle }}</h1>
          <p>项目与平台数据实时刷新 · 今日同步 18:30</p>
        </div>
        <div class="top-actions">
          <button type="button" class="ghost" @click="showTips = true">操作提示</button>
          <button type="button" class="primary" @click="showProgress = true">同步进度</button>
        </div>
      </header>
      <div class="content">
        <router-view />
      </div>
    </section>
  </div>
  <BaseModal v-model="showNotice" title="系统公告">
    <p>当前系统已开启全链路审计，重要操作均需二次确认。</p>
    <p>请在本周内完成各项目里程碑状态更新。</p>
    <template #footer>
      <button class="primary" type="button" @click="showNotice = false">收到</button>
    </template>
  </BaseModal>
  <BaseModal v-model="showTips" title="操作提示">
    <ul class="tips">
      <li>侧边栏为固定菜单，切换模块不会影响当前窗口大小。</li>
      <li>每个模块均支持表格编辑、资料查看与责任分派。</li>
      <li>重要按钮会弹出表单或进度弹窗，请按指引填写。</li>
    </ul>
    <template #footer>
      <button class="primary" type="button" @click="showTips = false">知道了</button>
    </template>
  </BaseModal>
  <BaseModal v-model="showProgress" title="数据同步进度" width="520px">
    <div class="progress-block">
      <div class="progress-row">
        <span>项目主数据</span>
        <div class="progress">
          <div class="progress-fill" style="width: 80%"></div>
        </div>
        <strong>80%</strong>
      </div>
      <div class="progress-row">
        <span>零部件BOM</span>
        <div class="progress">
          <div class="progress-fill" style="width: 62%"></div>
        </div>
        <strong>62%</strong>
      </div>
      <div class="progress-row">
        <span>供应商资料</span>
        <div class="progress">
          <div class="progress-fill" style="width: 45%"></div>
        </div>
        <strong>45%</strong>
      </div>
    </div>
    <template #footer>
      <button class="ghost" type="button" @click="showProgress = false">稍后查看</button>
      <button class="primary" type="button" @click="showProgress = false">已同步</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const route = useRoute();
const showNotice = ref(false);
const showTips = ref(false);
const showProgress = ref(false);

const menu = [
  { path: '/main/project', label: '项目与车型平台管理' },
  { path: '/main/parts', label: '内外饰零部件设计与BOM管理' },
  { path: '/main/change', label: '变更与评审签审流程' },
  { path: '/main/prototype', label: '试制验证与问题闭环' },
  { path: '/main/supplier', label: '供应商协同与资料归档' }
];

const currentTitle = computed(() => route.meta.title || '工作台');
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0f172a;
  color: #f8fafc;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  background: #38bdf8;
  color: #0f172a;
  padding: 10px;
  border-radius: 12px;
  font-weight: 700;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
}

.logo p {
  margin: 0;
  font-size: 12px;
  color: #cbd5f5;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  color: #e2e8f0;
  text-decoration: none;
  background: rgba(148, 163, 184, 0.08);
  transition: all 0.2s ease;
  font-size: 14px;
}

.menu-item.router-link-active {
  background: #1d4ed8;
  color: #fff;
}

.menu-item:hover {
  background: rgba(59, 130, 246, 0.3);
}

.sidebar-footer {
  margin-top: auto;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main {
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
}

.topbar {
  padding: 24px 32px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  gap: 16px;
  flex-wrap: wrap;
}

.topbar h1 {
  margin: 0;
  font-size: 22px;
}

.topbar p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.content {
  padding: 24px 32px 40px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.ghost {
  background: #e2e8f0;
  color: #1f2a44;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.tips {
  margin: 0;
  padding-left: 18px;
  line-height: 1.8;
}

.progress-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-row {
  display: grid;
  grid-template-columns: 120px 1fr 50px;
  align-items: center;
  gap: 12px;
}

.progress {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 5;
  }
}
</style>
