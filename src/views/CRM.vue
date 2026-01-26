<template>
  <section class="page">
    <div class="card">
      <div class="card-header">
        <h2>客户关系维护</h2>
        <div class="button-group">
          <button class="primary" type="button" @click="openPlan">新增回访计划</button>
          <button class="secondary" type="button" @click="openNotify">发送通知</button>
          <button class="secondary" type="button" @click="openCare">关怀触达</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>客户</th>
            <th>维护方式</th>
            <th>负责人</th>
            <th>下次回访</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.customer }}</td>
            <td>{{ task.channel }}</td>
            <td>{{ task.owner }}</td>
            <td>{{ task.next }}</td>
            <td><span class="badge">{{ task.status }}</span></td>
            <td>
              <button class="text" type="button" @click="openRecord(task)">记录回访</button>
              <button class="text" type="button" @click="openDetail(task)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>维护触达效果</h2>
        <button class="secondary" type="button" @click="openSummary">生成维护总结</button>
      </div>
      <div class="form-grid">
        <div class="card">
          <h3>回访完成率</h3>
          <p>本月完成率 86%，超出目标 6%。</p>
        </div>
        <div class="card">
          <h3>客户满意度</h3>
          <p>满意度均值 4.6 / 5。</p>
        </div>
        <div class="card">
          <h3>触达渠道分布</h3>
          <p>电话 40% / 邮件 35% / 微信 25%。</p>
        </div>
      </div>
    </div>

    <BaseModal :open="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'plan'">
        <div class="form-grid">
          <input v-model="form.customer" placeholder="客户名称" />
          <select v-model="form.channel">
            <option value="电话">电话</option>
            <option value="邮件">邮件</option>
            <option value="微信">微信</option>
          </select>
          <input v-model="form.owner" placeholder="负责人" />
          <input v-model="form.next" placeholder="下次回访日期" />
        </div>
        <div class="button-group" style="justify-content: flex-end; margin-top: 16px;">
          <button class="secondary" type="button" @click="closeModal">取消</button>
          <button class="primary" type="button" @click="savePlan">保存计划</button>
        </div>
      </template>
      <template v-else>
        <p>{{ modalMessage }}</p>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="primary" type="button" @click="closeModal">完成</button>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tasks = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    customer: `合作伙伴-${index + 1}`,
    channel: ['电话', '邮件', '微信'][index % 3],
    owner: ['顾问-王强', '顾问-李晨', '顾问-孙敏'][index % 3],
    next: `2024-0${(index % 9) + 1}-2${index % 8}`,
    status: ['进行中', '已完成', '待安排'][index % 3]
  }))
);

const modalOpen = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalType = ref('');
const form = ref({
  customer: '',
  channel: '电话',
  owner: '',
  next: ''
});

const openPlan = () => {
  modalTitle.value = '新增回访计划';
  modalType.value = 'plan';
  form.value = {
    customer: '',
    channel: '电话',
    owner: '',
    next: ''
  };
  modalOpen.value = true;
};

const openNotify = () => {
  modalTitle.value = '发送通知';
  modalMessage.value = '已向 12 位客户发送维护通知，并更新提醒日程。';
  modalType.value = '';
  modalOpen.value = true;
};

const openCare = () => {
  modalTitle.value = '关怀触达';
  modalMessage.value = '已发送节日关怀礼包，并通知客户经理跟进。';
  modalType.value = '';
  modalOpen.value = true;
};

const openRecord = (task) => {
  modalTitle.value = '记录回访';
  modalMessage.value = `已为 ${task.customer} 更新回访记录，满意度 4.7 分。`;
  modalType.value = '';
  modalOpen.value = true;
};

const openDetail = (task) => {
  modalTitle.value = '回访详情';
  modalMessage.value = `${task.customer} 最近一次回访方式为 ${task.channel}，负责人 ${task.owner}。`;
  modalType.value = '';
  modalOpen.value = true;
};

const openSummary = () => {
  modalTitle.value = '维护总结';
  modalMessage.value = '本季度共完成回访 86 次，客户满意度提升 9%。';
  modalType.value = '';
  modalOpen.value = true;
};

const savePlan = () => {
  const nextId = Math.max(...tasks.value.map((item) => item.id)) + 1;
  tasks.value.unshift({
    id: nextId,
    customer: form.value.customer || `新客户-${nextId}`,
    channel: form.value.channel,
    owner: form.value.owner || '顾问-王强',
    next: form.value.next || '待定',
    status: '待安排'
  });
  modalOpen.value = false;
};

const closeModal = () => {
  modalOpen.value = false;
};
</script>
