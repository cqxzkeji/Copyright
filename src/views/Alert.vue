<template>
  <div class="module">
    <section class="summary">
      <div class="card">
        <div class="label">异常上报</div>
        <div class="value">14 件</div>
        <div class="trend">已处理 9 件</div>
      </div>
      <div class="card">
        <div class="label">到期提醒</div>
        <div class="value">7 件</div>
        <div class="trend">需计划更换</div>
      </div>
      <div class="card">
        <div class="label">风险预警</div>
        <div class="value">4 件</div>
        <div class="trend">重点关注产线</div>
      </div>
    </section>

    <section class="actions">
      <button class="primary" @click="openModal('report')">老化/磨损上报</button>
      <button class="ghost" @click="openModal('risk')">设置风险提醒</button>
      <button class="ghost" @click="openModal('remind')">到期提醒发送</button>
      <button class="ghost" @click="openModal('progress')">处理进度</button>
      <button class="ghost" @click="openModal('tip')">按钮提示信息</button>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">异常趋势</div>
        <div class="panel-subtitle">近六个月异常数量</div>
      </div>
      <div class="chart">
        <div v-for="item in chartData" :key="item.month" class="bar">
          <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
          <span>{{ item.month }}</span>
          <em>{{ item.value }}</em>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div class="panel-title">异常与预警列表</div>
        <div class="panel-subtitle">表数据共 {{ alerts.length }} 条</div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>制品</th>
              <th>异常类型</th>
              <th>风险等级</th>
              <th>更新时间</th>
              <th>处理状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id">
              <td>{{ alert.id }}</td>
              <td>{{ alert.item }}</td>
              <td>{{ alert.type }}</td>
              <td><span class="status" :class="alert.levelClass">{{ alert.level }}</span></td>
              <td>{{ alert.date }}</td>
              <td>{{ alert.status }}</td>
              <td>
                <button class="link" @click="openModal('detail', alert)">查看</button>
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

        <form v-if="modal.type === 'report'" class="modal-form">
          <input placeholder="制品编号" />
          <select>
            <option>老化</option>
            <option>磨损</option>
            <option>开裂</option>
          </select>
          <textarea rows="3" placeholder="异常描述"></textarea>
        </form>

        <form v-if="modal.type === 'risk'" class="modal-form">
          <input placeholder="风险规则名称" />
          <select>
            <option>高风险</option>
            <option>中风险</option>
            <option>低风险</option>
          </select>
          <input placeholder="阈值/天数" />
        </form>

        <form v-if="modal.type === 'remind'" class="modal-form">
          <input placeholder="提醒对象" />
          <input placeholder="提醒方式" />
          <textarea rows="3" placeholder="提醒内容"></textarea>
        </form>

        <div v-if="modal.type === 'progress'" class="progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">异常处理进度 {{ progress }}%</div>
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
  { month: "3月", value: 32 },
  { month: "4月", value: 45 },
  { month: "5月", value: 38 },
  { month: "6月", value: 52 },
  { month: "7月", value: 47 },
  { month: "8月", value: 56 }
];

const alerts = Array.from({ length: 20 }, (_, index) => ({
  id: `AL-${200 + index}`,
  item: `密封圈-${index + 1}`,
  type: index % 2 === 0 ? "磨损" : "老化",
  level: index % 4 === 0 ? "高" : "中",
  levelClass: index % 4 === 0 ? "danger" : "warn",
  date: `2024-08-${String((index % 20) + 1).padStart(2, "0")}`,
  status: index % 3 === 0 ? "处理中" : "已派工"
}));

const modal = reactive({
  visible: false,
  title: "",
  message: "",
  type: "",
  payload: null
});

const progress = ref(64);

const openModal = (type, payload = null) => {
  modal.type = type;
  modal.payload = payload;
  modal.visible = true;
  if (type === "report") {
    modal.title = "异常上报";
    modal.message = "提交老化或磨损异常信息。";
  }
  if (type === "risk") {
    modal.title = "设置风险提醒";
    modal.message = "配置风险级别与阈值。";
  }
  if (type === "remind") {
    modal.title = "到期提醒发送";
    modal.message = "选择提醒对象与通知方式。";
  }
  if (type === "progress") {
    modal.title = "异常处理进度";
    modal.message = "系统同步最新处理进度。";
  }
  if (type === "detail") {
    modal.title = "异常详情";
    modal.message = `编号 ${payload.id}，风险等级 ${payload.level}，状态 ${payload.status}。`;
  }
  if (type === "tip") {
    modal.title = "提示信息";
    modal.message = "建议优先处理高风险异常并同步产线负责人。";
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
  color: #dc2626;
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
  background: #dc2626;
  color: #fff;
  padding: 0 16px;
  cursor: pointer;
}

.ghost {
  height: 36px;
  border-radius: 10px;
  border: 1px solid #fecaca;
  background: #fff5f5;
  color: #b91c1c;
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
  background: linear-gradient(180deg, #fca5a5, #dc2626);
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

.status.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.link {
  border: none;
  background: transparent;
  color: #dc2626;
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
  background: linear-gradient(90deg, #fca5a5, #dc2626);
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
