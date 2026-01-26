<template>
  <section class="module">
    <div class="metrics">
      <div class="metric-card">
        <h4>在途车辆</h4>
        <p>38 辆</p>
        <span>今日发车 12 辆</span>
      </div>
      <div class="metric-card">
        <h4>准时配送率</h4>
        <p>94.7%</p>
        <span>延误订单 6 单</span>
      </div>
      <div class="metric-card">
        <h4>平均运输时长</h4>
        <p>2.8 天</p>
        <span>较上周缩短 0.3 天</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>物流管理操作</h3>
        <div class="actions">
          <button class="primary" @click="openModal('dispatch')">运输调度</button>
          <button class="secondary" @click="openModal('route')">路线优化</button>
          <button class="secondary" @click="openModal('track')">实时跟踪</button>
          <button class="secondary" @click="openModal('delivery')">配送管理</button>
          <button class="ghost" @click="openModal('progress')">运输进度</button>
          <button class="ghost" @click="openModal('tips')">提示信息</button>
        </div>
      </div>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-header">
            <h4>线路准时率</h4>
            <span>本周</span>
          </div>
          <div class="bar-chart">
            <div v-for="line in routes" :key="line.name" class="bar-item">
              <div class="bar" :style="{ height: line.rate + '%' }"></div>
              <span>{{ line.name }}</span>
            </div>
          </div>
        </div>
        <div class="table-card">
          <div class="table-header">
            <h4>运输任务列表</h4>
            <button class="primary" @click="openModal('dispatch')">新增调度</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>任务编号</th>
                <th>线路</th>
                <th>车辆</th>
                <th>司机</th>
                <th>状态</th>
                <th>预计到达</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in tasks" :key="task.id">
                <td>{{ task.id }}</td>
                <td>{{ task.route }}</td>
                <td>{{ task.truck }}</td>
                <td>{{ task.driver }}</td>
                <td>{{ task.status }}</td>
                <td>{{ task.eta }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <ModalBase :open="modals.dispatch" title="运输调度" @close="closeModal('dispatch')">
    <form class="form-grid" @submit.prevent="dispatchTransport">
      <label>
        发运线路
        <select v-model="dispatchForm.route">
          <option>华东 → 华南</option>
          <option>华北 → 西部</option>
          <option>华南 → 华中</option>
        </select>
      </label>
      <label>
        车辆编号
        <input v-model="dispatchForm.truck" placeholder="浙A-6189" />
      </label>
      <label>
        司机
        <input v-model="dispatchForm.driver" placeholder="请输入司机" />
      </label>
      <label>
        预计出发时间
        <input v-model="dispatchForm.depart" type="datetime-local" />
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('dispatch')">取消</button>
      <button class="primary" @click="dispatchTransport">确认调度</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.route" title="路线优化" @close="closeModal('route')">
    <form class="form-grid" @submit.prevent="optimizeRoute">
      <label>
        目标线路
        <select v-model="routeForm.route">
          <option>华东 → 华南</option>
          <option>华北 → 西部</option>
          <option>华南 → 华中</option>
        </select>
      </label>
      <label>
        优化策略
        <select v-model="routeForm.strategy">
          <option>缩短时间</option>
          <option>降低成本</option>
          <option>减少碳排</option>
        </select>
      </label>
      <label>
        备注
        <textarea v-model="routeForm.note" rows="3" placeholder="填写优化说明"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('route')">关闭</button>
      <button class="primary" @click="optimizeRoute">保存方案</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.track" title="实时跟踪" @close="closeModal('track')">
    <form class="form-grid" @submit.prevent="trackShipment">
      <label>
        任务编号
        <input v-model="trackForm.id" placeholder="TRK-2024-021" />
      </label>
      <label>
        当前定位
        <input v-model="trackForm.location" placeholder="湖南长沙" />
      </label>
      <label>
        预计到达
        <input v-model="trackForm.eta" type="datetime-local" />
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('track')">关闭</button>
      <button class="primary" @click="trackShipment">更新轨迹</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.delivery" title="配送管理" @close="closeModal('delivery')">
    <form class="form-grid" @submit.prevent="manageDelivery">
      <label>
        配送订单
        <input v-model="deliveryForm.order" placeholder="ORD-2024-017" />
      </label>
      <label>
        配送方式
        <select v-model="deliveryForm.method">
          <option>直营网点配送</option>
          <option>第三方配送</option>
          <option>冷链配送</option>
        </select>
      </label>
      <label>
        配送员
        <input v-model="deliveryForm.courier" placeholder="请输入配送员" />
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('delivery')">取消</button>
      <button class="primary" @click="manageDelivery">确认安排</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.progress" title="运输进度" @close="closeModal('progress')">
    <div class="progress-block">
      <p>TRK-2024-021 华东 → 华南线路</p>
      <div class="progress">
        <div class="progress-bar" style="width: 64%"></div>
      </div>
      <ul>
        <li>装车完成：已完成</li>
        <li>途中停靠：进行中</li>
        <li>预计到达：18 小时后</li>
      </ul>
    </div>
    <template #footer>
      <button class="primary" @click="closeModal('progress')">知道了</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.tips" title="物流提示" @close="closeModal('tips')">
    <p>建议对高价值订单选择双司机保障，并在路线优化后同步司机与仓库。</p>
    <template #footer>
      <button class="primary" @click="closeModal('tips')">确认</button>
    </template>
  </ModalBase>
</template>

<script setup>
import { reactive } from "vue";
import ModalBase from "../components/ModalBase.vue";

const modals = reactive({
  dispatch: false,
  route: false,
  track: false,
  delivery: false,
  progress: false,
  tips: false
});

const tasks = [
  { id: "TRK-2024-001", route: "华东 → 华南", truck: "沪A-3621", driver: "刘斌", status: "运输中", eta: "06-12 18:00" },
  { id: "TRK-2024-002", route: "华北 → 西部", truck: "京B-7845", driver: "陈琳", status: "待发车", eta: "06-13 09:00" },
  { id: "TRK-2024-003", route: "华南 → 华中", truck: "粤C-2231", driver: "周航", status: "运输中", eta: "06-12 20:30" },
  { id: "TRK-2024-004", route: "华东 → 华北", truck: "鲁A-9987", driver: "王敏", status: "已完成", eta: "06-11 16:00" },
  { id: "TRK-2024-005", route: "华中 → 西部", truck: "鄂B-4421", driver: "卢杰", status: "运输中", eta: "06-13 22:00" },
  { id: "TRK-2024-006", route: "华南 → 华东", truck: "粤A-1456", driver: "高林", status: "待装车", eta: "06-12 12:00" },
  { id: "TRK-2024-007", route: "华北 → 华南", truck: "冀C-7812", driver: "陆莹", status: "运输中", eta: "06-14 08:00" },
  { id: "TRK-2024-008", route: "华东 → 西部", truck: "沪B-3312", driver: "杜鹏", status: "运输中", eta: "06-15 09:00" },
  { id: "TRK-2024-009", route: "华南 → 西部", truck: "粤B-5621", driver: "梁佳", status: "待发车", eta: "06-13 15:30" },
  { id: "TRK-2024-010", route: "华北 → 华中", truck: "晋A-2245", driver: "曹宁", status: "运输中", eta: "06-12 23:00" },
  { id: "TRK-2024-011", route: "华东 → 华南", truck: "浙A-7782", driver: "许雨", status: "运输中", eta: "06-13 01:00" },
  { id: "TRK-2024-012", route: "华中 → 华南", truck: "鄂A-9912", driver: "丁飞", status: "已完成", eta: "06-11 10:00" },
  { id: "TRK-2024-013", route: "华北 → 华东", truck: "京A-4219", driver: "方洁", status: "运输中", eta: "06-14 13:00" },
  { id: "TRK-2024-014", route: "华南 → 华东", truck: "粤D-1088", driver: "彭强", status: "待发车", eta: "06-13 18:00" },
  { id: "TRK-2024-015", route: "华东 → 华北", truck: "苏B-6677", driver: "沈杰", status: "运输中", eta: "06-12 21:00" },
  { id: "TRK-2024-016", route: "华中 → 西部", truck: "湘A-5566", driver: "孙志", status: "运输中", eta: "06-15 07:30" },
  { id: "TRK-2024-017", route: "华南 → 华北", truck: "粤A-8833", driver: "何澜", status: "待装车", eta: "06-14 09:00" },
  { id: "TRK-2024-018", route: "华北 → 华东", truck: "津B-2201", driver: "胡亮", status: "运输中", eta: "06-13 17:00" },
  { id: "TRK-2024-019", route: "华东 → 西部", truck: "沪C-7712", driver: "秦可", status: "运输中", eta: "06-15 11:00" },
  { id: "TRK-2024-020", route: "华中 → 华南", truck: "赣A-3330", driver: "姚青", status: "已完成", eta: "06-10 16:00" }
];

const routes = [
  { name: "华东-华南", rate: 88 },
  { name: "华北-西部", rate: 76 },
  { name: "华南-华中", rate: 82 },
  { name: "华中-西部", rate: 68 }
];

const dispatchForm = reactive({
  route: "华东 → 华南",
  truck: "浙A-6189",
  driver: "李飞",
  depart: "2024-06-12T09:00"
});

const routeForm = reactive({
  route: "华东 → 华南",
  strategy: "缩短时间",
  note: "优先选择高速路线，避开施工路段。"
});

const trackForm = reactive({
  id: "TRK-2024-021",
  location: "湖南长沙",
  eta: "2024-06-13T08:00"
});

const deliveryForm = reactive({
  order: "ORD-2024-017",
  method: "第三方配送",
  courier: "王磊"
});

const openModal = (key) => {
  modals[key] = true;
};

const closeModal = (key) => {
  modals[key] = false;
};

const dispatchTransport = () => {
  modals.dispatch = false;
};

const optimizeRoute = () => {
  modals.route = false;
};

const trackShipment = () => {
  modals.track = false;
};

const manageDelivery = () => {
  modals.delivery = false;
};
</script>

<style scoped>
@import "./shared-module.css";
</style>
