<template>
  <div class="module">
    <header>
      <div>
        <h2>维护计划</h2>
        <p>以周为单位滚动排程，确保关键零部件及时维护</p>
      </div>
      <button @click="openPlanModal">新增保养任务</button>
    </header>
    <section class="plan-table">
      <div class="row header">
        <span>计划名称</span>
        <span>负责人</span>
        <span>时间</span>
        <span>状态</span>
        <span>操作</span>
      </div>
      <div class="row" v-for="plan in plans" :key="plan.id">
        <span>{{ plan.name }}</span>
        <span>{{ plan.owner }}</span>
        <span>{{ plan.time }}</span>
        <span>
          <span :class="['tag', plan.status]">{{ statusText[plan.status] }}</span>
        </span>
        <span>
          <button @click="showProgress(plan)">查看进度</button>
        </span>
      </div>
    </section>
  </div>

  <BaseModal
    v-if="showPlanModal"
    :show="showPlanModal"
    title="添加维护计划"
    @close="showPlanModal = false"
  >
    <form class="plan-form" @submit.prevent="addPlan">
      <input v-model="planForm.name" placeholder="计划名称" required />
      <input v-model="planForm.owner" placeholder="负责人" required />
      <input v-model="planForm.time" placeholder="执行时间" required />
      <select v-model="planForm.status">
        <option value="pending">待执行</option>
        <option value="doing">执行中</option>
      </select>
      <button type="submit">保存计划</button>
    </form>
  </BaseModal>

  <BaseModal
    v-if="progressPlan"
    :show="!!progressPlan"
    title="计划执行情况"
    @close="progressPlan = null"
  >
    <p>{{ progressPlan?.name }} 当前完成度 {{ progressPlan?.progress }}%，已核对 {{ progressPlan?.checklist }} 项。</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const statusText = {
  pending: '待执行',
  doing: '进行中',
  done: '已完成'
};

const plans = ref([
  { id: 1, name: '压延线润滑保养', owner: '赵明', time: '周三白班', status: 'pending', progress: 40, checklist: 3 },
  { id: 2, name: '加硫机热电偶校准', owner: '李倩', time: '周五夜班', status: 'doing', progress: 70, checklist: 5 },
  { id: 3, name: '混炼室排风清理', owner: '周建', time: '周六白班', status: 'done', progress: 100, checklist: 8 }
]);

const showPlanModal = ref(false);
const progressPlan = ref(null);
const planForm = ref({ name: '', owner: '', time: '', status: 'pending' });

const openPlanModal = () => {
  showPlanModal.value = true;
};

const addPlan = () => {
  plans.value.push({
    id: Date.now(),
    ...planForm.value,
    progress: planForm.value.status === 'pending' ? 0 : 30,
    checklist: 0
  });
  planForm.value = { name: '', owner: '', time: '', status: 'pending' };
  showPlanModal.value = false;
};

const showProgress = (plan) => {
  progressPlan.value = plan;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  border: none;
  background: #0ea5e9;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
}

.plan-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  gap: 12px;
}

.row span {
  flex: 1;
}

.row.header {
  font-weight: 600;
  background: transparent;
}

.tag {
  padding: 6px 12px;
  border-radius: 999px;
  color: #fff;
  font-size: 14px;
}

.tag.pending {
  background: #f97316;
}

.tag.doing {
  background: #3b82f6;
}

.tag.done {
  background: #22c55e;
}

.plan-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-form input,
.plan-form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
}
</style>
