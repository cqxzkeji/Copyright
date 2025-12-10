<template>
  <div class="card">
    <header style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
      <div>
        <h3 style="margin: 0;">库存追踪</h3>
        <p class="tagline">实时关注安全库存与补货</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn" @click="openReplenish">补货申请</button>
        <button class="btn secondary" @click="openNotice('保持低于安全库存的商品预警。')">库存提醒</button>
      </div>
    </header>
    <div class="grid cols-2" style="margin-bottom: 16px;">
      <div class="card" style="box-shadow: none; background: #fff7ed; border-color: #fed7aa;">
        <div style="font-weight: 700;">低库存预警</div>
        <div style="font-size: 26px; font-weight: 800;">{{ lowStock.length }} 项</div>
        <div class="tagline">需要尽快补货</div>
      </div>
      <div class="card" style="box-shadow: none; background: #e0f2fe; border-color: #bfdbfe;">
        <div style="font-weight: 700;">总库存件数</div>
        <div style="font-size: 26px; font-weight: 800;">{{ totalStock }}</div>
        <div class="tagline">含所有仓位</div>
      </div>
    </div>
    <div style="overflow-x: auto;">
      <table class="table">
        <thead>
          <tr>
            <th>产品</th>
            <th>批次</th>
            <th>当前库存</th>
            <th>安全库存</th>
            <th>库位</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventory" :key="item.batch">
            <td>{{ item.name }}</td>
            <td>{{ item.batch }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ item.safe }}</td>
            <td>{{ item.location }}</td>
            <td style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn" @click="openAdjust(item)">调整</button>
              <button class="btn danger" @click="openFreeze(item)">冻结</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="showReplenish" title="补货申请" @confirm="submitReplenish">
    <label>补货产品</label>
    <input class="input" v-model="replenishForm.name" placeholder="选择产品" />
    <label>申请数量</label>
    <input class="input" type="number" v-model.number="replenishForm.qty" />
    <label>目标到货时间</label>
    <input class="input" type="date" v-model="replenishForm.date" />
  </ModalDialog>

  <ModalDialog v-model="showAdjust" title="库存调整" @confirm="submitAdjust">
    <p>调整 {{ currentItem.name }} 库存</p>
    <label>调整后数量</label>
    <input class="input" type="number" v-model.number="currentItem.qty" />
  </ModalDialog>

  <ModalDialog v-model="showFreeze" title="库存冻结" @confirm="confirmFreeze">
    <p>冻结批次 {{ currentItem.batch }} 用于质检或锁定？</p>
  </ModalDialog>

  <ModalDialog v-model="showNotice" title="提示">
    <p>{{ notice }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const inventory = reactive([
  { name: '富硒苹果', batch: 'B-2301', qty: 120, safe: 80, location: '冷库-A1' },
  { name: '有机西红柿', batch: 'B-2302', qty: 60, safe: 50, location: '冷库-B2' },
  { name: '冬枣', batch: 'B-2303', qty: 22, safe: 30, location: '恒温-C3' },
  { name: '草莓', batch: 'B-2304', qty: 18, safe: 25, location: '冷库-A2' },
  { name: '菜籽油', batch: 'B-2305', qty: 44, safe: 20, location: '常温-D1' },
  { name: '糙米', batch: 'B-2306', qty: 38, safe: 35, location: '常温-D2' },
  { name: '藜麦', batch: 'B-2307', qty: 17, safe: 25, location: '常温-D3' },
  { name: '黄心土豆', batch: 'B-2308', qty: 96, safe: 60, location: '阴凉-E1' },
  { name: '鲜鸡蛋', batch: 'B-2309', qty: 55, safe: 40, location: '冷链-F2' },
  { name: '有机胡萝卜', batch: 'B-2310', qty: 32, safe: 28, location: '冷库-B1' }
]);

const lowStock = computed(() => inventory.filter((item) => item.qty < item.safe));
const totalStock = computed(() => inventory.reduce((sum, item) => sum + item.qty, 0));

const showReplenish = ref(false);
const showAdjust = ref(false);
const showFreeze = ref(false);
const showNotice = ref(false);

const replenishForm = reactive({ name: '', qty: 0, date: '' });
const currentItem = reactive({});
const notice = ref('');

const openReplenish = () => {
  Object.assign(replenishForm, { name: '', qty: 0, date: '' });
  showReplenish.value = true;
};

const openAdjust = (item) => {
  Object.assign(currentItem, item);
  showAdjust.value = true;
};

const openFreeze = (item) => {
  Object.assign(currentItem, item);
  showFreeze.value = true;
};

const openNotice = (text) => {
  notice.value = text;
  showNotice.value = true;
};

const submitReplenish = () => {
  if (!replenishForm.name) return openNotice('请填写需要补货的产品');
  openNotice(`已提交补货申请：${replenishForm.name} 数量 ${replenishForm.qty}`);
  showReplenish.value = false;
};

const submitAdjust = () => {
  const index = inventory.findIndex((item) => item.batch === currentItem.batch);
  if (index > -1) {
    inventory[index].qty = currentItem.qty;
  }
  showAdjust.value = false;
  openNotice('库存数量已调整');
};

const confirmFreeze = () => {
  openNotice(`批次 ${currentItem.batch} 已冻结，等待质检`);
  showFreeze.value = false;
};
</script>
