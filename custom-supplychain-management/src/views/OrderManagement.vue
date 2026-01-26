<template>
  <section class="module">
    <div class="metrics">
      <div class="metric-card">
        <h4>本周订单量</h4>
        <p>1,248 单</p>
        <span>客户订单占比 68%</span>
      </div>
      <div class="metric-card">
        <h4>待审批订单</h4>
        <p>36 单</p>
        <span>平均审批时长 2.1 小时</span>
      </div>
      <div class="metric-card">
        <h4>出库完成率</h4>
        <p>93.2%</p>
        <span>今日出库 210 单</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>订单流程操作</h3>
        <div class="actions">
          <button class="primary" @click="openModal('create')">订单创建</button>
          <button class="secondary" @click="openModal('track')">订单追踪</button>
          <button class="secondary" @click="openModal('approve')">订单审批</button>
          <button class="secondary" @click="openModal('ship')">订单出库</button>
          <button class="ghost" @click="openModal('progress')">履约进度</button>
          <button class="ghost" @click="openModal('tips')">提示信息</button>
        </div>
      </div>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-header">
            <h4>订单履约率走势</h4>
            <span>最近 7 天</span>
          </div>
          <svg class="line-chart" viewBox="0 0 300 160">
            <polyline
              points="10,120 60,95 110,105 160,70 210,60 260,50 290,45"
              fill="none"
              stroke="#2f6bff"
              stroke-width="4"
              stroke-linecap="round"
            />
            <circle v-for="(point, index) in linePoints" :key="index" :cx="point.x" :cy="point.y" r="5" fill="#7aa6ff" />
          </svg>
        </div>
        <div class="table-card">
          <div class="table-header">
            <h4>订单清单</h4>
            <button class="primary" @click="openModal('create')">新增订单</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>订单号</th>
                <th>客户/供应商</th>
                <th>类型</th>
                <th>金额</th>
                <th>状态</th>
                <th>交付日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.partner }}</td>
                <td>{{ order.type }}</td>
                <td>{{ order.amount }}</td>
                <td>{{ order.status }}</td>
                <td>{{ order.delivery }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <ModalBase :open="modals.create" title="订单创建" @close="closeModal('create')">
    <form class="form-grid" @submit.prevent="createOrder">
      <label>
        订单类型
        <select v-model="createForm.type">
          <option>客户订单</option>
          <option>采购订单</option>
          <option>供应商订单</option>
        </select>
      </label>
      <label>
        客户/供应商
        <input v-model="createForm.partner" placeholder="请输入合作方" />
      </label>
      <label>
        金额
        <input v-model="createForm.amount" placeholder="¥ 120,000" />
      </label>
      <label>
        预计交付日期
        <input v-model="createForm.delivery" type="date" />
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('create')">取消</button>
      <button class="primary" @click="createOrder">提交订单</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.track" title="订单追踪" @close="closeModal('track')">
    <form class="form-grid" @submit.prevent="trackOrder">
      <label>
        订单号
        <input v-model="trackForm.id" placeholder="ORD-2024-017" />
      </label>
      <label>
        当前节点
        <select v-model="trackForm.stage">
          <option>生产排期</option>
          <option>备货完成</option>
          <option>配送中</option>
          <option>已签收</option>
        </select>
      </label>
      <label>
        客户反馈
        <textarea v-model="trackForm.feedback" rows="3" placeholder="填写最新反馈"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('track')">关闭</button>
      <button class="primary" @click="trackOrder">更新追踪</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.approve" title="订单审批" @close="closeModal('approve')">
    <form class="form-grid" @submit.prevent="approveOrder">
      <label>
        订单号
        <select v-model="approveForm.id">
          <option v-for="order in orders" :key="order.id" :value="order.id">
            {{ order.id }} - {{ order.partner }}
          </option>
        </select>
      </label>
      <label>
        审批结果
        <select v-model="approveForm.result">
          <option>通过</option>
          <option>需补充资料</option>
          <option>驳回</option>
        </select>
      </label>
      <label>
        审批意见
        <textarea v-model="approveForm.note" rows="3" placeholder="填写审批意见"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('approve')">取消</button>
      <button class="primary" @click="approveOrder">提交审批</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.ship" title="订单出库" @close="closeModal('ship')">
    <form class="form-grid" @submit.prevent="shipOrder">
      <label>
        出库订单
        <select v-model="shipForm.id">
          <option v-for="order in orders" :key="order.id" :value="order.id">
            {{ order.id }} - {{ order.type }}
          </option>
        </select>
      </label>
      <label>
        出库仓库
        <select v-model="shipForm.warehouse">
          <option>华东中心仓</option>
          <option>华南集散仓</option>
          <option>华北成品仓</option>
        </select>
      </label>
      <label>
        物流方式
        <select v-model="shipForm.method">
          <option>整车</option>
          <option>零担</option>
          <option>冷链</option>
        </select>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('ship')">取消</button>
      <button class="primary" @click="shipOrder">确认出库</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.progress" title="订单履约进度" @close="closeModal('progress')">
    <div class="progress-block">
      <p>ORD-2024-017 客户订单履约</p>
      <div class="progress">
        <div class="progress-bar" style="width: 82%"></div>
      </div>
      <ul>
        <li>备货完成：已完成</li>
        <li>出库装车：已完成</li>
        <li>运输在途：进行中</li>
      </ul>
    </div>
    <template #footer>
      <button class="primary" @click="closeModal('progress')">知道了</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.tips" title="订单提示" @close="closeModal('tips')">
    <p>建议对高金额订单进行双人审批，并在出库前再次核对库存占用情况。</p>
    <template #footer>
      <button class="primary" @click="closeModal('tips')">确认</button>
    </template>
  </ModalBase>
</template>

<script setup>
import { reactive } from "vue";
import ModalBase from "../components/ModalBase.vue";

const modals = reactive({
  create: false,
  track: false,
  approve: false,
  ship: false,
  progress: false,
  tips: false
});

const orders = [
  { id: "ORD-2024-001", partner: "华润制造", type: "客户订单", amount: "¥120,000", status: "待审批", delivery: "2024-06-12" },
  { id: "ORD-2024-002", partner: "南方包材", type: "采购订单", amount: "¥86,000", status: "已审批", delivery: "2024-06-14" },
  { id: "ORD-2024-003", partner: "启源原材", type: "供应商订单", amount: "¥92,500", status: "生产中", delivery: "2024-06-18" },
  { id: "ORD-2024-004", partner: "星河科技", type: "客户订单", amount: "¥156,000", status: "备货中", delivery: "2024-06-20" },
  { id: "ORD-2024-005", partner: "锐鹏配件", type: "采购订单", amount: "¥48,200", status: "待审批", delivery: "2024-06-22" },
  { id: "ORD-2024-006", partner: "宏泰运输", type: "供应商订单", amount: "¥36,000", status: "已完成", delivery: "2024-06-05" },
  { id: "ORD-2024-007", partner: "万力制造", type: "客户订单", amount: "¥210,400", status: "运输中", delivery: "2024-06-23" },
  { id: "ORD-2024-008", partner: "蓝海包装", type: "采购订单", amount: "¥63,800", status: "已审批", delivery: "2024-06-17" },
  { id: "ORD-2024-009", partner: "荣达物流", type: "供应商订单", amount: "¥58,000", status: "待确认", delivery: "2024-06-15" },
  { id: "ORD-2024-010", partner: "拓维运输", type: "客户订单", amount: "¥132,000", status: "备货中", delivery: "2024-06-19" },
  { id: "ORD-2024-011", partner: "嘉鸿原材", type: "采购订单", amount: "¥72,000", status: "已审批", delivery: "2024-06-18" },
  { id: "ORD-2024-012", partner: "维达包装", type: "客户订单", amount: "¥98,000", status: "待审批", delivery: "2024-06-24" },
  { id: "ORD-2024-013", partner: "凌云零件", type: "供应商订单", amount: "¥45,300", status: "生产中", delivery: "2024-06-21" },
  { id: "ORD-2024-014", partner: "森科包装", type: "采购订单", amount: "¥54,800", status: "已完成", delivery: "2024-06-10" },
  { id: "ORD-2024-015", partner: "天驰物流", type: "供应商订单", amount: "¥33,200", status: "运输中", delivery: "2024-06-16" },
  { id: "ORD-2024-016", partner: "恒信金属", type: "采购订单", amount: "¥88,900", status: "已审批", delivery: "2024-06-25" },
  { id: "ORD-2024-017", partner: "联盛制造", type: "客户订单", amount: "¥188,000", status: "运输中", delivery: "2024-06-26" },
  { id: "ORD-2024-018", partner: "迅捷供应", type: "采购订单", amount: "¥69,500", status: "待审批", delivery: "2024-06-27" },
  { id: "ORD-2024-019", partner: "宏泰运输", type: "供应商订单", amount: "¥41,700", status: "待确认", delivery: "2024-06-20" },
  { id: "ORD-2024-020", partner: "启源原材", type: "采购订单", amount: "¥90,000", status: "已审批", delivery: "2024-06-28" }
];

const linePoints = [
  { x: 10, y: 120 },
  { x: 60, y: 95 },
  { x: 110, y: 105 },
  { x: 160, y: 70 },
  { x: 210, y: 60 },
  { x: 260, y: 50 },
  { x: 290, y: 45 }
];

const createForm = reactive({
  type: "客户订单",
  partner: "",
  amount: "",
  delivery: "2024-06-30"
});

const trackForm = reactive({
  id: "ORD-2024-017",
  stage: "运输中",
  feedback: "运输途中，预计提前一天送达。"
});

const approveForm = reactive({
  id: orders[0].id,
  result: "通过",
  note: "库存充足，同意审批。"
});

const shipForm = reactive({
  id: orders[0].id,
  warehouse: "华东中心仓",
  method: "整车"
});

const openModal = (key) => {
  modals[key] = true;
};

const closeModal = (key) => {
  modals[key] = false;
};

const createOrder = () => {
  modals.create = false;
};

const trackOrder = () => {
  modals.track = false;
};

const approveOrder = () => {
  modals.approve = false;
};

const shipOrder = () => {
  modals.ship = false;
};
</script>

<style scoped>
@import "./shared-module.css";

.line-chart {
  width: 100%;
  height: 180px;
}
</style>
