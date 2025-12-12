<template>
  <div class="layout" style="display: grid; grid-template-columns: 260px 1fr; min-height: 100vh;">
    <aside class="sidebar card" style="display: flex; flex-direction: column; gap: 12px;">
      <div class="flex-between">
        <div style="font-weight: 800;">数字化作品</div>
        <router-link to="/login" style="color: var(--muted); font-weight: 600;">退出</router-link>
      </div>
      <div class="grid" style="gap: 10px;">
        <router-link v-for="link in links" :key="link.to" :to="link.to" class="card" style="padding: 12px; border: 1px solid #eef2fa;">
          <div style="font-weight: 700;">{{ link.label }}</div>
          <p style="margin: 6px 0 0; color: var(--muted); font-size: 13px;">{{ link.desc }}</p>
        </router-link>
      </div>
      <div class="card" style="background: linear-gradient(135deg, #e8f2ff, #fff);">
        <div style="font-weight: 700; margin-bottom: 6px;">实时动态</div>
        <ul class="timeline">
          <li v-for="item in activities" :key="item.time">
            <div class="flex-between" style="gap: 8px;">
              <strong>{{ item.title }}</strong>
              <span style="color: var(--muted); font-size: 12px;">{{ item.time }}</span>
            </div>
            <div style="color: var(--muted);">{{ item.detail }}</div>
          </li>
        </ul>
      </div>
    </aside>
    <main style="padding: 20px;">
      <div class="card" style="margin-bottom: 16px;">
        <div class="flex-between" style="gap: 12px;">
          <div>
            <div class="badge">自适应亮色界面</div>
            <h2 style="margin: 8px 0 4px;">数字化作品展示共享系统</h2>
            <p style="color: var(--muted);">在内容区灵活切换模块，快速完成展示、共享、互动、分析与权限配置。</p>
          </div>
          <div class="card" style="background: #f5fbff; min-width: 220px;">
            <div class="stat-card">
              <div>在线展厅</div>
              <strong style="font-size: 22px;">5</strong>
            </div>
            <div class="stat-card">
              <div>活跃创作者</div>
              <strong style="font-size: 22px; color: var(--primary);">48</strong>
            </div>
          </div>
        </div>
      </div>
      <router-view />
    </main>
  </div>
</template>

<script setup>
const links = [
  { to: '/gallery', label: '作品展示', desc: '精选作品与海报展示' },
  { to: '/share', label: '共享管理', desc: '流转与协作管控' },
  { to: '/interaction', label: '互动体验', desc: '点赞评论与弹窗反馈' },
  { to: '/analytics', label: '数据分析', desc: '图表与数据洞察' },
  { to: '/admin', label: '权限设置', desc: '角色策略与安全提示' }
];

const activities = [
  { title: '海报《云端》发布', detail: '已推送到公共展柜，观看量 1.2k', time: '10:20' },
  { title: '权限策略更新', detail: '策展人角色开放高清下载', time: '09:55' },
  { title: '互动热度上升', detail: '新增 86 条评论与 230 次点赞', time: '09:30' }
];
</script>
