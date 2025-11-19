<template>
  <div class="module-layout">
    <section class="section-card">
      <header class="module-header">
        <div>
          <h3>雪域场景轮播</h3>
          <p>选择任一场景立即推送到体验头显</p>
        </div>
        <button @click="openOverview">全局概览</button>
      </header>
      <div class="scene-grid">
        <article v-for="scene in scenes" :key="scene.id" class="scene-card">
          <div class="scene-hero" :style="{ backgroundImage: `url(${scene.cover})` }">
            <span class="tag">{{ scene.weather }}</span>
          </div>
          <h4>{{ scene.title }}</h4>
          <p>{{ scene.desc }}</p>
          <div class="scene-actions">
            <button @click="startExperience(scene)">进入体验</button>
            <button style="background:#0ea5e9;" @click="preview(scene)">氛围预览</button>
          </div>
        </article>
      </div>
    </section>

    <section class="section-card">
      <header class="module-header">
        <h3>实时环境监控</h3>
      </header>
      <div class="metrics-chart">
        <div class="metric" v-for="metric in metrics" :key="metric.label">
          <strong>{{ metric.value }}</strong>
          <span>{{ metric.label }}</span>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: metric.percent + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <BaseModal :open="showPreview" :title="previewScene?.title" @close="showPreview = false">
      <p>{{ previewScene?.desc }}</p>
      <p>声音：{{ previewScene?.audio }}</p>
      <p>建议体验时长：{{ previewScene?.duration }} 分钟</p>
    </BaseModal>

    <BaseModal :open="showOverview" title="场景全局概览" @close="showOverview = false">
      <div class="flat-chart">
        <div v-for="scene in scenes" :key="scene.id" class="flat-chart-bar" :style="{ height: scene.popularity + '%' }">
          <span>{{ scene.short }}</span>
        </div>
      </div>
    </BaseModal>

    <BaseModal :open="showProgress" title="正在部署场景" @close="stopExperience">
      <div style="display:flex;flex-direction:column;gap:0.8rem;">
        <p>为 {{ activeScene?.title }} 调配资源，包含渲染云节点、体感设备、空间音频。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: expProgress + '%' }"></div>
        </div>
        <strong>{{ expProgress }}%</strong>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const scenes = [
  { id: 1, title: '极光雪谷', short: '雪谷', desc: '漫步在极光照耀的峡谷，体验北境风暴。', weather: '极光/微风', audio: '温柔女声+风铃', duration: 12, popularity: 85, cover: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=600&q=60' },
  { id: 2, title: '冰川穿越', short: '冰川', desc: '徒步穿越透明冰穹，脚下万年冰纹闪耀。', weather: '晴空/-10℃', audio: '脚步+冰裂', duration: 15, popularity: 72, cover: 'https://images.unsplash.com/photo-1508264165352-258a6bf80060?auto=format&fit=crop&w=600&q=60' },
  { id: 3, title: '星空雪原', short: '雪原', desc: '广袤雪原搭配星空，适合冥想学习。', weather: '星空/-18℃', audio: '钢琴+呼吸引导', duration: 18, popularity: 65, cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=60' }
];

const metrics = [
  { label: '体感反馈负载', value: '68%', percent: 68 },
  { label: '云渲染利用率', value: '82%', percent: 82 },
  { label: '互动稳定度', value: '95%', percent: 95 }
];

const showPreview = ref(false);
const previewScene = ref(null);
const showOverview = ref(false);
const showProgress = ref(false);
const expProgress = ref(0);
const activeScene = ref(null);
let timer;

function preview(scene) {
  previewScene.value = scene;
  showPreview.value = true;
}

function openOverview() {
  showOverview.value = true;
}

function startExperience(scene) {
  activeScene.value = scene;
  expProgress.value = 0;
  showProgress.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    expProgress.value += 15;
    if (expProgress.value >= 100) {
      expProgress.value = 100;
      clearInterval(timer);
    }
  }, 400);
}

function stopExperience() {
  showProgress.value = false;
  clearInterval(timer);
}
</script>

<style scoped>
.module-layout {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.scene-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.scene-card {
  flex: 1 1 260px;
  border-radius: 20px;
  background: #f8fafc;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.scene-hero {
  height: 160px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.scene-hero .tag {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
}

.scene-actions {
  display: flex;
  gap: 0.6rem;
}

.metrics-chart {
  display: flex;
  gap: 1.5rem;
}

.metric {
  flex: 1;
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
</style>
