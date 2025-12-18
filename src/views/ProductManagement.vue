<template>
  <div class="card">
    <h3>农产品商品管理</h3>
    <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
      <button @click="showCreate = true">发布新商品</button>
      <button class="secondary" @click="showImport = true">批量上架</button>
      <button class="ghost" @click="showPrice = true">调价策略</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>商品</th>
          <th>品类</th>
          <th>库存</th>
          <th>售价</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.price }}</td>
          <td><span class="badge">{{ item.status }}</span></td>
          <td style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="ghost" @click="openSpec(item)">规格</button>
            <button class="secondary" @click="openReplenish(item)">补货</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showCreate" title="发布商品">
    <div class="form-grid">
      <div>
        <label>商品名称</label>
        <input v-model="createForm.name" placeholder="如：赣南脐橙 5kg" />
      </div>
      <div>
        <label>品类</label>
        <select v-model="createForm.category">
          <option>水果</option>
          <option>蔬菜</option>
          <option>粮油</option>
          <option>禽畜水产</option>
        </select>
      </div>
      <div>
        <label>售价</label>
        <input v-model="createForm.price" placeholder="¥99" />
      </div>
      <div>
        <label>库存</label>
        <input v-model="createForm.stock" type="number" />
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showCreate = false">取消</button>
      <button @click="pushProduct">立即上架</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showImport" title="批量上架进度">
    <p style="margin-top: 0;">已解析 Excel 模板，正在上传图片与SKU。</p>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: importProgress + '%' }"></div>
    </div>
    <template #footer>
      <button class="ghost" @click="showImport = false">关闭</button>
      <button class="secondary" @click="speedImport">加速上传</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showPrice" title="调价策略">
    <div class="form-grid">
      <div>
        <label>策略</label>
        <select v-model="priceForm.strategy">
          <option value="促销">促销降价</option>
          <option value="涨价">溢价提利</option>
          <option value="秒杀">限时秒杀</option>
        </select>
      </div>
      <div>
        <label>幅度</label>
        <input v-model="priceForm.rate" placeholder="例如 -10%" />
      </div>
      <div>
        <label>适用商品</label>
        <input v-model="priceForm.scope" placeholder="填写品类或SKU" />
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showPrice = false">稍后</button>
      <button @click="applyPrice">保存策略</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showSpec" :title="currentItem?.name + ' 规格档案'">
    <p style="margin-top: 0; color: var(--muted);">产地：{{ currentItem?.origin }}｜ 批次：{{ currentItem?.batch }}</p>
    <div class="chip-row">
      <span class="chip" v-for="tag in currentItem?.tags || []" :key="tag">{{ tag }}</span>
    </div>
    <template #footer>
      <button class="ghost" @click="showSpec = false">关闭</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showReplenish" :title="'补货 ' + currentItem?.name">
    <div class="form-grid">
      <div>
        <label>补货数量</label>
        <input v-model="replenishForm.count" type="number" />
      </div>
      <div>
        <label>到货时间</label>
        <input v-model="replenishForm.arrival" type="date" />
      </div>
      <div>
        <label>仓库</label>
        <input v-model="replenishForm.warehouse" placeholder="华东仓 / 华北仓" />
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showReplenish = false">取消</button>
      <button class="secondary" @click="submitReplenish">提交补货</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showInfo" title="操作提示">
    <p style="margin: 0; color: var(--muted);">{{ infoMessage }}</p>
    <template #footer>
      <button class="ghost" @click="showInfo = false">好的</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const items = ref([
  { name: '赣南脐橙 5kg', category: '水果', stock: 320, price: '¥89', status: '在售', origin: '江西', batch: 'B2406', tags: ['精品果', '冷链'] },
  { name: '丹东草莓 2kg', category: '水果', stock: 80, price: '¥129', status: '在售', origin: '辽宁', batch: 'B2405', tags: ['香甜', '礼盒'] },
  { name: '库尔勒香梨 3kg', category: '水果', stock: 150, price: '¥69', status: '在售', origin: '新疆', batch: 'B2403', tags: ['脆甜'] },
  { name: '五常大米 10kg', category: '粮油', stock: 560, price: '¥118', status: '在售', origin: '黑龙江', batch: 'B2406', tags: ['当季新米'] },
  { name: '高原藜麦 1kg', category: '粮油', stock: 220, price: '¥58', status: '预售', origin: '青海', batch: 'B2407', tags: ['低脂'] },
  { name: '崇明生态蔬菜箱', category: '蔬菜', stock: 140, price: '¥88', status: '在售', origin: '上海', batch: 'B2406', tags: ['直采', '有机'] },
  { name: '安吉笋干 500g', category: '蔬菜', stock: 60, price: '¥72', status: '在售', origin: '浙江', batch: 'B2404', tags: ['干制品'] },
  { name: '冷鲜三文鱼 1kg', category: '禽畜水产', stock: 50, price: '¥158', status: '在售', origin: '挪威', batch: 'B2405', tags: ['冷链', '海鲜'] },
  { name: '散养土鸡 2kg', category: '禽畜水产', stock: 120, price: '¥99', status: '在售', origin: '湖北', batch: 'B2406', tags: ['溯源'] },
  { name: '麻阳冰糖橙 4kg', category: '水果', stock: 260, price: '¥76', status: '在售', origin: '湖南', batch: 'B2406', tags: ['C端热卖'] }
]);

const showCreate = ref(false);
const showImport = ref(false);
const showPrice = ref(false);
const showSpec = ref(false);
const showReplenish = ref(false);
const importProgress = ref(35);
const currentItem = ref(null);
const showInfo = ref(false);
const infoMessage = ref('');

const createForm = reactive({
  name: '',
  category: '水果',
  price: '',
  stock: 100
});

const priceForm = reactive({
  strategy: '促销',
  rate: '-10%',
  scope: '水果全量'
});

const replenishForm = reactive({
  count: 100,
  arrival: '',
  warehouse: '华东仓'
});

const pushProduct = () => {
  items.value.unshift({
    name: createForm.name || '新商品',
    category: createForm.category,
    stock: createForm.stock,
    price: createForm.price || '待定',
    status: '在售',
    origin: '待填写',
    batch: 'NEW',
    tags: ['新品']
  });
  showCreate.value = false;
  infoMessage.value = '新商品已加入上架队列';
  showInfo.value = true;
};

const speedImport = () => {
  importProgress.value = Math.min(100, importProgress.value + 20);
};

const applyPrice = () => {
  infoMessage.value = `已应用 ${priceForm.strategy} 策略，幅度 ${priceForm.rate}`;
  showPrice.value = false;
  showInfo.value = true;
};

const openSpec = (item) => {
  currentItem.value = item;
  showSpec.value = true;
};

const openReplenish = (item) => {
  currentItem.value = item;
  showReplenish.value = true;
};

const submitReplenish = () => {
  infoMessage.value = `补货 ${replenishForm.count} 件，仓库 ${replenishForm.warehouse}`;
  showReplenish.value = false;
  showInfo.value = true;
};
</script>
