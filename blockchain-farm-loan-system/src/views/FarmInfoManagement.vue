<template>
  <div class="module">
    <header>
      <div>
        <h2>农地信息管理</h2>
        <p>采集农地权属、面积、位置与抵押状态</p>
      </div>
      <button @click="toggleModal('addFarm')">新增农地</button>
    </header>

    <section class="list">
      <article v-for="farm in store.farms" :key="farm.id" class="row">
        <div>
          <h3>{{ farm.owner }} · {{ farm.location }}</h3>
          <p>ID: {{ farm.id }} ｜ {{ farm.area }} 亩 ｜ 状态：{{ farm.status }}</p>
        </div>
        <button @click="showDetail(farm)">查看上链详情</button>
      </article>
    </section>

    <div v-if="modal.show && modal.type === 'detail'" class="modal-mask" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>农地链上凭证</h3>
        <p>地块 {{ modal.payload?.id }} 已写入联盟链，抵押状态：{{ modal.payload?.status }}</p>
        <p>所在节点：农担链-冀南节点，最新哈希：0x23af...99c</p>
        <button @click="closeModal">已阅</button>
      </div>
    </div>

    <div v-if="modal.show && modal.type === 'addFarm'" class="modal-mask" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>登记农地</h3>
        <form class="form" @submit.prevent="submitFarm">
          <input v-model="form.owner" placeholder="农户姓名" required />
          <input v-model="form.location" placeholder="行政区域" required />
          <input v-model.number="form.area" type="number" placeholder="面积(亩)" required />
          <select v-model="form.status">
            <option value="可抵押">可抵押</option>
            <option value="已抵押">已抵押</option>
          </select>
          <button type="submit">提交上链</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const store = inject('store');
const modal = reactive({ show: false, type: '', payload: null });
const form = reactive({ owner: '', location: '', area: 10, status: '可抵押' });

function toggleModal(type) {
  modal.show = true;
  modal.type = type;
}

function showDetail(farm) {
  modal.show = true;
  modal.type = 'detail';
  modal.payload = farm;
}

function closeModal() {
  modal.show = false;
  modal.payload = null;
}

function submitFarm() {
  store.addFarm({
    id: `F-${Math.floor(Math.random() * 900 + 100)}`,
    owner: form.owner,
    area: form.area,
    location: form.location,
    status: form.status
  });
  closeModal();
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
  border-radius: 10px;
  padding: 0.7rem 1rem;
  background: linear-gradient(120deg, #00b4d8, #0077b6);
  color: #fff;
  cursor: pointer;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
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
  border-radius: 14px;
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
  padding: 0.7rem 0.9rem;
  border: 1px solid #d9e2ec;
  border-radius: 10px;
}
</style>
