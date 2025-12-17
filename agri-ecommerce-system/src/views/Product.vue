<template>
  <div class="card">
    <div class="flex" style="justify-content: space-between; align-items: center;">
      <div>
        <h2>商品管理</h2>
        <p class="muted">管理农产品信息、上架节奏与库存安全线</p>
      </div>
      <div class="flex">
        <button @click="openForm('新增商品')">新增商品</button>
        <button class="secondary" @click="openProgress('批量同步到各渠道...')">渠道同步</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>商品</th>
          <th>类目</th>
          <th>售价</th>
          <th>库存</th>
          <th>安全库存</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td>￥{{ item.price }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.safe }}</td>
          <td><span :class="['badge', item.status === '上架' ? 'success' : 'warn']">{{ item.status }}</span></td>
          <td>
            <button class="secondary" @click="openInfo(`即将下架：${item.name}`)">下架</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog :visible="formModal" title="商品编辑" show-actions @close="formModal = false" @confirm="saveProduct">
    <div class="input-group">
      <label>商品名称</label>
      <input v-model="form.name" placeholder="填写商品名称" />
    </div>
    <div class="input-group">
      <label>类目</label>
      <select v-model="form.category">
        <option>蔬菜</option>
        <option>水果</option>
        <option>粮油</option>
        <option>禽畜</option>
      </select>
    </div>
    <div class="input-group">
      <label>库存</label>
      <input v-model="form.stock" type="number" placeholder="录入库存" />
    </div>
  </ModalDialog>

  <ModalDialog :visible="progressModal" title="同步进度" @close="progressModal = false">
    <p style="margin: 0 0 10px 0;">{{ progressMessage }}</p>
    <div class="progress"><div class="progress-fill" :style="{ width: progress + '%' }"></div></div>
  </ModalDialog>

  <ModalDialog :visible="infoModal" title="操作提示" @close="infoModal = false">
    <p>{{ infoMessage }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const products = [
  { name: '有机西红柿', category: '蔬菜', price: 16.8, stock: 320, safe: 120, status: '上架' },
  { name: '赣南脐橙', category: '水果', price: 29.9, stock: 280, safe: 100, status: '上架' },
  { name: '寒地蓝莓', category: '水果', price: 45.0, stock: 180, safe: 90, status: '上架' },
  { name: '长粒香大米', category: '粮油', price: 68.0, stock: 520, safe: 200, status: '上架' },
  { name: '初榨菜籽油', category: '粮油', price: 78.0, stock: 410, safe: 160, status: '上架' },
  { name: '散养土鸡蛋', category: '禽畜', price: 25.0, stock: 260, safe: 120, status: '上架' },
  { name: '生态散养鸡', category: '禽畜', price: 99.0, stock: 150, safe: 80, status: '上架' },
  { name: '芦笋', category: '蔬菜', price: 22.0, stock: 200, safe: 90, status: '上架' },
  { name: '砂糖橘', category: '水果', price: 19.9, stock: 300, safe: 110, status: '上架' },
  { name: '紫薯', category: '蔬菜', price: 12.0, stock: 240, safe: 100, status: '上架' },
];

const formModal = ref(false);
const progressModal = ref(false);
const infoModal = ref(false);
const progress = ref(0);
const progressMessage = ref('');
const infoMessage = ref('');
const form = reactive({ name: '', category: '蔬菜', stock: 0 });

const openForm = (title) => {
  formModal.value = true;
};

const saveProduct = () => {
  infoMessage.value = `已保存商品：${form.name || '新商品'}`;
  infoModal.value = true;
  formModal.value = false;
};

const openProgress = (message) => {
  progressMessage.value = message;
  progress.value = 0;
  progressModal.value = true;
  setTimeout(() => (progress.value = 55), 300);
  setTimeout(() => (progress.value = 100), 900);
};

const openInfo = (message) => {
  infoMessage.value = message;
  infoModal.value = true;
};
</script>
