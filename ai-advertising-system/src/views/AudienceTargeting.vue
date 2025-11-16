<template>
  <div class="module">
    <header>
      <div>
        <h3>受众定向与个性化投放</h3>
        <p>AI 画像、兴趣图谱与实时行为，为每位用户定制触达策略。</p>
      </div>
      <button class="primary" @click="openPersona" title="分析受众特征">生成受众洞察</button>
    </header>

    <section class="grid">
      <div class="panel">
        <h4>投放策略设置</h4>
        <label>人群标签<input v-model="target.label" placeholder="如：新手妈妈" /></label>
        <label>实时信号<input v-model="target.behavior" placeholder="如：深夜浏览护肤话题" /></label>
        <label>个性化优惠<input v-model="target.offer" placeholder="如：首单立减 50 元" /></label>
        <div class="actions">
          <button class="ghost" @click="openPersona">查看画像</button>
          <button class="primary" @click="openDelivery">启动个性化投放</button>
        </div>
      </div>
      <div class="panel chart">
        <h4>实时触达占比</h4>
        <div class="donut">
          <div class="donut-inner">
            <strong>72%</strong>
            <small>精准命中</small>
          </div>
        </div>
        <ul>
          <li>内容场景 · 32%</li>
          <li>兴趣广告 · 25%</li>
          <li>直播互动 · 15%</li>
        </ul>
      </div>
    </section>

    <ModalDialog v-model="showPersona" title="AI 受众画像">
      <p>用户特征：{{ target.label || '待补充' }} · 行为：{{ target.behavior || '实时捕捉中' }}</p>
      <p>推荐触点：社交短视频、兴趣社群、直播连线</p>
    </ModalDialog>

    <ModalDialog v-model="showDelivery" title="个性化投放进度">
      <p>正在同步触点与个性化优惠（{{ target.offer || '标准权益包' }}）。</p>
      <div class="progress-shell">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <small>投放准备完成度：{{ progress }}%</small>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const target = reactive({ label: '', behavior: '', offer: '' });
const showPersona = ref(false);
const showDelivery = ref(false);
const progress = ref(0);
let timer;

const openPersona = () => {
  showPersona.value = true;
};

const openDelivery = () => {
  showDelivery.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 20;
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

.panel label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.panel input {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.donut {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(#3b82f6 0 72%, #d1d5db 72% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-inner {
  width: 120px;
  height: 120px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #1f2937;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  color: #6b7280;
}

li + li {
  margin-top: 8px;
}

.primary {
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
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
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
}
</style>
