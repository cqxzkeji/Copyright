<template>
  <div class="module-shell">
    <header class="module-header">
      <div>
        <p class="eyebrow">合规报告</p>
        <h3>本季度合规率 {{ complianceRate }}% · 监管整改 {{ rectifications.length }} 项</h3>
      </div>
      <div class="actions">
        <button @click="reportOpen = true">生成监管报告</button>
        <button class="ghost" @click="scheduleOpen = true">监管日程</button>
      </div>
    </header>
    <section class="compliance-cards">
      <article class="card">
        <h4>许可证</h4>
        <p>有效期至：2026-08-31</p>
        <p>废水排放指标占用 42%</p>
      </article>
      <article class="card">
        <h4>危废台账</h4>
        <p>登记完整度 100%</p>
        <p>自动推送 32 条</p>
      </article>
      <article class="card">
        <h4>在线监测</h4>
        <p>烟气颗粒物：6.8 mg/m³</p>
        <p>VOC：0.28 mg/m³</p>
      </article>
    </section>
    <section class="rect-list">
      <article v-for="item in rectifications" :key="item.id" class="rect-item">
        <div>
          <h5>{{ item.title }}</h5>
          <p>{{ item.deadline }} · 责任人：{{ item.owner }}</p>
        </div>
        <div class="rect-progress">
          <div :style="{ width: item.progress + '%' }"></div>
        </div>
        <button class="ghost" @click="openRect(item)">处理</button>
      </article>
    </section>

    <ModalDialog v-if="reportOpen" title="生成监管报告" primary-text="导出 PDF" @close="reportOpen = false" @confirm="exportReport">
      <p>报告周期：{{ period }}</p>
      <p>包含模块：登记、运输、仓储、监测、联单</p>
      <p>点击导出后将自动生成 PDF 并推送至邮箱。</p>
    </ModalDialog>

    <ModalDialog v-if="scheduleOpen" title="监管日程" primary-text="关闭" @close="scheduleOpen = false" @confirm="scheduleOpen = false">
      <ul>
        <li>4月12日 · 市生态环境局专项检查</li>
        <li>4月25日 · 危废经营许可证换证</li>
        <li>5月03日 · ISO14001 外审</li>
      </ul>
    </ModalDialog>

    <ModalDialog
      v-if="currentRect"
      :title="currentRect.title"
      primary-text="更新进度"
      @close="currentRect = null"
      @confirm="updateRect"
    >
      <p>截止：{{ currentRect.deadline }}</p>
      <p>整改进度：{{ currentRect.progress }}%</p>
      <input v-model.number="currentRect.progress" type="range" min="0" max="100" />
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const complianceRate = 98.4;
const period = '2025 Q1';
const rectifications = ref([
  { id: 1, title: '危废仓堆码间距优化', deadline: '4月20日', owner: '仓储部', progress: 60 },
  { id: 2, title: '运输车辆在线监控备案', deadline: '4月28日', owner: '安环部', progress: 30 }
]);

const reportOpen = ref(false);
const scheduleOpen = ref(false);
const currentRect = ref(null);

const exportReport = () => {
  alert('报告已生成并推送至监管邮箱');
  reportOpen.value = false;
};

const openRect = (item) => {
  currentRect.value = item;
};

const updateRect = () => {
  currentRect.value = null;
};
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

button {
  background: linear-gradient(120deg, #a855f7, #ec4899);
  color: #fff;
  border-radius: 16px;
  padding: 0.7rem 1.6rem;
}

button.ghost {
  background: rgba(168, 85, 247, 0.15);
  color: #6b21a8;
}

.compliance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.card {
  background: #faf5ff;
  border-radius: 22px;
  padding: 1rem;
  box-shadow: inset 0 0 0 1px rgba(168, 85, 247, 0.15);
}

.rect-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rect-item {
  background: #fff1f2;
  border-radius: 22px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr auto;
  gap: 1rem;
  align-items: center;
}

.rect-progress {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(236, 72, 153, 0.2);
}

.rect-progress div {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #f472b6, #ec4899);
}
</style>
