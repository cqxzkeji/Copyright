<template>
  <div class="card">
    <div class="section-title">碰撞仿真管理</div>
    <p>管理整车碰撞仿真流程，确保车身与关键零部件的安全性能。</p>
    <div class="action-row">
      <button class="btn" type="button" @click="openModal('scenario')">建立碰撞场景</button>
      <button class="btn secondary" type="button" @click="openModal('run')">启动碰撞仿真</button>
      <button class="btn ghost" type="button" @click="openModal('tip')">安全提示</button>
    </div>
  </div>

  <div class="card">
    <div class="section-title">碰撞能量吸收图</div>
    <div class="chart-grid">
      <div class="chart-card">
        <strong>正碰吸能分布</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartData" :key="`front-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
      <div class="chart-card">
        <strong>侧碰侵入量</strong>
        <div class="chart-bars">
          <span v-for="(item, index) in chartDataB" :key="`side-${index}`" :style="{ height: item + '%' }"></span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">仿真任务列表</div>
    <table class="table">
      <thead>
        <tr>
          <th>任务编号</th>
          <th>工况</th>
          <th>碰撞速度</th>
          <th>假人配置</th>
          <th>状态</th>
          <th>评估人员</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableRows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.condition }}</td>
          <td>{{ row.speed }}</td>
          <td>{{ row.dummy }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.owner }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'scenario'" title="碰撞模型建立" @close="closeModal">
    <form @submit.prevent="submitModal">
      <div class="input-field">
        <label>碰撞工况</label>
        <select v-model="formState.condition">
          <option>正面 50km/h</option>
          <option>侧面 60km/h</option>
          <option>偏置 64km/h</option>
        </select>
      </div>
      <div class="input-field">
        <label>假人型号</label>
        <select v-model="formState.dummy">
          <option>Hybrid III 50%</option>
          <option>THOR 5%</option>
          <option>Q10</option>
        </select>
      </div>
      <div class="input-field">
        <label>网格精度</label>
        <select v-model="formState.mesh">
          <option>高精度</option>
          <option>标准</option>
          <option>快速评估</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="submit">保存场景</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'run'" title="碰撞仿真进度" @close="closeModal">
    <p>仿真正在计算乘员舱侵入量与能量吸收曲线。</p>
    <div class="progress-bar" style="margin-top: 16px;">
      <span style="width: 58%"></span>
    </div>
    <div class="modal-actions">
      <button class="btn" type="button" @click="closeModal">继续等待</button>
    </div>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tip'" title="安全评估提示" @close="closeModal">
    <p>建议在出具报告前核对假人胸部压缩量和脚部约束力。</p>
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
  condition: '正面 50km/h',
  dummy: 'Hybrid III 50%',
  mesh: '标准',
});

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `COL-${index + 1}`,
  condition: ['正面', '侧面', '偏置'][index % 3],
  speed: `${[50, 60, 64][index % 3]} km/h`,
  dummy: ['Hybrid III', 'THOR', 'Q10'][index % 3],
  status: ['待评估', '仿真中', '已完成'][index % 3],
  owner: ['赵宁', '韩梅', '周泽', '林奕'][index % 4],
}));

const chartData = [45, 70, 55, 82, 60, 68];
const chartDataB = [52, 63, 78, 48, 66, 74];

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
