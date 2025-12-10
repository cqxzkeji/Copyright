<template>
  <div class="card">
    <header style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
      <div>
        <h3 style="margin: 0;">产品管理</h3>
        <p class="tagline">维护农产品基础信息与定价</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn" @click="openAdd">新增产品</button>
        <button class="btn secondary" @click="openTip('建议定期检查价格与库存同步情况。')">操作提示</button>
      </div>
    </header>
    <div class="grid cols-3" style="margin-bottom: 16px;">
      <div class="card" v-for="metric in metrics" :key="metric.label" style="box-shadow: none; border-color: #dbeafe; background: #eff6ff;">
        <div style="font-weight: 700;">{{ metric.label }}</div>
        <div style="font-size: 24px; font-weight: 800;">{{ metric.value }}</div>
        <div class="tagline">{{ metric.desc }}</div>
      </div>
    </div>
    <div style="overflow-x: auto;">
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>产品</th>
            <th>分类</th>
            <th>价格(元)</th>
            <th>库存</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.price.toFixed(2) }}</td>
            <td>{{ item.stock }}</td>
            <td>
              <span class="badge" :class="item.stock > 40 ? 'success' : item.stock > 15 ? 'warning' : 'danger'">{{ item.status }}</span>
            </td>
            <td style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn" @click="openEdit(item)">编辑</button>
              <button class="btn danger" @click="openDelete(item)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="showAdd" title="新增产品" @confirm="saveNew">
    <label>名称</label>
    <input class="input" v-model="newProduct.name" placeholder="如：春见柑橘" />
    <label>分类</label>
    <input class="input" v-model="newProduct.category" placeholder="水果/蔬菜/粮油" />
    <label>价格</label>
    <input class="input" type="number" v-model.number="newProduct.price" />
    <label>库存</label>
    <input class="input" type="number" v-model.number="newProduct.stock" />
  </ModalDialog>

  <ModalDialog v-model="showEdit" title="编辑产品" @confirm="saveEdit">
    <label>名称</label>
    <input class="input" v-model="editProduct.name" />
    <label>分类</label>
    <input class="input" v-model="editProduct.category" />
    <label>价格</label>
    <input class="input" type="number" v-model.number="editProduct.price" />
    <label>库存</label>
    <input class="input" type="number" v-model.number="editProduct.stock" />
  </ModalDialog>

  <ModalDialog v-model="showDelete" title="确认删除" @confirm="confirmDelete">
    <p>确认删除 {{ editProduct.name }} 吗？删除后可再次新增。</p>
  </ModalDialog>

  <ModalDialog v-model="showTip" title="提示信息">
    <p>{{ tipMessage }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const products = reactive([
  { id: 'P-001', name: '有机西红柿', category: '蔬菜', price: 4.6, stock: 120, status: '在售' },
  { id: 'P-002', name: '富硒苹果', category: '水果', price: 6.9, stock: 86, status: '在售' },
  { id: 'P-003', name: '冬枣', category: '水果', price: 8.5, stock: 42, status: '在售' },
  { id: 'P-004', name: '糙米', category: '粮油', price: 5.2, stock: 55, status: '在售' },
  { id: 'P-005', name: '菜籽油', category: '粮油', price: 16.8, stock: 25, status: '在售' },
  { id: 'P-006', name: '有机胡萝卜', category: '蔬菜', price: 3.8, stock: 33, status: '在售' },
  { id: 'P-007', name: '鲜鸡蛋', category: '禽蛋', price: 7.5, stock: 73, status: '在售' },
  { id: 'P-008', name: '黄心土豆', category: '蔬菜', price: 2.9, stock: 95, status: '在售' },
  { id: 'P-009', name: '草莓', category: '水果', price: 18.0, stock: 18, status: '预售' },
  { id: 'P-010', name: '藜麦', category: '杂粮', price: 12.3, stock: 28, status: '在售' }
]);

const metrics = computed(() => [
  { label: '商品总数', value: products.length, desc: '含上线与预售' },
  { label: '库存合计', value: products.reduce((sum, p) => sum + p.stock, 0), desc: '实时库存件数' },
  { label: '平均售价', value: `¥${(products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2)}`, desc: '含特价商品' }
]);

const showAdd = ref(false);
const showEdit = ref(false);
const showDelete = ref(false);
const showTip = ref(false);
const tipMessage = ref('');
const newProduct = reactive({ name: '', category: '', price: 0, stock: 0 });
const editProduct = reactive({});

const openAdd = () => {
  Object.assign(newProduct, { name: '', category: '', price: 0, stock: 0 });
  showAdd.value = true;
};

const openEdit = (item) => {
  Object.assign(editProduct, item);
  showEdit.value = true;
};

const openDelete = (item) => {
  Object.assign(editProduct, item);
  showDelete.value = true;
};

const openTip = (text) => {
  tipMessage.value = text;
  showTip.value = true;
};

const saveNew = () => {
  if (!newProduct.name) return openTip('请填写完整信息后再保存');
  const id = `P-${(products.length + 1).toString().padStart(3, '0')}`;
  products.push({ ...newProduct, id, status: '在售' });
  showAdd.value = false;
  openTip('新增产品已保存');
};

const saveEdit = () => {
  const index = products.findIndex((p) => p.id === editProduct.id);
  if (index > -1) {
    products[index] = { ...editProduct };
  }
  showEdit.value = false;
  openTip('产品信息已更新');
};

const confirmDelete = () => {
  const index = products.findIndex((p) => p.id === editProduct.id);
  if (index > -1) {
    products.splice(index, 1);
  }
  showDelete.value = false;
  openTip('已删除，重新规划库存');
};
</script>
