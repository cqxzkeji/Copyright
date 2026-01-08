<template>
  <div class="card">
    <div class="section-title">运维与应急状态</div>
    <div class="grid-two">
      <div class="metric" v-for="metric in metrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.note }}</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">巡检完成率趋势</div>
    <div class="chart">
      <div
        class="bar"
        v-for="(bar, index) in chartData"
        :key="`maint-chart-${index}`"
        :style="{ height: `${bar}%` }"
      ></div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">设备运维清单</div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>设备编号</th>
            <th>运行时长</th>
            <th>健康指数</th>
            <th>状态</th>
            <th>能耗</th>
            <th>维护状态</th>
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
    <div class="section-title">运维操作</div>
    <div class="actions">
      <button class="primary-btn" @click="openModal('work')">创建工单</button>
      <button class="secondary-btn" @click="openModal('progress')">应急处置进度</button>
      <button class="ghost-btn" @click="openModal('tips')">提示信息</button>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'work'" title="新增运维工单" @close="closeModal">
    <form>
      <label>
        设备编号
        <input v-model="workForm.device" placeholder="例如：PS-002" />
      </label>
      <label>
        故障描述
        <textarea v-model="workForm.issue" rows="3"></textarea>
      </label>
      <label>
        优先级
        <select v-model="workForm.level">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </label>
    </form>
    <template #footer>
      <button class="secondary-btn" type="button" @click="closeModal">取消</button>
      <button class="primary-btn" type="button" @click="submitWork">提交工单</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'progress'" title="应急处置进度" @close="closeModal">
    <div>
      <p>正在安排现场抢修与远程调度资源。</p>
      <div class="progress">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
      <p>{{ progress }}%</p>
    </div>
    <template #footer>
      <button class="primary-btn" type="button" @click="closeModal">完成</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tips'" title="运维提示" @close="closeModal">
    <ul>
      <li>今日需完成 12 次巡检，已完成 8 次。</li>
      <li>二号泵站存在轻微振动，请安排复检。</li>
      <li>应急物资库存充足，可支撑 3 天。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import { buildChart, buildTable } from "../data/sampleData.js";

const metrics = [
  { label: "待处理工单", value: "6 单", note: "已超 2 单" },
  { label: "巡检完成率", value: "82%", note: "目标 90%" },
  { label: "应急响应时间", value: "18 分钟", note: "平均值" },
  { label: "设备健康度", value: "89%", note: "需保养 5 台" }
];

const chartData = buildChart();
const tableRows = buildTable("设备");

const activeModal = ref("");
const progress = ref(0);
let timer;

const workForm = reactive({
  device: "PS-002",
  issue: "运行电流偏高，建议检查电机轴承。",
  level: "高"
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
      progress.value += 13;
    }, 310);
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

const submitWork = () => {
  closeModal();
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
