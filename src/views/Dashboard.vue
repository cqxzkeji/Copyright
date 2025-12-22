<template>
  <div class="module">
    <section class="actions">
      <button class="primary" type="button" @click="showForm = true">新增监控策略</button>
      <button class="secondary" type="button" @click="openProgress">刷新采样进度</button>
      <button class="ghost" type="button" @click="showTip = true">查看提示</button>
    </section>

    <div class="grid">
      <BarChart title="节点资源负载 (10分钟)" :labels="chartLabels" :values="chartValues" />
      <div class="card">
        <h3>资源概览表</h3>
        <table>
          <thead>
            <tr>
              <th>节点</th>
              <th>CPU</th>
              <th>GPU</th>
              <th>内存</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.node">
              <td>{{ row.node }}</td>
              <td>{{ row.cpu }}%</td>
              <td>{{ row.gpu }}%</td>
              <td>{{ row.mem }}%</td>
              <td><span :class="['tag', row.status === '正常' ? 'ok' : 'warn']">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal :open="showForm" title="新增监控策略" @close="showForm = false">
      <form class="form" @submit.prevent="submitPolicy">
        <label>策略名称<input v-model="form.name" required placeholder="如：GPU峰值告警" /></label>
        <label>指标范围<input v-model="form.metric" required placeholder="CPU/GPU/内存" /></label>
        <label>阈值<input v-model="form.threshold" required placeholder="例如 85%" /></label>
        <label>通知人<input v-model="form.owner" required placeholder="告警负责人" /></label>
        <button class="primary" type="submit">保存策略</button>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="采样任务执行中" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>正在刷新 {{ progress }}% ，完成后将同步最新负载。</p>
    </BaseModal>

    <BaseModal :open="showTip" title="监控提示" @close="showTip = false">
      <ul class="tips">
        <li>建议将GPU阈值控制在 85% 以下。</li>
        <li>异常节点优先检查网络与散热状态。</li>
        <li>每日自动生成资源使用报告。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import BarChart from "../components/BarChart.vue";

const chartLabels = ["N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10"];
const chartValues = [68, 74, 82, 77, 65, 59, 88, 70, 63, 79];

const tableData = ref([
  { node: "node-01", cpu: 72, gpu: 61, mem: 68, status: "正常" },
  { node: "node-02", cpu: 78, gpu: 74, mem: 71, status: "正常" },
  { node: "node-03", cpu: 83, gpu: 89, mem: 76, status: "告警" },
  { node: "node-04", cpu: 64, gpu: 59, mem: 62, status: "正常" },
  { node: "node-05", cpu: 69, gpu: 72, mem: 66, status: "正常" },
  { node: "node-06", cpu: 74, gpu: 78, mem: 71, status: "正常" },
  { node: "node-07", cpu: 81, gpu: 85, mem: 79, status: "告警" },
  { node: "node-08", cpu: 66, gpu: 60, mem: 64, status: "正常" },
  { node: "node-09", cpu: 71, gpu: 69, mem: 67, status: "正常" },
  { node: "node-10", cpu: 76, gpu: 73, mem: 72, status: "正常" }
]);

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
const form = ref({
  name: "",
  metric: "",
  threshold: "",
  owner: ""
});

let progressTimer;

const submitPolicy = () => {
  showForm.value = false;
  form.value = { name: "", metric: "", threshold: "", owner: "" };
};

const openProgress = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      clearInterval(progressTimer);
    }
  }, 300);
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

.tag.warn {
  background: #fee2e2;
  color: #b91c1c;
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
