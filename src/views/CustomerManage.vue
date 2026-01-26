<template>
  <section class="page">
    <div class="card">
      <div class="card-header">
        <h2>客户信息管理</h2>
        <div class="button-group">
          <button class="primary" type="button" @click="openAdd">新增客户</button>
          <button class="secondary" type="button" @click="openSync">同步CRM</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>客户名称</th>
            <th>联系方式</th>
            <th>等级</th>
            <th>累计交易额</th>
            <th>最新交易</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer.id">
            <td>{{ customer.name }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.level }}</td>
            <td>¥ {{ customer.total }}</td>
            <td>{{ customer.lastTrade }}</td>
            <td><span class="badge">{{ customer.status }}</span></td>
            <td>
              <button class="text" type="button" @click="openDetail(customer)">详情</button>
              <button class="text" type="button" @click="openEdit(customer)">编辑</button>
              <button class="text" type="button" @click="openDelete(customer)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-header">
        <h2>客户标签概览</h2>
        <div class="button-group">
          <button class="secondary" type="button" @click="openTagPlan">生成维护计划</button>
          <button class="secondary" type="button" @click="openTip">标签说明</button>
        </div>
      </div>
      <div class="form-grid">
        <div class="card">
          <h3>高价值客户</h3>
          <p>共 {{ highValueCount }} 位，需要重点维护。</p>
        </div>
        <div class="card">
          <h3>沉默客户</h3>
          <p>共 {{ silentCount }} 位，建议启动唤醒活动。</p>
        </div>
        <div class="card">
          <h3>潜力客户</h3>
          <p>共 {{ potentialCount }} 位，可提升购买频次。</p>
        </div>
      </div>
    </div>

    <BaseModal :open="modalOpen" :title="modalTitle" @close="closeModal">
      <template v-if="modalType === 'add' || modalType === 'edit'">
        <div class="form-grid">
          <input v-model="form.name" placeholder="客户名称" />
          <input v-model="form.phone" placeholder="联系方式" />
          <input v-model="form.email" placeholder="邮箱" />
          <select v-model="form.level">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          <input v-model="form.total" type="number" placeholder="累计交易额" />
          <input v-model="form.lastTrade" placeholder="最新交易" />
        </div>
        <div class="button-group" style="justify-content: flex-end; margin-top: 16px;">
          <button class="secondary" type="button" @click="closeModal">取消</button>
          <button class="primary" type="button" @click="submitForm">保存</button>
        </div>
      </template>
      <template v-else-if="modalType === 'detail'">
        <p>客户名称：{{ selected?.name }}</p>
        <p>联系方式：{{ selected?.phone }}</p>
        <p>邮箱：{{ selected?.email }}</p>
        <p>客户等级：{{ selected?.level }}</p>
        <p>历史交易：{{ selected?.history }}</p>
        <p>最新交易：{{ selected?.lastTrade }}</p>
      </template>
      <template v-else-if="modalType === 'delete'">
        <p>确认删除客户 <strong>{{ selected?.name }}</strong> 的所有档案吗？</p>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="secondary" type="button" @click="closeModal">取消</button>
          <button class="primary" type="button" @click="confirmDelete">确认删除</button>
        </div>
      </template>
      <template v-else>
        <p>{{ tipMessage }}</p>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="primary" type="button" @click="closeModal">知道了</button>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const customers = ref(
  Array.from({ length: 20 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      name: `云端科技-${id}`,
      phone: `138-6200-${String(id).padStart(4, '0')}`,
      email: `customer${id}@xincloud.com`,
      level: ['A', 'B', 'C'][id % 3],
      total: (120 + id * 8).toFixed(2),
      status: ['活跃', '沉默', '跟进中'][id % 3],
      lastTrade: `2024-0${(id % 9) + 1}-1${id % 9}`,
      history: `${8 + (id % 6)} 次交易记录`
    };
  })
);

const modalOpen = ref(false);
const modalType = ref('');
const modalTitle = ref('');
const selected = ref(null);
const tipMessage = ref('');
const form = ref({
  name: '',
  phone: '',
  email: '',
  level: 'A',
  total: 0,
  lastTrade: ''
});

const highValueCount = computed(() => customers.value.filter((item) => item.level === 'A').length);
const silentCount = computed(() => customers.value.filter((item) => item.status === '沉默').length);
const potentialCount = computed(() => customers.value.filter((item) => item.level === 'B').length);

const openModal = (type, title) => {
  modalType.value = type;
  modalTitle.value = title;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const openAdd = () => {
  form.value = {
    name: '',
    phone: '',
    email: '',
    level: 'A',
    total: 0,
    lastTrade: ''
  };
  openModal('add', '新增客户');
};

const openEdit = (customer) => {
  selected.value = customer;
  form.value = { ...customer };
  openModal('edit', '编辑客户信息');
};

const openDetail = (customer) => {
  selected.value = customer;
  openModal('detail', '客户详情');
};

const openDelete = (customer) => {
  selected.value = customer;
  openModal('delete', '删除客户');
};

const openSync = () => {
  tipMessage.value = '已成功同步 CRM 数据，新增 4 条客户更新记录。';
  openModal('tip', '同步提示');
};

const openTagPlan = () => {
  tipMessage.value = '已根据标签生成季度维护计划，预计覆盖 52 位客户。';
  openModal('tip', '维护计划生成');
};

const openTip = () => {
  tipMessage.value = '标签说明：A-高价值、B-潜力、C-基础。';
  openModal('tip', '标签说明');
};

const submitForm = () => {
  if (modalType.value === 'add') {
    const nextId = Math.max(...customers.value.map((item) => item.id)) + 1;
    customers.value.unshift({
      ...form.value,
      id: nextId,
      status: '活跃',
      history: '0 次交易记录'
    });
  }
  if (modalType.value === 'edit' && selected.value) {
    const index = customers.value.findIndex((item) => item.id === selected.value.id);
    if (index > -1) {
      customers.value[index] = { ...customers.value[index], ...form.value };
    }
  }
  closeModal();
};

const confirmDelete = () => {
  if (selected.value) {
    customers.value = customers.value.filter((item) => item.id !== selected.value.id);
  }
  closeModal();
};
</script>
