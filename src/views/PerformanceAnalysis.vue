<template>
  <div class="grid" style="gap: 16px;">
    <div class="header-actions" style="justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 10px; align-items: center;">
        <h2 style="margin: 0;">业务性能分析</h2>
        <span class="tag">应用表现</span>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openPlan">优化计划</button>
        <button class="secondary-btn" @click="showProgress = true">性能压测</button>
        <button class="secondary-btn" @click="showNote = true">操作提示</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card" v-for="metric in metrics" :key="metric.label">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="color: #6b7280;">{{ metric.label }}</div>
            <div style="font-size: 26px; font-weight: 800;">{{ metric.value }}</div>
          </div>
          <span class="status-chip" :style="metric.chip">{{ metric.trend }}</span>
        </div>
        <div class="progress-bar" style="margin-top: 10px;">
          <div class="progress-inner" :style="{ width: metric.fill }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>接口耗时分布</strong>
        <button class="secondary-btn" @click="showChartInfo = true">图例说明</button>
      </div>
      <div class="chart-placeholder" style="margin-top: 14px;">
        <div v-for="api in apiUsage" :key="api.name" class="bar" :style="{ height: `${api.time}px`, background: api.color }">
          <span>{{ api.name }} {{ api.time }}ms</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>应用性能明细</strong>
        <button class="secondary-btn" @click="showTableInfo = true">表格提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>系统</th>
            <th>请求量</th>
            <th>平均响应</th>
            <th>错误率</th>
            <th>峰值 QPS</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.requests }}</td>
            <td>{{ row.latency }} ms</td>
            <td>{{ row.error }}%</td>
            <td>{{ row.qps }}</td>
            <td><span class="status-chip" :style="row.error < 1 ? goodChip : warnChip">{{ row.state }}</span></td>
            <td>
              <button class="secondary-btn" @click="openDetail(row)">分析</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showPlanModal" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">优化计划</div>
      <div class="modal-body">
        <div class="form-group">
          <label>目标系统</label>
          <select v-model="plan.target">
            <option value="核心交易">核心交易</option>
            <option value="结算服务">结算服务</option>
            <option value="网关">网关</option>
          </select>
        </div>
        <div class="form-group">
          <label>优化动作</label>
          <textarea rows="3" v-model="plan.action" placeholder="如：增加缓存、优化 SQL"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="secondary-btn" @click="showPlanModal = false">取消</button>
        <button class="primary-btn" @click="savePlan">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">压测进度</div>
      <div class="modal-body">
        <div class="progress-bar">
          <div class="progress-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="margin-top: 8px;">模拟流量已注入，等待压测完成...</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showProgress = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showNote" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">操作提示</div>
      <div class="modal-body">
        <p>压测会短暂提升请求量，请在低谷时段执行。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showNote = false">收到</button>
      </div>
    </div>
  </div>

  <div v-if="showChartInfo" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">图例说明</div>
      <div class="modal-body">
        <p>柱子高度代表平均响应时间，颜色区分不同接口。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showChartInfo = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showTableInfo" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">表格提示</div>
      <div class="modal-body">
        <p>错误率超过 1% 建议立即排查，可通过优化计划快速记录。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showTableInfo = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="detail" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">性能分析 - {{ detail.name }}</div>
      <div class="modal-body">
        <p>平均响应：{{ detail.latency }}ms</p>
        <p>错误率：{{ detail.error }}%</p>
        <p>建议：{{ detail.tip }}</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="detail = null">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

const goodChip = { background: '#dcfce7', color: '#166534' };
const warnChip = { background: '#fff7ed', color: '#ea580c' };

const metrics = [
  { label: '平均响应', value: '86 ms', trend: '良好', fill: '68%', chip: goodChip },
  { label: '错误率', value: '0.6%', trend: '下降', fill: '22%', chip: goodChip },
  { label: '吞吐量', value: '9.2k qps', trend: '提升', fill: '74%', chip: goodChip },
  { label: '队列堆积', value: '12 个', trend: '关注', fill: '30%', chip: warnChip }
];

const apiUsage = ref([
  { name: '下单接口', time: 190, color: 'linear-gradient(180deg,#60a5fa,#2563eb)' },
  { name: '支付接口', time: 150, color: 'linear-gradient(180deg,#34d399,#059669)' },
  { name: '查询接口', time: 120, color: 'linear-gradient(180deg,#facc15,#eab308)' },
  { name: '对账接口', time: 160, color: 'linear-gradient(180deg,#a78bfa,#7c3aed)' },
  { name: '通知接口', time: 110, color: 'linear-gradient(180deg,#f472b6,#db2777)' }
]);

const tableData = ref([
  { name: '核心交易', requests: 89000, latency: 86, error: 0.6, qps: 9200, state: '稳定', tip: '保持缓存热度' },
  { name: '支付网关', requests: 74000, latency: 94, error: 0.4, qps: 8700, state: '稳定', tip: '观察证书续期' },
  { name: '清结算', requests: 52000, latency: 112, error: 1.2, qps: 6400, state: '关注', tip: '检查数据库锁等待' },
  { name: '风控服务', requests: 48000, latency: 78, error: 0.5, qps: 7100, state: '稳定', tip: '更新特征集' },
  { name: '营销平台', requests: 38000, latency: 102, error: 0.9, qps: 5300, state: '稳定', tip: '优化缓存策略' },
  { name: '报表中心', requests: 26000, latency: 210, error: 0.7, qps: 3200, state: '关注', tip: '考虑拆分慢查询' },
  { name: '会员中心', requests: 45000, latency: 88, error: 0.8, qps: 6100, state: '稳定', tip: '升级消息组件' },
  { name: '日志服务', requests: 51000, latency: 134, error: 0.3, qps: 7200, state: '稳定', tip: '压缩策略优化' },
  { name: '通知服务', requests: 33000, latency: 126, error: 0.4, qps: 5400, state: '稳定', tip: '路由策略优化' },
  { name: '供应链', requests: 29000, latency: 118, error: 0.9, qps: 4800, state: '稳定', tip: '增加连接池' }
]);

const plan = reactive({ target: '核心交易', action: '' });
const showPlanModal = ref(false);
const showProgress = ref(false);
const showNote = ref(false);
const showChartInfo = ref(false);
const showTableInfo = ref(false);
const detail = ref(null);
const progress = ref(20);

const openPlan = () => (showPlanModal.value = true);

const savePlan = () => {
  showPlanModal.value = false;
  showNote.value = true;
};

const openDetail = (row) => {
  detail.value = row;
};

onMounted(() => {
  const timer = setInterval(() => {
    if (!showProgress.value) return;
    progress.value = Math.min(100, progress.value + 25);
    if (progress.value >= 100) {
      showProgress.value = false;
      progress.value = 20;
    }
  }, 400);
  return () => clearInterval(timer);
});
</script>
