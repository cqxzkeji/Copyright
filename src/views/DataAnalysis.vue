<template>
  <div class="analysis">
    <section class="reports">
      <div class="panel">
        <div class="head">
          <h3>产量预测</h3>
          <button class="ghost" @click="showModal('模型说明', '集成气象、土壤和生长模型，预测误差 3.2%。')">模型说明</button>
        </div>
        <div class="chart">
          <div v-for="item in production" :key="item.name" class="col">
            <div class="fill" :style="{ height: item.value + '%' }"></div>
            <small>{{ item.name }}</small>
            <span>{{ item.value }} 吨</span>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="head">
          <h3>质量指标</h3>
          <button @click="generateReport">生成报告</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>当前</th>
              <th>目标</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in quality" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ item.current }}</td>
              <td>{{ item.target }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="actions">
      <button @click="showModal('导出成功', '报告已导出为 PDF 并同步企业微信。')">导出 PDF</button>
      <button class="ghost" @click="showModal('分享完成', '仪表盘链接已发送至合作社。')">分享看板</button>
      <button class="ghost" @click="showModal('对比分析', '与去年同期相比，成本下降 8.6%。')">同比分析</button>
    </section>

    <ProgressModal
      v-if="reportVisible"
      title="报告生成中"
      description="正在聚合 24 小时内的传感器与运营数据"
      :progress="reportProgress"
      @close="reportVisible = false"
    />
    <ModalDialog v-if="visible" :title="modalTitle" @close="visible = false">
      <p>{{ modalContent }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
import ProgressModal from '../components/ProgressModal.vue';

const production = [
  { name: '番茄', value: 82 },
  { name: '黄瓜', value: 54 },
  { name: '蓝莓', value: 67 },
  { name: '玉米', value: 96 }
];

const quality = [
  { label: '糖度', current: '12.5°Bx', target: '12°Bx' },
  { label: '单果重量', current: '86g', target: '80g' },
  { label: '外观等级', current: 'A级 92%', target: 'A级 90%' }
];

const visible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const reportVisible = ref(false);
const reportProgress = ref(0);
let timer;

const showModal = (title, content) => {
  visible.value = true;
  modalTitle.value = title;
  modalContent.value = content;
};

const generateReport = () => {
  reportVisible.value = true;
  reportProgress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (reportProgress.value >= 100) {
      clearInterval(timer);
      return;
    }
    reportProgress.value += 20;
  }, 450);
};
</script>

<style scoped>
.analysis {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reports {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.panel {
  flex: 1;
  min-width: 280px;
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.col {
  flex: 1;
  text-align: center;
}

.fill {
  width: 100%;
  border-radius: 12px 12px 0 0;
  background: linear-gradient(180deg, #34d399, #38bdf8);
  min-height: 60px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.5rem;
  text-align: left;
}

thead {
  background: rgba(37, 99, 235, 0.08);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

button {
  border: none;
  border-radius: 16px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  background: #22c55e;
  color: #fff;
}

button.ghost {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}
</style>
