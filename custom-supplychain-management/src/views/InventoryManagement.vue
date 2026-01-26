<template>
  <section class="module">
    <div class="metrics">
      <div class="metric-card">
        <h4>当前库存</h4>
        <p>58,420 件</p>
        <span>安全库存达标率 92%</span>
      </div>
      <div class="metric-card">
        <h4>在途仓库</h4>
        <p>6 个</p>
        <span>今日调度 12 次</span>
      </div>
      <div class="metric-card">
        <h4>预警物料</h4>
        <p>7 种</p>
        <span>待补货 3 种</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>库存管理操作</h3>
        <div class="actions">
          <button class="primary" @click="openModal('monitor')">库存监控</button>
          <button class="secondary" @click="openModal('dispatch')">仓库调度</button>
          <button class="secondary" @click="openModal('alert')">库存预警</button>
          <button class="secondary" @click="openModal('count')">库存盘点</button>
          <button class="ghost" @click="openModal('progress')">调度进度</button>
          <button class="ghost" @click="openModal('tips')">提示信息</button>
        </div>
      </div>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-header">
            <h4>重点物料库存</h4>
            <span>单位：件</span>
          </div>
          <div class="bar-chart">
            <div v-for="item in stockLevels" :key="item.name" class="bar-item">
              <div class="bar" :style="{ height: item.value + '%' }"></div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="table-card">
          <div class="table-header">
            <h4>库存明细</h4>
            <button class="primary" @click="openModal('count')">发起盘点</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>物料编号</th>
                <th>物料名称</th>
                <th>仓库</th>
                <th>现有库存</th>
                <th>安全库存</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in inventory" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.warehouse }}</td>
                <td>{{ item.stock }}</td>
                <td>{{ item.safe }}</td>
                <td>{{ item.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <ModalBase :open="modals.monitor" title="库存监控" @close="closeModal('monitor')">
    <form class="form-grid" @submit.prevent="setMonitor">
      <label>
        选择仓库
        <select v-model="monitorForm.warehouse">
          <option>华东中心仓</option>
          <option>华南集散仓</option>
          <option>西部冷链仓</option>
        </select>
      </label>
      <label>
        重点物料
        <input v-model="monitorForm.material" placeholder="如：高强度钢材" />
      </label>
      <label>
        监控频率
        <select v-model="monitorForm.frequency">
          <option>每小时</option>
          <option>每4小时</option>
          <option>每日</option>
        </select>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('monitor')">取消</button>
      <button class="primary" @click="setMonitor">更新监控</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.dispatch" title="仓库调度" @close="closeModal('dispatch')">
    <form class="form-grid" @submit.prevent="dispatchWarehouse">
      <label>
        调出仓库
        <select v-model="dispatchForm.from">
          <option>华东中心仓</option>
          <option>华北成品仓</option>
          <option>华南集散仓</option>
        </select>
      </label>
      <label>
        调入仓库
        <select v-model="dispatchForm.to">
          <option>华南集散仓</option>
          <option>西部冷链仓</option>
          <option>华北成品仓</option>
        </select>
      </label>
      <label>
        调度数量
        <input v-model="dispatchForm.amount" placeholder="1200" />
      </label>
      <label>
        调度物料
        <input v-model="dispatchForm.material" placeholder="复合包装" />
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('dispatch')">取消</button>
      <button class="primary" @click="dispatchWarehouse">确认调度</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.alert" title="库存预警" @close="closeModal('alert')">
    <form class="form-grid" @submit.prevent="updateAlert">
      <label>
        预警物料
        <input v-model="alertForm.material" placeholder="铝合金板" />
      </label>
      <label>
        预警阈值
        <input v-model="alertForm.threshold" placeholder="低于 800" />
      </label>
      <label>
        通知方式
        <select v-model="alertForm.notify">
          <option>系统通知</option>
          <option>邮件提醒</option>
          <option>短信提醒</option>
        </select>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('alert')">取消</button>
      <button class="primary" @click="updateAlert">保存预警</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.count" title="库存盘点" @close="closeModal('count')">
    <form class="form-grid" @submit.prevent="startCount">
      <label>
        盘点仓库
        <select v-model="countForm.warehouse">
          <option>华东中心仓</option>
          <option>华北成品仓</option>
          <option>西部冷链仓</option>
        </select>
      </label>
      <label>
        盘点范围
        <select v-model="countForm.scope">
          <option>全部物料</option>
          <option>低库存物料</option>
          <option>重点物料</option>
        </select>
      </label>
      <label>
        负责人
        <input v-model="countForm.leader" placeholder="请输入负责人" />
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('count')">取消</button>
      <button class="primary" @click="startCount">开始盘点</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.progress" title="仓库调度进度" @close="closeModal('progress')">
    <div class="progress-block">
      <p>华东中心仓 → 华南集散仓</p>
      <div class="progress">
        <div class="progress-bar" style="width: 58%"></div>
      </div>
      <ul>
        <li>装车准备：完成</li>
        <li>运输在途：进行中</li>
        <li>入库确认：待处理</li>
      </ul>
    </div>
    <template #footer>
      <button class="primary" @click="closeModal('progress')">知道了</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.tips" title="库存操作提示" @close="closeModal('tips')">
    <p>建议对低库存物料设置双重预警，并在盘点后及时更新系统库存记录。</p>
    <template #footer>
      <button class="primary" @click="closeModal('tips')">收到</button>
    </template>
  </ModalBase>
</template>

<script setup>
import { reactive } from "vue";
import ModalBase from "../components/ModalBase.vue";

const modals = reactive({
  monitor: false,
  dispatch: false,
  alert: false,
  count: false,
  progress: false,
  tips: false
});

const inventory = [
  { id: "MAT-001", name: "高强度钢材", warehouse: "华东中心仓", stock: 3200, safe: 2800, status: "充足" },
  { id: "MAT-002", name: "复合包装", warehouse: "华南集散仓", stock: 1600, safe: 1900, status: "预警" },
  { id: "MAT-003", name: "精密轴承", warehouse: "华北成品仓", stock: 980, safe: 900, status: "正常" },
  { id: "MAT-004", name: "铝合金板", warehouse: "华东中心仓", stock: 760, safe: 900, status: "预警" },
  { id: "MAT-005", name: "冷链缓冲剂", warehouse: "西部冷链仓", stock: 520, safe: 600, status: "预警" },
  { id: "MAT-006", name: "光学玻璃", warehouse: "华北成品仓", stock: 1400, safe: 1200, status: "充足" },
  { id: "MAT-007", name: "包装胶带", warehouse: "华南集散仓", stock: 4200, safe: 3500, status: "充足" },
  { id: "MAT-008", name: "密封圈", warehouse: "华北成品仓", stock: 870, safe: 900, status: "预警" },
  { id: "MAT-009", name: "冷链托盘", warehouse: "西部冷链仓", stock: 1120, safe: 1000, status: "正常" },
  { id: "MAT-010", name: "抗压纸箱", warehouse: "华南集散仓", stock: 3200, safe: 2500, status: "充足" },
  { id: "MAT-011", name: "包装泡棉", warehouse: "华东中心仓", stock: 1400, safe: 1500, status: "预警" },
  { id: "MAT-012", name: "工业润滑油", warehouse: "华北成品仓", stock: 650, safe: 700, status: "预警" },
  { id: "MAT-013", name: "电机组件", warehouse: "华东中心仓", stock: 2100, safe: 1800, status: "正常" },
  { id: "MAT-014", name: "不锈钢阀门", warehouse: "华南集散仓", stock: 870, safe: 900, status: "预警" },
  { id: "MAT-015", name: "包装托盘", warehouse: "华北成品仓", stock: 2800, safe: 2000, status: "充足" },
  { id: "MAT-016", name: "抗震泡棉", warehouse: "华东中心仓", stock: 1250, safe: 1100, status: "正常" },
  { id: "MAT-017", name: "精密螺栓", warehouse: "华北成品仓", stock: 780, safe: 900, status: "预警" },
  { id: "MAT-018", name: "耐磨滚轮", warehouse: "华南集散仓", stock: 1380, safe: 1200, status: "正常" },
  { id: "MAT-019", name: "低温传感器", warehouse: "西部冷链仓", stock: 460, safe: 600, status: "预警" },
  { id: "MAT-020", name: "定制标签", warehouse: "华南集散仓", stock: 2300, safe: 2100, status: "充足" }
];

const stockLevels = [
  { name: "钢材", value: 80 },
  { name: "包装", value: 60 },
  { name: "轴承", value: 55 },
  { name: "传感器", value: 35 }
];

const monitorForm = reactive({
  warehouse: "华东中心仓",
  material: "高强度钢材",
  frequency: "每小时"
});

const dispatchForm = reactive({
  from: "华东中心仓",
  to: "华南集散仓",
  amount: "1200",
  material: "复合包装"
});

const alertForm = reactive({
  material: "铝合金板",
  threshold: "低于 800",
  notify: "系统通知"
});

const countForm = reactive({
  warehouse: "华东中心仓",
  scope: "全部物料",
  leader: "张丽"
});

const openModal = (key) => {
  modals[key] = true;
};

const closeModal = (key) => {
  modals[key] = false;
};

const setMonitor = () => {
  modals.monitor = false;
};

const dispatchWarehouse = () => {
  modals.dispatch = false;
};

const updateAlert = () => {
  modals.alert = false;
};

const startCount = () => {
  modals.count = false;
};
</script>

<style scoped>
@import "./shared-module.css";
</style>
