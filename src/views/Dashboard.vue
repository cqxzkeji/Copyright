<template>
  <div class="card">
    <div class="section-title">运行概览</div>
    <div class="grid-two">
      <div class="metric" v-for="metric in metrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.note }}</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">全域流量趋势</div>
    <div class="chart">
      <div
        class="bar"
        v-for="(bar, index) in chartData"
        :key="`chart-${index}`"
        :style="{ height: `${bar}%` }"
      ></div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">关键站点运行清单</div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>站点</th>
            <th>实时流量</th>
            <th>供水压力</th>
            <th>水质状态</th>
            <th>能耗</th>
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
    <div class="section-title">调度操作</div>
    <div class="actions">
      <button class="primary-btn" @click="openModal('report')">生成日报</button>
      <button class="secondary-btn" @click="openModal('drill')">启动应急演练</button>
      <button class="ghost-btn" @click="openModal('tips')">查看提示</button>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'report'" title="运行日报生成" @close="closeModal">
    <form>
      <label>
        报表日期
        <input type="date" v-model="reportForm.date" />
      </label>
      <label>
        分发范围
        <select v-model="reportForm.scope">
          <option>供水中心</option>
          <option>污水处理厂</option>
          <option>运维指挥部</option>
        </select>
      </label>
      <label>
        备注
        <textarea v-model="reportForm.note" rows="3" placeholder="填写说明"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="secondary-btn" type="button" @click="closeModal">取消</button>
      <button class="primary-btn" type="button" @click="submitReport">确认生成</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'drill'" title="应急演练执行进度" @close="closeModal">
    <div>
      <p>正在联动水厂、泵站、污水处理厂，请保持通信畅通。</p>
      <div class="progress">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
      <p>{{ progress }}%</p>
    </div>
    <template #footer>
      <button class="primary-btn" type="button" @click="closeModal">结束监控</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tips'" title="运行提示" @close="closeModal">
    <ul>
      <li>今日高峰预计 18:00-20:00，请提前调整泵站运行曲线。</li>
      <li>北区原水浊度偏高，建议加密取样。</li>
      <li>污水厂鼓风机 2# 需安排巡检。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import { buildChart, buildTable } from "../data/sampleData.js";

const metrics = [
  { label: "供水总量", value: "24.8 万 m³", note: "较昨日 +3.4%" },
  { label: "污水处理量", value: "19.6 万 m³", note: "达标率 99.2%" },
  { label: "在线站点", value: "128 座", note: "在线率 100%" },
  { label: "能源单耗", value: "0.46 kWh/m³", note: "目标值 0.5" }
];

const chartData = buildChart();
const tableRows = buildTable("总站");

const activeModal = ref("");
const progress = ref(0);
let timer;

const reportForm = reactive({
  date: "",
  scope: "供水中心",
  note: ""
});

const openModal = (type) => {
  activeModal.value = type;
  if (type === "drill") {
    progress.value = 0;
    timer = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(timer);
        return;
      }
      progress.value += 8;
    }, 400);
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

const submitReport = () => {
  closeModal();
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
