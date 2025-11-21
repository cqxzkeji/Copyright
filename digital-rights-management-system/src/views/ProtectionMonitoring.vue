<template>
  <div class="module-shell">
    <section class="panel">
      <header class="panel-header">
        <div>
          <h2>实时监控</h2>
          <p>平台在 8 个渠道同步抓取盗版线索</p>
        </div>
        <button @click="startMonitoring">启动探测</button>
      </header>
      <div class="radar-chart">
        <div v-for="(point, index) in radarPoints" :key="index" class="radar-point" :style="point"></div>
        <div class="radar-center"></div>
      </div>
      <div class="monitor-controls">
        <button class="secondary" @click="issueNotice">发送侵权通知</button>
        <button class="ghost" @click="exportEvidence">导出取证包</button>
      </div>
    </section>

    <section class="panel">
      <header class="panel-header">
        <h2>告警列表</h2>
        <button @click="refreshAlerts">刷新</button>
      </header>
      <ul class="alert-list">
        <li v-for="alert in alerts" :key="alert.id">
          <div>
            <strong>{{ alert.platform }}</strong>
            <p>{{ alert.desc }}</p>
          </div>
          <button @click="() => handleAlert(alert)">处理</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
const alerts = [
  { id: 1, platform: '短视频平台', desc: '疑似转载完整版 MV，热度 1.2w' },
  { id: 2, platform: '海外镜像站', desc: '抓取到 37 个盗链地址' },
  { id: 3, platform: '社交媒体', desc: '未经授权的海报分享 15 条' }
];

const radarPoints = Array.from({ length: 12 }).map((_, index) => ({
  transform: `rotate(${index * 30}deg) translateX(110px)`
}));

function startMonitoring() {
  window.alert('探测器已重新启动，最新指纹将在 3 分钟内同步。');
}

function issueNotice() {
  window.alert('已自动向 4 家平台发送律师函。');
}

function exportEvidence() {
  window.alert('正在打包取证报告，完成后将推送至邮箱。');
}

function refreshAlerts() {
  window.alert('已刷新，暂无新的告警。');
}

function handleAlert(alert) {
  window.alert(`已登记处理：${alert.platform}\n描述：${alert.desc}`);
}
</script>

<style scoped>
.module-shell {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.panel {
  flex: 1 1 360px;
  background: rgba(249, 250, 251, 0.9);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.radar-chart {
  position: relative;
  width: 260px;
  height: 260px;
  margin: 0 auto;
  border-radius: 50%;
  border: 1px solid rgba(99, 102, 241, 0.4);
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent);
}

.radar-point {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #f97316;
  border-radius: 50%;
  transform-origin: 0 0;
}

.radar-center {
  position: absolute;
  top: calc(50% - 6px);
  left: calc(50% - 6px);
  width: 12px;
  height: 12px;
  background: #22d3ee;
  border-radius: 50%;
}

.monitor-controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.secondary {
  background: #22c55e;
}

.ghost {
  background: #0f172a;
}

.alert-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  gap: 1rem;
}

.alert-list strong {
  display: block;
  margin-bottom: 0.25rem;
}
</style>
