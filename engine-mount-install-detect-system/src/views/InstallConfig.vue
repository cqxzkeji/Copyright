<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">工艺工位配置概览</div>
      <div class="info-row">
        <button class="button" @click="openForm('station')">新增工位</button>
        <button class="button secondary" @click="openProgress">下发工艺</button>
        <button class="button ghost" @click="openTip('工艺配置已同步最新标准，支持追溯。')">配置提示</button>
      </div>
    </div>
    <div class="grid cols-3">
      <div class="card">
        <div class="card-title">工位覆盖率</div>
        <p style="color: var(--muted);">今日上线工位 12 / 12</p>
        <div class="progress" style="margin-top: 12px;">
          <span style="width: 100%;"></span>
        </div>
      </div>
      <div class="card">
        <div class="card-title">关键扭矩策略</div>
        <p style="color: var(--muted);">已发布 18 条工艺曲线</p>
        <img :src="diagram" alt="工艺布局图" style="width: 100%; margin-top: 12px; border-radius: 12px;" />
      </div>
      <div class="card">
        <div class="card-title">装配顺序节拍</div>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">工位参数与工艺下发记录</div>
      <div class="info-row">
        <button class="button secondary" @click="openForm('sequence')">定义安装顺序</button>
        <button class="button ghost" @click="openTip('工位参数已锁定，调整需工艺审核。')">规则说明</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>工位编号</th>
          <th>支架型号</th>
          <th>扭矩(N·m)</th>
          <th>角度(°)</th>
          <th>安装顺序</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.station }}</td>
          <td>{{ row.model }}</td>
          <td>{{ row.torque }}</td>
          <td>{{ row.angle }}</td>
          <td>{{ row.sequence }}</td>
          <td><span class="tag">{{ row.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :open="modal.open" :title="modal.title" @close="closeModal">
    <template v-if="modal.type === 'form'">
      <label>
        工艺名称
        <input v-model="form.name" placeholder="请输入工艺或工位名称" />
      </label>
      <label>
        扭矩目标(N·m)
        <input v-model="form.torque" type="number" placeholder="如 42" />
      </label>
      <label>
        角度目标(°)
        <input v-model="form.angle" type="number" placeholder="如 90" />
      </label>
      <button class="button" type="button" @click="saveForm">保存配置</button>
    </template>
    <template v-else-if="modal.type === 'progress'">
      <p>正在将最新工艺参数下发至所有工位，请保持网络畅通。</p>
      <div class="progress">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="color: var(--muted); font-size: 12px;">完成度 {{ progress }}%</p>
    </template>
    <template v-else>
      <p>{{ modal.message }}</p>
      <button class="button" type="button" @click="closeModal">我知道了</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const diagram =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="140"><rect width="320" height="140" rx="16" fill="%23e6efff"/><circle cx="60" cy="70" r="28" fill="%232f6fed"/><rect x="110" y="40" width="170" height="20" rx="10" fill="%2390b3ff"/><rect x="110" y="70" width="140" height="20" rx="10" fill="%236a93ff"/><rect x="110" y="100" width="120" height="20" rx="10" fill="%232f6fed"/></svg>';

const chartData = [
  { label: '序1', value: 60 },
  { label: '序2', value: 75 },
  { label: '序3', value: 45 },
  { label: '序4', value: 85 },
  { label: '序5', value: 70 }
];

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  station: `ST-${(index + 1).toString().padStart(2, '0')}`,
  model: `EM-${100 + index}`,
  torque: 36 + (index % 5) * 2,
  angle: 85 + (index % 4) * 3,
  sequence: `S${(index % 6) + 1}`,
  status: index % 3 === 0 ? '已下发' : '待复核'
}));

const modal = reactive({
  open: false,
  type: 'form',
  title: '新增工位',
  message: ''
});

const form = reactive({
  name: '',
  torque: '',
  angle: ''
});

const progress = 72;

const openForm = (type) => {
  modal.open = true;
  modal.type = 'form';
  modal.title = type === 'station' ? '新增工位' : '定义安装顺序';
};

const openProgress = () => {
  modal.open = true;
  modal.type = 'progress';
  modal.title = '工艺参数下发中';
};

const openTip = (message) => {
  modal.open = true;
  modal.type = 'tip';
  modal.title = '配置提示';
  modal.message = message;
};

const saveForm = () => {
  modal.open = false;
};

const closeModal = () => {
  modal.open = false;
};
</script>
