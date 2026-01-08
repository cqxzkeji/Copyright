<template>
  <div class="card">
    <div class="section-title">水质在线监测指标</div>
    <div class="grid-two">
      <div class="metric" v-for="metric in metrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.note }}</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">原水与管网水质趋势</div>
    <div class="chart">
      <div
        class="bar"
        v-for="(bar, index) in chartData"
        :key="`quality-chart-${index}`"
        :style="{ height: `${bar}%` }"
      ></div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">水质监测点清单</div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>监测点</th>
            <th>浊度</th>
            <th>余氯</th>
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
    <div class="section-title">预警与响应</div>
    <div class="actions">
      <button class="primary-btn" @click="openModal('alert')">发布预警</button>
      <button class="secondary-btn" @click="openModal('tracking')">跟踪处置进度</button>
      <button class="ghost-btn" @click="openModal('tip')">提示信息</button>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'alert'" title="水质预警发布" @close="closeModal">
    <form>
      <label>
        预警级别
        <select v-model="alertForm.level">
          <option>一级</option>
          <option>二级</option>
          <option>三级</option>
        </select>
      </label>
      <label>
        影响范围
        <input v-model="alertForm.scope" placeholder="例如：北区管网" />
      </label>
      <label>
        处置建议
        <textarea v-model="alertForm.note" rows="3"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="secondary-btn" type="button" @click="closeModal">取消</button>
      <button class="primary-btn" type="button" @click="submitAlert">确认发布</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tracking'" title="预警处置进度" @close="closeModal">
    <div>
      <p>正在联动现场采样与加氯设备，预计 20 分钟完成。</p>
      <div class="progress">
        <span :style="{ width: `${progress}%` }"></span>
      </div>
      <p>{{ progress }}%</p>
    </div>
    <template #footer>
      <button class="primary-btn" type="button" @click="closeModal">关闭</button>
    </template>
  </BaseModal>

  <BaseModal v-if="activeModal === 'tip'" title="水质监测提示" @close="closeModal">
    <ul>
      <li>原水浊度波动较大，请关注取水口变化。</li>
      <li>管网余氯平均值 0.28 mg/L，处于安全范围。</li>
      <li>建议 15:00 前完成加氯设备校准。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import { buildChart, buildTable } from "../data/sampleData.js";

const metrics = [
  { label: "原水浊度", value: "1.2 NTU", note: "波动区间 0.8-1.4" },
  { label: "出厂水余氯", value: "0.32 mg/L", note: "符合标准" },
  { label: "管网水质", value: "98.6%", note: "合格率" },
  { label: "异常点位", value: "2 处", note: "已启动复测" }
];

const chartData = buildChart();
const tableRows = buildTable("水质点");

const activeModal = ref("");
const progress = ref(0);
let timer;

const alertForm = reactive({
  level: "二级",
  scope: "北区管网",
  note: "加强加氯并加密采样频次。"
});

const openModal = (type) => {
  activeModal.value = type;
  if (type === "tracking") {
    progress.value = 0;
    timer = setInterval(() => {
      if (progress.value >= 100) {
        clearInterval(timer);
        return;
      }
      progress.value += 12;
    }, 320);
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

const submitAlert = () => {
  closeModal();
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
