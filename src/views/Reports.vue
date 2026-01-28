<template>
  <div class="card">
    <div class="section-title">报告生成与管理</div>
    <p>统一管理仿真报告、评审记录与导出任务。</p>
    <div class="action-row">
      <button class="btn" type="button" @click="openModal('create')">生成新报告</button>
      <button class="btn secondary" type="button" @click="openModal('export')">批量导出</button>
      <button class="btn ghost" type="button" @click="openModal('tip')">报告提醒</button>
    </div>
  </div>

  <div class="card">
    <div class="section-title">报告完成率</div>
    <div class="chart-grid">
      <div class="chart-card">
        <strong>本月报告完成趋势</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartData" :key="`report-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
      <div class="chart-card">
        <strong>评审通过率</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartDataB" :key="`review-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">报告列表</div>
    <table class="table">
      <thead>
        <tr>
          <th>报告编号</th>
          <th>模块</th>
          <th>项目</th>
          <th>状态</th>
          <th>生成时间</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.module }}</td>
          <td>{{ row.project }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.date }}</td>
          <td>{{ row.owner }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'create'" title="生成仿真报告" @close="closeModal">
    <form @submit.prevent="submitModal">
      <div class="input-field">
        <label>选择模块</label>
        <select v-model="formState.module">
          <option>有限元分析</option>
          <option>碰撞仿真</option>
          <option>动力学仿真</option>
          <option>热流体分析</option>
          <option>结构优化</option>
        </select>
      </div>
      <div class="input-field">
        <label>项目名称</label>
        <input v-model="formState.project" placeholder="新能源SUV侧碰" />
      </div>
      <div class="input-field">
        <label>输出格式</label>
        <select v-model="formState.format">
          <option>PDF</option>
          <option>PPTX</option>
          <option>Word</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="submit">确认生成</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'export'" title="批量导出进度" @close="closeModal">
    <p>正在打包 8 份报告，并同步到项目资料库。</p>
    <div class="progress-bar" style="margin-top: 16px;">
      <span style="width: 69%"></span>
    </div>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">继续等待</button>
    </div>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tip'" title="报告提醒" @close="closeModal">
    <p>已有 3 份关键报告待审批，请及时分发评审任务。</p>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">了解</button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const formState = ref({
  module: '碰撞仿真',
  project: '新能源SUV侧碰',
  format: 'PDF',
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `REP-${index + 1}`,
  module: ['有限元分析', '碰撞仿真', '动力学仿真', '热流体分析', '结构优化'][index % 5],
  project: ['平台A', '平台B', '新能源SUV', '混动轿车'][index % 4],
  status: ['待评审', '已发布', '草稿'][index % 3],
  date: `2024-07-${String((index % 28) + 1).padStart(2, '0')}`,
  owner: ['谢敏', '余昕', '赵琪', '范扬'][index % 4],
}));

const chartData = [52, 65, 70, 58, 80, 72];
const chartDataB = [60, 68, 75, 66, 82, 74];

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const submitModal = () => {
  activeModal.value = 'export';
};
</script>

<style scoped>
.action-row {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
