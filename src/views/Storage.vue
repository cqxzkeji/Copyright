<template>
  <div class="module">
    <section class="actions">
      <button class="primary" type="button" @click="showForm = true">创建数据集</button>
      <button class="secondary" type="button" @click="openProgress">执行数据同步</button>
      <button class="ghost" type="button" @click="showTip = true">存储提示</button>
    </section>

    <div class="grid">
      <BarChart title="存储IO吞吐 (GB/s)" :labels="chartLabels" :values="chartValues" />
      <div class="card">
        <h3>存储与数据清单</h3>
        <table>
          <thead>
            <tr>
              <th>数据集</th>
              <th>类型</th>
              <th>容量</th>
              <th>副本</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.size }}</td>
              <td>{{ item.replica }}</td>
              <td><span :class="['tag', item.status === '可用' ? 'ok' : 'warn']">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal :open="showForm" title="创建数据集" @close="showForm = false">
      <form class="form" @submit.prevent="submitDataset">
        <label>数据集名称<input v-model="form.name" required placeholder="train-dataset" /></label>
        <label>存储类型<input v-model="form.type" required placeholder="对象存储/并行文件系统" /></label>
        <label>容量规划<input v-model="form.size" required placeholder="如 20TB" /></label>
        <label>副本策略<input v-model="form.replica" required placeholder="3副本" /></label>
        <button class="primary" type="submit">创建</button>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="数据同步进度" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>已完成 {{ progress }}%，正在同步跨域数据。</p>
    </BaseModal>

    <BaseModal :open="showTip" title="存储提示" @close="showTip = false">
      <ul class="tips">
        <li>冷热数据分层可提升总体吞吐。</li>
        <li>副本策略建议不低于 3。</li>
        <li>同步过程中避免高频写入。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import BarChart from "../components/BarChart.vue";

const chartLabels = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
const chartValues = [8.4, 7.9, 9.1, 8.7, 7.5, 9.3, 8.9, 7.8, 9.0, 8.6];

const items = ref([
  { name: "dataset-a", type: "并行文件系统", size: "12TB", replica: "3", status: "可用" },
  { name: "dataset-b", type: "对象存储", size: "8TB", replica: "2", status: "可用" },
  { name: "dataset-c", type: "归档存储", size: "18TB", replica: "3", status: "预警" },
  { name: "dataset-d", type: "并行文件系统", size: "6TB", replica: "2", status: "可用" },
  { name: "dataset-e", type: "对象存储", size: "10TB", replica: "3", status: "可用" },
  { name: "dataset-f", type: "归档存储", size: "22TB", replica: "3", status: "预警" },
  { name: "dataset-g", type: "并行文件系统", size: "15TB", replica: "3", status: "可用" },
  { name: "dataset-h", type: "对象存储", size: "9TB", replica: "2", status: "可用" },
  { name: "dataset-i", type: "归档存储", size: "14TB", replica: "3", status: "可用" },
  { name: "dataset-j", type: "并行文件系统", size: "11TB", replica: "3", status: "可用" }
]);

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
const form = ref({
  name: "",
  type: "",
  size: "",
  replica: ""
});

let progressTimer;

const submitDataset = () => {
  items.value.unshift({
    name: form.value.name,
    type: form.value.type,
    size: form.value.size,
    replica: form.value.replica,
    status: "可用"
  });
  showForm.value = false;
  form.value = { name: "", type: "", size: "", replica: "" };
};

const openProgress = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    progress.value += 14;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(progressTimer);
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

.tag.warn {
  background: #fef3c7;
  color: #92400e;
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
