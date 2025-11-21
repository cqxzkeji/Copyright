<template>
  <div class="traceability">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>批次追踪</h2>
          <p>输入批次号或扫描二维码获取溯源信息</p>
        </div>
        <button class="primary" @click="searchBatch">立即查询</button>
      </div>
      <div class="search-row">
        <input v-model="query" placeholder="如：HN2024030101" />
        <button class="ghost" @click="openScanner">扫码识别</button>
      </div>
      <div class="trace-steps">
        <div class="step" v-for="step in steps" :key="step.stage">
          <h4>{{ step.stage }}</h4>
          <p>{{ step.detail }}</p>
          <small>{{ step.time }}</small>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>关键凭证</h2>
          <p>快速调取加工、检测、运输等环节凭证</p>
        </div>
        <button class="secondary" @click="exportReport">导出报告</button>
      </div>
      <ul class="document-list">
        <li v-for="doc in documents" :key="doc.id">
          <div>
            <strong>{{ doc.title }}</strong>
            <p>{{ doc.org }} · {{ doc.time }}</p>
          </div>
          <button class="ghost" @click="previewDoc(doc)">查看</button>
        </li>
      </ul>
    </section>

    <ModalDialog
      :show="showResult"
      title="追踪结果"
      confirm-text="关闭"
      @close="showResult = false"
      @confirm="showResult = false"
    >
      <p>批次 {{ query || 'HN2024030101' }} 已完成全链路追踪，共计 {{ steps.length }} 个环节。</p>
      <p>最新状态：运输途中，预计 <strong>3 小时</strong> 抵达冷链仓。</p>
    </ModalDialog>

    <ModalDialog
      :show="showScanner"
      title="扫码识别"
      confirm-text="关闭"
      @close="showScanner = false"
      @confirm="showScanner = false"
    >
      <p>摄像头已开启，正识别二维码……请将包装码对准扫描框。</p>
    </ModalDialog>

    <ModalDialog
      :show="showExport"
      title="报告生成中"
      confirm-text="后台生成"
      @close="showExport = false"
      @confirm="showExport = false"
    >
      <p>正在整合质检、仓储、物流信息，预计 20 秒后完成导出。</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: exportProgress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog
      :show="!!preview"
      title="凭证详情"
      confirm-text="关闭"
      @close="preview = null"
      @confirm="preview = null"
    >
      <p>编号：{{ preview?.id }}</p>
      <p>检测机构：{{ preview?.org }}</p>
      <p>结果：{{ preview?.result }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const query = ref('HN2024030101');
const showResult = ref(false);
const showScanner = ref(false);
const showExport = ref(false);
const exportProgress = ref(30);
const preview = ref(null);

const steps = [
  { stage: '产地采收', detail: '清远示范基地，水洗分级后冷链入库', time: '2024-03-01 08:10' },
  { stage: '加工包装', detail: '冷风预冷 + 气调包装', time: '2024-03-01 12:20' },
  { stage: '质检放行', detail: '农残检测全部合格', time: '2024-03-01 14:50' },
  { stage: '冷链运输', detail: '粤A12345 按 4℃ 全程监控', time: '2024-03-01 18:30' }
];

const documents = [
  { id: 'CERT-001', title: '农残检测报告', org: '省农科院', time: '2024-03-01', result: '全部合格' },
  { id: 'LOG-002', title: '冷链运输记录', org: '粤冷链', time: '2024-03-01', result: '温控正常' },
  { id: 'PKG-003', title: '加工包装凭证', org: '清远工厂', time: '2024-03-01', result: '批次齐套' }
];

const searchBatch = () => {
  showResult.value = true;
};

const openScanner = () => {
  showScanner.value = true;
};

const exportReport = () => {
  showExport.value = true;
  exportProgress.value = 30;
  const timer = setInterval(() => {
    if (exportProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    exportProgress.value += 25;
  }, 500);
};

const previewDoc = (doc) => {
  preview.value = doc;
};
</script>

<style scoped>
.traceability {
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

.search-row {
  display: flex;
  gap: 0.8rem;
}

.trace-steps {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.step {
  background: #fff;
  border-radius: 14px;
  padding: 0.8rem 1rem;
}

.document-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.document-list li {
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
  background: #6366f1;
  color: #fff;
}

.progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 999px;
}

@media (max-width: 1024px) {
  .panel {
    flex: 1 1 100%;
  }
}
</style>
