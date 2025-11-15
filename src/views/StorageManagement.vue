<template>
  <div class="module-shell">
    <header class="module-header">
      <div>
        <p class="eyebrow">仓储管理</p>
        <h3>当前库存 {{ totalWeight }} 吨 · 占用率 {{ overallUsage }}%</h3>
      </div>
      <div class="actions">
        <button @click="adjustOpen = true">调节库存</button>
        <button class="ghost" @click="tempOpen = true">查看温度曲线</button>
      </div>
    </header>
    <section class="storage-grid">
      <article v-for="zone in storageZones" :key="zone.id" class="storage-card">
        <header>
          <h4>{{ zone.name }}</h4>
          <span>{{ zone.material }}</span>
        </header>
        <p>库存：{{ zone.current }} / {{ zone.capacity }} 吨</p>
        <div class="progress">
          <div :style="{ width: Math.round((zone.current / zone.capacity) * 100) + '%' }"></div>
        </div>
        <footer>
          <span>{{ Math.round((zone.current / zone.capacity) * 100) }}%</span>
          <button class="ghost" @click="selectZone(zone)">盘点</button>
        </footer>
      </article>
    </section>
    <section class="monitor">
      <article class="monitor-card">
        <h4>实时库存波动</h4>
        <div class="chart">
          <div v-for="point in stockSpark" :key="point" class="bar" :style="{ height: point + '%' }"></div>
        </div>
        <p>今日入库 2.8 吨 · 出库 3.1 吨</p>
      </article>
      <article class="monitor-card">
        <h4>安全巡检</h4>
        <ul>
          <li>气体浓度：{{ alarms.gas }} ppm · {{ alarms.gas < 40 ? '安全' : '预警' }}</li>
          <li>温湿度：{{ alarms.temp }}℃ / {{ alarms.hum }}% RH</li>
          <li>摄像头：{{ alarms.camera }} 路正常</li>
        </ul>
        <button class="ghost" @click="inspectionOpen = true">巡检记录</button>
      </article>
    </section>

    <ModalDialog v-if="adjustOpen" title="库存调节" primary-text="提交调节" @close="adjustOpen = false" @confirm="confirmAdjust">
      <form class="modal-form">
        <label>
          仓库
          <select v-model="adjustForm.zone">
            <option v-for="zone in storageZones" :key="zone.id" :value="zone.name">{{ zone.name }}</option>
          </select>
        </label>
        <label>
          调整量 (吨)
          <input v-model.number="adjustForm.delta" type="number" step="0.1" />
        </label>
      </form>
    </ModalDialog>

    <ModalDialog v-if="tempOpen" title="温度曲线" primary-text="关闭" @close="tempOpen = false" @confirm="tempOpen = false">
      <div class="temp-chart">
        <div v-for="(temp, idx) in tempTrend" :key="idx" class="temp-point">
          <div :style="{ height: temp + '%' }"></div>
          <span>{{ 6 + idx * 2 }}时</span>
        </div>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="selectedZone"
      :title="selectedZone.name + ' 盘点'"
      primary-text="完成盘点"
      @close="selectedZone = null"
      @confirm="selectedZone = null"
    >
      <p>危废类型：{{ selectedZone.material }}</p>
      <p>当前库存：{{ selectedZone.current }} 吨</p>
      <p>建议 12 小时内出库：{{ (selectedZone.current * 0.35).toFixed(1) }} 吨</p>
    </ModalDialog>

    <ModalDialog
      v-if="inspectionOpen"
      title="巡检记录"
      primary-text="关闭"
      @close="inspectionOpen = false"
      @confirm="inspectionOpen = false"
    >
      <ul>
        <li>09:30 仓库A 温度 23.4℃，正常。</li>
        <li>11:00 仓库B 气体报警测试，结果合格。</li>
        <li>13:20 仓库C 包装加固完成。</li>
      </ul>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const storageZones = ref([
  { id: 1, name: '防爆库 A', material: 'HW17', capacity: 12, current: 9.2 },
  { id: 2, name: '恒温库 B', material: 'HW48', capacity: 8, current: 5.1 },
  { id: 3, name: '暂存区 C', material: 'HW08', capacity: 10, current: 4.3 }
]);

const stockSpark = [55, 68, 45, 72, 60, 80, 58];
const alarms = { gas: 32, temp: 23.5, hum: 56, camera: 14 };

const totalWeight = storageZones.value.reduce((acc, curr) => acc + curr.current, 0).toFixed(1);
const overallUsage = Math.round(
  (storageZones.value.reduce((acc, curr) => acc + curr.current, 0) /
    storageZones.value.reduce((acc, curr) => acc + curr.capacity, 0)) *
    100
);

const adjustOpen = ref(false);
const tempOpen = ref(false);
const inspectionOpen = ref(false);
const selectedZone = ref(null);

const adjustForm = reactive({ zone: '防爆库 A', delta: 0 });
const tempTrend = [40, 46, 52, 55, 48, 44, 42];

const selectZone = (zone) => {
  selectedZone.value = zone;
};

const confirmAdjust = () => {
  const zone = storageZones.value.find((item) => item.name === adjustForm.zone);
  if (zone) {
    zone.current = Math.max(0, zone.current + adjustForm.delta);
  }
  adjustOpen.value = false;
};
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

button {
  background: linear-gradient(120deg, #22c55e, #10b981);
  color: #fff;
  border-radius: 16px;
  padding: 0.7rem 1.6rem;
}

button.ghost {
  background: rgba(16, 185, 129, 0.15);
  color: #065f46;
}

.storage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.storage-card {
  background: #ecfdf5;
  border-radius: 22px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.2);
}

.progress div {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(120deg, #22c55e, #14b8a6);
}

.monitor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.monitor-card {
  background: #f0fdf4;
  border-radius: 22px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.chart {
  display: flex;
  gap: 0.5rem;
  height: 90px;
  align-items: flex-end;
}

.chart .bar {
  flex: 1;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(180deg, #86efac, #22c55e);
}

.temp-chart {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  height: 160px;
}

.temp-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #475569;
}

.temp-point div {
  width: 24px;
  border-radius: 12px 12px 0 0;
  background: linear-gradient(180deg, #facc15, #f97316);
}
</style>
