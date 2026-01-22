<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">数据统计与报告分析</div>
      <div class="info-row">
        <button class="button" @click="openForm">生成报表</button>
        <button class="button secondary" @click="openProgress">导出进度</button>
        <button class="button ghost" @click="openTip('统计周期支持按班次、按周、按月。')">统计说明</button>
      </div>
    </div>
    <div class="grid cols-3">
      <div class="card">
        <div class="card-title">工位负载分布</div>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">缺陷类型占比</div>
        <img :src="diagram" alt="缺陷占比图" style="width: 100%; margin-top: 12px; border-radius: 12px;" />
      </div>
      <div class="card">
        <div class="card-title">效率指标</div>
        <p style="color: var(--muted);">平均节拍 78s · 产线负载 82%</p>
        <div class="progress" style="margin-top: 12px;">
          <span style="width: 82%;"></span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">统计数据明细</div>
      <div class="info-row">
        <button class="button secondary" @click="openForm">新增分析任务</button>
        <button class="button ghost" @click="openTip('支持一键导出 PDF 与 Excel。')">导出提示</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>日期</th>
          <th>工位负载</th>
          <th>合格率</th>
          <th>平均节拍</th>
          <th>异常件数</th>
          <th>分析结论</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.date }}</td>
          <td>{{ row.load }}</td>
          <td>{{ row.passRate }}</td>
          <td>{{ row.cycle }}</td>
          <td>{{ row.abnormal }}</td>
          <td>{{ row.summary }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :open="modal.open" :title="modal.title" @close="closeModal">
    <template v-if="modal.type === 'form'">
      <label>
        报表名称
        <input v-model="form.name" placeholder="例如：周度质量分析" />
      </label>
      <label>
        统计周期
        <select v-model="form.period">
          <option value="周度">周度</option>
          <option value="月度">月度</option>
          <option value="季度">季度</option>
        </select>
      </label>
      <label>
        导出格式
        <select v-model="form.format">
          <option value="PDF">PDF</option>
          <option value="Excel">Excel</option>
        </select>
      </label>
      <button class="button" type="button" @click="closeModal">生成报表</button>
    </template>
    <template v-else-if="modal.type === 'progress'">
      <p>报表导出中，请稍候。</p>
      <div class="progress">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="color: var(--muted); font-size: 12px;">导出进度 {{ progress }}%</p>
    </template>
    <template v-else>
      <p>{{ modal.message }}</p>
      <button class="button" type="button" @click="closeModal">确认</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const diagram =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="140"><rect width="320" height="140" rx="16" fill="%23ecfdf3"/><circle cx="90" cy="70" r="36" fill="%2322c55e"/><circle cx="150" cy="70" r="28" fill="%2384cc16"/><circle cx="210" cy="70" r="20" fill="%2322b07d"/><rect x="240" y="50" width="50" height="40" rx="10" fill="%236ee7b7"/></svg>';

const chartData = [
  { label: 'ST1', value: 60 },
  { label: 'ST2', value: 72 },
  { label: 'ST3', value: 84 },
  { label: 'ST4', value: 65 },
  { label: 'ST5', value: 78 }
];

const tableRows = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  date: `2024-09-${(index + 1).toString().padStart(2, '0')}`,
  load: `${70 + (index % 10)}%`,
  passRate: `${96 + (index % 4)}%`,
  cycle: `${72 + (index % 6)}s`,
  abnormal: `${index % 5}`,
  summary: index % 4 === 0 ? '负载偏高' : '稳定'
}));

const modal = reactive({
  open: false,
  type: 'form',
  title: '生成统计报表',
  message: ''
});

const form = reactive({
  name: '',
  period: '周度',
  format: 'PDF'
});

const progress = 76;

const openForm = () => {
  modal.open = true;
  modal.type = 'form';
  modal.title = '生成统计报表';
};

const openProgress = () => {
  modal.open = true;
  modal.type = 'progress';
  modal.title = '导出进度';
};

const openTip = (message) => {
  modal.open = true;
  modal.type = 'tip';
  modal.title = '统计提示';
  modal.message = message;
};

const closeModal = () => {
  modal.open = false;
};
</script>
