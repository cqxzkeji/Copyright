<template>
  <div class="app-shell">
    <template v-if="isLogin">
      <router-view />
    </template>
    <template v-else>
      <aside class="sidebar">
        <div class="logo">
          <div class="logo-icon">CA</div>
          <div>
            <p class="logo-title">竣工验收管控</p>
            <p class="logo-subtitle">商住综合体</p>
          </div>
        </div>
        <nav class="menu">
          <router-link v-for="item in menu" :key="item.path" class="menu-item" :to="item.path">
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
        <div class="sidebar-footer">
          <div class="info-card">
            <p class="info-title">今日提醒</p>
            <p class="info-value">12 项节点待确认</p>
            <button class="btn ghost" type="button" @click="reminderOpen = true">查看提醒</button>
          </div>
        </div>
      </aside>
      <main class="content">
        <header class="topbar">
          <div>
            <h1>竣工验收与移交证书全流程管控系统</h1>
            <p>统一计划、在线审批、问题整改闭环与证书移交管理</p>
          </div>
          <div class="top-actions">
            <button class="btn ghost" type="button" @click="filterOpen = true">全局筛选</button>
            <button class="btn primary" type="button" @click="taskOpen = true">新增任务</button>
          </div>
        </header>
        <section class="content-body">
          <router-view />
        </section>
      </main>
      <BaseModal
        :open="reminderOpen"
        title="节点提醒与跟进"
        subtitle="今日待确认节点汇总与责任单位提醒"
        @close="reminderOpen = false"
      >
        <ul class="modal-list">
          <li>住宅 3 号楼：消防验收待提交资料（责任单位：施工总包）</li>
          <li>商业 1 期：机电调试待复验（责任单位：机电分包）</li>
          <li>公区 2 区：观感评估待整改复查（责任单位：装饰单位）</li>
        </ul>
        <template #footer>
          <button class="btn secondary" type="button" @click="reminderOpen = false">稍后处理</button>
          <button class="btn primary" type="button" @click="reminderOpen = false">已安排跟进</button>
        </template>
      </BaseModal>
      <BaseModal
        :open="filterOpen"
        title="全局筛选"
        subtitle="按专业、楼栋、批次快速筛选"
        @close="filterOpen = false"
      >
        <div class="form-grid">
          <label class="field">
            <span>专业</span>
            <select class="select">
              <option>全部专业</option>
              <option>住宅工程</option>
              <option>商业工程</option>
              <option>机电工程</option>
              <option>消防工程</option>
            </select>
          </label>
          <label class="field">
            <span>楼栋</span>
            <select class="select">
              <option>全部楼栋</option>
              <option>A1</option>
              <option>A2</option>
              <option>B1</option>
            </select>
          </label>
          <label class="field">
            <span>批次</span>
            <select class="select">
              <option>全部批次</option>
              <option>一期</option>
              <option>二期</option>
              <option>三期</option>
            </select>
          </label>
        </div>
        <template #footer>
          <button class="btn ghost" type="button" @click="filterOpen = false">重置</button>
          <button class="btn primary" type="button" @click="filterOpen = false">应用筛选</button>
        </template>
      </BaseModal>
      <BaseModal
        :open="taskOpen"
        title="新增验收任务"
        subtitle="创建验收节点并绑定责任单位"
        @close="taskOpen = false"
      >
        <div class="form-grid">
          <label class="field">
            <span>任务名称</span>
            <input class="input" placeholder="填写验收任务名称" />
          </label>
          <label class="field">
            <span>责任单位</span>
            <input class="input" placeholder="施工/监理/设计单位" />
          </label>
          <label class="field">
            <span>计划时间</span>
            <input class="input" type="date" />
          </label>
        </div>
        <label class="field">
          <span>说明</span>
          <textarea class="textarea" rows="3" placeholder="补充验收范围与注意事项"></textarea>
        </label>
        <template #footer>
          <button class="btn ghost" type="button" @click="taskOpen = false">取消</button>
          <button class="btn primary" type="button" @click="taskOpen = false">提交任务</button>
        </template>
      </BaseModal>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import BaseModal from "./components/BaseModal.vue";

const route = useRoute();
const isLogin = computed(() => route.path === "/login");
const reminderOpen = ref(false);
const filterOpen = ref(false);
const taskOpen = ref(false);

const menu = [
  { label: "验收与移交总览", path: "/dashboard" },
  { label: "竣工验收计划管理", path: "/acceptance-plan" },
  { label: "验收流程与审批", path: "/acceptance-process" },
  { label: "问题整改与复验", path: "/rectification" },
  { label: "移交证书管理", path: "/handover-certificate" },
  { label: "归档查询与统计", path: "/archive-analysis" }
];
</script>

<style>
:root {
  color-scheme: light;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f8fafc;
  color: #0f172a;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f8fafc;
}

a {
  text-decoration: none;
  color: inherit;
}

.app-shell {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #60a5fa, #38bdf8);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.logo-title {
  font-weight: 700;
  font-size: 16px;
}

.logo-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
  color: #1e293b;
  font-size: 14px;
  border: 1px solid transparent;
  transition: 0.2s;
}

.menu-item.router-link-active {
  background: #e0f2fe;
  border-color: #38bdf8;
  color: #0369a1;
}

.sidebar-footer {
  margin-top: auto;
}

.info-card {
  background: #f1f5f9;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 8px;
}

.info-title {
  font-size: 13px;
  color: #64748b;
}

.info-value {
  font-weight: 700;
  font-size: 18px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 32px 40px;
  gap: 20px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(148, 163, 184, 0.2);
}

.topbar h1 {
  font-size: 22px;
}

.topbar p {
  color: #64748b;
  margin-top: 6px;
  font-size: 14px;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.btn.primary {
  background: linear-gradient(135deg, #38bdf8, #3b82f6);
  color: #ffffff;
}

.btn.ghost {
  background: #ffffff;
  border-color: #e2e8f0;
  color: #334155;
}

.btn.secondary {
  background: #f1f5f9;
  color: #0f172a;
}

.section-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(148, 163, 184, 0.2);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th,
.table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.table th {
  background: #f8fafc;
  color: #475569;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: #e0f2fe;
  color: #0284c7;
}

.input,
.select,
.textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

.field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #22c55e, #3b82f6);
}

.modal-list {
  display: grid;
  gap: 8px;
  padding-left: 18px;
  color: #334155;
  font-size: 13px;
}

@media (max-width: 1024px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    flex-direction: row;
    flex-wrap: wrap;
    position: static;
  }

  .content {
    padding: 20px;
  }
}
</style>
