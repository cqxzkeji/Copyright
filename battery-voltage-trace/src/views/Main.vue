<template>
  <div class="menu-layout">
    <aside class="menu">
      <h2>功能导航</h2>
      <div v-for="item in menu" :key="item.path" :class="['menu-item', route.path.includes(item.path) ? 'active' : '']" @click="go(item.path)">
        <span>{{ item.label }}</span>
        <span style="font-size:12px;color:var(--muted);">{{ item.tip }}</span>
      </div>
      <div style="margin-top: 20px;" class="card">
        <p style="margin-bottom:6px; font-weight: 700;">运行状态</p>
        <div class="tag"><span class="status-dot" style="background:#1f7aec;"></span> 云端同步正常</div>
        <div style="margin-top:10px;" class="tag"><span class="status-dot" style="background:#23c19a;"></span> 采集器已连接</div>
        <div style="margin-top:10px; display:flex; gap:8px;">
          <button class="btn btn-ghost" @click="openNotice">提示</button>
          <button class="btn btn-ghost" @click="logout">退出</button>
        </div>
      </div>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
  <ModalDialog v-model="notice" title="提示信息" :withFooter="false">
    <p>菜单栏为固定宽度，模块内容自适应窗口大小。</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const route = useRoute();
const notice = ref(false);
const menu = [
  { path: '/app/device', label: '设备与防摔管理', tip: '建档/维护' },
  { path: '/app/collect', label: '电压数据采集', tip: '实时采集' },
  { path: '/app/trace', label: '数据追溯管理', tip: '时间链路' },
  { path: '/app/analysis', label: '智能分析预警', tip: '趋势/预警' },
  { path: '/app/report', label: '统计报表运维', tip: '导出/闭环' }
];

const go = (path) => router.push(path);
const logout = () => {
  localStorage.removeItem('bv-auth');
  router.push('/login');
};
const openNotice = () => (notice.value = true);
</script>
