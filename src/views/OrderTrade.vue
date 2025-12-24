<template>
  <div>
    <div class="section-header">
      <div>
        <p class="status-pill">订单交易与履约</p>
        <small>覆盖下单、支付、发货与售后，实时监测履约风险</small>
      </div>
      <div class="nav-links">
        <button class="btn" @click="openModal('create')">创建订单</button>
        <button class="btn secondary" @click="openModal('ship')">批量发货</button>
        <button class="btn secondary" @click="openModal('alert')">时效告警</button>
      </div>
    </div>

    <div class="card-grid" style="margin: 12px 0;">
      <div class="card" v-for="summary in summaries" :key="summary.label">
        <div class="section-header">
          <span>{{ summary.label }}</span>
          <span class="status-pill">{{ summary.tag }}</span>
        </div>
        <p style="font-size: 24px; color: #0b8a5b;">{{ summary.value }}</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: summary.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>订单号</th>
          <th>商品</th>
          <th>买家</th>
          <th>金额</th>
          <th>渠道</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.product }}</td>
          <td>{{ order.buyer }}</td>
          <td>￥{{ order.amount }}</td>
          <td>{{ order.channel }}</td>
          <td><span class="status-pill">{{ order.status }}</span></td>
          <td>
            <button class="btn secondary" @click="openModal('ship', order)">发货</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalDialog v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
      <template v-if="modal.type === 'create'">
        <form class="form-grid" @submit.prevent="createOrder">
          <div>
            <label>商品</label>
            <input v-model="orderForm.product" required placeholder="输入商品名称" />
          </div>
          <div>
            <label>买家姓名</label>
            <input v-model="orderForm.buyer" required />
          </div>
          <div>
            <label>金额</label>
            <input v-model.number="orderForm.amount" type="number" min="1" />
          </div>
          <div>
            <label>渠道</label>
            <select v-model="orderForm.channel">
              <option>小程序</option>
              <option>抖音</option>
              <option>拼多多</option>
              <option>线下团购</option>
            </select>
          </div>
          <button class="btn" type="submit">生成订单</button>
        </form>
      </template>
      <template v-else-if="modal.type === 'ship'">
        <form class="form-grid" @submit.prevent="shipOrder">
          <div>
            <label>承运商</label>
            <select v-model="shipForm.vendor">
              <option>京东物流</option>
              <option>顺丰冷链</option>
              <option>邮政快递</option>
            </select>
          </div>
          <div>
            <label>运单号</label>
            <input v-model="shipForm.code" required />
          </div>
          <button class="btn" type="submit">确认发货</button>
        </form>
      </template>
      <template v-else>
        <p>履约时效监控，正在生成预警列表。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: alertProgress + '%' }"></div>
        </div>
        <p style="margin-top: 8px;">已处理 {{ alertProgress }}% 异常订单</p>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const summaries = [
  { label: '今日成交', value: '￥68,320', tag: '支付成功', progress: 78 },
  { label: '履约及时率', value: '96%', tag: '24h 送达', progress: 96 },
  { label: '售后处理', value: '12 单', tag: '2 单待跟进', progress: 60 }
];

const orders = reactive([
  { id: 'DY20240501', product: '富硒大米 5kg', buyer: '李想', amount: 89, channel: '抖音', status: '待发货' },
  { id: 'XC20240502', product: '脐橙礼盒', buyer: '张敏', amount: 68, channel: '小程序', status: '待发货' },
  { id: 'PDD20240503', product: '山茶油 2L', buyer: '刘霞', amount: 139, channel: '拼多多', status: '在途' },
  { id: 'DY20240504', product: '紫薯山药粉', buyer: '王强', amount: 59, channel: '抖音', status: '在途' },
  { id: 'TG20240505', product: '无抗跑山鸡', buyer: '乡邻团', amount: 99, channel: '线下团购', status: '已签收' },
  { id: 'XC20240506', product: '高山云雾绿茶', buyer: '李婷', amount: 129, channel: '小程序', status: '待发货' },
  { id: 'DY20240507', product: '老坛酸菜鱼套装', buyer: '赵冬', amount: 79, channel: '抖音', status: '待发货' },
  { id: 'PDD20240508', product: '手工苎麻布', buyer: '黄威', amount: 59, channel: '拼多多', status: '在途' },
  { id: 'TG20240509', product: '散养土鸡蛋', buyer: '社群团', amount: 69, channel: '线下团购', status: '待发货' },
  { id: 'XC20240510', product: '农家蜂蜜 1kg', buyer: '吴伟', amount: 89, channel: '小程序', status: '待发货' }
]);

const modal = reactive({ visible: false, type: 'create', title: '订单操作' });
const orderForm = reactive({ product: '', buyer: '', amount: 88, channel: '小程序' });
const shipForm = reactive({ vendor: '京东物流', code: '' });
const alertProgress = ref(20);

const openModal = (type) => {
  modal.visible = true;
  modal.type = type;
  modal.title = type === 'create' ? '创建订单' : type === 'ship' ? '批量发货' : '履约告警';
  if (type === 'alert') {
    alertProgress.value = 20;
    const timer = setInterval(() => {
      if (alertProgress.value >= 100) {
        clearInterval(timer);
      } else {
        alertProgress.value += 18;
      }
    }, 600);
  }
};

const createOrder = () => {
  orders.unshift({
    id: `XC${Date.now()}`,
    product: orderForm.product,
    buyer: orderForm.buyer,
    amount: orderForm.amount,
    channel: orderForm.channel,
    status: '待发货'
  });
  modal.visible = false;
};

const shipOrder = () => {
  const target = orders.find((o) => o.status === '待发货');
  if (target) {
    target.status = `已发货 · ${shipForm.vendor}`;
  }
  modal.visible = false;
};
</script>
