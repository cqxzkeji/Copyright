<template>
  <div class="grid grid-2">
    <div class="card">
      <h2>系统运行态势</h2>
      <div class="chart">
        <div v-for="item in chartData" :key="item.label" class="chart-row">
          <span>{{ item.label }}</span>
          <div class="bar">
            <span :style="{ width: item.value + '%' }"></span>
          </div>
          <strong>{{ item.value }}%</strong>
        </div>
      </div>
      <div class="action-row">
        <button class="button" @click="openTrend">查看趋势</button>
        <button class="button secondary" @click="openRefresh">刷新数据</button>
      </div>
    </div>
    <div class="card">
      <h2>实时任务概览</h2>
      <div class="summary-grid">
        <div class="summary-item" v-for="item in summary" :key="item.label">
          <div class="summary-value">{{ item.value }}</div>
          <div>{{ item.label }}</div>
        </div>
      </div>
      <button class="button ghost" @click="openExport">导出报表</button>
    </div>
  </div>

  <div class="card" style="margin-top: 20px;">
    <h2>识别与翻译任务表</h2>
    <table class="table">
      <thead>
        <tr>
          <th>任务ID</th>
          <th>语种</th>
          <th>实时状态</th>
          <th>识别准确率</th>
          <th>翻译延迟</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.language }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.accuracy }}</td>
          <td>{{ row.delay }}</td>
          <td>{{ row.owner }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="showTrend" title="趋势洞察" @close="showTrend = false">
    <p>系统识别稳定度上升 6%，翻译平均延迟降低至 0.8 秒。</p>
    <div class="progress-bar"><span></span></div>
    <div class="modal-actions">
      <span class="button" @click="showTrend = false">了解</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showRefresh" title="刷新数据" @close="showRefresh = false">
    <p>将重新拉取语音流与翻译引擎最新状态。</p>
    <label>
      刷新范围
      <select class="select">
        <option>全部模块</option>
        <option>语音识别</option>
        <option>实时翻译</option>
      </select>
    </label>
    <div class="modal-actions">
      <span class="button" @click="showRefresh = false">开始刷新</span>
      <span class="button ghost" @click="showRefresh = false">取消</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showExport" title="导出报表" @close="showExport = false">
    <p>生成多语言识别与翻译分析报表。</p>
    <label>
      文件格式
      <select class="select">
        <option>PDF</option>
        <option>Excel</option>
        <option>CSV</option>
      </select>
    </label>
    <div class="modal-actions">
      <span class="button" @click="showExport = false">确认导出</span>
      <span class="button ghost" @click="showExport = false">关闭</span>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showTrend = ref(false);
const showRefresh = ref(false);
const showExport = ref(false);

const chartData = [
  { label: '语音识别稳定度', value: 86 },
  { label: '翻译一致性', value: 78 },
  { label: '多模态融合效率', value: 72 },
  { label: '语音合成自然度', value: 81 }
];

const summary = [
  { label: '实时会话', value: '128' },
  { label: '活跃语言', value: '12' },
  { label: '峰值并发', value: '86' },
  { label: '平均延迟', value: '0.8s' }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `TASK-${index + 1}`,
  language: ['中文-英文', '英文-法文', '英文-西班牙文'][index % 3],
  status: ['运行中', '待优化', '已完成'][index % 3],
  accuracy: `${92 + (index % 6)}%`,
  delay: `${0.6 + (index % 5) * 0.1}s`,
  owner: ['李明', 'Anna', 'Carlos'][index % 3]
}));

const openTrend = () => {
  showTrend.value = true;
};
const openRefresh = () => {
  showRefresh.value = true;
};
const openExport = () => {
  showExport.value = true;
};
</script>

<style scoped>
.chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.chart-row {
  display: grid;
  grid-template-columns: 120px 1fr 50px;
  align-items: center;
  gap: 10px;
}

.bar {
  height: 10px;
  background: #edf1f7;
  border-radius: 999px;
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #78a6ff);
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.summary-item {
  background: #f5f8ff;
  padding: 12px;
  border-radius: 12px;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #2f6bff;
}
</style>
