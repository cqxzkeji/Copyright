<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">CI</div>
        <div>
          <div class="title">企业咨询智能研判</div>
          <div class="subtitle">多维风险治理中心</div>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/main/intake">咨询采集接入</router-link>
        <router-link to="/main/parsing">解析抽取与知识</router-link>
        <router-link to="/main/judge">智能研判评分</router-link>
        <router-link to="/main/workflow">工单协同闭环</router-link>
        <router-link to="/main/analytics">看板分析报告</router-link>
      </nav>
      <div class="profile">
        <div>
          <strong>当前用户</strong>
          <p>分析师 / 高级咨询</p>
        </div>
        <button class="secondary" @click="logout">退出登录</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h2>{{ currentTitle }}</h2>
          <p>实时汇聚咨询数据，支持规则 + 模型的智能研判。</p>
        </div>
        <div class="top-actions">
          <button class="ghost" @click="openTip('消息中心已同步 3 条预警。')">消息提醒</button>
          <button class="primary" @click="openTip('已刷新最新研判结果。')">刷新数据</button>
        </div>
      </header>
      <section class="module-panel">
        <router-view />
      </section>
    </main>
    <BaseModal v-model="tipOpen" title="提示信息" @confirm="tipOpen = false">
      <p>{{ tipMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseModal from "../components/BaseModal.vue";

const router = useRouter();
const route = useRoute();
const tipOpen = ref(false);
const tipMessage = ref("");

const titleMap = {
  "/main/intake": "咨询信息采集与接入",
  "/main/parsing": "文本解析与知识抽取",
  "/main/judge": "智能研判与风险评分",
  "/main/workflow": "处置协同与工单闭环",
  "/main/analytics": "看板分析与报告输出"
};

const currentTitle = computed(() => titleMap[route.path] ?? "企业咨询智能研判系统");

const logout = () => {
  router.push("/login");
};

const openTip = (message) => {
  tipMessage.value = message;
  tipOpen.value = true;
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0f172a;
  color: #e2e8f0;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #38bdf8;
  color: #0f172a;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.title {
  font-weight: 700;
}

.subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.menu {
  display: grid;
  gap: 12px;
}

.menu a {
  text-decoration: none;
  color: #e2e8f0;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(148, 163, 184, 0.1);
}

.menu a.router-link-active {
  background: #1d4ed8;
}

.profile {
  margin-top: auto;
  display: grid;
  gap: 12px;
  font-size: 13px;
  color: #cbd5f5;
}

.secondary {
  border: none;
  background: #334155;
  color: #e2e8f0;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.content {
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px 12px;
  gap: 20px;
}

.topbar h2 {
  margin: 0;
}

.topbar p {
  margin: 6px 0 0;
  color: #64748b;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #fff;
  border: 1px solid #cbd5f5;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.module-panel {
  padding: 0 32px 32px;
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .menu {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    width: 100%;
  }
}
</style>
