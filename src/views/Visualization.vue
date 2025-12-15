<template>
  <div class="grid" style="gap: 16px;">
    <div class="header-actions" style="justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 10px; align-items: center;">
        <h2 style="margin: 0;">数据可视化与报表</h2>
        <span class="tag">图表中心</span>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openReport">导出报表</button>
        <button class="secondary-btn" @click="showProgress = true">生成快照</button>
        <button class="secondary-btn" @click="showHint = true">操作提示</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card">
        <div style="color: #6b7280;">报表数量</div>
        <div style="font-size: 26px; font-weight: 800;">18 份</div>
      </div>
      <div class="card">
        <div style="color: #6b7280;">更新频率</div>
        <div style="font-size: 26px; font-weight: 800;">每30分钟</div>
      </div>
      <div class="card">
        <div style="color: #6b7280;">订阅用户</div>
        <div style="font-size: 26px; font-weight: 800;">126 人</div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>业务量报表</strong>
        <button class="secondary-btn" @click="showChartInfo = true">图例说明</button>
      </div>
      <div class="chart-placeholder" style="margin-top: 14px;">
        <div v-for="item in traffic" :key="item.name" class="bar" :style="{ height: `${item.value}px`, background: item.color }">
          <span>{{ item.name }} {{ item.value }}万笔</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>报表订阅列表</strong>
        <button class="secondary-btn" @click="showTableInfo = true">表格提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>报表</th>
            <th>周期</th>
            <th>最近生成</th>
            <th>订阅人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.name">
            <td>{{ report.name }}</td>
            <td>{{ report.cycle }}</td>
            <td>{{ report.last }}</td>
            <td>{{ report.subscribers }}</td>
            <td><span class="status-chip" :style="report.status === '正常' ? goodChip : warnChip">{{ report.status }}</span></td>
            <td><button class="secondary-btn" @click="openDetail(report)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showReportModal" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">导出报表</div>
      <div class="modal-body">
        <div class="form-group">
          <label>选择报表</label>
          <select v-model="exportForm.name">
            <option v-for="report in reports" :key="report.name" :value="report.name">{{ report.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>格式</label>
          <select v-model="exportForm.format">
            <option value="PDF">PDF</option>
            <option value="Excel">Excel</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="secondary-btn" @click="showReportModal = false">取消</button>
        <button class="primary-btn" @click="confirmExport">导出</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">生成快照</div>
      <div class="modal-body">
        <div class="progress-bar">
          <div class="progress-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="margin-top: 8px;">正在渲染仪表盘快照...</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showProgress = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showHint" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">操作提示</div>
      <div class="modal-body">
        <p>导出报表会生成可下载文件，快照适合发送到移动端。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showHint = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showChartInfo" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">图例说明</div>
      <div class="modal-body">
        <p>柱子表示不同系统的业务量，单位为万笔。</p>
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
        <p>订阅用户超过 50 的报表建议检查分发频率以保障性能。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showTableInfo = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="detail" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">报表详情 - {{ detail.name }}</div>
      <div class="modal-body">
        <p>周期：{{ detail.cycle }}</p>
        <p>订阅人：{{ detail.subscribers }}</p>
        <p>状态：{{ detail.status }}</p>
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

const traffic = ref([
  { name: '核心交易', value: 180, color: 'linear-gradient(180deg,#60a5fa,#2563eb)' },
  { name: '支付网关', value: 150, color: 'linear-gradient(180deg,#34d399,#059669)' },
  { name: '清结算', value: 120, color: 'linear-gradient(180deg,#facc15,#eab308)' },
  { name: '会员中心', value: 100, color: 'linear-gradient(180deg,#a78bfa,#7c3aed)' },
  { name: '报表中心', value: 90, color: 'linear-gradient(180deg,#f472b6,#db2777)' }
]);

const reports = ref([
  { name: '全局业务量日报', cycle: '每日', last: '09:30', subscribers: 62, status: '正常' },
  { name: '链路性能周报', cycle: '每周', last: '周一 08:00', subscribers: 44, status: '正常' },
  { name: '告警处理周报', cycle: '每周', last: '周一 07:45', subscribers: 38, status: '正常' },
  { name: '性能趋势月报', cycle: '每月', last: '1号 09:00', subscribers: 55, status: '关注' },
  { name: '报表延迟监控', cycle: '每日', last: '09:10', subscribers: 36, status: '正常' },
  { name: '终端访问排行', cycle: '每日', last: '09:05', subscribers: 41, status: '正常' },
  { name: '接口性能概览', cycle: '每日', last: '09:15', subscribers: 47, status: '正常' },
  { name: '业务容量预测', cycle: '每周', last: '周一 08:30', subscribers: 29, status: '正常' },
  { name: '安全审计报告', cycle: '每周', last: '周一 08:20', subscribers: 33, status: '正常' },
  { name: '区域访问统计', cycle: '每日', last: '09:12', subscribers: 58, status: '关注' }
]);

const exportForm = reactive({ name: '全局业务量日报', format: 'PDF' });
const showReportModal = ref(false);
const showProgress = ref(false);
const showHint = ref(false);
const showChartInfo = ref(false);
const showTableInfo = ref(false);
const detail = ref(null);
const progress = ref(15);

const openReport = () => (showReportModal.value = true);

const confirmExport = () => {
  showReportModal.value = false;
  showHint.value = true;
};

const openDetail = (report) => {
  detail.value = report;
};

onMounted(() => {
  const timer = setInterval(() => {
    if (!showProgress.value) return;
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value >= 100) {
      showProgress.value = false;
      progress.value = 15;
    }
  }, 500);
  return () => clearInterval(timer);
});
</script>
