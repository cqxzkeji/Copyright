<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">安装检测平台</div>
      <nav class="nav">
        <router-link to="/main/install-config">安装工艺管理</router-link>
        <router-link to="/main/process-monitor">过程监测采集</router-link>
        <router-link to="/main/quality-detect">质量检测判定</router-link>
        <router-link to="/main/alarm-review">异常报警复检</router-link>
        <router-link to="/main/data-analysis">数据统计分析</router-link>
      </nav>
      <div class="tag">在线 · 正常运行</div>
    </aside>
    <section class="main">
      <header class="topbar">
        <div>
          <strong>发动机支架安装与检测系统</strong>
          <div style="color: var(--muted); font-size: 12px;">全流程装配可追溯 · 质量闭环管理</div>
        </div>
        <div class="info-row">
          <span class="tag">今日工位 12</span>
          <span class="tag">合格率 98.6%</span>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </section>
  </div>
</template>

<script setup></script>
