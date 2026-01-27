<template>
  <section>
    <div class="card-grid">
      <div class="card" v-for="item in stats" :key="item.label">
        <h3>{{ item.label }}</h3>
        <div class="value">{{ item.value }}</div>
        <p>{{ item.note }}</p>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>订单状态与支付物流</h2>
        <div class="button-group">
          <button class="btn" type="button" @click="openFormModal('新建订单')">新建订单</button>
          <button class="btn secondary" type="button" @click="openProgressModal('批量发货')">批量发货</button>
          <button class="btn ghost" type="button" @click="openNoticeModal('售后提醒')">售后提醒</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>订单编号</th>
              <th>客户</th>
              <th>支付方式</th>
              <th>物流</th>
              <th>金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.customer }}</td>
              <td>{{ order.payment }}</td>
              <td>{{ order.delivery }}</td>
              <td>{{ order.amount }}</td>
              <td>
                <span :class="['status', order.statusClass]">{{ order.status }}</span>
              </td>
              <td>
                <div class="button-group">
                  <button class="btn secondary" type="button" @click="openFormModal('订单处理')">处理</button>
                  <button class="btn" type="button" @click="openProgressModal('支付校验')">支付</button>
                  <button class="btn ghost" type="button" @click="openNoticeModal('退换货')">退换</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Modal :show="modal.show" :title="modal.title" @close="closeModal">
      <p>{{ modal.message }}</p>
      <div v-if="modal.formType" class="form-grid">
        <div>
          <label>客户名称</label>
          <input type="text" placeholder="输入客户名称" />
        </div>
        <div>
          <label>订单金额</label>
          <input type="text" placeholder="输入金额" />
        </div>
        <div>
          <label>发货仓库</label>
          <select>
            <option>华东中心仓</option>
            <option>华南中心仓</option>
            <option>华北中心仓</option>
          </select>
        </div>
      </div>
      <div v-if="modal.showProgress" class="progress-bar">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <template #footer>
        <button class="btn secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import Modal from '../components/Modal.vue';

const stats = [
  { label: '今日订单', value: '328', note: '待处理 46' },
  { label: '已完成', value: '1,246', note: '本周累计' },
  { label: '退款申请', value: '18', note: '需要审核' },
  { label: '履约准时率', value: '96.4%', note: '目标 95%' }
];

const orders = Array.from({ length: 20 }, (_, index) => ({
  id: `PO-2024-${String(index + 11).padStart(3, '0')}`,
  customer: `连锁店${index + 1}`,
  payment: ['线上支付', '对公转账', '分期付款'][index % 3],
  delivery: ['顺丰速运', '京东物流', '自有车队'][index % 3],
  amount: `¥${(9800 + index * 360).toLocaleString()}`,
  status: ['待付款', '已付款', '已发货'][index % 3],
  statusClass: ['warning', '', ''][index % 3]
}));

const modal = reactive({
  show: false,
  title: '',
  message: '',
  formType: false,
  showProgress: false,
  progress: 64
});

const openFormModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `请补充${action}的支付、发货与售后信息。`;
  modal.formType = true;
  modal.showProgress = false;
};

const openProgressModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `系统正在执行${action}流程，请稍候。`;
  modal.formType = false;
  modal.showProgress = true;
  modal.progress = action === '支付校验' ? 58 : 83;
};

const openNoticeModal = (action) => {
  modal.show = true;
  modal.title = action;
  modal.message = `提示：${action}将关联客户满意度与退款状态。`;
  modal.formType = false;
  modal.showProgress = false;
};

const closeModal = () => {
  modal.show = false;
};
</script>
