<template>
  <section class="view">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>商品关联与展示</h2>
          <p>管理直播间商品关联、库存与展示卡片。</p>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('link')">新增关联</button>
          <button class="ghost" @click="openModal('template')">展示模板</button>
          <button class="outline" @click="openModal('progress')">库存同步</button>
        </div>
      </div>
      <div class="card-grid">
        <div class="product-card" v-for="product in products" :key="product.id">
          <img :src="product.image" alt="商品" />
          <div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.desc }}</p>
          </div>
          <div class="tag-row">
            <span class="tag">库存 {{ product.stock }}</span>
            <span class="tag">{{ product.tag }}</span>
          </div>
          <button class="ghost" @click="openModal('detail')">查看详情</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>商品关联列表</h2>
        <button class="primary" @click="openModal('price')">批量调价</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>商品编号</th>
              <th>商品名称</th>
              <th>关联直播间</th>
              <th>讲解顺序</th>
              <th>库存</th>
              <th>售价</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.room }}</td>
              <td>{{ row.order }}</td>
              <td>{{ row.stock }}</td>
              <td>{{ row.price }}</td>
              <td><span class="tag">{{ row.status }}</span></td>
              <td><button class="ghost" @click="openModal('edit')">编辑</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <BaseModal v-if="activeModal" :title="modalTitle" :confirm-text="confirmText" @close="activeModal = ''" @confirm="confirm">
    <template v-if="activeModal === 'link'">
      <label>
        选择商品
        <input v-model="form.product" placeholder="请输入商品名称" />
      </label>
      <label>
        关联直播间
        <input v-model="form.room" placeholder="请输入直播间" />
      </label>
      <label>
        讲解顺序
        <input v-model="form.order" type="number" placeholder="请输入序号" />
      </label>
    </template>
    <template v-else-if="activeModal === 'price'">
      <label>
        调价方案
        <select v-model="form.plan">
          <option>直播专享价 -8%</option>
          <option>会员价 -5%</option>
          <option>节日促销价 -12%</option>
        </select>
      </label>
      <label>
        生效时间
        <input v-model="form.time" type="datetime-local" />
      </label>
    </template>
    <template v-else-if="activeModal === 'edit'">
      <label>
        库存调整
        <input v-model="form.stock" type="number" placeholder="请输入库存" />
      </label>
      <label>
        关联状态
        <select v-model="form.status">
          <option>已上架</option>
          <option>待补货</option>
          <option>暂停展示</option>
        </select>
      </label>
    </template>
    <template v-else-if="activeModal === 'detail'">
      <p>商品展示卡片已同步至直播间，支持弹窗推荐。</p>
      <ul class="info-list">
        <li>主推卖点：原产地直供</li>
        <li>转化率：7.2%</li>
        <li>最近更新：5 分钟前</li>
      </ul>
    </template>
    <template v-else-if="activeModal === 'template'">
      <p>已选择「清新果蔬」展示模板。</p>
      <label>
        模板主题色
        <input v-model="form.theme" type="color" />
      </label>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>库存同步进度</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>{{ progress }}% 已同步</p>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const products = [
  {
    id: 1,
    name: '生态蔬菜礼盒',
    desc: '精选当季蔬菜组合',
    stock: 320,
    tag: '热销',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: '高原番茄',
    desc: '无公害种植，酸甜适口',
    stock: 180,
    tag: '新品',
    image: 'https://images.unsplash.com/photo-1506807803488-8eafc15323d1?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: '黑米杂粮包',
    desc: '健康粗粮搭配',
    stock: 260,
    tag: '推荐',
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=80'
  }
];

const tableRows = [
  { id: 'P-001', name: '生态蔬菜礼盒', room: '夜场团购', order: 1, stock: 320, price: '￥128', status: '已上架' },
  { id: 'P-002', name: '高原番茄', room: '午间厨房', order: 2, stock: 180, price: '￥59', status: '已上架' },
  { id: 'P-003', name: '黑米杂粮包', room: '清晨采摘', order: 3, stock: 260, price: '￥89', status: '已上架' },
  { id: 'P-004', name: '精品蜂蜜', room: '夜场团购', order: 4, stock: 140, price: '￥79', status: '待补货' },
  { id: 'P-005', name: '山地鸡蛋', room: '午间厨房', order: 5, stock: 90, price: '￥69', status: '待补货' },
  { id: 'P-006', name: '有机大米', room: '清晨采摘', order: 6, stock: 240, price: '￥99', status: '已上架' },
  { id: 'P-007', name: '香草调味礼盒', room: '夜场团购', order: 7, stock: 150, price: '￥129', status: '已上架' },
  { id: 'P-008', name: '冷压菜籽油', room: '午间厨房', order: 8, stock: 110, price: '￥89', status: '暂停展示' },
  { id: 'P-009', name: '鲜榨果汁组合', room: '清晨采摘', order: 9, stock: 210, price: '￥109', status: '已上架' },
  { id: 'P-010', name: '生态银耳', room: '夜场团购', order: 10, stock: 170, price: '￥49', status: '已上架' }
];

const activeModal = ref('');
const modalTitle = ref('');
const confirmText = ref('确认');
const progress = ref(73);

const form = reactive({
  product: '',
  room: '',
  order: 1,
  plan: '直播专享价 -8%',
  time: '',
  stock: 200,
  status: '已上架',
  theme: '#4ade80'
});

const openModal = (type) => {
  activeModal.value = type;
  const titleMap = {
    link: '新增商品关联',
    template: '选择展示模板',
    progress: '库存同步进度',
    price: '批量调价',
    edit: '编辑商品关联',
    detail: '商品展示详情'
  };
  modalTitle.value = titleMap[type];
  confirmText.value = type === 'detail' || type === 'progress' ? '' : '确认';
};

const confirm = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.product-card {
  background: #f8fafc;
  padding: 14px;
  border-radius: 16px;
  display: grid;
  gap: 10px;
}

.product-card img {
  height: 140px;
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
}

tr + tr {
  border-top: 1px solid #e2e8f0;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #e0f2fe;
  color: #0369a1;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.outline {
  background: transparent;
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22d3ee);
}

input,
select,
textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-list {
  padding-left: 18px;
  color: #475569;
}
</style>
