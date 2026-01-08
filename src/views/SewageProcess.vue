<template>
  <div class="card">
    <div class="section-title">污水处理关键指标</div>
    <div class="grid-two">
      <div class="metric" v-for="metric in metrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.note }}</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">进出水水质变化</div>
    <div class="chart">
      <div
        class="bar"
        v-for="(bar, index) in chartData"
        :key="`sewage-chart-${index}`"
        :style="{ height: `${bar}%` }"
      ></div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">处理工艺站点</div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>工艺段</th>
            <th>进水量</th>
            <th>出水水质</th>
            <th>运行状态</th>
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
    <div class="section-title">工艺调控</div>
    <div class="actions">
      <button class="primary-btn" @click="openModal('adjust')">调整工艺参数</button>
      <button class="secondary-btn" @click="openModal('progress')">曝气提升进度</button>
      <button class="ghost-btn" @click="openModal('tips')">查看提示</button>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'adjust'" title="工艺参数调整" @close="closeModal">
    <form>
      <label>
        调整段
        <select v-model="adjustForm.section">
          <option>初沉池</option>
          <option>生化池</option>
          <option>二沉池</option>
        </select>
      </label>
      <label>
        曝气强度
        <input v-model="adjustForm.aeration" placeholder="例如：提升 5%" />
      </label>
      <label>
        说明
        <textarea v-model="adjustForm.note" rows="3"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="secondary-btn" type="button" @click="closeModal">取消</button>
      <button class="primary-btn" type="button" @click="submitAdjust">执行调整</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'progress'" title="曝气提升进度" @close="closeModal">
    <div>
      <p>曝气系统正在逐步提升，预计 15 分钟完成。</p>
      <div class="progress">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
      <p>{{ progress }}%</p>
    </div>
    <template #footer>
      <button class="primary-btn" type="button" @click="closeModal">完成</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tips'" title="污水处理提示" @close="closeModal">
    <ul>
      <li>生化池溶解氧偏低，建议逐步提升曝气。</li>
      <li>二沉池泥位上升，请检查回流泵。</li>
      <li>今日出水 COD 低于目标值，运行良好。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import { buildChart, buildTable } from "../data/sampleData.js";

const metrics = [
  { label: "进水量", value: "3.9 万 m³/h", note: "峰值 4.1" },
  { label: "出水 COD", value: "26 mg/L", note: "低于限值" },
  { label: "脱氮效率", value: "92%", note: "目标 90%" },
  { label: "污泥负荷", value: "0.32 kg/kg", note: "稳定" }
];

const chartData = buildChart();
const tableRows = buildTable("工艺段");

const activeModal = ref("");
const progress = ref(0);
let timer;

const adjustForm = reactive({
  section: "生化池",
  aeration: "提升 8%",
  note: "确保溶解氧维持 2.0 mg/L。"
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
      progress.value += 9;
    }, 360);
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

const submitAdjust = () => {
  closeModal();
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
