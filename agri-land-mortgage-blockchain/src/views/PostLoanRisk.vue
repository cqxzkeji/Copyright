<template>
  <div class="page-container">
    <div class="grid risk-grid">
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">贷后风险监测</h2>
          <div class="actions">
            <button class="button" @click="openModal('monitor')">新增监测因子</button>
            <button class="button secondary" @click="openModal('alert')">发布预警</button>
          </div>
        </div>
        <div class="risk-metrics">
          <div class="metric">
            <strong>24</strong>
            <span>逾期预警</span>
          </div>
          <div class="metric">
            <strong>6</strong>
            <span>抵押物异常</span>
          </div>
          <div class="metric">
            <strong>12%</strong>
            <span>集中度</span>
          </div>
          <div class="metric">
            <strong>9</strong>
            <span>处置工单</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="section-header">
          <h2 class="section-title">风险因子趋势</h2>
          <button class="button ghost" @click="openModal('progress')">刷新巡检</button>
        </div>
        <div class="risk-chart">
          <div v-for="(bar, index) in riskTrend" :key="index" class="risk-bar" :style="{ height: bar + '%' }"></div>
        </div>
        <div class="chart-legend">近 10 周自然灾害/政策变动影响指数</div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h2 class="section-title">贷后处置台账</h2>
        <div class="actions">
          <button class="button" @click="openModal('workorder')">生成处置工单</button>
          <button class="button secondary" @click="openModal('extend')">展期/重组</button>
          <button class="button ghost" @click="openModal('tips')">提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>工单编号</th>
            <th>借款主体</th>
            <th>风险类型</th>
            <th>风险级别</th>
            <th>处置措施</th>
            <th>催收记录</th>
            <th>链上留痕</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in riskTable" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.borrower }}</td>
            <td>{{ row.type }}</td>
            <td><span class="badge">{{ row.level }}</span></td>
            <td>{{ row.action }}</td>
            <td>{{ row.follow }}</td>
            <td>{{ row.hash }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :show="modal.show" :title="modal.title" @close="closeModal">
      <template v-if="modal.type === 'monitor'">
        <div class="modal-form">
          <label>监测因子
            <input class="input" v-model="form.factor" placeholder="自然灾害/政策变动/资金流" />
          </label>
          <label>监测频率
            <select class="input" v-model="form.frequency">
              <option>每日</option>
              <option>每周</option>
              <option>每月</option>
            </select>
          </label>
          <label>数据来源
            <input class="input" v-model="form.source" placeholder="气象/监管/现场巡检" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'alert'">
        <div class="modal-form">
          <label>预警对象
            <input class="input" v-model="form.target" placeholder="主体/地块编号" />
          </label>
          <label>预警级别
            <select class="input" v-model="form.alertLevel">
              <option>高</option>
              <option>中</option>
              <option>低</option>
            </select>
          </label>
          <label>处置建议
            <input class="input" v-model="form.suggestion" placeholder="补充担保/催收" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'workorder'">
        <div class="modal-form">
          <label>工单类型
            <select class="input" v-model="form.workType">
              <option>逾期催收</option>
              <option>抵押物异常</option>
              <option>政策影响核查</option>
            </select>
          </label>
          <label>负责人
            <input class="input" v-model="form.owner" placeholder="风险处置专员" />
          </label>
          <label>说明
            <input class="input" v-model="form.workDesc" placeholder="工单处置要求" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'extend'">
        <div class="modal-form">
          <label>展期方式
            <select class="input" v-model="form.extendType">
              <option>展期 6 个月</option>
              <option>展期 12 个月</option>
              <option>重组还款计划</option>
            </select>
          </label>
          <label>审批意见
            <input class="input" v-model="form.extendNote" placeholder="请输入审批意见" />
          </label>
          <label>是否上链留痕
            <select class="input" v-model="form.onChain">
              <option>是</option>
              <option>否</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'progress'">
        <div class="progress">
          <div class="progress-bar" :style="{ width: '66%' }"></div>
        </div>
        <p class="progress-text">巡检记录已同步 18/27 条，预计 20 秒完成。</p>
      </template>
      <template v-else>
        <p>提示：风险处置材料会自动生成链上留痕，便于监管追溯。</p>
      </template>
      <template #footer>
        <button class="button secondary" type="button" @click="closeModal">取消</button>
        <button class="button" type="button" @click="confirmModal">提交</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const riskTrend = [45, 50, 60, 58, 62, 70, 66, 68, 72, 75];

const riskTable = Array.from({ length: 22 }, (_, index) => ({
  id: `FX-${2024}${String(index + 1).padStart(3, '0')}`,
  borrower: ['春耕合作社', '丰裕农场', '沃野农业'][index % 3],
  type: ['逾期预警', '抵押物异常', '政策变动'][index % 3],
  level: ['高', '中', '低'][index % 3],
  action: ['催收提醒', '现场核查', '展期评估'][index % 3],
  follow: `${1 + (index % 4)}次`,
  hash: `0x${(170000 + index).toString(16)}`
}));

const modal = reactive({
  show: false,
  type: 'tips',
  title: ''
});

const form = reactive({
  factor: '',
  frequency: '每周',
  source: '',
  target: '',
  alertLevel: '中',
  suggestion: '',
  workType: '逾期催收',
  owner: '',
  workDesc: '',
  extendType: '展期 6 个月',
  extendNote: '',
  onChain: '是'
});

const openModal = (type) => {
  modal.show = true;
  modal.type = type;
  modal.title =
    type === 'monitor'
      ? '新增监测因子'
      : type === 'alert'
        ? '发布风险预警'
        : type === 'workorder'
          ? '生成处置工单'
          : type === 'extend'
            ? '展期/重组流程'
            : type === 'progress'
              ? '巡检同步进度'
              : '按钮提示';
};

const closeModal = () => {
  modal.show = false;
};

const confirmModal = () => {
  modal.show = false;
};
</script>

<style scoped>
.risk-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.risk-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.metric {
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  display: grid;
  gap: 4px;
}

.metric strong {
  font-size: 20px;
}

.metric span {
  color: #64748b;
  font-size: 12px;
}

.risk-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 160px;
  padding: 12px 0;
}

.risk-bar {
  flex: 1;
  background: linear-gradient(180deg, #facc15, #f97316);
  border-radius: 8px 8px 4px 4px;
}

.chart-legend {
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
