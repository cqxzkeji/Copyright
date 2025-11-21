<template>
  <div class="page-shell">
    <section class="page-header">
      <div>
        <p class="eyebrow">Customer Success</p>
        <h2>客户关系管理</h2>
        <p>统一客户画像、线索、拜访记录，强化咨询交付闭环。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="showCustomer = true">新增客户</button>
        <button @click="showCampaign = true">创建触达</button>
      </div>
    </section>
    <section class="flex-layout">
      <article class="panel table-panel">
        <h3>重点客户管道</h3>
        <div class="table">
          <div class="row header">
            <span>客户</span>
            <span>阶段</span>
            <span>负责人</span>
            <span>价值</span>
          </div>
          <div class="row" v-for="account in accounts" :key="account.name">
            <span>{{ account.name }}</span>
            <span>{{ account.stage }}</span>
            <span>{{ account.owner }}</span>
            <span>{{ account.value }}</span>
          </div>
        </div>
      </article>
      <article class="panel">
        <h3>客户细分热力</h3>
        <div class="segment-chart">
          <div v-for="segment in segments" :key="segment.name" class="segment" :style="{ flexBasis: segment.ratio + '%' }">
            <strong>{{ segment.name }}</strong>
            <span>{{ segment.ratio }}%</span>
          </div>
        </div>
        <button class="secondary" @click="showInsight = true">推送洞察</button>
      </article>
    </section>
    <ModalDialog v-model="showCustomer" title="新增客户">
      <p>已经创建“华东能源集团”账号，自动同步销售云。</p>
    </ModalDialog>
    <ModalDialog v-model="showCampaign" title="触达计划">
      <p>将于今晚 18:00 向数字政府客户推送解决方案简报。</p>
    </ModalDialog>
    <ModalDialog v-model="showInsight" title="客户洞察">
      <p>AI 建议本周拜访制造行业 TOP 客户，重点跟进 ESG 数字化话题。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showCustomer = ref(false);
const showCampaign = ref(false);
const showInsight = ref(false);

const accounts = [
  { name: '北辰物流', stage: '方案', owner: '许凝', value: '¥2.3M' },
  { name: '华星数科', stage: '谈判', owner: '李航', value: '¥4.1M' },
  { name: '国信医药', stage: '交付', owner: '杨立', value: '¥1.8M' }
];

const segments = [
  { name: '政企数字化', ratio: 35 },
  { name: '能源与制造', ratio: 30 },
  { name: '金融服务', ratio: 18 },
  { name: '新经济', ratio: 17 }
];
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
  flex-wrap: wrap;
  gap: 16px;
}

.actions {
  display: flex;
  gap: 12px;
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
  background: #f1f5f9;
  color: #0f172a;
}

.flex-layout {
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

.table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.row.header {
  font-weight: 700;
}

.segment-chart {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.segment {
  flex: 1 1 45%;
  background: #fef3c7;
  border-radius: 18px;
  padding: 16px;
}
</style>
