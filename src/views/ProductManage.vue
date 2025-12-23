<template>
  <div class="page">
    <div class="section-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 700;">农产品与资源总览</div>
        <div class="action-row">
          <button class="btn" @click="openAdd">新增农产品</button>
          <button class="btn secondary" @click="openInventory">资源盘点</button>
          <button class="btn warning" @click="openAlert">库存预警</button>
        </div>
      </div>
      <div class="card-grid" style="margin-top: 16px;">
        <div class="section-card" v-for="card in cards" :key="card.title">
          <div style="font-size: 12px; color: #64748b;">{{ card.title }}</div>
          <div style="font-size: 22px; font-weight: 700; margin-top: 8px;">{{ card.value }}</div>
          <div class="badge" style="margin-top: 12px;">{{ card.tag }}</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">特色产品展示</div>
      <div class="card-grid">
        <div class="section-card" v-for="item in gallery" :key="item.name" style="padding: 12px;">
          <img :src="item.image" :alt="item.name" style="width: 100%; height: 140px; object-fit: cover; border-radius: 12px;" />
          <div style="margin-top: 10px; font-weight: 600;">{{ item.name }}</div>
          <div style="font-size: 12px; color: #64748b;">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">农产品库存表</div>
      <table class="table">
        <thead>
          <tr>
            <th>品类</th>
            <th>产地</th>
            <th>库存(吨)</th>
            <th>预计出库</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.origin }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.out }}</td>
            <td>
              <span class="badge">{{ item.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="addOpen" title="新增农产品" :on-close="closeAdd">
      <form class="modal-form" @submit.prevent="submitAdd">
        <div>
          <label>品类名称</label>
          <input v-model="form.name" type="text" placeholder="如：高山蔬菜" required />
        </div>
        <div>
          <label>产地乡镇</label>
          <input v-model="form.origin" type="text" placeholder="如：安和镇" required />
        </div>
        <div>
          <label>当前库存</label>
          <input v-model="form.stock" type="number" min="0" required />
        </div>
        <div>
          <label>预计出库</label>
          <input v-model="form.out" type="text" placeholder="周三冷链" />
        </div>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeAdd">取消</button>
        <button class="btn" @click="submitAdd">保存</button>
      </template>
    </BaseModal>

    <BaseModal :open="inventoryOpen" title="资源盘点进度" :on-close="closeInventory">
      <p>正在校验仓储、冷链、农机资源数据。</p>
      <div class="progress" style="margin-top: 16px;">
        <span :style="{ width: '72%' }"></span>
      </div>
      <template #footer>
        <button class="btn" @click="closeInventory">完成</button>
      </template>
    </BaseModal>

    <BaseModal :open="alertOpen" title="库存预警" :on-close="closeAlert">
      <p>冷库 C 区蔬菜库存不足 20 吨，建议发起补采。</p>
      <p>菌菇类保鲜期短，请优先安排物流配送。</p>
      <template #footer>
        <button class="btn" @click="closeAlert">已知晓</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const cards = [
  { title: '在库品类', value: '36 类', tag: '可追溯产地' },
  { title: '冷链仓储', value: '5,200 吨', tag: '当日使用 78%' },
  { title: '订单预售', value: '920 吨', tag: '未来 7 天' },
  { title: '农机共享', value: '128 台', tag: '线上调度' }
];

const gallery = [
  {
    name: '高山蔬菜组合',
    desc: '安和镇 · 直供社区团购',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%2360a5fa"/><stop offset="1" stop-color="%2322d3ee"/></linearGradient></defs><rect width="360" height="200" fill="url(%23g)"/><circle cx="90" cy="120" r="50" fill="%23fef08a"/><circle cx="160" cy="90" r="40" fill="%23bbf7d0"/><circle cx="240" cy="130" r="45" fill="%23fecaca"/></svg>'
  },
  {
    name: '有机水果礼盒',
    desc: '丰谷镇 · 直播热销',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><rect width="360" height="200" fill="%23fef3c7"/><rect x="40" y="40" width="280" height="120" rx="20" fill="%23f97316"/><circle cx="120" cy="100" r="34" fill="%23fca5a5"/><circle cx="210" cy="100" r="34" fill="%23fde047"/></svg>'
  },
  {
    name: '农机共享调度',
    desc: '南坪镇 · 线上预约',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><rect width="360" height="200" fill="%23e0f2fe"/><rect x="60" y="70" width="240" height="70" rx="16" fill="%236366f1"/><circle cx="120" cy="150" r="20" fill="%2322d3ee"/><circle cx="240" cy="150" r="20" fill="%2322d3ee"/></svg>'
  }
];

const products = ref([
  { name: '高山蔬菜', origin: '安和镇', stock: 120, out: '周二冷链', status: '充足' },
  { name: '柑橘鲜果', origin: '丰谷镇', stock: 85, out: '周三外运', status: '稳定' },
  { name: '生态大米', origin: '双桥镇', stock: 260, out: '周五发车', status: '充足' },
  { name: '菌菇礼盒', origin: '石岭镇', stock: 32, out: '周一加急', status: '预警' },
  { name: '蜂蜜制品', origin: '新桥镇', stock: 64, out: '周四发货', status: '稳定' },
  { name: '红薯制品', origin: '青山镇', stock: 150, out: '周三冷链', status: '充足' },
  { name: '土鸡蛋', origin: '合兴镇', stock: 48, out: '今日配送', status: '预警' },
  { name: '辣椒酱', origin: '观山镇', stock: 90, out: '周五外运', status: '稳定' },
  { name: '茶叶礼盒', origin: '临河镇', stock: 70, out: '周二发车', status: '稳定' },
  { name: '桑蚕丝', origin: '南坪镇', stock: 24, out: '周末发货', status: '紧张' }
]);

const addOpen = ref(false);
const inventoryOpen = ref(false);
const alertOpen = ref(false);

const form = reactive({
  name: '',
  origin: '',
  stock: 0,
  out: ''
});

const openAdd = () => {
  addOpen.value = true;
};
const closeAdd = () => {
  addOpen.value = false;
};
const submitAdd = () => {
  products.value.unshift({
    name: form.name,
    origin: form.origin,
    stock: form.stock,
    out: form.out || '待安排',
    status: '新增'
  });
  form.name = '';
  form.origin = '';
  form.stock = 0;
  form.out = '';
  addOpen.value = false;
};

const openInventory = () => {
  inventoryOpen.value = true;
};
const closeInventory = () => {
  inventoryOpen.value = false;
};

const openAlert = () => {
  alertOpen.value = true;
};
const closeAlert = () => {
  alertOpen.value = false;
};
</script>
