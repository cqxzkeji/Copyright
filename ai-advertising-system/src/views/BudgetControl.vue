<template>
  <div class="module">
    <header>
      <div>
        <h3>预算管理与成本控制</h3>
        <p>多渠道预算一键统筹，实时预警成本异常。</p>
      </div>
      <button class="primary" @click="openAllocation" title="预算调整">智能分配预算</button>
    </header>

    <section class="grid">
      <div class="panel">
        <h4>预算概览</h4>
        <div class="budget-card">
          <div>
            <small>月度预算</small>
            <strong>¥ 2,000,000</strong>
          </div>
          <div>
            <small>已花费</small>
            <strong>¥ 1,320,000</strong>
          </div>
          <div>
            <small>剩余可用</small>
            <strong>¥ 680,000</strong>
          </div>
        </div>
        <label>成本预警阈值（%）
          <input type="number" v-model.number="settings.alert" />
        </label>
        <button class="ghost" @click="openAlert">配置预警</button>
      </div>
      <div class="panel chart">
        <h4>渠道预算权重</h4>
        <div class="weights">
          <div v-for="item in weights" :key="item.name" class="weight-row">
            <span>{{ item.name }}</span>
            <input type="range" min="0" max="100" v-model.number="item.value" />
            <span>{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </section>

    <ModalDialog v-model="showAllocation" title="预算分配建议">
      <p>根据实时 ROI，推荐以下组合：</p>
      <ul>
        <li v-for="item in weights" :key="item.name">{{ item.name }} · {{ item.value }}%</li>
      </ul>
      <div class="progress-shell"><div class="progress" :style="{ width: progress + '%' }"></div></div>
      <small>预算模拟完成度：{{ progress }}%</small>
    </ModalDialog>

    <ModalDialog v-model="showAlert" title="预警配置">
      <p>当消耗达到 {{ settings.alert }}% 时，将推送钉钉提醒。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const weights = reactive([
  { name: '信息流', value: 40 },
  { name: '短视频', value: 30 },
  { name: '搜索', value: 20 },
  { name: '联盟投放', value: 10 }
]);
const settings = reactive({ alert: 85 });
const showAllocation = ref(false);
const showAlert = ref(false);
const progress = ref(0);
let timer;

const openAllocation = () => {
  showAllocation.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 22;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 260);
};

const openAlert = () => {
  showAlert.value = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  min-width: 280px;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
}

.budget-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.budget-card div {
  background: #f9fafb;
  border-radius: 14px;
  padding: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input[type='number'] {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  background: #f9fafb;
}

.chart {
  flex: 0.8;
}

.weights {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.weight-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

input[type='range'] {
  flex: 1;
}

.primary {
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff;
  cursor: pointer;
}

.ghost {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: transparent;
  padding: 10px 16px;
  cursor: pointer;
  margin-top: 12px;
}

.progress-shell {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(120deg, #ec4899, #f43f5e);
}
</style>
