<template>
  <div class="module">
    <header>
      <div>
        <h3>广告投放与实时优化</h3>
        <p>实时监控曝光、点击、转化，自动调优出价和频次。</p>
      </div>
      <button class="primary" @click="launchCampaign" title="立即投放">投放广告</button>
    </header>

    <section class="grid">
      <div class="panel">
        <h4>投放参数</h4>
        <label>投放渠道<select v-model="campaign.channel"><option>信息流</option><option>短视频</option><option>开屏</option></select></label>
        <label>优化目标<select v-model="campaign.goal"><option>转化</option><option>点击</option><option>曝光</option></select></label>
        <label>实时出价（¥）<input type="number" v-model.number="campaign.bid" /></label>
        <div class="actions">
          <button class="ghost" @click="showTactics = true">查看优化策略</button>
          <button class="primary" @click="launchCampaign">实时投放</button>
        </div>
      </div>
      <div class="panel chart">
        <h4>实时监控</h4>
        <div class="line-chart">
          <div class="line" v-for="n in 6" :key="n" :style="{ height: waves[n - 1] + '%' }"></div>
        </div>
        <div class="summary">
          <div>
            <strong>CTR</strong>
            <p>3.8%</p>
          </div>
          <div>
            <strong>CVR</strong>
            <p>1.6%</p>
          </div>
          <div>
            <strong>CPA</strong>
            <p>¥ 36.4</p>
          </div>
        </div>
      </div>
    </section>

    <ModalDialog v-model="showLaunch" title="投放进度">
      <p>{{ campaign.channel }} 渠道正在完成部署...</p>
      <div class="progress-shell"><div class="progress" :style="{ width: progress + '%' }"></div></div>
      <small>实时优化启用：{{ progress }}%</small>
    </ModalDialog>

    <ModalDialog v-model="showTactics" title="实时优化策略">
      <ul>
        <li>人群 A CPM 降低 8%，频控 3 次</li>
        <li>自动探索高转化素材组合</li>
        <li>夜间预算倾斜 20% 到直播场景</li>
      </ul>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const campaign = reactive({ channel: '信息流', goal: '转化', bid: 2.5 });
const showLaunch = ref(false);
const showTactics = ref(false);
const progress = ref(0);
const waves = [35, 60, 45, 70, 40, 80];
let timer;

const launchCampaign = () => {
  showLaunch.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 18;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 300);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  min-width: 280px;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

input,
select {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  background: #f9fafb;
}

.actions {
  display: flex;
  gap: 12px;
}

.chart {
  flex: 0.8;
}

.line-chart {
  height: 180px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.line {
  flex: 1;
  background: linear-gradient(180deg, #10b981, transparent);
  border-radius: 999px 999px 0 0;
}

.summary {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.primary {
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #22c55e, #14b8a6);
  color: #fff;
  cursor: pointer;
}

.ghost {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: transparent;
  padding: 10px 16px;
  cursor: pointer;
}

.progress-shell {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(120deg, #34d399, #10b981);
}
</style>
