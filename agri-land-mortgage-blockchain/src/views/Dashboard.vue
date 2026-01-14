<template>
  <div class="page-container">
    <div class="grid summary-grid">
      <div class="card summary-card" v-for="item in summary" :key="item.label">
        <p>{{ item.label }}</p>
        <h3>{{ item.value }}</h3>
        <span>{{ item.note }}</span>
      </div>
    </div>

    <div class="grid dashboard-grid">
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">业务走势</h2>
          <div class="actions">
            <button class="button secondary" @click="openModal('filter')">筛选口径</button>
            <button class="button ghost" @click="openModal('tips')">指标说明</button>
          </div>
        </div>
        <div class="chart">
          <div class="line" v-for="(point, index) in linePoints" :key="index" :style="{ height: point + '%' }"></div>
        </div>
        <div class="chart-legend">
          <span>近12个月放款趋势</span>
          <strong>同比 +18.6%</strong>
        </div>
      </div>
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">区域热力分布</h2>
          <button class="button secondary" @click="openModal('heatmap')">生成热力图</button>
        </div>
        <div class="heatmap">
          <div v-for="block in heatmap" :key="block.id" class="heat-block" :style="{ opacity: block.level }">
            {{ block.name }}
          </div>
        </div>
        <div class="heatmap-note">覆盖 8 个县域，异常集中度 2 项</div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2 class="section-title">监管穿透明细</h2>
        <div class="actions">
          <button class="button" @click="openModal('export')">导出报表</button>
          <button class="button secondary" @click="openModal('progress')">同步链上凭证</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>机构</th>
            <th>申请量</th>
            <th>通过率</th>
            <th>审批时长</th>
            <th>放款规模</th>
            <th>不良迁徙</th>
            <th>链上凭证</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.batch">
            <td>{{ row.batch }}</td>
            <td>{{ row.org }}</td>
            <td>{{ row.apply }}</td>
            <td>{{ row.pass }}</td>
            <td>{{ row.duration }}</td>
            <td>{{ row.amount }}</td>
            <td>{{ row.migration }}</td>
            <td><span class="badge">{{ row.hash }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :show="modal.show" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'filter'">
        <div class="modal-form">
          <label>统计周期
            <select class="input" v-model="form.cycle">
              <option>月度</option>
              <option>季度</option>
              <option>年度</option>
            </select>
          </label>
          <label>监管口径
            <select class="input" v-model="form.scope">
              <option>省级</option>
              <option>市级</option>
              <option>县域</option>
            </select>
          </label>
          <label>指标组
            <input class="input" v-model="form.metric" placeholder="例如：逾期率、不良迁徙" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'export'">
        <div class="modal-form">
          <label>导出格式
            <select class="input" v-model="form.exportType">
              <option>Excel</option>
              <option>PDF</option>
              <option>CSV</option>
            </select>
          </label>
          <label>报送渠道
            <input class="input" v-model="form.channel" placeholder="省监管平台 / 金融专线" />
          </label>
          <label>数据校验
            <select class="input" v-model="form.verify">
              <option>链上凭证校验</option>
              <option>人工复核</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <div class="progress">
          <div class="progress-bar" :style="{ width: '68%' }"></div>
        </div>
        <p class="progress-text">正在同步 24 条凭证，预计剩余 16 秒。</p>
      </template>
      <template v-else-if="modal.type === 'heatmap'">
        <div class="modal-form">
          <label>热力层级
            <select class="input" v-model="form.level">
              <option>机构</option>
              <option>区域</option>
              <option>地块</option>
            </select>
          </label>
          <label>权属异常阈值
            <input class="input" v-model="form.threshold" placeholder="如 0.6" />
          </label>
          <label>显示维度
            <select class="input" v-model="form.dimension">
              <option>放款规模</option>
              <option>逾期率</option>
              <option>评估价值</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else>
        <p>指标说明：所有统计均已穿透到链上凭证，支持多角色审计追溯。</p>
      </template>
      <template #footer>
        <button class="button secondary" type="button" @click="closeModal">取消</button>
        <button class="button" type="button" @click="confirmModal">确认</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const summary = [
  { label: '申请量', value: '1,248', note: '本月新增 86' },
  { label: '通过率', value: '82.4%', note: '环比 +2.1%' },
  { label: '平均审批时长', value: '4.6 天', note: '缩短 0.8 天' },
  { label: '放款规模', value: '¥ 3.2 亿', note: '存量 9.7 亿' }
];

const linePoints = [28, 36, 42, 38, 54, 60, 52, 68, 74, 70, 82, 88];

const heatmap = [
  { id: 1, name: '平塘', level: 0.3 },
  { id: 2, name: '富源', level: 0.6 },
  { id: 3, name: '清安', level: 0.8 },
  { id: 4, name: '瑞川', level: 0.45 },
  { id: 5, name: '河谷', level: 0.5 },
  { id: 6, name: '莲新', level: 0.7 },
  { id: 7, name: '林南', level: 0.55 },
  { id: 8, name: '昌岭', level: 0.35 }
];

const tableData = Array.from({ length: 24 }, (_, index) => ({
  batch: `2024-${String(index + 1).padStart(2, '0')}`,
  org: ['省农信', '农商行', '村镇银行'][index % 3],
  apply: 40 + index,
  pass: `${78 + (index % 8)}%`,
  duration: `${3 + (index % 5)} 天`,
  amount: `¥ ${(18 + index / 2).toFixed(1)}M`,
  migration: `${1.8 + (index % 4) * 0.2}%`,
  hash: `0x${(18900 + index).toString(16)}`
}));

const modal = reactive({
  show: false,
  type: 'tips',
  title: ''
});

const form = reactive({
  cycle: '月度',
  scope: '省级',
  metric: '逾期率',
  exportType: 'Excel',
  channel: '省监管平台',
  verify: '链上凭证校验',
  level: '区域',
  threshold: '0.6',
  dimension: '放款规模'
});

const openModal = (type) => {
  modal.show = true;
  modal.type = type;
  modal.title =
    type === 'filter'
      ? '筛选统计口径'
      : type === 'export'
        ? '监管报送导出'
        : type === 'progress'
          ? '链上凭证同步中'
          : type === 'heatmap'
            ? '热力分布配置'
            : '指标说明';
};

const closeModal = () => {
  modal.show = false;
};

const confirmModal = () => {
  modal.show = false;
};
</script>

<style scoped>
.summary-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-bottom: 20px;
}

.summary-card h3 {
  font-size: 24px;
  margin: 8px 0;
}

.summary-card p {
  color: #64748b;
  font-size: 13px;
}

.summary-card span {
  color: #94a3b8;
  font-size: 12px;
}

.dashboard-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 160px;
  padding: 12px 0;
}

.line {
  flex: 1;
  background: linear-gradient(180deg, #3b82f6, #93c5fd);
  border-radius: 8px 8px 4px 4px;
}

.chart-legend {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 13px;
}

.heatmap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.heat-block {
  background: #3b82f6;
  color: #ffffff;
  padding: 12px;
  border-radius: 12px;
  font-size: 12px;
  text-align: center;
}

.heatmap-note {
  margin-top: 12px;
  color: #64748b;
  font-size: 12px;
}

.modal-form {
  display: grid;
  gap: 12px;
  font-size: 14px;
  color: #475569;
}

.modal-form label {
  display: grid;
  gap: 6px;
}

.progress {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
  margin-top: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
}

.progress-text {
  margin-top: 12px;
  color: #64748b;
  font-size: 13px;
}
</style>
