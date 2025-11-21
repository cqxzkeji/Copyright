<template>
  <div class="module-shell">
    <section class="panel form-panel">
      <h2>内容注册</h2>
      <form class="flex-form" @submit.prevent="submitRegistration">
        <div class="field">
          <label>作品名称</label>
          <input v-model="form.title" placeholder="例如：城市印象摄影集" required />
        </div>
        <div class="field">
          <label>权利人</label>
          <input v-model="form.owner" placeholder="王小云" required />
        </div>
        <div class="field">
          <label>内容类型</label>
          <select v-model="form.category">
            <option value="文字">文字</option>
            <option value="图片">图片</option>
            <option value="视频">视频</option>
            <option value="音频">音频</option>
          </select>
        </div>
        <div class="field">
          <label>摘要</label>
          <textarea v-model="form.summary" rows="3" placeholder="描述作品核心信息"></textarea>
        </div>
        <div class="actions">
          <button type="submit">提交注册</button>
          <button type="button" class="secondary" @click="openTemplate">下载模板</button>
        </div>
      </form>
    </section>

    <section class="panel list-panel">
      <header class="panel-header">
        <h2>注册记录</h2>
        <button @click="syncLedger">同步区块链凭证</button>
      </header>
      <div class="records">
        <article v-for="item in records" :key="item.id" class="record-card">
          <div class="record-meta">
            <h3>{{ item.title }}</h3>
            <small>{{ item.owner }} · {{ item.category }}</small>
          </div>
          <p>{{ item.desc }}</p>
          <button class="ghost" @click="() => showCertificate(item)">查看证书</button>
        </article>
      </div>
      <div class="mini-chart">
        <div class="bar" v-for="(bar, index) in chartBars" :key="index" :style="{ height: bar + '%' }"></div>
        <p class="chart-label">近七日注册趋势</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
  title: '',
  owner: '',
  summary: '',
  category: '文字'
});

const records = [
  { id: 1, title: '星云原声带', owner: '未来影业', category: '音频', desc: '原创影视背景音乐包' },
  { id: 2, title: 'AI 城市手册', owner: '智像文化', category: '文字', desc: '行业案例分析报告' },
  { id: 3, title: '水彩植物合集', owner: '鹿野设计', category: '图片', desc: '200+ 手绘素材库' }
];

const chartBars = [60, 90, 45, 72, 80, 65, 95];

function submitRegistration() {
  window.alert(`作品【${form.title}】已提交登记，预计 10 分钟内完成备案。`);
  form.title = '';
  form.owner = '';
  form.summary = '';
  form.category = '文字';
}

function openTemplate() {
  window.alert('模板下载链接已发送至邮箱：records@drm.cn');
}

function syncLedger() {
  window.alert('正在与联盟链节点对账，预计 3 秒完成。');
}

function showCertificate(item) {
  window.alert(`证书编号：CN-${item.id}2024\n作品：${item.title}\n权利人：${item.owner}`);
}
</script>

<style scoped>
.module-shell {
  flex: 1;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.panel {
  flex: 1 1 320px;
  background: rgba(249, 250, 251, 0.9);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flex-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.secondary {
  background: #0ea5e9;
}

.list-panel {
  min-width: 360px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.records {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.record-card {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.record-card .ghost {
  background: #111827;
  align-self: flex-start;
}

.mini-chart {
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  height: 120px;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  border-radius: 12px 12px 0 0;
}

.chart-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  color: #6b7280;
  font-size: 0.85rem;
}
</style>
