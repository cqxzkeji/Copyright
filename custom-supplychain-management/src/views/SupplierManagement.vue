<template>
  <section class="module">
    <div class="metrics">
      <div class="metric-card">
        <h4>活跃供应商</h4>
        <p>{{ suppliers.length }} 家</p>
        <span>本月新增 4 家</span>
      </div>
      <div class="metric-card">
        <h4>合同执行率</h4>
        <p>96.4%</p>
        <span>较上月提升 1.8%</span>
      </div>
      <div class="metric-card">
        <h4>绩效等级 A</h4>
        <p>14 家</p>
        <span>优质供应商占比 67%</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>供应商操作</h3>
        <div class="actions">
          <button class="primary" @click="openModal('onboard')">供应商入驻</button>
          <button class="secondary" @click="openModal('maintain')">信息维护</button>
          <button class="secondary" @click="openModal('evaluate')">绩效评估</button>
          <button class="secondary" @click="openModal('contract')">合同管理</button>
          <button class="ghost" @click="openModal('progress')">进度追踪</button>
          <button class="ghost" @click="openModal('tips')">提示信息</button>
        </div>
      </div>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-header">
            <h4>供应商绩效分布</h4>
            <span>最新评分</span>
          </div>
          <div class="bar-chart">
            <div v-for="item in performance" :key="item.level" class="bar-item">
              <div class="bar" :style="{ height: item.value + '%' }"></div>
              <span>{{ item.level }}</span>
            </div>
          </div>
        </div>
        <div class="table-card">
          <div class="table-header">
            <h4>供应商清单</h4>
            <button class="primary" @click="openModal('onboard')">新增供应商</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>编号</th>
                <th>名称</th>
                <th>类别</th>
                <th>负责人</th>
                <th>绩效</th>
                <th>合同状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="supplier in suppliers" :key="supplier.id">
                <td>{{ supplier.id }}</td>
                <td>{{ supplier.name }}</td>
                <td>{{ supplier.type }}</td>
                <td>{{ supplier.manager }}</td>
                <td>{{ supplier.score }}</td>
                <td>{{ supplier.contract }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <ModalBase :open="modals.onboard" title="供应商入驻" @close="closeModal('onboard')">
    <form class="form-grid" @submit.prevent="addSupplier">
      <label>
        供应商名称
        <input v-model="onboardForm.name" placeholder="请输入供应商名称" />
      </label>
      <label>
        品类
        <select v-model="onboardForm.type">
          <option>原材料</option>
          <option>零部件</option>
          <option>包装</option>
          <option>物流服务</option>
        </select>
      </label>
      <label>
        负责人
        <input v-model="onboardForm.manager" placeholder="请输入负责人" />
      </label>
      <label>
        目标绩效
        <input v-model="onboardForm.score" placeholder="A-98" />
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('onboard')">取消</button>
      <button class="primary" @click="addSupplier">确认入驻</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.maintain" title="信息维护" @close="closeModal('maintain')">
    <form class="form-grid" @submit.prevent="updateSupplier">
      <label>
        选择供应商
        <select v-model="maintenanceForm.id">
          <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
            {{ supplier.name }}
          </option>
        </select>
      </label>
      <label>
        联系人
        <input v-model="maintenanceForm.manager" placeholder="更新负责人" />
      </label>
      <label>
        绩效评级
        <select v-model="maintenanceForm.score">
          <option>A-95</option>
          <option>A-90</option>
          <option>B-85</option>
          <option>B-80</option>
        </select>
      </label>
      <label>
        合同状态
        <select v-model="maintenanceForm.contract">
          <option>已签署</option>
          <option>续签中</option>
          <option>待审批</option>
        </select>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('maintain')">关闭</button>
      <button class="primary" @click="updateSupplier">保存更新</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.evaluate" title="绩效评估" @close="closeModal('evaluate')">
    <form class="form-grid" @submit.prevent="evaluateSupplier">
      <label>
        供应商
        <select v-model="evaluationForm.id">
          <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
            {{ supplier.name }}
          </option>
        </select>
      </label>
      <label>
        到货准时率
        <input v-model="evaluationForm.ontime" placeholder="96%" />
      </label>
      <label>
        质量合格率
        <input v-model="evaluationForm.quality" placeholder="99%" />
      </label>
      <label>
        综合评分
        <input v-model="evaluationForm.score" placeholder="A-96" />
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('evaluate')">取消</button>
      <button class="primary" @click="evaluateSupplier">生成评估</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.contract" title="合同管理" @close="closeModal('contract')">
    <form class="form-grid" @submit.prevent="updateContract">
      <label>
        合同编号
        <input v-model="contractForm.code" placeholder="CT-2024-089" />
      </label>
      <label>
        供应商
        <select v-model="contractForm.id">
          <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
            {{ supplier.name }}
          </option>
        </select>
      </label>
      <label>
        到期时间
        <input v-model="contractForm.expire" type="date" />
      </label>
      <label>
        状态
        <select v-model="contractForm.status">
          <option>续签中</option>
          <option>已签署</option>
          <option>待审批</option>
        </select>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('contract')">关闭</button>
      <button class="primary" @click="updateContract">更新合同</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.progress" title="供应商入驻进度" @close="closeModal('progress')">
    <div class="progress-block">
      <p>正在同步供应商准入文件...</p>
      <div class="progress">
        <div class="progress-bar" style="width: 72%"></div>
      </div>
      <ul>
        <li>材料审核：已完成</li>
        <li>现场验厂：进行中</li>
        <li>合同签署：待确认</li>
      </ul>
    </div>
    <template #footer>
      <button class="primary" @click="closeModal('progress')">知道了</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.tips" title="操作提示" @close="closeModal('tips')">
    <p>建议每季度更新供应商绩效评级，并在合同到期前 30 天完成续签提醒。</p>
    <template #footer>
      <button class="primary" @click="closeModal('tips')">好的</button>
    </template>
  </ModalBase>
</template>

<script setup>
import { reactive, ref } from "vue";
import ModalBase from "../components/ModalBase.vue";

const modals = reactive({
  onboard: false,
  maintain: false,
  evaluate: false,
  contract: false,
  progress: false,
  tips: false
});

const suppliers = ref([
  { id: "SUP-001", name: "华东原材", type: "原材料", manager: "赵敏", score: "A-96", contract: "已签署" },
  { id: "SUP-002", name: "南方包材", type: "包装", manager: "李强", score: "A-94", contract: "续签中" },
  { id: "SUP-003", name: "天驰物流", type: "物流服务", manager: "周洋", score: "A-92", contract: "已签署" },
  { id: "SUP-004", name: "北方零件", type: "零部件", manager: "冯雪", score: "B-88", contract: "待审批" },
  { id: "SUP-005", name: "恒信金属", type: "原材料", manager: "韩冰", score: "A-95", contract: "已签署" },
  { id: "SUP-006", name: "星环化工", type: "原材料", manager: "宋毅", score: "A-93", contract: "已签署" },
  { id: "SUP-007", name: "锐鹏配件", type: "零部件", manager: "罗莎", score: "B-86", contract: "续签中" },
  { id: "SUP-008", name: "远航包装", type: "包装", manager: "吕帆", score: "A-90", contract: "已签署" },
  { id: "SUP-009", name: "拓维运输", type: "物流服务", manager: "蒋林", score: "A-91", contract: "已签署" },
  { id: "SUP-010", name: "启源原材", type: "原材料", manager: "许诺", score: "A-97", contract: "已签署" },
  { id: "SUP-011", name: "迅捷供应", type: "零部件", manager: "陈凯", score: "B-84", contract: "待审批" },
  { id: "SUP-012", name: "蓝海包装", type: "包装", manager: "吴昕", score: "A-92", contract: "续签中" },
  { id: "SUP-013", name: "万力制造", type: "零部件", manager: "刘洋", score: "A-95", contract: "已签署" },
  { id: "SUP-014", name: "荣达物流", type: "物流服务", manager: "冯晨", score: "A-93", contract: "已签署" },
  { id: "SUP-015", name: "嘉鸿原材", type: "原材料", manager: "张雅", score: "A-96", contract: "续签中" },
  { id: "SUP-016", name: "森科包装", type: "包装", manager: "周亚", score: "B-85", contract: "已签署" },
  { id: "SUP-017", name: "凌云零件", type: "零部件", manager: "胡颖", score: "A-94", contract: "待审批" },
  { id: "SUP-018", name: "宏泰运输", type: "物流服务", manager: "曹阳", score: "A-90", contract: "已签署" },
  { id: "SUP-019", name: "裕丰材料", type: "原材料", manager: "孟珊", score: "A-92", contract: "已签署" },
  { id: "SUP-020", name: "维达包装", type: "包装", manager: "林萱", score: "B-87", contract: "续签中" }
]);

const performance = [
  { level: "A+", value: 80 },
  { level: "A", value: 70 },
  { level: "B", value: 55 },
  { level: "C", value: 35 }
];

const onboardForm = reactive({
  name: "",
  type: "原材料",
  manager: "",
  score: "A-96"
});

const maintenanceForm = reactive({
  id: suppliers.value[0].id,
  manager: "",
  score: "A-95",
  contract: "已签署"
});

const evaluationForm = reactive({
  id: suppliers.value[0].id,
  ontime: "96%",
  quality: "99%",
  score: "A-96"
});

const contractForm = reactive({
  id: suppliers.value[0].id,
  code: "CT-2024-089",
  expire: "2024-12-31",
  status: "续签中"
});

const openModal = (key) => {
  modals[key] = true;
};

const closeModal = (key) => {
  modals[key] = false;
};

const addSupplier = () => {
  if (!onboardForm.name) {
    return;
  }
  suppliers.value.unshift({
    id: `SUP-${String(suppliers.value.length + 1).padStart(3, "0")}`,
    name: onboardForm.name,
    type: onboardForm.type,
    manager: onboardForm.manager || "待分配",
    score: onboardForm.score,
    contract: "待审批"
  });
  onboardForm.name = "";
  onboardForm.manager = "";
  modals.onboard = false;
};

const updateSupplier = () => {
  const target = suppliers.value.find((item) => item.id === maintenanceForm.id);
  if (target) {
    target.manager = maintenanceForm.manager || target.manager;
    target.score = maintenanceForm.score;
    target.contract = maintenanceForm.contract;
  }
  modals.maintain = false;
};

const evaluateSupplier = () => {
  const target = suppliers.value.find((item) => item.id === evaluationForm.id);
  if (target) {
    target.score = evaluationForm.score;
  }
  modals.evaluate = false;
};

const updateContract = () => {
  const target = suppliers.value.find((item) => item.id === contractForm.id);
  if (target) {
    target.contract = contractForm.status;
  }
  modals.contract = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.metric-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.metric-card h4 {
  margin: 0 0 12px;
  color: #5b6475;
  font-weight: 600;
}

.metric-card p {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
}

.metric-card span {
  color: #8a93a5;
  font-size: 13px;
}

.panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.panel-header h3 {
  margin: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary {
  background: #2f6bff;
  border: none;
  color: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.secondary {
  background: #eef2f7;
  border: none;
  color: #2b3445;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.ghost {
  background: #ffffff;
  border: 1px solid #d7e0ef;
  color: #2b3445;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.panel-body {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) 2fr;
  gap: 20px;
}

.chart,
.table-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.bar-chart {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  height: 180px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #4f87ff, #89b4ff);
  border-radius: 10px 10px 4px 4px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-card th,
.table-card td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e4e9f2;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-weight: 500;
}

.form-grid input,
.form-grid select {
  border: 1px solid #d7e0ef;
  border-radius: 10px;
  padding: 8px 10px;
}

.progress-block {
  display: grid;
  gap: 12px;
  color: #4b5563;
}

.progress {
  background: #e4e9f2;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #79a6ff);
}

@media (max-width: 1100px) {
  .panel-body {
    grid-template-columns: 1fr;
  }
}
</style>
