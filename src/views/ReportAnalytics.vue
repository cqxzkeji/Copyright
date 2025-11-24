<template>
  <div class="module flex-column">
    <div class="module-header flex-row">
      <div>
        <h2>报告与数据分析</h2>
        <p>多维报表、成本与容量预测，一键导出。</p>
      </div>
      <button class="primary-button" @click="generateReport">生成周报</button>
    </div>

    <div class="flex-row panels">
      <div class="card panel flex-column">
        <h3>容量预测</h3>
        <div class="forecast">
          <div v-for="item in forecast" :key="item.name" class="forecast-row">
            <div>
              <strong>{{ item.name }}</strong>
              <p>{{ item.desc }}</p>
            </div>
            <span>{{ item.usage }}%</span>
          </div>
        </div>
      </div>
      <div class="card panel flex-column">
        <h3>报表清单</h3>
        <ul class="report-list">
          <li v-for="report in reports" :key="report.id">
            <div>
              <strong>{{ report.title }}</strong>
              <p>{{ report.info }}</p>
            </div>
            <button class="secondary-button" @click="download(report.title)">下载</button>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="toast" class="modal-backdrop" @click="toast = false">
      <div class="modal-panel" @click.stop>
        <h3>报表已生成</h3>
        <p>任务编号 #{{ taskId }} ，稍后自动推送至邮箱。</p>
        <button class="primary-button" @click="toast = false">完成</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const toast = ref(false);
const taskId = ref('');
const forecast = [
  { name: '核心库', desc: '预计 7 天后达到 80%', usage: 72 },
  { name: '报表库', desc: '可用空间充足', usage: 35 },
  { name: '日志归档', desc: '建议扩容 2TB', usage: 91 }
];
const reports = [
  { id: 1, title: '性能周报', info: 'Q1-W12 · 包含延迟/慢 SQL' },
  { id: 2, title: '安全合规报告', info: '身份审计 + 访问轨迹' },
  { id: 3, title: '成本与容量分析', info: '多云资源对比' }
];

const generateReport = () => {
  taskId.value = Math.floor(100000 + Math.random() * 900000);
  toast.value = true;
};

const download = (title) => {
  window.alert(`${title} 已推送至下载中心`);
};
</script>

<style scoped>
.module {
  gap: 1.5rem;
}

.module-header {
  justify-content: space-between;
  align-items: center;
}

.panels {
  gap: 1.5rem;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  gap: 1rem;
}

.forecast {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.forecast-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.8rem;
}

.forecast-row span {
  font-weight: 700;
  color: #2563eb;
}

.report-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.8rem;
}
</style>
