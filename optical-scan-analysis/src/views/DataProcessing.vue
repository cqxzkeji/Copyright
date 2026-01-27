<template>
  <section class="card">
    <h2>数据处理与优化</h2>
    <p>对原始点云数据进行噪声过滤、重建修复与模型优化。</p>
    <div class="toolbar">
      <button @click="openModal('filter')">噪声过滤方案</button>
      <button class="secondary" @click="openModal('rebuild')">重建修复任务</button>
      <button class="ghost" @click="openModal('tip')">算法提示</button>
    </div>
  </section>

  <section class="card hero">
    <div>
      <h3>处理策略</h3>
      <ol>
        <li>激光点云降噪与分层剔除</li>
        <li>缺失区域自动重建</li>
        <li>曲面细节增强与采样优化</li>
      </ol>
    </div>
    <img :src="heroImage" alt="处理策略示意" />
  </section>

  <section class="card">
    <h3>处理任务明细</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>批次</th>
            <th>点云数量</th>
            <th>算法</th>
            <th>处理耗时</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.batch">
            <td>{{ item.batch }}</td>
            <td>{{ item.points }}</td>
            <td>{{ item.algorithm }}</td>
            <td>{{ item.duration }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <ModalDialog
    v-if="activeModal === 'filter'"
    title="噪声过滤方案"
    @close="closeModal"
    @confirm="confirmModal"
  >
    <form>
      <label>
        滤波模式
        <select v-model="filterForm.mode">
          <option>自适应半径滤波</option>
          <option>统计离群点剔除</option>
          <option>双边滤波</option>
        </select>
      </label>
      <label>
        阈值参数
        <input v-model="filterForm.threshold" type="number" step="0.1" />
      </label>
      <label>
        保留细节
        <select v-model="filterForm.detail">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </label>
    </form>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'rebuild'"
    title="重建修复进度"
    :showFooter="false"
    @close="closeModal"
  >
    <p>正在修复缺失网格，请稍候。</p>
    <div class="progress-bar">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>修复完成度 {{ progress }}%</p>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'tip'"
    title="算法提示"
    :showFooter="false"
    @close="closeModal"
  >
    <p>{{ tipMessage }}</p>
  </ModalDialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ModalDialog from "../components/ModalDialog.vue";
import heroImage from "../assets/scan-visual.svg";

const records = Array.from({ length: 20 }, (_, index) => ({
  batch: `PROC-${310 + index}`,
  points: `${4.2 + index * 0.2}M`,
  algorithm: ["双边滤波", "泊松重建", "曲面拟合"][index % 3],
  duration: `${18 + index} min`,
  status: index % 2 === 0 ? "已完成" : "处理中"
}));

const activeModal = ref("");
const progress = ref(30);
const filterForm = ref({
  mode: "自适应半径滤波",
  threshold: 1.8,
  detail: "高"
});
const tipMessage = "建议在高反光区域使用双边滤波以保留细节纹理。";

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
    if (activeModal.value !== "rebuild") {
      return;
    }
    progress.value = progress.value >= 100 ? 100 : progress.value + 7;
    if (progress.value === 100) {
      clearInterval(interval);
    }
  }, 280);
});
</script>
