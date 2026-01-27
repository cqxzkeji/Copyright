<template>
  <section class="card hero">
    <div>
      <h2>新能源汽车光学扫描分析软件</h2>
      <p>统一管理五大功能模块，实时掌握扫描进度、数据质量与报告输出。</p>
      <div class="toolbar">
        <button @click="openModal('mission')">创建全流程任务</button>
        <button class="secondary" @click="openModal('sync')">同步设备数据</button>
        <button class="ghost" @click="openModal('tip')">查看系统提示</button>
      </div>
    </div>
    <img :src="heroImage" alt="光学扫描示意图" />
  </section>

  <section class="card">
    <h3>关键运行指标</h3>
    <div class="stat-list">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <strong>{{ stat.value }}</strong>
        <p>{{ stat.label }}</p>
      </div>
    </div>
  </section>

  <section class="card">
    <h3>任务总览</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>任务编号</th>
            <th>车型</th>
            <th>阶段</th>
            <th>负责人</th>
            <th>进度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.model }}</td>
            <td>{{ record.stage }}</td>
            <td>{{ record.owner }}</td>
            <td>{{ record.progress }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <ModalDialog
    v-if="activeModal === 'mission'"
    title="创建全流程任务"
    @close="closeModal"
    @confirm="confirmModal"
  >
    <form>
      <label>
        车型名称
        <input v-model="missionForm.model" type="text" placeholder="如：智行X8" />
      </label>
      <label>
        扫描区域
        <select v-model="missionForm.scope">
          <option>整车覆盖</option>
          <option>座舱内饰</option>
          <option>外观光学面</option>
        </select>
      </label>
      <label>
        交付日期
        <input v-model="missionForm.deadline" type="date" />
      </label>
      <label>
        备注
        <textarea v-model="missionForm.note" rows="3"></textarea>
      </label>
    </form>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'sync'"
    title="设备数据同步"
    :showFooter="false"
    @close="closeModal"
  >
    <p>正在同步扫描设备数据，请稍候。</p>
    <div class="progress-bar">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>已完成 {{ progress }}%</p>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'tip'"
    title="系统提示"
    :showFooter="false"
    @close="closeModal"
  >
    <p>{{ tipMessage }}</p>
  </ModalDialog>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import ModalDialog from "../components/ModalDialog.vue";
import heroImage from "../assets/scan-visual.svg";

const stats = [
  { label: "扫描任务运行中", value: "12" },
  { label: "今日采集点云(万)", value: "8.6" },
  { label: "已完成模型", value: "24" },
  { label: "待输出报告", value: "6" }
];

const records = Array.from({ length: 20 }, (_, index) => ({
  id: `SCAN-${1001 + index}`,
  model: `智行EV-${index + 1}`,
  stage: index % 3 === 0 ? "采集中" : index % 3 === 1 ? "处理优化" : "报告生成",
  owner: ["王晨", "李珊", "赵海", "徐悦"][index % 4],
  progress: `${60 + (index % 5) * 8}%`
}));

const activeModal = ref("");
const progress = ref(65);
const missionForm = ref({
  model: "智行X8",
  scope: "整车覆盖",
  deadline: "",
  note: ""
});

const tipMessage = computed(
  () => "当前系统运行稳定，建议在夜间低峰期执行高精度扫描。"
);

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = "";
};

const confirmModal = () => {
  activeModal.value = "";
};

onMounted(() => {
  const interval = setInterval(() => {
    if (activeModal.value !== "sync") {
      return;
    }
    progress.value = progress.value >= 100 ? 100 : progress.value + 5;
    if (progress.value === 100) {
      clearInterval(interval);
    }
  }, 400);
});
</script>
