<template>
  <div class="page">
    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3>订单与交易（20条+）</h3>
          <p class="muted-text">覆盖下单、支付、履约、售后全链路</p>
        </div>
        <div class="table-actions">
          <button @click="openExport">导出流水</button>
          <button @click="openDispatch">催发货</button>
          <button @click="openAfterSale">售后处理</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>订单号</th>
            <th>买家</th>
            <th>金额</th>
            <th>配送</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.user }}</td>
            <td>¥{{ order.amount }}</td>
            <td>{{ order.ship }}</td>
            <td><span class="badge" :class="order.stateClass">{{ order.state }}</span></td>
            <td class="table-actions">
              <button @click="openTrace(order)">轨迹</button>
              <button @click="openModify(order)">改址</button>
              <button @click="openClose(order)">关闭</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-grid">
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800;">履约进度</div>
            <div class="muted-text">揽收-签收</div>
          </div>
          <button @click="openFulfill">批量催派</button>
        </div>
        <div class="progress-bar" style="height:14px;margin-top:10px;"><span style="width:72%"></span></div>
        <p class="muted-text">近 24h 已完成 72%，超时件已自动升级客服。</p>
      </div>
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800;">退款处理</div>
            <div class="muted-text">待审核退款单</div>
          </div>
          <button @click="openRefund">批量审核</button>
        </div>
        <div class="bar-chart" style="grid-template-columns:repeat(5,1fr);height:120px;">
          <div v-for="(h, idx) in refundBars" :key="idx" class="bar" :style="{ height: h + 'px' }"></div>
        </div>
      </div>
    </div>

    <Modal v-if="exportModal" title="导出流水" @close="exportModal = false">
      <form @submit.prevent="exportModal = false" style="display:grid;gap:10px;">
        <label>时间范围</label>
        <select required>
          <option>今日</option>
          <option>近7日</option>
          <option>近30日</option>
        </select>
        <div class="progress-bar" style="height:14px;">
          <span style="width:40%"></span>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="exportModal = false">取消</button>
          <button type="submit">开始导出</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="dispatchModal" title="催发货" @close="dispatchModal = false">
      <form @submit.prevent="dispatchModal = false" style="display:grid;gap:10px;">
        <select required>
          <option>全部发货仓</option>
          <option>冷链仓</option>
          <option>产地直发</option>
        </select>
        <textarea rows="3" placeholder="附加提醒，如：乡镇节前备货，请提前装车"></textarea>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="dispatchModal = false">取消</button>
          <button type="submit">发送催发</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="afterSaleModal" title="售后处理" @close="afterSaleModal = false">
      <p>为退款、退货、补寄场景提供统一配置。</p>
      <div class="progress-bar" style="height:14px;margin:10px 0;">
        <span style="width:65%"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="afterSaleModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="traceModal" :title="'物流轨迹 - ' + activeOrder?.id" @close="traceModal = false">
      <ul style="padding-left:18px;">
        <li>已揽收 - {{ activeOrder?.ship }}</li>
        <li>干线运输中 - 预计今日 18:00 抵达分拨</li>
        <li>派送中 - 已分配乡镇骑手</li>
      </ul>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="traceModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="modifyModal" :title="'改址 - ' + activeOrder?.id" @close="modifyModal = false">
      <form @submit.prevent="modifyModal = false" style="display:grid;gap:10px;">
        <input placeholder="新收货地址" required />
        <textarea rows="2" placeholder="补充门牌、电话"></textarea>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="modifyModal = false">取消</button>
          <button type="submit">确认改址</button>
        </div>
      </form>
    </Modal>

    <Modal v-if="closeModal" :title="'关闭订单 - ' + activeOrder?.id" @close="closeModal = false">
      <p>关闭后将退款，是否继续？</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="closeModal = false">取消</button>
        <button @click="closeModal = false">确认关闭</button>
      </div>
    </Modal>

    <Modal v-if="fulfillModal" title="批量催派" @close="fulfillModal = false">
      <p>根据超时件自动生成催派单。</p>
      <div class="progress-bar" style="height:14px;margin:8px 0;">
        <span style="width:70%"></span>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button @click="fulfillModal = false">关闭</button>
      </div>
    </Modal>

    <Modal v-if="refundModal" title="批量审核退款" @close="refundModal = false">
      <form @submit.prevent="refundModal = false" style="display:grid;gap:10px;">
        <label>审核结论</label>
        <select required>
          <option>同意退款</option>
          <option>补偿优惠券</option>
          <option>拒绝并说明</option>
        </select>
        <textarea rows="3" placeholder="补充说明"></textarea>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" @click="refundModal = false">取消</button>
          <button type="submit">提交</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const orders = reactive([
  { id: 'NO202401', user: '李想', amount: 129.8, ship: '产地直发', state: '待揽收', stateClass: 'warn' },
  { id: 'NO202402', user: '张明', amount: 86.4, ship: '冷链仓', state: '运输中', stateClass: 'info' },
  { id: 'NO202403', user: '王雪', amount: 203.2, ship: '产地直发', state: '派送中', stateClass: 'info' },
  { id: 'NO202404', user: '刘刚', amount: 45.3, ship: '中心仓', state: '已完成', stateClass: 'success' },
  { id: 'NO202405', user: '黄敏', amount: 67.8, ship: '中心仓', state: '待揽收', stateClass: 'warn' },
  { id: 'NO202406', user: '赵云', amount: 188.6, ship: '冷链仓', state: '运输中', stateClass: 'info' },
  { id: 'NO202407', user: '陈静', amount: 78.2, ship: '产地直发', state: '派送中', stateClass: 'info' },
  { id: 'NO202408', user: '彭磊', amount: 54.1, ship: '中心仓', state: '已完成', stateClass: 'success' },
  { id: 'NO202409', user: '梁爽', amount: 132.9, ship: '中心仓', state: '待揽收', stateClass: 'warn' },
  { id: 'NO202410', user: '周倩', amount: 98.7, ship: '冷链仓', state: '运输中', stateClass: 'info' },
  { id: 'NO202411', user: '魏峰', amount: 65.0, ship: '产地直发', state: '派送中', stateClass: 'info' },
  { id: 'NO202412', user: '韩梅', amount: 142.3, ship: '中心仓', state: '已完成', stateClass: 'success' },
  { id: 'NO202413', user: '宋宁', amount: 77.6, ship: '中心仓', state: '待揽收', stateClass: 'warn' },
  { id: 'NO202414', user: '钱进', amount: 154.9, ship: '冷链仓', state: '运输中', stateClass: 'info' },
  { id: 'NO202415', user: '吴倩', amount: 121.1, ship: '产地直发', state: '派送中', stateClass: 'info' },
  { id: 'NO202416', user: '张萍', amount: 63.4, ship: '中心仓', state: '已完成', stateClass: 'success' },
  { id: 'NO202417', user: '邓山', amount: 211.0, ship: '中心仓', state: '待揽收', stateClass: 'warn' },
  { id: 'NO202418', user: '郑悦', amount: 89.9, ship: '冷链仓', state: '运输中', stateClass: 'info' },
  { id: 'NO202419', user: '郭海', amount: 72.5, ship: '产地直发', state: '派送中', stateClass: 'info' },
  { id: 'NO202420', user: '杨波', amount: 134.2, ship: '中心仓', state: '已完成', stateClass: 'success' },
  { id: 'NO202421', user: '童亮', amount: 99.9, ship: '中心仓', state: '运输中', stateClass: 'info' }
]);

const refundBars = [120, 100, 140, 90, 110];

const exportModal = ref(false);
const dispatchModal = ref(false);
const afterSaleModal = ref(false);
const traceModal = ref(false);
const modifyModal = ref(false);
const closeModal = ref(false);
const fulfillModal = ref(false);
const refundModal = ref(false);
const activeOrder = ref(null);

const openExport = () => { exportModal.value = true; };
const openDispatch = () => { dispatchModal.value = true; };
const openAfterSale = () => { afterSaleModal.value = true; };
const openTrace = (order) => { activeOrder.value = order; traceModal.value = true; };
const openModify = (order) => { activeOrder.value = order; modifyModal.value = true; };
const openClose = (order) => { activeOrder.value = order; closeModal.value = true; };
const openFulfill = () => { fulfillModal.value = true; };
const openRefund = () => { refundModal.value = true; };
</script>
