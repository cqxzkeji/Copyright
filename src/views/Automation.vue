<template>
  <section class="grid-3">
    <div class="card">
      <h3>自动化调优</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">智能分析慢查询并给出优化建议。</p>
      <div class="action-bar">
        <button class="primary-button" type="button" @click="openProgress('正在执行智能调优计划')">执行调优</button>
        <button class="secondary-button" type="button" @click="openForm('配置调优策略')">调优策略</button>
        <button class="secondary-button" type="button" @click="openInfo('调优策略支持窗口期与灰度发布。')">策略说明</button>
      </div>
    </div>
    <div class="card">
      <h3>健康检查评分</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">最近七天健康评分趋势。</p>
      <div class="chart">
        <div v-for="value in chartData" :key="value" class="chart-bar" :style="{ height: `${value}%` }"></div>
      </div>
    </div>
    <div class="card">
      <h3>任务调度概览</h3>
      <div class="form-grid">
        <label>待执行任务<input type="text" value="12" disabled /></label>
        <label>成功任务<input type="text" value="98" disabled /></label>
        <label>失败任务<input type="text" value="2" disabled /></label>
      </div>
    </div>
  </section>

  <section class="card">
    <h3>自动化任务列表</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>任务名称</th>
          <th>调度周期</th>
          <th>最近执行</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.cycle }}</td>
          <td>{{ row.lastRun }}</td>
          <td><span class="tag">{{ row.status }}</span></td>
          <td>
            <button class="secondary-button" type="button" @click="openDetails(row)">查看</button>
            <button class="secondary-button" type="button" @click="openForm('编辑调度', row)">编辑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <AppModal v-model="showModal" :title="modalTitle">
    <div v-if="modalType === 'form'" class="form-grid">
      <label>
        任务名称
        <input v-model="formState.name" type="text" placeholder="例如 自动索引优化" />
      </label>
      <label>
        调度周期
        <input v-model="formState.cycle" type="text" placeholder="例如 每周一 02:00" />
      </label>
      <label>
        执行负责人
        <input v-model="formState.owner" type="text" placeholder="负责人" />
      </label>
      <label>
        任务说明
        <textarea v-model="formState.note" rows="3" placeholder="说明任务目标"></textarea>
      </label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" @click="showModal = false">取消</button>
        <button class="primary-button" type="button" @click="submitForm">保存任务</button>
      </div>
    </div>
    <div v-else-if="modalType === 'progress'" class="form-grid">
      <p>{{ modalMessage }}</p>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <p>进度：{{ progress }}%</p>
      <div class="modal-actions">
        <button class="primary-button" type="button" @click="showModal = false">完成</button>
      </div>
    </div>
    <div v-else class="form-grid">
      <p>{{ modalMessage }}</p>
      <div class="modal-actions">
        <button class="primary-button" type="button" @click="showModal = false">知道了</button>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import AppModal from '../components/AppModal.vue';

const chartData = [82, 76, 88, 90, 84, 78, 92];
const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `自动巡检任务-${index + 1}`,
  cycle: index % 2 === 0 ? '每日 02:00' : '每周一 03:30',
  lastRun: `2024-06-${(index + 1).toString().padStart(2, '0')} 03:00`,
  status: index % 3 === 0 ? '已完成' : '排队中'
}));

const showModal = ref(false);
const modalTitle = ref('');
const modalType = ref('info');
const modalMessage = ref('');
const progress = ref(0);
const formState = reactive({
  name: '',
  cycle: '',
  owner: '',
  note: ''
});
let timer;

const openForm = (title, row) => {
  modalTitle.value = title;
  modalType.value = 'form';
  formState.name = row?.name ?? '';
  formState.cycle = row?.cycle ?? '';
  formState.owner = '';
  formState.note = '';
  showModal.value = true;
};

const openProgress = (message) => {
  modalTitle.value = '执行进度';
  modalType.value = 'progress';
  modalMessage.value = message;
  progress.value = 0;
  showModal.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      return;
    }
    progress.value += 12;
  }, 240);
};

const openInfo = (message) => {
  modalTitle.value = '提示信息';
  modalType.value = 'info';
  modalMessage.value = message;
  showModal.value = true;
};

const openDetails = (row) => {
  modalTitle.value = '任务详情';
  modalType.value = 'info';
  modalMessage.value = `${row.name} 计划 ${row.cycle} 执行，最近一次运行：${row.lastRun}。`;
  showModal.value = true;
};

const submitForm = () => {
  modalTitle.value = '保存成功';
  modalType.value = 'info';
  modalMessage.value = '任务调度已更新，系统将自动记录执行日志。';
};
</script>
