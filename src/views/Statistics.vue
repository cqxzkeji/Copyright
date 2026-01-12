<template>
  <div class="grid three">
    <div class="card">
      <div class="section-title">指标总览</div>
      <div style="font-size: 26px; font-weight: 700;">98.4%</div>
      <div style="font-size: 12px; color: #6b7a99;">日报准时率</div>
    </div>
    <div class="card">
      <div class="section-title">数据覆盖率</div>
      <div style="font-size: 26px; font-weight: 700;">74,520</div>
      <div style="font-size: 12px; color: #6b7a99;">日活指标样本</div>
    </div>
    <div class="card">
      <div class="section-title">异常提醒</div>
      <div style="font-size: 26px; font-weight: 700;">7</div>
      <div style="font-size: 12px; color: #6b7a99;">待处理指标</div>
    </div>
  </div>

  <div class="grid two">
    <div class="card">
      <div class="section-title">指标趋势</div>
      <div class="chart">
        <div v-for="item in kpiTrend" :key="item.label" class="chart-row">
          <span>{{ item.label }}</span>
          <div class="chart-bar">
            <span :style="{ width: item.value + '%' }"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">指标操作</div>
      <div class="actions">
        <button class="btn" type="button" @click="openModal('export')">生成报表</button>
        <button class="btn secondary" type="button" @click="openModal('analyze')">启动分析</button>
        <button class="btn outline" type="button" @click="openModal('compare')">对比维度</button>
        <button class="btn secondary" type="button" @click="openModal('progress')">分析进度</button>
        <button class="btn outline" type="button" @click="openModal('tip')">指标提示</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">指标明细</div>
    <table class="table">
      <thead>
        <tr>
          <th>指标名称</th>
          <th>负责人</th>
          <th>目标值</th>
          <th>当前值</th>
          <th>环比</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in kpiTable" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.owner }}</td>
          <td>{{ row.target }}</td>
          <td>{{ row.value }}</td>
          <td>{{ row.change }}</td>
          <td><span class="badge" :class="row.badge">{{ row.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal">
    <template v-if="activeModal === 'export'">
      <div class="form-grid">
        <div>
          <label>报表类型</label>
          <select v-model="form.reportType">
            <option value="日报指标">日报指标</option>
            <option value="周报趋势">周报趋势</option>
            <option value="管理驾驶舱">管理驾驶舱</option>
          </select>
        </div>
        <div>
          <label>输出格式</label>
          <select v-model="form.reportFormat">
            <option value="PDF">PDF</option>
            <option value="Excel">Excel</option>
            <option value="PPT">PPT</option>
          </select>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'analyze'">
      <div class="form-grid">
        <div>
          <label>分析范围</label>
          <select v-model="form.range">
            <option value="近7天">近7天</option>
            <option value="近30天">近30天</option>
            <option value="本季度">本季度</option>
          </select>
        </div>
        <div>
          <label>分析重点</label>
          <textarea v-model="form.focus" rows="3" placeholder="填写关注指标"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'compare'">
      <div class="form-grid">
        <div>
          <label>对比维度</label>
          <input v-model="form.dimension" placeholder="例如：地区、行业" />
        </div>
        <div>
          <label>对比说明</label>
          <textarea v-model="form.compareNote" rows="3" placeholder="填写对比目的"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>分析任务执行进度</p>
      <div style="display: grid; gap: 8px; margin-top: 12px;">
        <div>
          <div style="font-size: 12px; color: #6b7a99;">数据建模</div>
          <div class="progress"><span style="width: 76%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">可视化渲染</div>
          <div class="progress"><span style="width: 52%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">报告生成</div>
          <div class="progress"><span style="width: 38%"></span></div>
        </div>
      </div>
    </template>
    <template v-else>
      <p>保持指标口径一致，建议每日早 9 点完成数据校验并生成日报。</p>
    </template>
    <template #actions>
      <button class="btn" type="button" @click="closeModal">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const form = ref({
  reportType: '日报指标',
  reportFormat: 'PDF',
  range: '近7天',
  focus: '',
  dimension: '',
  compareNote: ''
});

const kpiTrend = [
  { label: '营收增长', value: 72 },
  { label: '客户活跃', value: 65 },
  { label: '转化率', value: 54 },
  { label: '复购率', value: 70 },
  { label: '服务满意度', value: 88 }
];

const kpiTable = Array.from({ length: 24 }, (_, index) => {
  const status = [
    { text: '正常', badge: 'success' },
    { text: '波动', badge: 'warning' },
    { text: '关注', badge: 'info' }
  ][index % 3];
  return {
    name: `指标-${index + 1}`,
    owner: ['赵敏', '陈琪', '孙浩', '杨雪'][index % 4],
    target: `${90 + (index % 5)}%`,
    value: `${80 + (index % 12)}%`,
    change: `${index % 2 === 0 ? '+' : '-'}${(index % 7) + 1}%`,
    status: status.text,
    badge: status.badge
  };
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const modalTitleMap = {
  export: '生成指标报表',
  analyze: '启动分析任务',
  compare: '维度对比设置',
  progress: '分析进度',
  tip: '指标提示'
};

const modalTitle = computed(() => modalTitleMap[activeModal.value] || '提示');
</script>
