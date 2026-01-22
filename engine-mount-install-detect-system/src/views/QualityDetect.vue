<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">支架质量检测状态</div>
      <div class="info-row">
        <button class="button" @click="openForm">新增检测规则</button>
        <button class="button secondary" @click="openProgress">模型复算</button>
        <button class="button ghost" @click="openTip('检测模型基于历史 5000 件样本训练。')">模型说明</button>
      </div>
    </div>
    <div class="grid cols-3">
      <div class="card">
        <div class="card-title">合格率走势</div>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">偏差分布</div>
        <img :src="diagram" alt="偏差分布图" style="width: 100%; margin-top: 12px; border-radius: 12px;" />
      </div>
      <div class="card">
        <div class="card-title">当前检测结论</div>
        <p style="color: var(--muted);">今日检测 128 件，异常 3 件</p>
        <div class="progress" style="margin-top: 12px;">
          <span style="width: 97%;"></span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">质量检测记录与判定</div>
      <div class="info-row">
        <button class="button secondary" @click="openForm">新增检测项</button>
        <button class="button ghost" @click="openTip('异常件已标记复检，请及时处理。')">异常提示</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>检测编号</th>
          <th>支架型号</th>
          <th>扭矩偏差</th>
          <th>角度偏差</th>
          <th>模型判定</th>
          <th>原因分析</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.code }}</td>
          <td>{{ row.model }}</td>
          <td>{{ row.torque }}</td>
          <td>{{ row.angle }}</td>
          <td><span class="tag">{{ row.result }}</span></td>
          <td>{{ row.reason }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :open="modal.open" :title="modal.title" @close="closeModal">
    <template v-if="modal.type === 'form'">
      <label>
        检测规则名称
        <input v-model="form.name" placeholder="例如：主支架扭矩偏差" />
      </label>
      <label>
        阈值范围
        <input v-model="form.threshold" placeholder="±5%" />
      </label>
      <label>
        触发等级
        <select v-model="form.level">
          <option value="提示">提示</option>
          <option value="预警">预警</option>
          <option value="拦截">拦截</option>
        </select>
      </label>
      <button class="button" type="button" @click="closeModal">保存规则</button>
    </template>
    <template v-else-if="modal.type === 'progress'">
      <p>检测模型正在复算，预计 2 分钟完成。</p>
      <div class="progress">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="color: var(--muted); font-size: 12px;">复算进度 {{ progress }}%</p>
    </template>
    <template v-else>
      <p>{{ modal.message }}</p>
      <button class="button" type="button" @click="closeModal">确定</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const diagram =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="140"><rect width="320" height="140" rx="16" fill="%23fef3c7"/><rect x="30" y="40" width="60" height="60" rx="12" fill="%23f59e0b"/><rect x="110" y="30" width="60" height="80" rx="12" fill="%23fb923c"/><rect x="190" y="50" width="60" height="60" rx="12" fill="%23fdba74"/><circle cx="270" cy="70" r="26" fill="%232f6fed"/></svg>';

const chartData = [
  { label: '周一', value: 88 },
  { label: '周二', value: 92 },
  { label: '周三', value: 96 },
  { label: '周四', value: 90 },
  { label: '周五', value: 97 }
];

const tableRows = Array.from({ length: 21 }, (_, index) => ({
  id: index + 1,
  code: `QD-${202400 + index}`,
  model: `EM-${200 + (index % 8)}`,
  torque: `${(index % 5) + 1}.2%`,
  angle: `${(index % 4) + 0.8}°`,
  result: index % 6 === 0 ? '不合格' : '合格',
  reason: index % 6 === 0 ? '扭矩超限' : '正常'
}));

const modal = reactive({
  open: false,
  type: 'form',
  title: '新增检测规则',
  message: ''
});

const form = reactive({
  name: '',
  threshold: '',
  level: '提示'
});

const progress = 58;

const openForm = () => {
  modal.open = true;
  modal.type = 'form';
  modal.title = '新增检测规则';
};

const openProgress = () => {
  modal.open = true;
  modal.type = 'progress';
  modal.title = '模型复算进度';
};

const openTip = (message) => {
  modal.open = true;
  modal.type = 'tip';
  modal.title = '检测提示';
  modal.message = message;
};

const closeModal = () => {
  modal.open = false;
};
</script>
