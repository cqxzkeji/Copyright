<template>
  <div class="card">
    <div class="section-title">供水设施实时状态</div>
    <div class="grid-two">
      <div class="metric" v-for="metric in metrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.note }}</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">取水量与水位趋势</div>
    <div class="chart">
      <div
        class="bar"
        v-for="(bar, index) in chartData"
        :key="`supply-chart-${index}`"
        :style="{ height: `${bar}%` }"
      ></div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">供水站点实时清单</div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>站点</th>
            <th>取水量</th>
            <th>压力</th>
            <th>水质状态</th>
            <th>电耗</th>
            <th>设备状态</th>
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
    <div class="section-title">操作指令</div>
    <div class="actions">
      <button class="primary-btn" @click="openModal('dispatch')">下发调度</button>
      <button class="secondary-btn" @click="openModal('progress')">泵站切换进度</button>
      <button class="ghost-btn" @click="openModal('notice')">运行提示</button>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'dispatch'" title="供水调度指令" @close="closeModal">
    <form>
      <label>
        调度对象
        <select v-model="dispatchForm.target">
          <option>一水厂</option>
          <option>二水厂</option>
          <option>北区泵站</option>
        </select>
      </label>
      <label>
        调整内容
        <input v-model="dispatchForm.action" placeholder="例如：提升出水压力" />
      </label>
      <label>
        生效时间
        <input type="time" v-model="dispatchForm.time" />
      </label>
    </form>
    <template #footer>
      <button class="secondary-btn" type="button" @click="closeModal">取消</button>
      <button class="primary-btn" type="button" @click="submitDispatch">确认下发</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'progress'" title="泵站切换进度" @close="closeModal">
    <div>
      <p>泵站切换作业正在执行，请留意实时压力变化。</p>
      <div class="progress">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
      <p>{{ progress }}%</p>
    </div>
    <template #footer>
      <button class="primary-btn" type="button" @click="closeModal">完成</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'notice'" title="供水运行提示" @close="closeModal">
    <ul>
      <li>东区水池水位偏低，建议适当提升取水量。</li>
      <li>南区泵站电耗上涨 6%，请安排巡检。</li>
      <li>今日高峰预计提前 30 分钟，请优化水压曲线。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import { buildChart, buildTable } from "../data/sampleData.js";

const metrics = [
  { label: "取水口流量", value: "4.2 万 m³/h", note: "目标值 4.5" },
  { label: "主干管压力", value: "0.46 MPa", note: "稳定区间" },
  { label: "高峰负荷", value: "86%", note: "预计 18:30 达峰" },
  { label: "泵站电耗", value: "1280 kWh", note: "较昨日 -2.1%" }
];

const chartData = buildChart();
const tableRows = buildTable("供水站");

const activeModal = ref("");
const progress = ref(0);
let timer;

const dispatchForm = reactive({
  target: "一水厂",
  action: "提升出水压力 0.02 MPa",
  time: ""
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
      progress.value += 10;
    }, 350);
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

const submitDispatch = () => {
  closeModal();
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
