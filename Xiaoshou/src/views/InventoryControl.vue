<template>
  <div class="grid-layout">
    <div>
      <div class="flex-between">
        <h3>库存管理</h3>
        <div class="flex" style="gap: 8px;">
          <button class="btn" @click="showAdjust = true">库存调整</button>
          <button class="btn secondary" @click="showReplenish = true">补货计划</button>
          <button class="btn secondary" @click="showAlarm">安全库存提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>料号</th>
            <th>牌号</th>
            <th>规格</th>
            <th>在库(吨)</th>
            <th>预留(吨)</th>
            <th>周转天数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stock" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.grade }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.onhand }}</td>
            <td>{{ item.reserved }}</td>
            <td>{{ item.turnover }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h4>周转结构</h4>
      <div class="chart">
        <div v-for="item in turnoverChart" :key="item.label" class="chart-bar" :style="{ height: item.value * 4 + 'px' }">
          <div>{{ item.value }}</div>
          <small>{{ item.label }}</small>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showAdjust" class="overlay">
    <div class="modal">
      <header>
        <h3>库存调整</h3>
        <button class="btn secondary" @click="showAdjust = false">关闭</button>
      </header>
      <div class="form-grid">
        <label>料号<input v-model="adjust.code" class="input" /></label>
        <label>调整数量<input v-model.number="adjust.delta" type="number" class="input" /></label>
        <label>原因<input v-model="adjust.reason" class="input" /></label>
      </div>
      <footer>
        <button class="btn secondary" @click="showAdjust = false">取消</button>
        <button class="btn" @click="applyAdjust">应用</button>
      </footer>
    </div>
  </div>

  <div v-if="showReplenish" class="overlay">
    <div class="modal">
      <header>
        <h3>补货计划</h3>
        <button class="btn secondary" @click="showReplenish = false">关闭</button>
      </header>
      <div v-for="plan in plans" :key="plan.label" style="margin-bottom: 8px;">
        <div class="flex-between">
          <span>{{ plan.label }}</span>
          <span class="badge">{{ plan.percent }}%</span>
        </div>
        <div class="progress-bar">
          <span :style="{ width: plan.percent + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

const stock = ref([
  { code: 'INV-101', grade: '20CrMnTi', size: 'Φ45', onhand: 120, reserved: 40, turnover: 18 },
  { code: 'INV-102', grade: '42CrMo', size: 'Φ80', onhand: 80, reserved: 22, turnover: 25 },
  { code: 'INV-103', grade: 'GCr15', size: 'Φ70', onhand: 150, reserved: 60, turnover: 16 },
  { code: 'INV-104', grade: '35CrMo', size: 'Φ90', onhand: 65, reserved: 20, turnover: 22 },
  { code: 'INV-105', grade: '1Cr18Ni9Ti', size: 'Φ60', onhand: 95, reserved: 32, turnover: 20 },
  { code: 'INV-106', grade: 'P91', size: 'Φ120', onhand: 140, reserved: 55, turnover: 28 },
  { code: 'INV-107', grade: '38CrMoAl', size: 'Φ110', onhand: 70, reserved: 18, turnover: 24 },
  { code: 'INV-108', grade: '65Mn', size: 'Φ50', onhand: 110, reserved: 42, turnover: 19 },
  { code: 'INV-109', grade: '17-4PH', size: 'Φ30', onhand: 90, reserved: 15, turnover: 17 },
  { code: 'INV-110', grade: 'EH36', size: '板10mm', onhand: 130, reserved: 48, turnover: 21 },
  { code: 'INV-111', grade: '20CrNiMo', size: 'Φ95', onhand: 75, reserved: 20, turnover: 23 }
]);

const adjust = reactive({ code: '', delta: 0, reason: '' });
const showAdjust = ref(false);
const showReplenish = ref(false);

const plans = [
  { label: '低周转清理', percent: 60 },
  { label: '急单补货', percent: 80 },
  { label: '季度盘点', percent: 45 }
];

const turnoverChart = computed(() =>
  stock.value.slice(0, 6).map((item) => ({ label: item.grade, value: item.turnover }))
);

const applyAdjust = () => {
  if (!adjust.code) {
    alert('请输入料号');
    return;
  }
  stock.value = stock.value.map((item) =>
    item.code === adjust.code
      ? { ...item, onhand: item.onhand + Number(adjust.delta || 0) }
      : item
  );
  showAdjust.value = false;
};

const showAlarm = () => {
  alert('已提醒仓库关注周转天数超过 25 天的物料。');
};
</script>
