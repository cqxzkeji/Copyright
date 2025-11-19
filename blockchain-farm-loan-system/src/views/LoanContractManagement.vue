<template>
  <div class="module">
    <header>
      <div>
        <h2>农地抵押贷款合同管理</h2>
        <p>监督合同签署、履约节点与链上存证</p>
      </div>
      <button @click="toggleModal('new')">生成合同</button>
    </header>

    <section class="table">
      <div class="table-head">
        <span>合同编号</span>
        <span>农地</span>
        <span>放款行</span>
        <span>金额(万)</span>
        <span>状态</span>
        <span>操作</span>
      </div>
      <div v-for="contract in store.contracts" :key="contract.id" class="table-row">
        <span>{{ contract.id }}</span>
        <span>{{ contract.farmId }}</span>
        <span>{{ contract.bank }}</span>
        <span>{{ contract.amount }}</span>
        <span>{{ contract.status }}</span>
        <div class="ops">
          <button @click="viewContract(contract)">查看</button>
          <button @click="sign(contract)">签署完成</button>
        </div>
      </div>
    </section>

    <div v-if="modal.show" class="modal-mask" @click="closeModal">
      <div class="modal" @click.stop>
        <template v-if="modal.type === 'new'">
          <h3>创建新合同</h3>
          <form class="form" @submit.prevent="submitContract">
            <input v-model="form.id" placeholder="合同编号" required />
            <input v-model="form.farmId" placeholder="农地编号" required />
            <input v-model="form.bank" placeholder="合作银行" required />
            <input v-model.number="form.amount" type="number" placeholder="金额(万元)" required />
            <select v-model="form.status">
              <option value="草拟中">草拟中</option>
              <option value="履约中">履约中</option>
            </select>
            <button type="submit">提交</button>
          </form>
        </template>
        <template v-else>
          <h3>合同提示</h3>
          <p>{{ modal.message }}</p>
          <button @click="closeModal">确认</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const store = inject('store');
const modal = reactive({ show: false, type: '', message: '' });
const form = reactive({ id: '', farmId: '', bank: '', amount: 30, status: '草拟中' });

function toggleModal(type) {
  modal.show = true;
  modal.type = type;
}

function closeModal() {
  modal.show = false;
}

function submitContract() {
  store.addContract({ ...form });
  closeModal();
}

function viewContract(contract) {
  modal.show = true;
  modal.type = 'info';
  modal.message = `合同 ${contract.id} 已同步链上哈希，当前状态：${contract.status}`;
}

function sign(contract) {
  contract.status = '履约中';
  modal.show = true;
  modal.type = 'info';
  modal.message = `已确认 ${contract.id} 签署完成，将推送至银行与链节点。`;
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
  padding: 0.6rem 0.9rem;
  background: linear-gradient(120deg, #40916c, #2d6a4f);
  color: #fff;
  cursor: pointer;
}

.table {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(80px, 1fr));
  gap: 0.5rem;
  padding: 0.8rem;
  background: #f0fdf4;
  border-radius: 12px;
  align-items: center;
}

.table-head {
  background: #d1fae5;
  font-weight: 600;
}

.ops {
  display: flex;
  gap: 0.4rem;
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
  border: 1px solid #c6f6d5;
}
</style>
