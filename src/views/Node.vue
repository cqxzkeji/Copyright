<template>
  <div class="module">
    <section class="actions">
      <button class="primary" type="button" @click="showForm = true">新增节点</button>
      <button class="secondary" type="button" @click="openProgress">下发环境更新</button>
      <button class="ghost" type="button" @click="showTip = true">维护提示</button>
    </section>

    <div class="grid">
      <BarChart title="节点健康评分" :labels="chartLabels" :values="chartValues" />
      <div class="card">
        <h3>节点与环境列表</h3>
        <table>
          <thead>
            <tr>
              <th>节点</th>
              <th>镜像</th>
              <th>内核</th>
              <th>温度</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="node in nodes" :key="node.name">
              <td>{{ node.name }}</td>
              <td>{{ node.image }}</td>
              <td>{{ node.kernel }}</td>
              <td>{{ node.temp }}℃</td>
              <td><span :class="['tag', node.status === '稳定' ? 'ok' : 'warn']">{{ node.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal :open="showForm" title="新增节点" @close="showForm = false">
      <form class="form" @submit.prevent="submitNode">
        <label>节点名称<input v-model="form.name" required placeholder="node-11" /></label>
        <label>环境镜像<input v-model="form.image" required placeholder="cuda11.8-base" /></label>
        <label>内核版本<input v-model="form.kernel" required placeholder="5.15.0" /></label>
        <label>机柜位置<input v-model="form.rack" required placeholder="R2-08" /></label>
        <button class="primary" type="submit">保存节点</button>
      </form>
    </BaseModal>

    <BaseModal :open="showProgress" title="环境更新进度" @close="showProgress = false">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>已完成 {{ progress }}%，正在批量更新节点环境。</p>
    </BaseModal>

    <BaseModal :open="showTip" title="节点维护提示" @close="showTip = false">
      <ul class="tips">
        <li>建议每周执行一次固件巡检。</li>
        <li>高温节点需优先清理风道。</li>
        <li>环境更新后自动校验驱动。</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";
import BarChart from "../components/BarChart.vue";

const chartLabels = ["N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10"];
const chartValues = [92, 88, 84, 90, 86, 79, 93, 87, 81, 85];

const nodes = ref([
  { name: "node-01", image: "cuda11.8", kernel: "5.15.0", temp: 54, status: "稳定" },
  { name: "node-02", image: "cuda12.1", kernel: "5.19.0", temp: 61, status: "稳定" },
  { name: "node-03", image: "cuda11.7", kernel: "5.10.0", temp: 72, status: "关注" },
  { name: "node-04", image: "cuda11.8", kernel: "5.15.0", temp: 55, status: "稳定" },
  { name: "node-05", image: "cuda12.0", kernel: "5.18.0", temp: 63, status: "稳定" },
  { name: "node-06", image: "cuda11.6", kernel: "5.4.0", temp: 68, status: "关注" },
  { name: "node-07", image: "cuda11.8", kernel: "5.15.0", temp: 57, status: "稳定" },
  { name: "node-08", image: "cuda12.1", kernel: "5.19.0", temp: 60, status: "稳定" },
  { name: "node-09", image: "cuda11.7", kernel: "5.10.0", temp: 70, status: "关注" },
  { name: "node-10", image: "cuda11.8", kernel: "5.15.0", temp: 58, status: "稳定" }
]);

const showForm = ref(false);
const showProgress = ref(false);
const showTip = ref(false);
const progress = ref(0);
const form = ref({
  name: "",
  image: "",
  kernel: "",
  rack: ""
});

let progressTimer;

const submitNode = () => {
  nodes.value.unshift({
    name: form.value.name,
    image: form.value.image,
    kernel: form.value.kernel,
    temp: 52,
    status: "稳定"
  });
  showForm.value = false;
  form.value = { name: "", image: "", kernel: "", rack: "" };
};

const openProgress = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    progress.value += 15;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(progressTimer);
    }
  }, 280);
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
