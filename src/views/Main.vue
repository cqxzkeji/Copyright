<template>
  <div class="layout">
    <aside class="sidebar">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#3e9df6,#52d1f2);display:grid;place-items:center;color:#fff;font-weight:800;">UR</div>
        <div>
          <div style="font-weight:800;">城市更新评估</div>
          <div style="color:var(--muted);font-size:12px;">模块化导航</div>
        </div>
      </div>
      <div v-for="item in menus" :key="item.path" :class="['menu-item', activePath === item.path ? 'active' : '']" @click="go(item.path)">
        <span>{{ item.name }}</span>
        <span class="tag" style="margin-left:auto;">{{ item.tag }}</span>
      </div>
      <div class="card" style="gap:8px;">
        <div style="font-weight:700;">运行摘要</div>
        <div class="progress-bar"><span :style="{ width: '72%' }"></span></div>
        <small style="color:var(--muted);">模板加载、评分规则、预警阈值已准备就绪</small>
      </div>
    </aside>
    <main>
      <header class="header">
        <div class="header-title">
          <span style="width:10px;height:10px;border-radius:50%;background:var(--accent);"></span>
          <span>综合工作台</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="tag">实时监控</span>
          <span class="tag">数据完整性</span>
          <button class="btn secondary" @click="openNotify">提醒</button>
        </div>
      </header>
      <div class="content">
        <router-view />
      </div>
    </main>
    <div v-if="showNotify" class="overlay" @click.self="showNotify=false">
      <div class="modal">
        <h3>提示</h3>
        <p>模块切换与数据刷新的提示信息。</p>
        <div class="progress-bar"><span :style="{ width: '45%' }"></span></div>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button class="btn" @click="showNotify=false">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const showNotify = ref(false);

const menus = [
  { name: '基础数据与项目库', path: '/main/project-database', tag: '5条+' },
  { name: '指标体系与模型配置', path: '/main/indicator-model', tag: '权重' },
  { name: '可行性综合评估', path: '/main/feasibility', tag: '评分' },
  { name: '实施计划与过程监测', path: '/main/implementation', tag: '进度' },
  { name: '风险预警与决策支持', path: '/main/risk', tag: '预警' },
];

const activePath = computed(() => route.path);

const go = (path) => {
  router.push(path);
};

const openNotify = () => {
  showNotify.value = true;
};
</script>
