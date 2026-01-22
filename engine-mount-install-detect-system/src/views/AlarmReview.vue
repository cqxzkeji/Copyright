<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">异常报警与复检概览</div>
      <div class="info-row">
        <button class="button" @click="openForm">登记异常</button>
        <button class="button secondary" @click="openProgress">复检流程推进</button>
        <button class="button ghost" @click="openTip('报警联动已开启，支持短信/看板推送。')">报警策略</button>
      </div>
    </div>
    <div class="grid cols-3">
      <div class="card">
        <div class="card-title">报警分布</div>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">复检进度</div>
        <p style="color: var(--muted);">待复检 6 项 · 已完成 14 项</p>
        <div class="progress" style="margin-top: 12px;">
          <span style="width: 70%;"></span>
        </div>
      </div>
      <div class="card">
        <div class="card-title">异常示意图</div>
        <img :src="diagram" alt="异常示意图" style="width: 100%; margin-top: 12px; border-radius: 12px;" />
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">报警与复检记录</div>
      <div class="info-row">
        <button class="button secondary" @click="openForm">新增复检</button>
        <button class="button ghost" @click="openTip('整改记录需填写责任人和完成时间。')">复检说明</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>报警编号</th>
          <th>工位</th>
          <th>异常类型</th>
          <th>触发参数</th>
          <th>复检状态</th>
          <th>整改记录</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.code }}</td>
          <td>{{ row.station }}</td>
          <td>{{ row.type }}</td>
          <td>{{ row.metric }}</td>
          <td><span class="tag">{{ row.status }}</span></td>
          <td>{{ row.action }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :open="modal.open" :title="modal.title" @close="closeModal">
    <template v-if="modal.type === 'form'">
      <label>
        异常类型
        <select v-model="form.type">
          <option value="扭矩超限">扭矩超限</option>
          <option value="角度偏差">角度偏差</option>
          <option value="节拍超时">节拍超时</option>
        </select>
      </label>
      <label>
        责任工位
        <input v-model="form.station" placeholder="ST-01" />
      </label>
      <label>
        整改说明
        <textarea v-model="form.action" rows="3" placeholder="填写整改措施与复检计划"></textarea>
      </label>
      <button class="button" type="button" @click="closeModal">提交复检</button>
    </template>
    <template v-else-if="modal.type === 'progress'">
      <p>复检流程推进中，正在同步整改记录。</p>
      <div class="progress">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="color: var(--muted); font-size: 12px;">流程完成度 {{ progress }}%</p>
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
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="140"><rect width="320" height="140" rx="16" fill="%23fee2e2"/><circle cx="70" cy="70" r="28" fill="%23ef4444"/><rect x="120" y="40" width="160" height="20" rx="10" fill="%23fca5a5"/><rect x="120" y="70" width="130" height="20" rx="10" fill="%23f87171"/><rect x="120" y="100" width="110" height="20" rx="10" fill="%23ef4444"/></svg>';

const chartData = [
  { label: '扭矩', value: 80 },
  { label: '角度', value: 60 },
  { label: '节拍', value: 45 },
  { label: '传感', value: 30 },
  { label: '其他', value: 20 }
];

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `AL-${500 + index}`,
  station: `ST-${(index % 12) + 1}`,
  type: index % 3 === 0 ? '扭矩超限' : index % 3 === 1 ? '角度偏差' : '节拍超时',
  metric: index % 3 === 0 ? '48 N·m' : index % 3 === 1 ? '4.2°' : '85s',
  status: index % 4 === 0 ? '待复检' : '已关闭',
  action: index % 4 === 0 ? '待安排复检' : '已整改并复检'
}));

const modal = reactive({
  open: false,
  type: 'form',
  title: '登记异常',
  message: ''
});

const form = reactive({
  type: '扭矩超限',
  station: '',
  action: ''
});

const progress = 42;

const openForm = () => {
  modal.open = true;
  modal.type = 'form';
  modal.title = '异常登记与复检';
};

const openProgress = () => {
  modal.open = true;
  modal.type = 'progress';
  modal.title = '复检流程推进';
};

const openTip = (message) => {
  modal.open = true;
  modal.type = 'tip';
  modal.title = '报警提示';
  modal.message = message;
};

const closeModal = () => {
  modal.open = false;
};
</script>
