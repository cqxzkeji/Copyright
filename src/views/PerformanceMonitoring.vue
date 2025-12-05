<template>
  <div class="page">
    <header class="page-header">
      <div>
        <p class="eyebrow">性能监控</p>
        <h2>实时监测与分析</h2>
      </div>
      <div class="btns">
        <button class="primary" @click="showRefresh = true">刷新指标</button>
        <button @click="showExport = true">导出报告</button>
        <button @click="showTrend = true">打开趋势图</button>
      </div>
    </header>

    <section class="charts">
      <div class="chart-card">
        <div class="chart-head">
          <h3>集群负载</h3>
          <span class="tag">过去 24 小时</span>
        </div>
        <div class="line-chart">
          <div v-for="(point, idx) in loadPoints" :key="idx" class="point" :style="{ height: point + '%' }"></div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-head">
          <h3>核心指标</h3>
          <span class="tag blue">实时</span>
        </div>
        <div class="metric-grid">
          <div class="metric" v-for="m in metrics" :key="m.label">
            <p class="metric-label">{{ m.label }}</p>
            <p class="metric-value">{{ m.value }}</p>
            <div class="metric-bar">
              <div class="metric-fill" :style="{ width: m.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="table-card">
      <div class="table-head">
        <h3>节点性能列表</h3>
        <button @click="showInstruction = true">查看提示</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>节点</th>
            <th>CPU</th>
            <th>内存</th>
            <th>IO</th>
            <th>网络</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.node">
            <td>{{ row.node }}</td>
            <td>{{ row.cpu }}%</td>
            <td>{{ row.memory }}%</td>
            <td>{{ row.io }}%</td>
            <td>{{ row.network }}%</td>
            <td><button @click="openNode(row)">查看</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal v-if="showRefresh" title="刷新指标" @close="showRefresh = false">
      <p>将请求最新的监控数据。</p>
      <div class="modal-actions">
        <button class="primary" @click="showRefresh = false">立即刷新</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showExport" title="导出报告" @close="showExport = false">
      <p>将生成 PDF 格式的性能快照。</p>
      <div class="progress">
        <div class="progress-fill" :style="{ width: exportPercent + '%' }"></div>
      </div>
      <p class="desc">导出进度：{{ exportPercent }}%</p>
      <div class="modal-actions">
        <button class="primary" @click="increaseExport">刷新进度</button>
        <button @click="showExport = false">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showTrend" title="性能趋势" @close="showTrend = false">
      <p>CPU 与内存的趋势图将叠加展示。</p>
      <div class="trend">
        <div class="trend-line blue" v-for="p in trendLine" :key="p" :style="{ height: p + '%' }"></div>
      </div>
      <div class="modal-actions">
        <button class="primary" @click="showTrend = false">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showInstruction" title="查看提示" @close="showInstruction = false">
      <p>负载超过 80% 时建议优先扩容或迁移任务。</p>
      <div class="modal-actions">
        <button class="primary" @click="showInstruction = false">明白</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeNode" :title="activeNode.node + ' 性能详情'" @close="activeNode = null">
      <ul class="detail-list">
        <li>CPU：{{ activeNode.cpu }}%</li>
        <li>内存：{{ activeNode.memory }}%</li>
        <li>IO：{{ activeNode.io }}%</li>
        <li>网络：{{ activeNode.network }}%</li>
      </ul>
      <div class="modal-actions">
        <button class="primary" @click="showThrottle = true">限流</button>
        <button @click="activeNode = null">关闭</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showThrottle" title="启用限流" @close="showThrottle = false">
      <p>将限制节点的网络带宽，避免突发影响。</p>
      <div class="modal-actions">
        <button class="primary" @click="showThrottle = false">应用</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from './components/BaseModal.vue';

const loadPoints = [40, 55, 62, 48, 70, 64, 80, 60, 52, 66, 58, 74];
const metrics = [
  { label: 'CPU 使用率', value: '64%', percent: 64 },
  { label: '内存使用率', value: '72%', percent: 72 },
  { label: '磁盘 IOPS', value: '890', percent: 56 },
  { label: '网络出流量', value: '1.2 Gbps', percent: 68 }
];

const rows = ref([
  { node: 'cn-sh-01', cpu: 61, memory: 72, io: 44, network: 53 },
  { node: 'cn-sh-02', cpu: 70, memory: 69, io: 50, network: 66 },
  { node: 'cn-bj-01', cpu: 55, memory: 58, io: 41, network: 49 },
  { node: 'cn-bj-02', cpu: 82, memory: 75, io: 64, network: 70 },
  { node: 'ap-sg-01', cpu: 64, memory: 68, io: 56, network: 72 },
  { node: 'ap-sg-02', cpu: 58, memory: 63, io: 48, network: 59 },
  { node: 'eu-fr-01', cpu: 62, memory: 60, io: 42, network: 51 },
  { node: 'eu-fr-02', cpu: 77, memory: 74, io: 63, network: 78 },
  { node: 'us-ca-01', cpu: 66, memory: 70, io: 45, network: 57 },
  { node: 'us-ca-02', cpu: 73, memory: 71, io: 59, network: 69 }
]);

const showRefresh = ref(false);
const showExport = ref(false);
const showTrend = ref(false);
const showInstruction = ref(false);
const activeNode = ref(null);
const showThrottle = ref(false);
const exportPercent = ref(35);
const trendLine = [30, 44, 60, 52, 70, 68, 64, 80];

const increaseExport = () => {
  exportPercent.value = Math.min(100, exportPercent.value + 22);
};

const openNode = (node) => {
  activeNode.value = node;
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 18px 20px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.08);
}

.btns button {
  margin-left: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
}

.eyebrow {
  color: #6b7280;
  margin: 0;
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.chart-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
}

.chart-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag {
  padding: 6px 10px;
  background: #ecfdf3;
  border-radius: 999px;
  color: #15803d;
}

.blue {
  background: #e0ecff;
  color: #1d4ed8;
}

.line-chart {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 6px;
  align-items: end;
  height: 160px;
  margin-top: 12px;
  background: linear-gradient(180deg, #f8fafc, #eef2ff);
  border-radius: 12px;
  padding: 10px;
}

.point {
  background: linear-gradient(180deg, #60a5fa, #2563eb);
  border-radius: 6px 6px 0 0;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.metric {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
}

.metric-label {
  margin: 0;
  color: #6b7280;
}

.metric-value {
  margin: 6px 0;
  font-size: 22px;
  font-weight: 800;
}

.metric-bar {
  background: #e5e7eb;
  height: 8px;
  border-radius: 8px;
}

.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #2563eb);
  border-radius: 8px;
}

.table-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
}

.table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.progress {
  width: 100%;
  height: 12px;
  background: #eef2ff;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #22c55e);
}

.trend {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  align-items: end;
  height: 140px;
}

.trend-line {
  background: linear-gradient(180deg, #c4dafe, #2563eb);
  border-radius: 6px 6px 0 0;
}

.detail-list {
  padding-left: 18px;
  color: #374151;
}
</style>
