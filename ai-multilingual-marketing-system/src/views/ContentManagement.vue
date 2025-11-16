<template>
  <section class="module">
    <header>
      <h2>多平台发布与内容管理</h2>
      <p>一键编排社交媒体、邮件、网站和广告平台，实现多语言版本同步投放。</p>
    </header>
    <div class="grid">
      <div class="panel schedule">
        <h3>发布排程</h3>
        <label>
          选择平台
          <select v-model="platform">
            <option>Meta Ads</option>
            <option>TikTok</option>
            <option>LinkedIn</option>
            <option>邮件自动化</option>
          </select>
        </label>
        <label>
          发布时间
          <input type="datetime-local" v-model="publishAt" />
        </label>
        <div class="btn-group">
          <button @click="schedule">创建排程</button>
          <button class="secondary" @click="openSync">同步平台</button>
        </div>
      </div>
      <div class="panel list">
        <h3>内容资产</h3>
        <div class="card" v-for="asset in assets" :key="asset.id">
          <div>
            <strong>{{ asset.title }}</strong>
            <p>{{ asset.locale }} · {{ asset.channel }}</p>
          </div>
          <button @click="openAsset(asset)">查看详情</button>
        </div>
      </div>
    </div>
    <ModalDialog v-model="scheduleVisible" title="排程创建成功">
      <p>{{ platform }} 将在 {{ formattedDate }} 自动发布。</p>
    </ModalDialog>
    <ModalDialog v-model="syncVisible" title="同步进度">
      <div class="progress">
        <div class="progress-fill" :style="{ width: syncProgress + '%' }"></div>
      </div>
      <p>正在同步 {{ syncPlatforms.join('、') }}。</p>
    </ModalDialog>
    <ModalDialog v-model="assetVisible" :title="activeAsset?.title || '内容详情'">
      <p>渠道：{{ activeAsset?.channel }}</p>
      <p>语种：{{ activeAsset?.locale }}</p>
      <p>最后更新：{{ activeAsset?.updated }}</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const platform = ref('Meta Ads');
const publishAt = ref('');
const scheduleVisible = ref(false);
const syncVisible = ref(false);
const assetVisible = ref(false);
const syncProgress = ref(0);
const activeAsset = ref(null);
const syncPlatforms = ['Meta', 'Google', 'LinkedIn'];

const assets = [
  { id: 1, title: '全球春季活动', locale: '多语言', channel: 'Social', updated: '2 小时前' },
  { id: 2, title: 'B2B 白皮书', locale: 'EN/DE', channel: 'Email', updated: '昨天' },
  { id: 3, title: '品牌主视觉', locale: 'JP/KO', channel: 'Website', updated: '3 天前' }
];

const formattedDate = computed(() => (publishAt.value ? new Date(publishAt.value).toLocaleString() : '预设时间'));

const schedule = () => {
  scheduleVisible.value = true;
};

const openSync = () => {
  syncVisible.value = true;
  syncProgress.value = 0;
  const timer = setInterval(() => {
    syncProgress.value += 25;
    if (syncProgress.value >= 100) {
      syncProgress.value = 100;
      clearInterval(timer);
    }
  }, 250);
};

const openAsset = (asset) => {
  activeAsset.value = asset;
  assetVisible.value = true;
};
</script>

<style scoped>
.module header {
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.panel {
  background: var(--panel);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

select,
input {
  border: none;
  border-radius: 16px;
  padding: 12px 16px;
  background: var(--panel-light);
  color: var(--text);
}

.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

button {
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  background: var(--accent);
  color: #0f172a;
}

button.secondary {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: var(--muted);
}

.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 18px;
  background: rgba(148, 163, 184, 0.1);
  margin-bottom: 12px;
}

.progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.3);
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #38bdf8, #0ea5e9);
  transition: width 0.3s ease;
}
</style>
