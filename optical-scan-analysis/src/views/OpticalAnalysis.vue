<template>
  <section class="card">
    <h2>光学性能分析</h2>
    <p>评估车身表面的反射、折射与材料光学表现。</p>
    <div class="toolbar">
      <button @click="openModal('analyze')">启动光学分析</button>
      <button class="secondary" @click="openModal('simulate')">仿真进度</button>
      <button class="ghost" @click="openModal('tip')">分析提示</button>
    </div>
  </section>

  <section class="card hero">
    <div>
      <h3>分析维度</h3>
      <ul>
        <li>光照均匀性与眩光评估</li>
        <li>材料折射率与色偏分析</li>
        <li>车身表面反射率分布</li>
      </ul>
    </div>
    <img :src="heroImage" alt="光学分析示意" />
  </section>

  <section class="card">
    <h3>光学测量样本</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>样本编号</th>
            <th>部位</th>
            <th>反射率</th>
            <th>折射率</th>
            <th>评估结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.part }}</td>
            <td>{{ item.reflect }}</td>
            <td>{{ item.refract }}</td>
            <td>{{ item.result }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <ModalDialog
    v-if="activeModal === 'analyze'"
    title="光学分析配置"
    @close="closeModal"
    @confirm="confirmModal"
  >
    <form>
      <label>
        分析模式
        <select v-model="analysisForm.mode">
          <option>反射均匀性</option>
          <option>折射率分布</option>
          <option>光泽度评估</option>
        </select>
      </label>
      <label>
        光照条件
        <select v-model="analysisForm.light">
          <option>标准室内光</option>
          <option>日光模拟</option>
          <option>夜间灯光</option>
        </select>
      </label>
      <label>
        输出精度
        <select v-model="analysisForm.precision">
          <option>高</option>
          <option>标准</option>
          <option>快速</option>
        </select>
      </label>
    </form>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'simulate'"
    title="仿真进度"
    :showFooter="false"
    @close="closeModal"
  >
    <p>正在进行光照仿真计算。</p>
    <div class="progress-bar">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>仿真完成度 {{ progress }}%</p>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'tip'"
    title="分析提示"
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
  id: `OPT-${510 + index}`,
  part: ["车门", "侧窗", "尾灯", "仪表台", "中控屏"][index % 5],
  reflect: `${42 + index % 10}%`,
  refract: (1.3 + (index % 6) * 0.02).toFixed(2),
  result: index % 3 === 0 ? "优秀" : index % 3 === 1 ? "良好" : "需优化"
}));

const activeModal = ref("");
const progress = ref(25);
const analysisForm = ref({
  mode: "反射均匀性",
  light: "标准室内光",
  precision: "高"
});
const tipMessage = "高光区域建议提高采样密度以获得更准确的反射率曲线。";

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
    if (activeModal.value !== "simulate") {
      return;
    }
    progress.value = progress.value >= 100 ? 100 : progress.value + 8;
    if (progress.value === 100) {
      clearInterval(interval);
    }
  }, 300);
});
</script>
