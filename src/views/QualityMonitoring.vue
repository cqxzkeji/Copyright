<template>
  <div class="quality">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>关键指标</h2>
          <p>实时监控温湿度、农残、重金属等指标</p>
        </div>
        <button class="primary" @click="syncRealtime">刷新监控</button>
      </div>
      <div class="indicator-grid">
        <div class="indicator" v-for="metric in metrics" :key="metric.name">
          <p class="label">{{ metric.name }}</p>
          <h3>{{ metric.value }}</h3>
          <small :class="metric.trend">{{ metric.trendLabel }}</small>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>预警策略</h2>
          <p>可配置阈值自动触发短信、APP、语音等预警</p>
        </div>
        <button class="ghost" @click="openStrategy">新增策略</button>
      </div>
      <ul class="alert-list">
        <li v-for="alert in alerts" :key="alert.id">
          <div>
            <strong>{{ alert.title }}</strong>
            <p>{{ alert.channel }} · 阈值 {{ alert.threshold }}</p>
          </div>
          <button class="secondary" @click="testAlert(alert)">试鸣</button>
        </li>
      </ul>
    </section>

    <ModalDialog
      :show="showSync"
      title="同步实时监控"
      confirm-text="后台同步"
      @close="showSync = false"
      @confirm="showSync = false"
    >
      <p>已联通 32 个传感器，数据刷新进度 {{ syncProgress }}%。</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: syncProgress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog
      :show="showStrategy"
      title="新增预警策略"
      confirm-text="保存策略"
      @close="showStrategy = false"
      @confirm="saveStrategy"
    >
      <div class="form-grid">
        <label>监控指标<input v-model="strategy.indicator" placeholder="如：土壤湿度" /></label>
        <label>阈值设置<input v-model="strategy.threshold" placeholder="小于 30%" /></label>
        <label>通知方式<input v-model="strategy.channel" placeholder="短信 + 钉钉" /></label>
      </div>
    </ModalDialog>

    <ModalDialog
      :show="!!testTarget"
      title="预警试鸣"
      confirm-text="停止"
      @close="testTarget = null"
      @confirm="testTarget = null"
    >
      <p>策略 {{ testTarget?.title }} 正在模拟触发，将向 {{ testTarget?.channel }} 推送告警。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = ref([
  { name: '基地平均温度', value: '22.3℃', trend: 'up', trendLabel: '+0.6℃' },
  { name: '基地平均湿度', value: '63%', trend: 'down', trendLabel: '-2%' },
  { name: '农残检测合格率', value: '99.2%', trend: 'up', trendLabel: '+0.4%' },
  { name: '病虫害监测点', value: '3处', trend: 'flat', trendLabel: '维持' }
]);

const alerts = ref([
  { id: 1, title: '温室高温预警', channel: '短信 + APP', threshold: '≥ 35℃' },
  { id: 2, title: '冷链断电预警', channel: '语音机器人', threshold: '监控断链 30s' }
]);

const showSync = ref(false);
const syncProgress = ref(15);
const showStrategy = ref(false);
const strategy = reactive({ indicator: '', threshold: '', channel: '' });
const testTarget = ref(null);

const syncRealtime = () => {
  showSync.value = true;
  syncProgress.value = 15;
  const timer = setInterval(() => {
    if (syncProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    syncProgress.value += 20;
  }, 400);
};

const openStrategy = () => {
  showStrategy.value = true;
};

const saveStrategy = () => {
  if (!strategy.indicator) return;
  alerts.value.push({
    id: Date.now(),
    title: `${strategy.indicator} 预警`,
    channel: strategy.channel || '短信',
    threshold: strategy.threshold || '自定义'
  });
  showStrategy.value = false;
  strategy.indicator = '';
  strategy.threshold = '';
  strategy.channel = '';
};

const testAlert = (alert) => {
  testTarget.value = alert;
};
</script>

<style scoped>
.quality {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
}

.panel {
  flex: 1 1 45%;
  background: #f8fafc;
  border-radius: 20px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.indicator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.indicator {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.indicator .label {
  margin: 0;
  color: #94a3b8;
}

.indicator small.up {
  color: #16a34a;
}

.indicator small.down {
  color: #dc2626;
}

.indicator small.flat {
  color: #2563eb;
}

.alert-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.alert-list li {
  background: #fff;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.ghost {
  background: #ecfccb;
  color: #4d7c0f;
}

.secondary {
  background: #fbbf24;
  color: #92400e;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  border-radius: 999px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

@media (max-width: 1024px) {
  .panel {
    flex: 1 1 100%;
  }
}
</style>
