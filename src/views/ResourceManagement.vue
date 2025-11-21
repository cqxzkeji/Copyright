<template>
  <div class="page-shell">
    <section class="page-header">
      <div>
        <p class="eyebrow">Resource Control</p>
        <h2>资源管理</h2>
        <p>实时掌握顾问利用率、技能矩阵与硬件资产，提升交付效率。</p>
      </div>
      <button class="primary" @click="showOptimize = true">智能优化</button>
    </section>
    <section class="grid">
      <article class="panel">
        <h3>顾问利用率</h3>
        <div class="utilization">
          <div v-for="member in members" :key="member.name" class="util-row">
            <span>{{ member.name }}</span>
            <div class="bar">
              <div class="fill" :style="{ width: member.usage + '%' }"></div>
            </div>
            <small>{{ member.usage }}%</small>
          </div>
        </div>
      </article>
      <article class="panel">
        <h3>技能矩阵</h3>
        <div class="skills">
          <div v-for="skill in skills" :key="skill.name" class="skill">
            <strong>{{ skill.name }}</strong>
            <span>{{ skill.count }} 人</span>
          </div>
        </div>
        <button class="secondary" @click="showSkills = true">补齐技能</button>
      </article>
    </section>
    <section class="panel">
      <h3>资产调拨</h3>
      <div class="assets">
        <div v-for="asset in assets" :key="asset.name" class="asset-card">
          <strong>{{ asset.name }}</strong>
          <p>{{ asset.desc }}</p>
          <button @click="selectAsset(asset)">调拨</button>
        </div>
      </div>
    </section>
    <ModalDialog v-model="showOptimize" title="智能优化">
      <p>AI 已重新分配 4 名云架构顾问支援重点项目。</p>
    </ModalDialog>
    <ModalDialog v-model="showSkills" title="技能补齐计划">
      <p>建议在五月新增“AI+PMO”培训营，预计覆盖 28 人。</p>
    </ModalDialog>
    <ModalDialog v-model="showAsset" :title="currentAsset?.name ?? '资产调拨'">
      <p>{{ currentAsset?.desc }}</p>
      <div class="progress">
        <div class="progress-fill" :style="{ width: assetProgress + '%' }"></div>
      </div>
      <p>调拨进度 {{ assetProgress }}%</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showOptimize = ref(false);
const showSkills = ref(false);
const showAsset = ref(false);
const currentAsset = ref(null);
const assetProgress = 46;

const members = [
  { name: '架构组', usage: 88 },
  { name: '交付顾问', usage: 74 },
  { name: '数据分析', usage: 62 },
  { name: '实施工程', usage: 57 }
];

const skills = [
  { name: '云原生', count: 14 },
  { name: '数据治理', count: 11 },
  { name: '敏捷交付', count: 17 },
  { name: '安全合规', count: 9 }
];

const assets = [
  { name: '移动演示终端', desc: '用于上门演示的高性能终端，库存 8 台。' },
  { name: '测试环境许可', desc: '多云兼容测试环境许可，剩余 12 套。' },
  { name: '远程协作包', desc: '含摄像头、耳机与安全认证硬件。' }
];

const selectAsset = (asset) => {
  currentAsset.value = asset;
  showAsset.value = true;
};
</script>

<style scoped>
.page-shell {
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

button {
  border: none;
  border-radius: 14px;
  padding: 10px 18px;
  font-weight: 600;
}

.primary {
  background: linear-gradient(120deg, #2563eb, #9333ea);
  color: #fff;
}

.secondary {
  background: #e0f2fe;
  color: #0369a1;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.panel {
  flex: 1 1 360px;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.util-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.bar {
  flex: 1;
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
}

.bar .fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #22c55e, #3b82f6);
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill {
  flex: 1 1 160px;
  border-radius: 18px;
  background: #f5f3ff;
  padding: 16px;
}

.assets {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.asset-card {
  flex: 1 1 280px;
  border-radius: 20px;
  background: #f8fafc;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.asset-card button {
  align-self: flex-start;
  background: #f97316;
  color: #fff;
  border-radius: 999px;
}

.progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #e2e8f0;
  margin-top: 12px;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #f59e0b, #ef4444);
}
</style>
