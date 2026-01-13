<template>
  <section class="module">
    <div class="summary">
      <div class="card">
        <h4>压力曲线（近 60 分钟）</h4>
        <svg class="chart" viewBox="0 0 400 160" role="img" aria-label="压力曲线">
          <polyline :points="chartPoints" fill="none" stroke="#2563eb" stroke-width="3" />
          <circle v-for="(point, index) in chartPointList" :key="index" :cx="point.x" :cy="point.y" r="3" fill="#1d4ed8" />
        </svg>
      </div>
      <div class="card gauge">
        <h4>当前压力负载</h4>
        <div class="gauge-ring">
          <div class="gauge-fill" :style="{ height: `${gaugeValue}%` }"></div>
          <span>{{ gaugeValue }}%</span>
        </div>
        <p>阈值区间：{{ threshold.min }} - {{ threshold.max }} MPa</p>
        <button type="button" @click="openModal('form', '阈值设置')">阈值设置</button>
      </div>
      <div class="card">
        <h4>报警闭环</h4>
        <p class="metric">{{ alarmCount }} 条</p>
        <span>已确认 {{ resolvedCount }} 条</span>
        <div class="alarm-actions">
          <button type="button" @click="openModal('info', '报警推送')">推送通知</button>
          <button type="button" @click="openModal('progress', '联动演练')">联动演练</button>
        </div>
      </div>
    </div>

    <div class="toolbar">
      <button type="button" @click="openModal('form', '新增规则')">新增规则</button>
      <button type="button" @click="openModal('info', '报警确认')">报警确认</button>
      <button type="button" @click="openModal('form', '处置记录')">处置记录</button>
      <button type="button" @click="openModal('progress', '通知演算')">通知演算</button>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h4>实时报警列表</h4>
        <span>上限 / 下限 / 突变 / 持续超限</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>设备</th>
            <th>类型</th>
            <th>当前值</th>
            <th>阈值</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alarm in alarms" :key="alarm.id">
            <td>{{ alarm.time }}</td>
            <td>{{ alarm.device }}</td>
            <td>{{ alarm.type }}</td>
            <td>{{ alarm.value }}</td>
            <td>{{ alarm.limit }}</td>
            <td>{{ alarm.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-mask" role="dialog" aria-modal="true">
      <div class="modal">
        <header>
          <h3>{{ modal.title }}</h3>
          <button type="button" class="icon" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <form v-if="modal.type === 'form'" class="modal-form" @submit.prevent="submitForm">
            <label>
              规则名称
              <input v-model="form.rule" type="text" required />
            </label>
            <label>
              触发条件
              <input v-model="form.condition" type="text" required />
            </label>
            <label>
              联动动作
              <select v-model="form.action">
                <option>短信 + 应用通知</option>
                <option>仅应用通知</option>
                <option>联动停机</option>
              </select>
            </label>
            <label>
              责任人
              <input v-model="form.owner" type="text" required />
            </label>
            <button type="submit" class="primary">保存规则</button>
          </form>
          <div v-else-if="modal.type === 'progress'">
            <p>正在执行报警联动演练。</p>
            <div class="progress">
              <div class="bar" :style="{ width: `${progress}%` }"></div>
            </div>
            <p class="progress-tip">演练进度 {{ progress }}%</p>
          </div>
          <div v-else class="info-body">
            <p>已完成报警确认与通知推送，责任人：{{ form.owner }}。</p>
            <button type="button" class="primary" @click="closeModal">查看处置</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onBeforeUnmount } from "vue";

const dataSeries = [32, 34, 36, 35, 37, 40, 38, 39, 41, 40, 42, 44];

const chartPointList = computed(() =>
  dataSeries.map((value, index) => ({
    x: 20 + index * 30,
    y: 140 - (value - 30) * 4
  }))
);

const chartPoints = computed(() => chartPointList.value.map((p) => `${p.x},${p.y}`).join(" "));

const gaugeValue = 78;
const threshold = reactive({ min: 24, max: 46 });

const alarms = ref(
  Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    time: `09:${String(index + 10).padStart(2, "0")}:45`,
    device: `高压管线-${(index % 6) + 1}`,
    type: ["上限", "下限", "突变", "持续超限"][index % 4],
    value: `${(35 + index * 0.4).toFixed(1)} MPa`,
    limit: `${index % 2 === 0 ? 45 : 22} MPa`,
    status: index % 3 === 0 ? "待确认" : "已确认"
  }))
);

const alarmCount = computed(() => alarms.value.length);
const resolvedCount = computed(() => alarms.value.filter((alarm) => alarm.status === "已确认").length);

const modal = reactive({
  visible: false,
  type: "info",
  title: ""
});

const form = reactive({
  rule: "压力突变告警",
  condition: "5 秒内升幅 > 8 MPa",
  action: "短信 + 应用通知",
  owner: "值班长-李工"
});

const progress = ref(0);
const timer = ref(null);

const openModal = (type, title) => {
  modal.visible = true;
  modal.type = type;
  modal.title = title;
  if (type === "progress") {
    progress.value = 0;
    timer.value = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(timer.value);
        timer.value = null;
      } else {
        progress.value += 14;
      }
    }, 160);
  }
};

const closeModal = () => {
  modal.visible = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const submitForm = () => {
  threshold.min = 22;
  threshold.max = 48;
  openModal("info", "规则已更新");
};

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.metric {
  font-size: 22px;
  font-weight: 700;
  margin: 8px 0;
}

.chart {
  width: 100%;
  height: 160px;
  background: #f8fafc;
  border-radius: 12px;
}

.gauge {
  display: grid;
  gap: 12px;
}

.gauge-ring {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #e2e8f0;
  overflow: hidden;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #1d4ed8;
}

.gauge-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(180deg, #93c5fd, #2563eb);
}

.gauge p {
  margin: 0;
  color: #64748b;
}

.gauge button {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.alarm-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.alarm-actions button {
  border: none;
  background: #f97316;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.alarm-actions button:last-child {
  background: #0f172a;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.toolbar button {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.table-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.table-header span {
  color: #64748b;
  font-size: 13px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 20px;
}

.modal-form {
  display: grid;
  gap: 10px;
}

.modal-form input,
.modal-form select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.primary {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.icon {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin: 12px 0;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #38bdf8);
  transition: width 0.2s ease;
}

.progress-tip {
  font-size: 13px;
  color: #64748b;
}
</style>
