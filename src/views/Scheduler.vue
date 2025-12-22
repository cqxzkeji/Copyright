<template>
  <div class="module">
    <section class="actions">
      <button class="primary" type="button" @click="showForm = true">新增作业计划</button>
      <button class="secondary" type="button" @click="openProgress">执行调度</button>
      <button class="ghost" type="button" @click="showTip = true">调度提示</button>
    </section>

    <div class="grid">
      <BarChart title="队列等待时间 (分钟)" :labels="chartLabels" :values="chartValues" />
      <div class="card">
        <h3>作业调度列表</h3>
        <table>
          <thead>
            <tr>
              <th>作业ID</th>
              <th>队列</th>
              <th>优先级</th>
              <th>运行时长</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobs" :key="job.id">
              <td>{{ job.id }}</td>
              <td>{{ job.queue }}</td>
              <td>{{ job.priority }}</td>
              <td>{{ job.runtime }}</td>
              <td><span :class="['tag', job.status === '运行中' ? 'ok' : 'pending']">{{ job.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal :open="showForm" title="新增作业计划" @close="showForm = false">
      <form class="form" @submit.prevent="submitJob">
        <label>作业名称<input v-model="form.name" required placeholder="如：分子动力学模拟" /></label>
        <label>队列<input v-model="form.queue" required placeholder="gpu-long/gpu-short" /></label>
        <label>资源规模<input v-model="form.scale" required placeholder="CPU 128 / GPU 8" /></label>
        <label>负责人<input v-model="form.owner" required placeholder="调度负责人" /></label>
        <button class="primary" type="submit">生成计划</button>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="调度引擎运行中" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>调度策略已完成 {{ progress }}%，即将更新运行状态。</p>
    </BaseModal>

    <BaseModal :open="showTip" title="调度提示" @close="showTip = false">
      <ul class="tips">
        <li>高优先级作业会自动提升资源配额。</li>
        <li>建议在低峰时段执行大规模训练。</li>
        <li>调度引擎支持抢占式策略。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import BarChart from "../components/BarChart.vue";

const chartLabels = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10"];
const chartValues = [12, 18, 9, 24, 16, 20, 14, 11, 19, 17];

const jobs = ref([
  { id: "JOB-101", queue: "gpu-short", priority: "高", runtime: "1h 10m", status: "运行中" },
  { id: "JOB-102", queue: "cpu-long", priority: "中", runtime: "3h 20m", status: "排队" },
  { id: "JOB-103", queue: "gpu-long", priority: "高", runtime: "2h 40m", status: "运行中" },
  { id: "JOB-104", queue: "cpu-short", priority: "低", runtime: "40m", status: "排队" },
  { id: "JOB-105", queue: "gpu-short", priority: "中", runtime: "55m", status: "运行中" },
  { id: "JOB-106", queue: "cpu-long", priority: "高", runtime: "4h 15m", status: "排队" },
  { id: "JOB-107", queue: "gpu-long", priority: "中", runtime: "1h 35m", status: "运行中" },
  { id: "JOB-108", queue: "cpu-short", priority: "低", runtime: "30m", status: "排队" },
  { id: "JOB-109", queue: "gpu-short", priority: "高", runtime: "2h 05m", status: "运行中" },
  { id: "JOB-110", queue: "cpu-long", priority: "中", runtime: "3h 50m", status: "排队" }
]);

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
const form = ref({
  name: "",
  queue: "",
  scale: "",
  owner: ""
});

let progressTimer;

const submitJob = () => {
  jobs.value.unshift({
    id: `JOB-${Math.floor(Math.random() * 900 + 100)}`,
    queue: form.value.queue,
    priority: "中",
    runtime: "0m",
    status: "排队"
  });
  showForm.value = false;
  form.value = { name: "", queue: "", scale: "", owner: "" };
};

const openProgress = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    progress.value += 12;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(progressTimer);
      if (jobs.value[0]) {
        jobs.value[0].status = "运行中";
      }
    }
  }, 260);
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary,
.secondary,
.ghost {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e0f2fe;
  color: #1d4ed8;
}

.ghost {
  border: 1px solid #cbd5f5;
  background: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

h3 {
  margin: 0 0 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
 td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ok {
  background: #dcfce7;
  color: #166534;
}

.tag.pending {
  background: #fef9c3;
  color: #a16207;
}

.form {
  display: grid;
  gap: 12px;
}

.form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.form input {
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  padding: 8px 10px;
}

.progress {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  transition: width 0.2s ease;
}

.tips {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}
</style>
