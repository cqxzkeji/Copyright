<template>
  <div class="card">
    <div class="section-title">运行评估指标</div>
    <div class="grid-two">
      <div class="metric" v-for="metric in metrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.note }}</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">能耗趋势分析</div>
    <div class="chart">
      <div
        class="bar"
        v-for="(bar, index) in chartData"
        :key="`analytics-chart-${index}`"
        :style="{ height: `${bar}%` }"
      ></div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">绩效指标清单</div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>评价对象</th>
            <th>处理量</th>
            <th>单位能耗</th>
            <th>指标状态</th>
            <th>综合评分</th>
            <th>趋势</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.site }}</td>
            <td>{{ row.flow }}</td>
            <td>{{ row.pressure }}</td>
            <td>{{ row.quality }}</td>
            <td>{{ row.energy }}</td>
            <td>{{ row.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="section-title">分析操作</div>
    <div class="actions">
      <button class="primary-btn" @click="openModal('forecast')">生成预测报告</button>
      <button class="secondary-btn" @click="openModal('progress')">模型计算进度</button>
      <button class="ghost-btn" @click="openModal('hint')">查看提示</button>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'forecast'" title="趋势预测配置" @close="closeModal">
    <form>
      <label>
        分析周期
        <select v-model="forecastForm.period">
          <option>近 7 天</option>
          <option>近 30 天</option>
          <option>季度</option>
        </select>
      </label>
      <label>
        指标范围
        <input v-model="forecastForm.metric" placeholder="例如：能耗、产水率" />
      </label>
      <label>
        输出方式
        <select v-model="forecastForm.output">
          <option>PDF 报告</option>
          <option>可视化看板</option>
          <option>调度建议</option>
        </select>
      </label>
    </form>
    <template #footer>
      <button class="secondary-btn" type="button" @click="closeModal">取消</button>
      <button class="primary-btn" type="button" @click="submitForecast">开始生成</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'progress'" title="模型计算进度" @close="closeModal">
    <div>
      <p>正在进行多维能耗与处理效率分析。</p>
      <div class="progress">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
      <p>{{ progress }}%</p>
    </div>
    <template #footer>
      <button class="primary-btn" type="button" @click="closeModal">完成</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'hint'" title="分析提示" @close="closeModal">
    <ul>
      <li>当前能耗低于历史均值 4.2%，可持续优化。</li>
      <li>建议下周重点关注北区泵站运行效率。</li>
      <li>污水处理负荷稳定，具备调峰空间。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import { buildChart, buildTable } from "../data/sampleData.js";

const metrics = [
  { label: "综合绩效指数", value: "92.4 分", note: "较上周 +1.8" },
  { label: "单位能耗", value: "0.48 kWh/m³", note: "优于基准 6%" },
  { label: "调度响应", value: "98%", note: "及时率" },
  { label: "设备健康度", value: "91%", note: "需维护 3 台" }
];

const chartData = buildChart();
const tableRows = buildTable("评估项");

const activeModal = ref("");
const progress = ref(0);
let timer;

const forecastForm = reactive({
  period: "近 30 天",
  metric: "能耗、供水率",
  output: "可视化看板"
});

const openModal = (type) => {
  activeModal.value = type;
  if (type === "progress") {
    progress.value = 0;
    timer = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(timer);
        return;
      }
      progress.value += 11;
    }, 340);
  }
};

const closeModal = () => {
  activeModal.value = "";
  progress.value = 0;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const submitForecast = () => {
  closeModal();
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
