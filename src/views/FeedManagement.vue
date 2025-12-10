<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h2>饲料管理</h2>
        <p class="muted">库存、采购与发放全流程记录，保证饲料安全。</p>
      </div>
      <div class="flex-between" style="gap: 8px;">
        <button class="button" @click="openPurchase">采购计划</button>
        <button class="button secondary" @click="openDispatch">饲料发放</button>
      </div>
    </div>
    <div class="chart-row">
      <div class="card">
        <h4>库存占比</h4>
        <div class="progress" v-for="item in stockStats" :key="item.name" style="margin-bottom: 8px;">
          <span :style="{ width: item.percent + '%' }"></span>
        </div>
        <div class="muted" v-for="item in stockStats" :key="item.name + '-label'">{{ item.name }}：{{ item.quantity }} 吨</div>
      </div>
      <div class="card">
        <h4>消耗趋势</h4>
        <svg viewBox="0 0 200 100" style="width: 100%;">
          <polyline
            :points="consumePoints"
            fill="none"
            stroke="#0ca678"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <div class="muted">近10天日均消耗 {{ averageConsume }} 吨</div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>品类</th>
          <th>库存(吨)</th>
          <th>安全库存</th>
          <th>到期日</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="feed in feeds" :key="feed.id">
          <td>{{ feed.name }}</td>
          <td>{{ feed.quantity }}</td>
          <td>{{ feed.safe }}</td>
          <td>{{ feed.expire }}</td>
          <td><span class="badge">{{ feed.status }}</span></td>
          <td>
            <button class="button secondary" @click="openAdjust(feed)">调整</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showAdjust" class="modal-backdrop">
    <div class="modal">
      <h3>库存调整 - {{ current?.name }}</h3>
      <div class="form-grid">
        <label>现有库存(吨) <input type="number" v-model.number="current.quantity" /></label>
        <label>安全库存(吨) <input type="number" v-model.number="current.safe" /></label>
        <label>到期日 <input type="date" v-model="current.expire" /></label>
      </div>
      <div class="flex-between" style="margin-top: 16px;">
        <button class="button secondary" @click="showAdjust = false">取消</button>
        <button class="button" @click="saveAdjust">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showPurchase" class="modal-backdrop">
    <div class="modal">
      <h3>创建采购计划</h3>
      <div class="form-grid">
        <label>品类 <input v-model="purchase.name" placeholder="玉米/豆粕" /></label>
        <label>数量(吨) <input type="number" v-model.number="purchase.quantity" /></label>
        <label>交付日期 <input type="date" v-model="purchase.date" /></label>
      </div>
      <div class="flex-between" style="margin-top: 16px;">
        <button class="button secondary" @click="showPurchase = false">取消</button>
        <button class="button" @click="submitPurchase">提交计划</button>
      </div>
    </div>
  </div>

  <div v-if="showDispatch" class="modal-backdrop">
    <div class="modal">
      <h3>饲料发放</h3>
      <div class="form-grid">
        <label>畜群分区
          <select v-model="dispatch.zone">
            <option>犊牛区</option>
            <option>育肥区</option>
            <option>产奶区</option>
          </select>
        </label>
        <label>饲料类型 <input v-model="dispatch.feed" placeholder="精饲料" /></label>
        <label>发放量(吨) <input type="number" v-model.number="dispatch.amount" /></label>
      </div>
      <div class="progress" style="margin-top: 12px;"><span :style="{ width: dispatchProgress + '%' }"></span></div>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="button secondary" @click="closeDispatch">关闭</button>
        <button class="button" @click="startDispatch">开始发放</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const feeds = ref([
  { id: 1, name: '玉米', quantity: 24, safe: 15, expire: '2024-08-01', status: '正常' },
  { id: 2, name: '豆粕', quantity: 18, safe: 12, expire: '2024-07-12', status: '补货中' },
  { id: 3, name: '苜蓿草', quantity: 32, safe: 18, expire: '2024-09-20', status: '正常' },
  { id: 4, name: '青贮', quantity: 40, safe: 22, expire: '2024-10-05', status: '正常' },
  { id: 5, name: '酒糟', quantity: 12, safe: 10, expire: '2024-06-28', status: '紧急补货' },
  { id: 6, name: '精饲料', quantity: 20, safe: 14, expire: '2024-07-30', status: '补货中' },
  { id: 7, name: '矿物质添加剂', quantity: 8, safe: 6, expire: '2024-08-18', status: '正常' },
  { id: 8, name: '维生素预混料', quantity: 6, safe: 5, expire: '2024-06-25', status: '紧急补货' },
  { id: 9, name: '麦麸', quantity: 16, safe: 10, expire: '2024-08-10', status: '正常' },
  { id: 10, name: '油脂', quantity: 5, safe: 3, expire: '2024-06-30', status: '补货中' },
  { id: 11, name: '草粉', quantity: 14, safe: 9, expire: '2024-07-08', status: '正常' }
]);

const consume = ref([4, 3.8, 4.2, 4.6, 4.1, 4.3, 4.5, 4.7, 4.4, 4.2]);
const showAdjust = ref(false);
const showPurchase = ref(false);
const showDispatch = ref(false);
const dispatchProgress = ref(0);
const current = ref(null);
const purchase = reactive({ name: '', quantity: 0, date: '' });
const dispatch = reactive({ zone: '犊牛区', feed: '', amount: 0 });
let dispatchTimer;

const stockStats = computed(() => {
  const total = feeds.value.reduce((sum, f) => sum + f.quantity, 0) || 1;
  return feeds.value.map((f) => ({ name: f.name, quantity: f.quantity, percent: Math.round((f.quantity / total) * 100) }));
});

const consumePoints = computed(() => {
  const max = Math.max(...consume.value);
  const min = Math.min(...consume.value);
  const span = max - min || 1;
  return consume.value
    .map((v, idx) => {
      const x = (idx / (consume.value.length - 1)) * 200;
      const y = 90 - ((v - min) / span) * 80;
      return `${x},${y}`;
    })
    .join(' ');
});

const averageConsume = computed(() => (consume.value.reduce((s, v) => s + v, 0) / consume.value.length).toFixed(2));

const openAdjust = (feed) => {
  current.value = { ...feed };
  showAdjust.value = true;
};

const saveAdjust = () => {
  const idx = feeds.value.findIndex((f) => f.id === current.value.id);
  if (idx !== -1) feeds.value[idx] = { ...current.value };
  showAdjust.value = false;
};

const openPurchase = () => {
  showPurchase.value = true;
};

const submitPurchase = () => {
  if (purchase.name && purchase.quantity) {
    feeds.value.push({
      id: Date.now(),
      name: purchase.name,
      quantity: purchase.quantity,
      safe: purchase.quantity * 0.6,
      expire: purchase.date || '待定',
      status: '补货中'
    });
  }
  showPurchase.value = false;
};

const openDispatch = () => {
  dispatchProgress.value = 0;
  showDispatch.value = true;
};

const startDispatch = () => {
  dispatchProgress.value = 20;
  clearInterval(dispatchTimer);
  dispatchTimer = setInterval(() => {
    if (dispatchProgress.value >= 100) {
      clearInterval(dispatchTimer);
    } else {
      dispatchProgress.value += 20;
    }
  }, 400);
};

const closeDispatch = () => {
  clearInterval(dispatchTimer);
  showDispatch.value = false;
};
</script>
