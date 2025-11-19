<template>
  <div class="module">
    <header>
      <div>
        <h2>财务与风险管理</h2>
        <p>跟踪风险预警、现金流压力与对冲动作</p>
      </div>
      <button @click="openModal('simulate')">风险压力测试</button>
    </header>

    <section class="risk-list">
      <article v-for="risk in store.risks" :key="risk.id" class="risk-item">
        <div>
          <h3>{{ risk.type }} · 影响：{{ risk.impact }}</h3>
          <p>应对策略：{{ risk.action }}</p>
        </div>
        <button @click="acknowledge(risk)">执行对冲</button>
      </article>
    </section>

    <div class="cashflow">
      <div class="flow-card" v-for="flow in flows" :key="flow.label">
        <p>{{ flow.label }}</p>
        <h2>{{ flow.value }} 万元</h2>
      </div>
    </div>

    <div v-if="modal.show" class="modal-mask" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <div v-if="modal.progress !== undefined" class="progress">
          <div class="bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
        <button @click="closeModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const store = inject('store');
const flows = reactive([
  { label: '本月回款', value: 320 },
  { label: '待放款', value: 210 },
  { label: '风险缓释资金', value: 90 }
]);

const modal = reactive({ show: false, title: '', message: '', progress: undefined });
let timer;

function openModal(type) {
  modal.show = true;
  modal.title = '压力测试';
  modal.message = '正在仿真 500 次市场波动场景...';
  modal.progress = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (modal.progress >= 100) {
      modal.message = '压力测试完成，资本充足率 13.2%';
      clearInterval(timer);
      return;
    }
    modal.progress += 25;
  }, 500);
}

function acknowledge(risk) {
  store.acknowledgeRisk(risk.id);
  modal.show = true;
  modal.title = '风险处置';
  modal.message = `${risk.type} 已触发备付措施`;
  modal.progress = undefined;
}

function closeModal() {
  modal.show = false;
  modal.progress = undefined;
  clearInterval(timer);
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

button {
  border: none;
  border-radius: 12px;
  padding: 0.6rem 1rem;
  background: linear-gradient(120deg, #ef476f, #f78c6b);
  color: #fff;
  cursor: pointer;
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.risk-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: #ffe5ec;
  border-radius: 14px;
  padding: 1rem;
  gap: 0.6rem;
}

.cashflow {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.flow-card {
  flex: 1 1 200px;
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 15px 30px rgba(239, 71, 111, 0.15);
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: min(420px, 90vw);
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress {
  height: 10px;
  background: #ffe3e3;
  border-radius: 999px;
}

.progress .bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(120deg, #ffd166, #ef476f);
  transition: width 0.3s ease;
}
</style>
