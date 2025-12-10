<template>
  <div class="card">
    <header style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
      <div>
        <h3 style="margin: 0;">销售管理</h3>
        <p class="tagline">登记销售、确认收款、跟进配送</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn" @click="openSaleForm">登记销售</button>
        <button class="btn secondary" @click="openNotification('完成线下批发后及时回填销售记录。')">销售提醒</button>
      </div>
    </header>
    <div class="grid cols-3" style="margin-bottom: 16px;">
      <div class="card" v-for="item in indicators" :key="item.label" style="box-shadow: none; background: #f0fdf4; border-color: #bbf7d0;">
        <div style="font-weight: 700;">{{ item.label }}</div>
        <div style="font-size: 22px; font-weight: 800;">{{ item.value }}</div>
        <div class="tagline">{{ item.desc }}</div>
      </div>
    </div>
    <div style="overflow-x: auto;">
      <table class="table">
        <thead>
          <tr>
            <th>单号</th>
            <th>产品</th>
            <th>数量</th>
            <th>金额</th>
            <th>客户</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in sales" :key="sale.no">
            <td>{{ sale.no }}</td>
            <td>{{ sale.product }}</td>
            <td>{{ sale.qty }}</td>
            <td>¥{{ sale.amount.toFixed(2) }}</td>
            <td>{{ sale.client }}</td>
            <td><span class="badge" :class="sale.status === '已完成' ? 'success' : sale.status === '待发货' ? 'warning' : 'danger'">{{ sale.status }}</span></td>
            <td style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn" @click="openPayment(sale)">确认收款</button>
              <button class="btn secondary" @click="openDelivery(sale)">安排发货</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="showSaleForm" title="登记销售" @confirm="submitSale">
    <label>产品</label>
    <input class="input" v-model="saleForm.product" placeholder="如：富硒苹果" />
    <label>数量</label>
    <input class="input" type="number" v-model.number="saleForm.qty" />
    <label>金额</label>
    <input class="input" type="number" v-model.number="saleForm.amount" />
    <label>客户</label>
    <input class="input" v-model="saleForm.client" />
  </ModalDialog>

  <ModalDialog v-model="showPayment" title="收款确认" @confirm="confirmPayment">
    <p>确认 {{ currentSale.product }} 的收款吗？金额 ¥{{ currentSale.amount?.toFixed(2) }}</p>
  </ModalDialog>

  <ModalDialog v-model="showDelivery" title="发货安排" @confirm="confirmDelivery">
    <label>物流公司</label>
    <input class="input" v-model="deliveryForm.company" placeholder="输入物流名称" />
    <label>发货时间</label>
    <input class="input" type="datetime-local" v-model="deliveryForm.time" />
  </ModalDialog>

  <ModalDialog v-model="showNotification" title="提示">
    <p>{{ notification }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const sales = reactive([
  { no: 'S-1001', product: '富硒苹果', qty: 20, amount: 1380, client: '百果鲜', status: '待发货' },
  { no: 'S-1002', product: '有机西红柿', qty: 35, amount: 980, client: '供销社', status: '待发货' },
  { no: 'S-1003', product: '鲜鸡蛋', qty: 15, amount: 450, client: '邻里超市', status: '已完成' },
  { no: 'S-1004', product: '冬枣', qty: 12, amount: 560, client: '晨光社区店', status: '已完成' },
  { no: 'S-1005', product: '黄心土豆', qty: 40, amount: 520, client: '田园餐厅', status: '待发货' },
  { no: 'S-1006', product: '菜籽油', qty: 18, amount: 2100, client: '乡味厨房', status: '待收款' },
  { no: 'S-1007', product: '糙米', qty: 26, amount: 910, client: '膳食社', status: '待收款' },
  { no: 'S-1008', product: '藜麦', qty: 10, amount: 780, client: '营养餐吧', status: '已完成' },
  { no: 'S-1009', product: '草莓', qty: 8, amount: 1440, client: '山楂铺子', status: '待收款' },
  { no: 'S-1010', product: '有机胡萝卜', qty: 30, amount: 640, client: '社区团购', status: '已完成' }
]);

const indicators = computed(() => [
  { label: '今日订单', value: sales.length, desc: '含线上+线下' },
  { label: '应收金额', value: `¥${sales.filter((s) => s.status === '待收款').reduce((sum, s) => sum + s.amount, 0).toFixed(2)}`, desc: '待收款金额' },
  { label: '待发货', value: sales.filter((s) => s.status === '待发货').length, desc: '及时安排运输' }
]);

const showSaleForm = ref(false);
const showPayment = ref(false);
const showDelivery = ref(false);
const showNotification = ref(false);

const saleForm = reactive({ product: '', qty: 0, amount: 0, client: '' });
const currentSale = reactive({});
const deliveryForm = reactive({ company: '', time: '' });
const notification = ref('');

const openSaleForm = () => {
  Object.assign(saleForm, { product: '', qty: 0, amount: 0, client: '' });
  showSaleForm.value = true;
};

const openPayment = (sale) => {
  Object.assign(currentSale, sale);
  showPayment.value = true;
};

const openDelivery = (sale) => {
  Object.assign(currentSale, sale);
  Object.assign(deliveryForm, { company: '', time: '' });
  showDelivery.value = true;
};

const openNotification = (text) => {
  notification.value = text;
  showNotification.value = true;
};

const submitSale = () => {
  if (!saleForm.product) return openNotification('请完善销售信息');
  const no = `S-${(sales.length + 1001).toString().padStart(4, '0')}`;
  sales.unshift({ ...saleForm, no, status: '待收款' });
  showSaleForm.value = false;
  openNotification('已登记销售并同步财务');
};

const confirmPayment = () => {
  const idx = sales.findIndex((s) => s.no === currentSale.no);
  if (idx > -1) {
    sales[idx].status = '待发货';
  }
  showPayment.value = false;
  openNotification('收款已确认，进入发货环节');
};

const confirmDelivery = () => {
  const idx = sales.findIndex((s) => s.no === currentSale.no);
  if (idx > -1) {
    sales[idx].status = '已完成';
  }
  showDelivery.value = false;
  openNotification(`已提交发货信息：${deliveryForm.company}`);
};
</script>
