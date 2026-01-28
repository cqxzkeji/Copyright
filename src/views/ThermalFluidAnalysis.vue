<template>
  <div class="card">
    <div class="section-title">热分析与流体分析</div>
    <p>覆盖发动机冷却、车内温控与流体流动仿真，优化热管理设计。</p>
    <div class="action-row">
      <button class="btn" type="button" @click="openModal('thermal')">配置热分析</button>
      <button class="btn secondary" type="button" @click="openModal('run')">启动流体仿真</button>
      <button class="btn ghost" type="button" @click="openModal('tip')">节能提示</button>
    </div>
  </div>

  <div class="card">
    <div class="section-title">温度场与流速图</div>
    <div class="chart-grid">
      <div class="chart-card">
        <strong>温控区域温度</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartData" :key="`temp-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
      <div class="chart-card">
        <strong>流体速度分布</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartDataB" :key="`flow-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">热流体任务清单</div>
    <table class="table">
      <thead>
        <tr>
          <th>任务编号</th>
          <th>系统</th>
          <th>冷却介质</th>
          <th>关键指标</th>
          <th>状态</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.system }}</td>
          <td>{{ row.medium }}</td>
          <td>{{ row.metric }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.owner }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'thermal'" title="热分析设置" @close="closeModal">
    <form @submit.prevent="submitModal">
      <div class="input-field">
        <label>分析对象</label>
        <select v-model="formState.system">
          <option>发动机冷却系统</option>
          <option>电池热管理</option>
          <option>车内温控系统</option>
        </select>
      </div>
      <div class="input-field">
        <label>冷却介质</label>
        <select v-model="formState.medium">
          <option>乙二醇水溶液</option>
          <option>冷媒 R134a</option>
          <option>空气对流</option>
        </select>
      </div>
      <div class="input-field">
        <label>目标温度上限</label>
        <input v-model="formState.target" placeholder="85℃" />
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="submit">保存配置</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'run'" title="流体仿真进度" @close="closeModal">
    <p>正在计算流道压降与热交换效率。</p>
    <div class="progress-bar" style="margin-top: 16px;">
      <span style="width: 61%"></span>
    </div>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">继续等待</button>
    </div>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tip'" title="节能提示" @close="closeModal">
    <p>建议在高温工况下优化风扇控制策略，以降低能耗。</p>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">确认</button>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const formState = ref({
  system: '发动机冷却系统',
  medium: '乙二醇水溶液',
  target: '85℃',
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `TH-${index + 1}`,
  system: ['发动机冷却', '电池热管理', '车内温控'][index % 3],
  medium: ['冷媒', '乙二醇水溶液', '空气'][index % 3],
  metric: ['温度均匀性', '压降', '换热效率'][index % 3],
  status: ['待计算', '仿真中', '已完成'][index % 3],
  owner: ['韩瑞', '顾欣', '杨程', '崔曼'][index % 4],
}));

const chartData = [50, 65, 72, 58, 80, 68];
const chartDataB = [45, 55, 70, 60, 75, 62];

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const submitModal = () => {
  activeModal.value = 'run';
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
