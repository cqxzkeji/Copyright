<template>
  <section class="module">
    <div class="summary">
      <div class="card">
        <h4>趋势与稳定性评估</h4>
        <svg class="chart" viewBox="0 0 360 160" role="img" aria-label="趋势分析">
          <rect v-for="(bar, index) in trendBars" :key="index" :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height" fill="#60a5fa" />
        </svg>
        <span>近七日稳定性评分 {{ stabilityScore }} 分</span>
      </div>
      <div class="card">
        <h4>异常检测</h4>
        <p class="metric">{{ anomalyCount }} 项</p>
        <span>已关联工况 {{ scenarioCount }} 项</span>
        <button type="button" @click="openModal('info', '异常复核')">异常复核</button>
      </div>
      <div class="card">
        <h4>寿命/风险预测</h4>
        <p class="metric">{{ riskScore }}%</p>
        <span>建议检修窗口 {{ suggestionWindow }}</span>
        <button type="button" @click="openModal('form', '预测模型参数')">模型参数</button>
      </div>
    </div>

    <div class="toolbar">
      <button type="button" @click="openModal('progress', '启动分析')">启动分析</button>
      <button type="button" @click="openModal('form', '工况识别')">工况识别</button>
      <button type="button" @click="openModal('form', '策略建议')">策略建议</button>
      <button type="button" @click="openModal('info', '分析结论')">分析结论</button>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h4>诊断结果清单</h4>
        <span>趋势分析 / 峰谷评估 / 风险预测</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>设备</th>
            <th>工况</th>
            <th>诊断结论</th>
            <th>风险等级</th>
            <th>建议</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in diagnostics" :key="item.id">
            <td>{{ item.time }}</td>
            <td>{{ item.device }}</td>
            <td>{{ item.scenario }}</td>
            <td>{{ item.conclusion }}</td>
            <td>{{ item.risk }}</td>
            <td>{{ item.advice }}</td>
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
              分析范围
              <input v-model="form.scope" type="text" required />
            </label>
            <label>
              目标设备
              <input v-model="form.device" type="text" required />
            </label>
            <label>
              诊断模型
              <select v-model="form.model">
                <option>趋势预测模型</option>
                <option>异常检测模型</option>
                <option>寿命评估模型</option>
              </select>
            </label>
            <label>
              输出策略
              <select v-model="form.strategy">
                <option>生产优化建议</option>
                <option>检修建议</option>
                <option>风险预警</option>
              </select>
            </label>
            <button type="submit" class="primary">生成策略</button>
          </form>
          <div v-else-if="modal.type === 'progress'">
            <p>智能分析任务运行中。</p>
            <div class="progress">
              <div class="bar" :style="{ width: `${progress}%` }"></div>
            </div>
            <p class="progress-tip">已完成 {{ progress }}%</p>
          </div>
          <div v-else class="info-body">
            <p>诊断结论：主力设备负载偏高，建议调整工况并提前检修。</p>
            <button type="button" class="primary" @click="closeModal">导出建议</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onBeforeUnmount } from "vue";

const trendData = [40, 52, 48, 60, 55, 65, 58];
const trendBars = computed(() =>
  trendData.map((value, index) => ({
    x: 20 + index * 45,
    y: 140 - value,
    width: 28,
    height: value
  }))
);

const stabilityScore = 86;
const anomalyCount = 5;
const scenarioCount = 8;
const riskScore = 68;
const suggestionWindow = "7-10 天";

const diagnostics = ref(
  Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    time: `06-${String(index % 7 + 9).padStart(2, "0")} 0${index % 9}:30`,
    device: `主泵-${(index % 5) + 1}`,
    scenario: ["高负载", "稳态", "启停", "波动"][index % 4],
    conclusion: ["趋势上行", "轻微波动", "峰值偏高", "稳定"][(index + 1) % 4],
    risk: ["低", "中", "高"][index % 3],
    advice: ["优化工况", "建议巡检", "提前检修", "保持监测"][index % 4]
  }))
);

const modal = reactive({
  visible: false,
  type: "info",
  title: ""
});

const form = reactive({
  scope: "近 30 天",
  device: "主泵-2",
  model: "趋势预测模型",
  strategy: "生产优化建议"
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
        progress.value += 13;
      }
    }, 150);
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
  diagnostics.value.unshift({
    id: diagnostics.value.length + 1,
    time: "06-16 10:30",
    device: form.device,
    scenario: "高负载",
    conclusion: "风险升高",
    risk: "高",
    advice: form.strategy
  });
  closeModal();
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
  display: grid;
  gap: 12px;
}

.metric {
  font-size: 22px;
  font-weight: 700;
  margin: 4px 0;
}

.chart {
  width: 100%;
  height: 160px;
  background: #f8fafc;
  border-radius: 12px;
}

.card span {
  color: #64748b;
  font-size: 13px;
}

.card button {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
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
