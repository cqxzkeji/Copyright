<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="dot" />
        <div>
          <p class="eyebrow">切割控制</p>
          <strong>主控工作台</strong>
        </div>
      </div>
      <nav class="menu">
        <RouterLink v-for="item in menus" :key="item.path" :to="item.path" class="menu-item" active-class="active">
          <span>{{ item.icon }}</span>
          <div>
            <p class="menu-title">{{ item.label }}</p>
            <small>{{ item.desc }}</small>
          </div>
        </RouterLink>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <p class="eyebrow" style="margin: 0;">设备安全在线</p>
          <h2 style="margin: 4px 0 0;">多功能高精度切割装备控制系统</h2>
        </div>
        <div class="top-actions">
          <button class="secondary-btn" @click="showNotice = true">通知</button>
          <button class="primary-btn" @click="showProfile = true">个人中心</button>
        </div>
      </header>
      <section class="module-wrapper">
        <RouterView />
      </section>
    </main>
    <div v-if="showNotice" class="modal-backdrop" @click.self="showNotice = false">
      <div class="modal-card">
        <h3 style="margin: 0 0 6px;">系统提示</h3>
        <ul style="margin: 0 0 12px; padding-left: 18px; color: #4b5563;">
          <li>所有功能模块已解锁并加载到内容窗口。</li>
          <li>设备控制需要确保操作员完成安全检查。</li>
          <li>数据分析与报告模块已自动生成日报。</li>
        </ul>
        <button class="primary-btn" @click="showNotice = false">关闭提醒</button>
      </div>
    </div>
    <div v-if="showProfile" class="modal-backdrop" @click.self="showProfile = false">
      <div class="modal-card">
        <h3 style="margin: 0 0 6px;">当前账号</h3>
        <p style="margin: 0 0 12px;">高级工程师 · 已启用双因子验证</p>
        <div class="progress" style="margin-bottom: 12px;">
          <span style="width: 78%;"></span>
        </div>
        <button class="secondary-btn" @click="showProfile = false">返回工作</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const showNotice = ref(false);
const showProfile = ref(false);
const menus = [
  {
    path: '/app/equipment-control',
    label: '切割设备控制',
    desc: '启停、功率、轨迹与安全锁定',
    icon: '🛠️'
  },
  {
    path: '/app/cutting-task',
    label: '切割任务管理',
    desc: '任务计划、状态跟踪与调度',
    icon: '📋'
  },
  {
    path: '/app/precision-calibration',
    label: '精度校准与调整',
    desc: '激光、刀具、平台校准',
    icon: '🎯'
  },
  {
    path: '/app/maintenance-tracking',
    label: '维护与故障追踪',
    desc: '备件、保养、报警记录',
    icon: '🩺'
  },
  {
    path: '/app/data-analysis',
    label: '数据分析与报告',
    desc: '效率、能耗与产能报告',
    icon: '📈'
  },
  {
    path: '/app/system-settings',
    label: '系统设置与用户管理',
    desc: '权限、偏好、安全策略',
    icon: '⚙️'
  }
];
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #f8fbff, #eef2ff);
  border-right: 1px solid #e5e7eb;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.dot {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4ea8de, #2f54eb);
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid transparent;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.menu-item small {
  color: #6b7280;
}

.menu-item:hover {
  border-color: #caddff;
}

.menu-item.active {
  border-color: #4ea8de;
  box-shadow: 0 12px 28px rgba(78, 168, 222, 0.18);
}

.content {
  background: #f5f8fb;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topbar {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
}

.top-actions {
  display: flex;
  gap: 10px;
}

.module-wrapper {
  background: transparent;
}

@media (max-width: 1080px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    overflow-x: auto;
    gap: 12px;
  }
  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .menu-item {
    min-width: 220px;
  }
}
</style>
