<template>
  <div class="grid grid-2">
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">数据总览</div>
          <h3>地块基础数据</h3>
        </div>
        <div class="actions">
          <button class="btn btn-outline" @click="openImport">导入数据</button>
          <button class="btn btn-primary" @click="openAdd">新增地块</button>
        </div>
      </header>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>编号</th>
              <th>位置</th>
              <th>面积(亩)</th>
              <th>规划用途</th>
              <th>拆除比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="parcel in parcels" :key="parcel.id">
              <td>{{ parcel.id }}</td>
              <td>{{ parcel.location }}</td>
              <td>{{ parcel.area }}</td>
              <td>{{ parcel.usage }}</td>
              <td>
                <div class="progress">
                  <div class="progress-bar" :style="{ width: parcel.demolition + '%' }"></div>
                </div>
                <small class="muted">{{ parcel.demolition }}%</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <header class="section-head">
        <div>
          <div class="eyebrow">容量对比</div>
          <h3>用地强度图</h3>
        </div>
        <button class="btn btn-outline" @click="openSummary">快速评估</button>
      </header>
      <div class="bars">
        <div v-for="parcel in parcels" :key="parcel.id" class="bar-row">
          <div class="label">{{ parcel.location }}</div>
          <div class="bar-chart">
            <div class="fill" :style="{ width: parcel.capacity + '%', background: `linear-gradient(120deg, #2d7bff, #4fe1b9 ${parcel.capacity}%)` }"></div>
          </div>
          <span class="value">{{ parcel.capacity }}%</span>
        </div>
      </div>
    </div>
  </div>
  <BaseModal v-if="showAdd" title="新增地块" @close="showAdd = false" :actions="addActions">
    <form class="modal-form" @submit.prevent>
      <label>编号</label>
      <input v-model="newParcel.id" required />
      <label>位置</label>
      <input v-model="newParcel.location" required />
      <label>面积(亩)</label>
      <input v-model.number="newParcel.area" type="number" required />
      <label>规划用途</label>
      <input v-model="newParcel.usage" required />
      <label>拆除比例</label>
      <input v-model.number="newParcel.demolition" type="number" min="0" max="100" required />
    </form>
  </BaseModal>
  <BaseModal v-if="showImport" title="数据导入进度" @close="showImport = false">
    <p>正在导入现有地块数据...</p>
    <div class="progress" style="margin-top: 8px">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
    <p class="muted">{{ progress }}%</p>
  </BaseModal>
  <BaseModal v-if="showSummary" title="容量评估" @close="showSummary = false" :actions="summaryActions">
    <p>根据现有拆除比与容量，推荐提前处理：{{ tightParcel.location }}。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const parcels = reactive([
  { id: 'A01', location: '北区-01号', area: 32, usage: '住宅更新', demolition: 60, capacity: 72 },
  { id: 'B03', location: '东区-03号', area: 18, usage: '商服置换', demolition: 45, capacity: 54 },
  { id: 'C07', location: '南区-07号', area: 26, usage: '安置房', demolition: 80, capacity: 86 },
  { id: 'D02', location: '西区-02号', area: 14, usage: '公共配套', demolition: 30, capacity: 41 },
  { id: 'E05', location: '核心-05号', area: 22, usage: '综合开发', demolition: 55, capacity: 68 }
]);

const showAdd = ref(false);
const showImport = ref(false);
const showSummary = ref(false);
const progress = ref(16);
const newParcel = reactive({ id: '', location: '', area: 10, usage: '住宅更新', demolition: 40, capacity: 50 });

const addActions = [
  { label: '取消', onClick: () => (showAdd.value = false) },
  {
    label: '保存地块',
    primary: true,
    onClick: () => {
      parcels.push({ ...newParcel, capacity: Math.min(100, newParcel.demolition + 15) });
      Object.assign(newParcel, { id: '', location: '', area: 10, usage: '住宅更新', demolition: 40, capacity: 50 });
      showAdd.value = false;
    }
  }
];

const summaryActions = [{ label: '确认', primary: true, onClick: () => (showSummary.value = false) }];

const tightParcel = computed(() => parcels.reduce((a, b) => (a.capacity > b.capacity ? a : b)));

const openAdd = () => (showAdd.value = true);
const openImport = () => {
  showImport.value = true;
  progress.value = 16;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 14);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 500);
};
const openSummary = () => (showSummary.value = true);
</script>

<style scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.table-wrap {
  overflow: auto;
}

.bars {
  display: grid;
  gap: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 1.2fr 3fr 0.6fr;
  align-items: center;
  gap: 10px;
}

.bar-chart {
  height: 12px;
  background: rgba(45, 123, 255, 0.12);
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.label {
  font-weight: 600;
}

.value {
  font-weight: 700;
}

.modal-form {
  display: grid;
  gap: 10px;
}

input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(45, 123, 255, 0.3);
}

.muted {
  color: var(--muted);
}
</style>
