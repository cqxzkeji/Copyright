<template>
  <div class="module modeling">
    <div class="intro">
      <div>
        <h2>资源采集与建模</h2>
        <p>整合实景扫描、音频纹理与冰雪地形数据，形成可复用的素材库。</p>
      </div>
      <button class="primary" @click="openModal('云端同步完成，素材库已更新。')">同步素材库</button>
    </div>
    <section class="workflow">
      <div class="step" v-for="step in steps" :key="step.title">
        <h3>{{ step.title }}</h3>
        <p>{{ step.desc }}</p>
        <button @click="openModal(step.action)">执行操作</button>
      </div>
    </section>
    <section class="form">
      <h3>新建采集任务</h3>
      <form @submit.prevent="submitTask">
        <label>
          任务名称
          <input v-model="task.name" placeholder="如：冰湖雪纹扫描" />
        </label>
        <label>
          数据类型
          <select v-model="task.type">
            <option value="scan">实景扫描</option>
            <option value="audio">环境音采集</option>
            <option value="model">建模复刻</option>
          </select>
        </label>
        <label>
          设备数量
          <input type="number" v-model.number="task.devices" min="1" />
        </label>
        <button type="submit">生成任务</button>
      </form>
    </section>
    <BaseModal v-model="showModal" title="建模提示">
      <p>{{ modalMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const steps = [
  { title: '高精度扫描', desc: '整合 Lidar 与影像数据，输出点云。', action: '扫描排程已下发，预计 30 分钟完成。' },
  { title: '材质贴图', desc: '自动匹配非遗纹样库，生成 PBR 材质。', action: '纹样套用完成，可进行审核。' },
  { title: '冰雪地形构建', desc: '基于实时气候生成雪面厚度曲线。', action: '地形重新计算完成，等待发布。' }
];

const showModal = ref(false);
const modalMessage = ref('');
const task = reactive({ name: '', type: 'scan', devices: 1 });

const openModal = (msg) => {
  modalMessage.value = msg;
  showModal.value = true;
};

const submitTask = () => {
  if (!task.name) {
    openModal('请填写任务名称以便追踪。');
    return;
  }
  openModal(`已创建任务 “${task.name}”，共部署 ${task.devices} 台设备。`);
  task.name = '';
  task.type = 'scan';
  task.devices = 1;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.intro {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.workflow {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.step {
  flex: 1 1 260px;
  border: 1px solid #e0e7ff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.primary,
button {
  border: none;
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
}

.form {
  background: #f8fbff;
  border-radius: 16px;
  padding: 16px;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

label {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input,
select {
  border: 1px solid #d0d7ff;
  border-radius: 12px;
  padding: 10px;
}
</style>
