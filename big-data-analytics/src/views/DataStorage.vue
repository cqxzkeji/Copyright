<template>
  <div class="module">
    <div class="panel grid">
      <div class="panel-header">
        <h3>多层存储集群</h3>
        <small>冷热分层、策略可视化</small>
      </div>
      <div class="clusters">
        <div class="cluster" v-for="cluster in clusters" :key="cluster.name">
          <header>
            <h4>{{ cluster.name }}</h4>
            <span :class="cluster.health">{{ cluster.health }}</span>
          </header>
          <p>{{ cluster.desc }}</p>
          <div class="capacity">
            <strong>{{ cluster.usage }}%</strong>
            <progress :value="cluster.usage" max="100"></progress>
            <small>{{ cluster.free }} TB 剩余</small>
          </div>
          <div class="actions">
            <button @click="showAction('扩容计划已生成', cluster.name)">动态扩容</button>
            <button class="ghost" @click="showAction('已切换容灾机房', cluster.name)">容灾切换</button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel form">
      <div class="panel-header">
        <h3>生命周期策略</h3>
        <small>自动迁移至低频存储</small>
      </div>
      <form @submit.prevent="updatePolicy">
        <label>热数据保持</label>
        <input type="number" v-model.number="policy.hot" min="1" />
        <label>温数据保持</label>
        <input type="number" v-model.number="policy.warm" min="1" />
        <label>冷数据保持</label>
        <input type="number" v-model.number="policy.cold" min="1" />
        <button type="submit">保存策略</button>
      </form>
    </div>
    <BaseModal v-model="modal.show" :title="modal.title">
      <p>{{ modal.message }}</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const clusters = reactive([
  { name: 'ClickHouse 实时库', desc: '写多读多，支持秒级查询', usage: 72, free: 18, health: '健康' },
  { name: 'Hudi 数据湖', desc: '批流一体，Merge-On-Read', usage: 45, free: 110, health: '健康' },
  { name: '对象存储冷层', desc: '历史回放、备份', usage: 63, free: 260, health: '关注' }
]);

const policy = reactive({ hot: 7, warm: 30, cold: 365 });
const modal = reactive({ show: false, title: '提示', message: '' });

const showAction = (message, target) => {
  modal.title = target;
  modal.message = message;
  modal.show = true;
};

const updatePolicy = () => {
  modal.title = '策略更新';
  modal.message = `热 ${policy.hot} 天 / 温 ${policy.warm} 天 / 冷 ${policy.cold} 天，已生效`;
  modal.show = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.panel {
  flex: 1 1 360px;
  background: #fff;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}
.clusters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.cluster {
  background: #f8fafc;
  border-radius: 18px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.cluster header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cluster span.健康 {
  color: #22c55e;
}
.cluster span.关注 {
  color: #f97316;
}
.capacity {
  display: flex;
  flex-direction: column;
}
progress {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
}
progress::-webkit-progress-bar {
  background: #e2e8f0;
}
progress::-webkit-progress-value {
  background: linear-gradient(120deg, #10b981, #14b8a6);
}
.actions {
  display: flex;
  gap: 0.5rem;
}
button {
  border: none;
  border-radius: 18px;
  padding: 0.6rem 1rem;
  background: linear-gradient(120deg, #10b981, #34d399);
  color: #fff;
  cursor: pointer;
}
button.ghost {
  background: rgba(16, 185, 129, 0.12);
  color: #0f766e;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
input {
  border: none;
  border-radius: 16px;
  padding: 0.75rem;
  background: #f1f5f9;
}
</style>
