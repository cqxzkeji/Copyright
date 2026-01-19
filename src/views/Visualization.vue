<template>
  <section class="grid-2">
    <div class="card">
      <h3>数据库状态仪表盘</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">核心数据库健康状态可视化。</p>
      <div class="chart">
        <div v-for="value in chartData" :key="value" class="chart-bar" :style="{ height: `${value}%` }"></div>
      </div>
      <div class="action-bar" style="margin-top: 16px;">
        <button class="primary-button" type="button" @click="openProgress('正在刷新可视化数据')">刷新仪表盘</button>
        <button class="secondary-button" type="button" @click="openForm('定制仪表盘')">定制视图</button>
        <button class="secondary-button" type="button" @click="openInfo('支持按业务线、区域与实例类型筛选。')">说明</button>
      </div>
    </div>
    <div class="card">
      <h3>趋势预测</h3>
      <p style="color: #6b7280; margin: 8px 0 16px;">未来 7 天容量增长预测。</p>
      <div class="chart">
        <div v-for="value in forecastData" :key="value" class="chart-bar" :style="{ height: `${value}%`, background: 'linear-gradient(180deg, #34d399, #059669)' }"></div>
      </div>
    </div>
  </section>

  <section class="card">
    <h3>定制化报表</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>报表名称</th>
          <th>周期</th>
          <th>负责人</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.cycle }}</td>
          <td>{{ row.owner }}</td>
          <td><span class="tag">{{ row.status }}</span></td>
          <td>
            <button class="secondary-button" type="button" @click="openDetails(row)">预览</button>
            <button class="secondary-button" type="button" @click="openForm('编辑报表', row)">编辑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <AppModal v-model="showModal" :title="modalTitle">
    <div v-if="modalType === 'form'" class="form-grid">
      <label>
        报表名称
        <input v-model="formState.name" type="text" placeholder="例如 月度性能报告" />
      </label>
      <label>
        周期
        <input v-model="formState.cycle" type="text" placeholder="例如 每月 1 日" />
      </label>
      <label>
        订阅人
        <input v-model="formState.owner" type="text" placeholder="负责人/群组" />
      </label>
      <label>
        备注说明
        <textarea v-model="formState.note" rows="3" placeholder="说明报表用途"></textarea>
      </label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" @click="showModal = false">取消</button>
        <button class="primary-button" type="button" @click="submitForm">保存报表</button>
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

const chartData = [68, 74, 82, 90, 86, 78, 92];
const forecastData = [52, 58, 64, 70, 78, 84, 90];
const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `运营报告-${index + 1}`,
  cycle: index % 2 === 0 ? '每周五' : '每月 1 日',
  owner: ['数据产品', '业务分析', '运维团队'][index % 3],
  status: index % 2 === 0 ? '生成中' : '已完成'
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
  formState.owner = row?.owner ?? '';
  formState.note = '';
  showModal.value = true;
};

const openProgress = (message) => {
  modalTitle.value = '刷新进度';
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
    progress.value += 18;
  }, 260);
};

const openInfo = (message) => {
  modalTitle.value = '提示信息';
  modalType.value = 'info';
  modalMessage.value = message;
  showModal.value = true;
};

const openDetails = (row) => {
  modalTitle.value = '报表预览';
  modalType.value = 'info';
  modalMessage.value = `${row.name} 周期：${row.cycle}，负责人 ${row.owner}，状态 ${row.status}。`;
  showModal.value = true;
};

const submitForm = () => {
  modalTitle.value = '保存成功';
  modalType.value = 'info';
  modalMessage.value = '报表模板已更新，将在下次周期自动生成。';
};
</script>
