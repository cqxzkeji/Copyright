<template>
  <div class="module">
    <header>
      <div>
        <h2>库存管理</h2>
        <p>橡胶配方化学品、模具、辅料均需实时监控库存安全区间</p>
      </div>
      <button @click="openReplenish">补货申请</button>
    </header>
    <section class="inventory-grid">
      <article v-for="item in inventory" :key="item.id" class="inventory-card">
        <div class="item-head">
          <h3>{{ item.name }}</h3>
          <span>{{ item.code }}</span>
        </div>
        <p>剩余 {{ item.stock }} {{ item.unit }} · 安全线 {{ item.safety }} {{ item.unit }}</p>
        <div class="meter">
          <div class="fill" :style="{ width: item.stockRate + '%' }"></div>
        </div>
        <button @click="showDetail(item)">库存动态</button>
      </article>
    </section>
  </div>

  <BaseModal
    v-if="detailItem"
    :show="!!detailItem"
    title="库存预警"
    @close="detailItem = null"
  >
    <p>{{ detailItem?.name }} 最近 7 天发料 {{ detailItem?.usage }} 次，目前 {{ detailItem?.stockRate }}% 处于安全线 {{ detailItem?.safety }}。</p>
  </BaseModal>

  <BaseModal
    v-if="showReplenishModal"
    :show="showReplenishModal"
    title="申请补货"
    @close="showReplenishModal = false"
  >
    <form class="plan-form" @submit.prevent="submitReplenish">
      <select v-model="replenish.item" required>
        <option disabled value="">选择物料</option>
        <option v-for="item in inventory" :key="item.id" :value="item.name">{{ item.name }}</option>
      </select>
      <input v-model.number="replenish.quantity" type="number" min="1" placeholder="申请数量" required />
      <button type="submit">提交</button>
    </form>
  </BaseModal>

  <BaseModal
    v-if="replenishResult"
    :show="!!replenishResult"
    title="补货指令已生成"
    @close="replenishResult = null"
  >
    <p>{{ replenishResult }}</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const inventory = ref([
  { id: 1, name: '天然胶 RSS3', code: 'MAT-001', stock: 4.2, unit: '吨', safety: 3.5, stockRate: 55, usage: 6 },
  { id: 2, name: '硫化剂 TBBS', code: 'CHE-008', stock: 220, unit: 'kg', safety: 180, stockRate: 72, usage: 10 },
  { id: 3, name: '模具 245-A', code: 'MOL-112', stock: 8, unit: '套', safety: 6, stockRate: 60, usage: 2 }
]);

const detailItem = ref(null);
const showReplenishModal = ref(false);
const replenishResult = ref(null);
const replenish = ref({ item: '', quantity: null });

const showDetail = (item) => {
  detailItem.value = item;
};

const openReplenish = () => {
  showReplenishModal.value = true;
};

const submitReplenish = () => {
  replenishResult.value = `${replenish.value.item} 申请 ${replenish.value.quantity} 已同步采购与仓储。`;
  replenish.value = { item: '', quantity: null };
  showReplenishModal.value = false;
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

header button {
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  background: #d97706;
  color: #fff;
}

.inventory-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.inventory-card {
  flex: 1 1 260px;
  background: #fef9c3;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-head {
  display: flex;
  justify-content: space-between;
}

.meter {
  width: 100%;
  height: 10px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 999px;
}

.fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #fde047, #f97316);
}

.inventory-card button {
  border: none;
  border-radius: 999px;
  padding: 8px;
  background: #f97316;
  color: #fff;
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
