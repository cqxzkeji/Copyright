<template>
  <div class="module">
    <div class="summary-grid">
      <div class="card highlight">
        <div class="label">今日订单</div>
        <div class="value">1,248 单</div>
        <div class="hint">已发货 860 单</div>
      </div>
      <div class="card">
        <div class="label">履约准时率</div>
        <div class="value">96.8%</div>
        <div class="hint">目标 95%</div>
      </div>
      <div class="card">
        <div class="label">异常订单</div>
        <div class="value">18 单</div>
        <div class="hint">已处理 12 单</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">订单履约与物流监控</div>
          <div class="panel-sub">集中跟踪订单状态、仓配响应与物流时效。</div>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('form')">批量发货</button>
          <button class="ghost" @click="openModal('progress')">履约进度</button>
          <button class="ghost" @click="openModal('tip')">异常提醒</button>
        </div>
      </div>

      <div class="content-grid">
        <div class="chart">
          <div class="chart-title">近10单履约时效</div>
          <div class="bars">
            <div v-for="item in fulfillment" :key="item.order" class="bar-item">
              <div class="bar" :style="{ height: item.hours * 8 + '%' }"></div>
              <span>{{ item.order }}</span>
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-title">订单清单</div>
          <table>
            <thead>
              <tr>
                <th>订单号</th>
                <th>客户</th>
                <th>商品</th>
                <th>状态</th>
                <th>配送</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orders" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.customer }}</td>
                <td>{{ item.product }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.shipping }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">仓配协同清单</div>
          <div class="panel-sub">多仓库分拣能力与派车计划。</div>
        </div>
        <button class="ghost" @click="openModal('form')">新增配送计划</button>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>仓库</th>
              <th>可用车次</th>
              <th>在途单量</th>
              <th>负责人</th>
              <th>预计完成</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in warehouses" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.trips }}</td>
              <td>{{ item.inTransit }}</td>
              <td>{{ item.owner }}</td>
              <td>{{ item.eta }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modalOpen" class="modal-backdrop">
      <div class="modal">
        <template v-if="modalType === 'form'">
          <h3>批量发货</h3>
          <form class="form">
            <label>订单范围<input type="text" placeholder="输入订单号范围" /></label>
            <label>物流公司<select><option>冷链速达</option><option>顺风鲜配</option><option>同城急送</option></select></label>
            <label>发货时间<input type="datetime-local" /></label>
            <label>备注<input type="text" placeholder="填写备注" /></label>
            <button type="button" class="primary" @click="closeModal">提交发货</button>
          </form>
        </template>
        <template v-else-if="modalType === 'progress'">
          <h3>履约执行进度</h3>
          <p>正在同步 4 个仓库出库进度。</p>
          <div class="progress">
            <div class="progress-bar" :style="{ width: '80%' }"></div>
          </div>
          <button class="primary" @click="closeModal">完成</button>
        </template>
        <template v-else>
          <h3>异常提醒</h3>
          <ul>
            <li>订单 20240321-008 需人工审核。</li>
            <li>冷链温控异常 2 起。</li>
            <li>三号仓库延迟拣货 15 分钟。</li>
          </ul>
          <button class="primary" @click="closeModal">已处理</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const modalOpen = ref(false);
const modalType = ref("form");

const openModal = (type) => {
  modalType.value = type;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const fulfillment = [
  { order: "#01", hours: 6 },
  { order: "#02", hours: 9 },
  { order: "#03", hours: 5 },
  { order: "#04", hours: 12 },
  { order: "#05", hours: 8 },
  { order: "#06", hours: 7 },
  { order: "#07", hours: 10 },
  { order: "#08", hours: 6 },
  { order: "#09", hours: 11 },
  { order: "#10", hours: 9 }
];

const orders = [
  { id: "20240321-001", customer: "张女士", product: "高原草莓", status: "已发货", shipping: "冷链速达" },
  { id: "20240321-002", customer: "刘先生", product: "蜂蜜礼盒", status: "待揽收", shipping: "顺风鲜配" },
  { id: "20240321-003", customer: "何先生", product: "东北大米", status: "已完成", shipping: "同城急送" },
  { id: "20240321-004", customer: "徐女士", product: "菌菇组合", status: "配送中", shipping: "冷链速达" },
  { id: "20240321-005", customer: "吴先生", product: "土鸡蛋", status: "已发货", shipping: "顺风鲜配" },
  { id: "20240321-006", customer: "曹女士", product: "蓝莓礼盒", status: "配送中", shipping: "冷链速达" },
  { id: "20240321-007", customer: "沈先生", product: "有机玉米", status: "已完成", shipping: "同城急送" },
  { id: "20240321-008", customer: "孔女士", product: "阿坝蜂蜜", status: "审核中", shipping: "顺风鲜配" },
  { id: "20240321-009", customer: "陆先生", product: "富硒红薯", status: "已发货", shipping: "冷链速达" },
  { id: "20240321-010", customer: "范女士", product: "坚果礼盒", status: "待揽收", shipping: "同城急送" }
];

const warehouses = [
  { name: "一号仓", trips: "6", inTransit: "120", owner: "赵强", eta: "18:00" },
  { name: "二号仓", trips: "4", inTransit: "86", owner: "刘敏", eta: "17:30" },
  { name: "三号仓", trips: "5", inTransit: "98", owner: "陈宏", eta: "19:10" },
  { name: "冷链仓", trips: "3", inTransit: "65", owner: "杨柳", eta: "20:00" },
  { name: "同城仓", trips: "8", inTransit: "140", owner: "郑楚", eta: "16:40" },
  { name: "礼盒仓", trips: "2", inTransit: "52", owner: "贺宁", eta: "19:30" },
  { name: "西部仓", trips: "3", inTransit: "70", owner: "郭行", eta: "21:00" },
  { name: "东部仓", trips: "4", inTransit: "88", owner: "顾媛", eta: "18:50" },
  { name: "南部仓", trips: "5", inTransit: "95", owner: "邓颖", eta: "20:20" },
  { name: "北部仓", trips: "3", inTransit: "60", owner: "唐琪", eta: "19:40" }
];
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.summary-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.card {
  background: #ffffff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(30, 60, 114, 0.08);
  display: grid;
  gap: 8px;
}

.card.highlight {
  background: linear-gradient(135deg, #e9f3ff, #ffffff);
}

.label {
  font-size: 13px;
  color: #7a8bad;
}

.value {
  font-size: 22px;
  font-weight: 700;
}

.hint {
  font-size: 12px;
  color: #6c7ea0;
}

.panel {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  display: grid;
  gap: 16px;
  box-shadow: 0 12px 30px rgba(30, 60, 114, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.panel-title {
  font-weight: 600;
}

.panel-sub {
  color: #7a8bad;
  font-size: 12px;
  margin-top: 4px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
}

button.primary {
  background: linear-gradient(135deg, #3a7bff, #5ed0ff);
  color: #ffffff;
}

button.ghost {
  background: #f1f5ff;
  color: #35548b;
}

.content-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.chart {
  background: #f8faff;
  border-radius: 16px;
  padding: 16px;
}

.chart-title {
  font-weight: 600;
  margin-bottom: 10px;
}

.bars {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  align-items: end;
  height: 160px;
}

.bar-item {
  display: grid;
  gap: 6px;
  justify-items: center;
  font-size: 11px;
  color: #6b7d9f;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #3a7bff, #a4d8ff);
  border-radius: 6px 6px 2px 2px;
}

.table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th,
.table td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #eef2f8;
}

.table-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal {
  width: min(420px, 90%);
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  display: grid;
  gap: 16px;
}

.form {
  display: grid;
  gap: 12px;
}

.form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #4a5b7c;
}

.form input,
.form select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d7dfef;
  background: #f9fbff;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #eef3ff;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3a7bff, #5ed0ff);
}

@media (max-width: 720px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
