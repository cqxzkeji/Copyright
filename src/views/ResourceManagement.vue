<template>
  <div class="resource">
    <section class="inventory">
      <article v-for="item in inventory" :key="item.name" class="item">
        <div>
          <h4>{{ item.name }}</h4>
          <p>库存 {{ item.stock }} / {{ item.unit }}</p>
        </div>
        <button class="ghost" @click="showModal(item.name, item.tip)">补给提醒</button>
      </article>
    </section>

    <section class="workflow">
      <h3>资源调度</h3>
      <div class="flow">
        <article v-for="action in actions" :key="action.title" class="node">
          <div>
            <strong>{{ action.title }}</strong>
            <p>{{ action.desc }}</p>
          </div>
          <button @click="showModal(action.title, action.message)">下发</button>
        </article>
      </div>
    </section>

    <ModalDialog v-if="visible" :title="modalTitle" @close="visible = false">
      <p>{{ modalContent }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const inventory = [
  { name: '水溶肥', stock: 2.1, unit: '吨', tip: '低于 2 吨阈值，建议今日下单补货。' },
  { name: '滴灌滤芯', stock: 48, unit: '件', tip: '可用 12 周，无需加购。' },
  { name: '柴油', stock: 860, unit: '升', tip: '周转库存充足，注意防火安全。' }
];

const actions = [
  { title: '机耕队', desc: '安排深松 40 亩', message: '已发送至机械调度群，等待确认。' },
  { title: '物资仓库', desc: '准备喷药物料', message: '仓库将按配方配货并创建出库单。' },
  { title: '外协劳务', desc: '补充采收人手', message: '合作社已回复 18 人，预计明日到场。' }
];

const visible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

const showModal = (title, content) => {
  visible.value = true;
  modalTitle.value = title;
  modalContent.value = content;
};
</script>

<style scoped>
.resource {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.inventory {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.item {
  background: #f8fafc;
  padding: 1.2rem;
  border-radius: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workflow {
  background: #ecfeff;
  border-radius: 20px;
  padding: 1.5rem;
}

.flow {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.node {
  background: #fff;
  padding: 1rem 1.2rem;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  background: #22c55e;
  color: #fff;
}

button.ghost {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}
</style>
