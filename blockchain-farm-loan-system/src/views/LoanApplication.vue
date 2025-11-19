<template>
  <div class="module">
    <header>
      <div>
        <h2>贷款申请管理</h2>
        <p>记录农户贷款申请进度，驱动审批流程</p>
      </div>
      <button @click="toggleModal('new')">录入申请</button>
    </header>

    <section class="grid">
      <article v-for="app in store.applications" :key="app.id" class="card">
        <h3>{{ app.farmer }} · {{ app.id }}</h3>
        <p>申请额度：{{ app.amount }} 万元</p>
        <p>当前阶段：{{ app.stage }}</p>
        <div class="actions">
          <button @click="advance(app)">推进环节</button>
          <button @click="notify(app)">推送提醒</button>
        </div>
      </article>
    </section>

    <div v-if="modal.show" class="modal-mask" @click="closeModal">
      <div class="modal" @click.stop>
        <h3 v-if="modal.type === 'new'">新增贷款申请</h3>
        <h3 v-else>操作提示</h3>
        <template v-if="modal.type === 'new'">
          <form class="form" @submit.prevent="submitApp">
            <input v-model="form.farmer" placeholder="农户姓名" required />
            <input v-model="form.id" placeholder="申请编号" required />
            <input v-model.number="form.amount" type="number" placeholder="额度(万元)" required />
            <select v-model="form.stage">
              <option value="资料审核">资料审核</option>
              <option value="链上验证">链上验证</option>
              <option value="放款审批">放款审批</option>
            </select>
            <button type="submit">保存</button>
          </form>
        </template>
        <template v-else>
          <p>{{ modal.message }}</p>
          <button @click="closeModal">知道了</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const store = inject('store');
const modal = reactive({ show: false, type: '', message: '' });
const form = reactive({ farmer: '', id: '', amount: 20, stage: '资料审核' });

function toggleModal(type) {
  modal.show = true;
  modal.type = type;
}

function closeModal() {
  modal.show = false;
}

function submitApp() {
  store.addApplication({ ...form });
  closeModal();
}

const flow = ['资料审核', '链上验证', '放款审批', '放款完成'];

function advance(app) {
  const idx = flow.indexOf(app.stage);
  const next = flow[Math.min(idx + 1, flow.length - 1)];
  store.updateApplicationStage(app.id, next);
  modal.show = true;
  modal.type = 'info';
  modal.message = `${app.id} 已推进至 ${next}`;
}

function notify(app) {
  modal.show = true;
  modal.type = 'info';
  modal.message = `已向 ${app.farmer} 发送短信提醒，内容：请补充链上凭证。`;
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
  padding: 0.7rem 1rem;
  background: linear-gradient(120deg, #ff9f1c, #ff6b6b);
  color: #fff;
  cursor: pointer;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 240px;
  background: #fff2e5;
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
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

.form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

input,
select {
  padding: 0.7rem;
  border-radius: 10px;
  border: 1px solid #ffd6a5;
}
</style>
