<template>
  <div class="module">
    <section class="summary">
      <div class="card">
        <div class="label">巡检计划</div>
        <div class="value">18 条</div>
        <div class="trend">待执行 6 条</div>
      </div>
      <div class="card">
        <div class="label">维护工单</div>
        <div class="value">12 单</div>
        <div class="trend">本周已完成 7 单</div>
      </div>
      <div class="card">
        <div class="label">更换记录</div>
        <div class="value">29 次</div>
        <div class="trend">平均周期 32 天</div>
      </div>
    </section>

    <section class="actions">
      <button class="primary" @click="openModal('plan')">新增巡检计划</button>
      <button class="ghost" @click="openModal('order')">创建维护工单</button>
      <button class="ghost" @click="openModal('replace')">登记更换记录</button>
      <button class="ghost" @click="openModal('progress')">工单执行进度</button>
      <button class="ghost" @click="openModal('tip')">按钮提示信息</button>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">巡检执行率</div>
        <div class="panel-subtitle">近六周巡检完成率</div>
      </div>
      <div class="chart">
        <div v-for="item in chartData" :key="item.week" class="bar">
          <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
          <span>{{ item.week }}</span>
          <em>{{ item.value }}%</em>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">巡检与维护工单列表</div>
        <div class="panel-subtitle">表数据共 {{ tasks.length }} 条</div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>工单号</th>
              <th>制品</th>
              <th>计划日期</th>
              <th>责任人</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.item }}</td>
              <td>{{ task.date }}</td>
              <td>{{ task.owner }}</td>
              <td><span class="status" :class="task.statusClass">{{ task.status }}</span></td>
              <td>
                <button class="link" @click="openModal('detail', task)">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal">
        <h3>{{ modal.title }}</h3>
        <p class="modal-message">{{ modal.message }}</p>

        <form v-if="modal.type === 'plan'" class="modal-form">
          <input placeholder="巡检计划名称" />
          <input type="date" />
          <select>
            <option>每日巡检</option>
            <option>每周巡检</option>
            <option>每月巡检</option>
          </select>
        </form>

        <form v-if="modal.type === 'order'" class="modal-form">
          <input placeholder="工单主题" />
          <input placeholder="制品编号" />
          <textarea rows="3" placeholder="维护内容"></textarea>
        </form>

        <form v-if="modal.type === 'replace'" class="modal-form">
          <input placeholder="更换制品编号" />
          <input type="date" />
          <input placeholder="更换原因" />
        </form>

        <div v-if="modal.type === 'progress'" class="progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">工单执行进度 {{ progress }}%</div>
        </div>

        <div class="modal-actions">
          <button class="ghost" @click="closeModal">取消</button>
          <button class="primary" @click="confirmModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const chartData = [
  { week: "W1", value: 78 },
  { week: "W2", value: 82 },
  { week: "W3", value: 76 },
  { week: "W4", value: 88 },
  { week: "W5", value: 84 },
  { week: "W6", value: 91 }
];

const tasks = Array.from({ length: 20 }, (_, index) => ({
  id: `WO-${100 + index}`,
  item: `胶辊-${index + 1}`,
  date: `2024-09-${String((index % 20) + 1).padStart(2, "0")}`,
  owner: ["刘工", "孙工", "周工", "郑工"][index % 4],
  status: index % 3 === 0 ? "待执行" : "进行中",
  statusClass: index % 3 === 0 ? "warn" : "info"
}));

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "",
  payload: null
});

const progress = ref(52);

const openModal = (type, payload = null) => {
  modal.type = type;
  modal.payload = payload;
  modal.visible = true;
  if (type === "plan") {
    modal.title = "新增巡检计划";
    modal.message = "配置巡检频次与执行人。";
  }
  if (type === "order") {
    modal.title = "创建维护工单";
    modal.message = "填写维护内容并指派负责人。";
  }
  if (type === "replace") {
    modal.title = "登记更换记录";
    modal.message = "记录更换时间与原因。";
  }
  if (type === "progress") {
    modal.title = "工单执行进度";
    modal.message = "工单处理进度实时更新。";
  }
  if (type === "detail") {
    modal.title = "工单详情";
    modal.message = `工单 ${payload.id} 状态：${payload.status}，负责人：${payload.owner}。`;
  }
  if (type === "tip") {
    modal.title = "提示信息";
    modal.message = "请在巡检完成后及时提交结果，确保维护闭环。";
  }
};

const closeModal = () => {
  modal.visible = false;
};

const confirmModal = () => {
  modal.visible = false;
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
}

.label {
  color: #64748b;
  font-size: 13px;
}

.value {
  font-size: 24px;
  font-weight: 700;
  margin: 8px 0 4px;
  color: #0f766e;
}

.trend {
  font-size: 12px;
  color: #94a3b8;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary {
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #0f766e;
  color: #fff;
  padding: 0 16px;
  cursor: pointer;
}

.ghost {
  height: 36px;
  border-radius: 10px;
  border: 1px solid #99f6e4;
  background: #f0fdfa;
  color: #115e59;
  padding: 0 16px;
  cursor: pointer;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.panel-title {
  font-weight: 600;
}

.panel-subtitle {
  font-size: 13px;
  color: #94a3b8;
}

.chart {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 16px;
  align-items: end;
}

.bar {
  background: #f1f5f9;
  border-radius: 12px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8px;
  text-align: center;
  font-size: 12px;
  color: #475569;
}

.bar-fill {
  background: linear-gradient(180deg, #5eead4, #0f766e);
  border-radius: 10px;
  width: 100%;
}

.bar span {
  margin-top: 8px;
}

.bar em {
  font-style: normal;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.status {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status.warn {
  background: #fef3c7;
  color: #b45309;
}

.status.info {
  background: #ccfbf1;
  color: #0f766e;
}

.link {
  border: none;
  background: transparent;
  color: #0f766e;
  cursor: pointer;
  padding: 0;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 40;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: min(420px, 100%);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.modal-message {
  color: #475569;
}

.modal-form {
  display: grid;
  gap: 12px;
  margin: 16px 0;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
}

.progress {
  margin: 16px 0;
}

.progress-bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5eead4, #0f766e);
}

.progress-text {
  margin-top: 8px;
  font-size: 13px;
  color: #475569;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
