<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">安装过程监测概览</div>
      <div class="info-row">
        <button class="button" @click="openForm">采集点配置</button>
        <button class="button secondary" @click="openProgress">实时数据同步</button>
        <button class="button ghost" @click="openTip('当前采集频率 50ms，可按工位调整。')">采集提示</button>
      </div>
    </div>
    <div class="grid cols-3">
      <div class="card">
        <div class="card-title">关键扭矩曲线</div>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">实时采集概况</div>
        <p style="color: var(--muted);">当前在线传感器 32 个</p>
        <div class="progress" style="margin-top: 12px;">
          <span style="width: 86%;"></span>
        </div>
      </div>
      <div class="card">
        <div class="card-title">姿态监测图</div>
        <img :src="diagram" alt="姿态监测图" style="width: 100%; margin-top: 12px; border-radius: 12px;" />
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">安装过程数据采集记录</div>
      <div class="info-row">
        <button class="button secondary" @click="openForm">新增采集任务</button>
        <button class="button ghost" @click="openTip('历史数据已按批次归档，可按时间检索。')">数据提示</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>批次</th>
          <th>工位</th>
          <th>扭矩峰值</th>
          <th>位移</th>
          <th>姿态偏差</th>
          <th>时间节点</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.batch }}</td>
          <td>{{ row.station }}</td>
          <td>{{ row.torque }} N·m</td>
          <td>{{ row.displacement }} mm</td>
          <td>{{ row.pose }}°</td>
          <td>{{ row.time }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :open="modal.open" :title="modal.title" @close="closeModal">
    <template v-if="modal.type === 'form'">
      <label>
        采集任务名称
        <input v-model="form.name" placeholder="例如：主支架扭矩监测" />
      </label>
      <label>
        采集频率(ms)
        <input v-model="form.rate" type="number" placeholder="50" />
      </label>
      <label>
        监测参数
        <select v-model="form.metric">
          <option value="扭矩">扭矩</option>
          <option value="位移">位移</option>
          <option value="姿态">姿态</option>
          <option value="时间">时间</option>
        </select>
      </label>
      <button class="button" type="button" @click="closeModal">保存任务</button>
    </template>
    <template v-else-if="modal.type === 'progress'">
      <p>数据流同步中，正在从所有工位拉取最新参数。</p>
      <div class="progress">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="color: var(--muted); font-size: 12px;">同步进度 {{ progress }}%</p>
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
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="140"><rect width="320" height="140" rx="16" fill="%23f0f9ff"/><path d="M40 90 C80 20, 140 20, 190 90" stroke="%2322b07d" stroke-width="6" fill="none"/><circle cx="40" cy="90" r="8" fill="%232f6fed"/><circle cx="190" cy="90" r="8" fill="%232f6fed"/><rect x="210" y="40" width="80" height="60" rx="10" fill="%2390b3ff"/></svg>';

const chartData = [
  { label: 'T1', value: 55 },
  { label: 'T2', value: 78 },
  { label: 'T3', value: 62 },
  { label: 'T4', value: 88 },
  { label: 'T5', value: 70 }
];

const tableRows = Array.from({ length: 22 }, (_, index) => ({
  id: index + 1,
  batch: `B-2024-${(index + 11).toString().padStart(2, '0')}`,
  station: `ST-${(index % 12) + 1}`,
  torque: 38 + (index % 6) * 3,
  displacement: 2.3 + (index % 5) * 0.4,
  pose: 0.6 + (index % 4) * 0.3,
  time: `10:${(index * 3) % 60}`.padStart(5, '0')
}));

const modal = reactive({
  open: false,
  type: 'form',
  title: '采集点配置',
  message: ''
});

const form = reactive({
  name: '',
  rate: 50,
  metric: '扭矩'
});

const progress = 64;

const openForm = () => {
  modal.open = true;
  modal.type = 'form';
  modal.title = '采集任务配置';
};

const openProgress = () => {
  modal.open = true;
  modal.type = 'progress';
  modal.title = '实时同步中';
};

const openTip = (message) => {
  modal.open = true;
  modal.type = 'tip';
  modal.title = '采集提示';
  modal.message = message;
};

const closeModal = () => {
  modal.open = false;
};
</script>
