<template>
  <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 16px;">
    <section class="card player">
      <div class="player-shell">
        <div class="video-simulate">播放窗口</div>
        <div class="player-controls">
          <span class="chip inline">当前倍速：{{ currentRate }}</span>
          <button class="btn" @click="showPlayHint = true">播放提示</button>
          <button class="btn secondary" @click="showRate = true">倍速</button>
          <button class="btn" @click="showCapture = true">截图分享</button>
        </div>
        <p v-if="captureLink" class="muted">{{ captureLink }}</p>
      </div>
    </section>
    <section class="card">
      <div class="header">
        <h3>播放数据</h3>
        <button class="btn secondary" @click="showLog = true">导出日志</button>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));">
        <div v-for="metric in metrics" :key="metric.label" class="stat">
          <div class="value">{{ metric.value }}</div>
          <div class="label">{{ metric.label }}</div>
        </div>
      </div>
      <div class="dashboard-chart">
        <div v-for="item in chart" :key="item.hour" class="bar" :style="{ height: item.height + 'px' }">
          {{ item.hour }}
        </div>
      </div>
      <p v-if="exportInfo" class="muted">{{ exportInfo }}</p>
    </section>
  </div>

  <Modal v-if="showPlayHint" title="播放提示" @close="showPlayHint = false">
    <p>缓冲完成后自动播放，点击任意位置暂停。</p>
    <button class="btn" @click="showPlayHint = false">好的</button>
  </Modal>

  <Modal v-if="showRate" title="调整倍速" @close="showRate = false">
    <form class="form-grid" @submit.prevent="applyRate">
      <label>选择倍速</label>
      <select v-model="rateSelection">
        <option>0.75x</option>
        <option>1.0x</option>
        <option>1.25x</option>
        <option>1.5x</option>
      </select>
      <button class="btn" type="submit">应用</button>
    </form>
  </Modal>

  <Modal v-if="showCapture" title="截图分享" @close="showCapture = false">
    <p>正在生成高分辨率截图... {{ captureProgress }}%</p>
    <div class="progress">
      <div class="progress-bar" :style="{ width: captureProgress + '%' }"></div>
    </div>
    <p class="muted">完成后可复制链接或下载</p>
  </Modal>

  <Modal v-if="showLog" title="导出播放日志" @close="showLog = false">
    <form class="form-grid" @submit.prevent="exportLog">
      <label>时间范围</label>
      <input v-model="logForm.date" type="date" />
      <label>导出格式</label>
      <select v-model="logForm.format">
        <option>CSV</option>
        <option>JSON</option>
      </select>
      <button class="btn" type="submit">开始导出</button>
    </form>
  </Modal>
</template>

<script setup>
import { reactive, ref, onUnmounted, watch } from 'vue';
import Modal from '../components/Modal.vue';

const showPlayHint = ref(false);
const showRate = ref(false);
const showCapture = ref(false);
const showLog = ref(false);
const captureProgress = ref(18);
const currentRate = ref('1.0x');
const rateSelection = ref('1.0x');
const captureLink = ref('');
const exportInfo = ref('');
const logForm = reactive({ date: '', format: 'CSV' });
let captureTimer;

const metrics = reactive([
  { label: '实时在线', value: '1,230' },
  { label: '完播率', value: '76%' },
  { label: '分享', value: '324' },
  { label: '评论', value: '846' },
  { label: '收藏', value: '1,104' },
  { label: '播放异常', value: '3' }
]);

const chart = reactive(
  Array.from({ length: 10 }).map((_, index) => ({
    hour: `${index + 10}:00`,
    height: 60 + index * 8
  }))
);

const updateMetric = (label, updater) => {
  const target = metrics.find((item) => item.label === label);
  if (target) {
    target.value = updater(target.value);
  }
};

watch(
  () => showCapture.value,
  (open) => {
    clearInterval(captureTimer);
    if (open) {
      captureProgress.value = 12;
      captureLink.value = '';
      captureTimer = setInterval(() => {
        captureProgress.value = Math.min(100, captureProgress.value + 18);
        if (captureProgress.value >= 100) {
          captureLink.value = '截图已生成，可复制链接分享';
          updateMetric('分享', (val) => `${Number(val.replace(/,/g, '')) + 3}`);
          clearInterval(captureTimer);
        }
      }, 600);
    }
  }
);

const applyRate = () => {
  currentRate.value = rateSelection.value;
  exportInfo.value = `已切换倍速至 ${rateSelection.value}`;
  updateMetric('完播率', () => `${Math.min(99, Number(currentRate.value.replace('x', '')) * 76).toFixed(0)}%`);
  showRate.value = false;
};

const exportLog = () => {
  const dateRange = logForm.date || '今天';
  exportInfo.value = `${dateRange} 的播放日志以 ${logForm.format} 导出`;
  showLog.value = false;
};

onUnmounted(() => {
  clearInterval(captureTimer);
});
</script>

<style scoped>
.player {
  min-height: 320px;
}

.player-shell {
  background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
  border-radius: 16px;
  padding: 18px;
  display: grid;
  gap: 14px;
}

.video-simulate {
  background: #0f172a;
  height: 260px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 22px;
  letter-spacing: 1px;
}

.player-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stat {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #f8fafc;
}

.value {
  font-size: 22px;
  font-weight: 800;
}

.label {
  color: #6b7280;
}
</style>
