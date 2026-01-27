<template>
  <section class="card">
    <h2>3D建模与可视化</h2>
    <p>通过处理后的点云数据生成高精度三维模型并实时渲染。</p>
    <div class="toolbar">
      <button @click="openModal('model')">生成建模方案</button>
      <button class="secondary" @click="openModal('render')">启动渲染</button>
      <button class="ghost" @click="openModal('tip')">可视化提示</button>
    </div>
  </section>

  <section class="card hero">
    <div>
      <h3>可视化功能</h3>
      <ul>
        <li>车身结构分层显示</li>
        <li>关键部件高亮</li>
        <li>实时截面剖切</li>
      </ul>
    </div>
    <img :src="heroImage" alt="3D建模示意" />
  </section>

  <section class="card">
    <h3>模型构建进度</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>模型ID</th>
            <th>部件</th>
            <th>网格数</th>
            <th>渲染质量</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.part }}</td>
            <td>{{ item.meshes }}</td>
            <td>{{ item.quality }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <ModalDialog
    v-if="activeModal === 'model'"
    title="建模方案配置"
    @close="closeModal"
    @confirm="confirmModal"
  >
    <form>
      <label>
        建模精度
        <select v-model="modelForm.precision">
          <option>超高</option>
          <option>高</option>
          <option>标准</option>
        </select>
      </label>
      <label>
        输出格式
        <select v-model="modelForm.format">
          <option>OBJ</option>
          <option>FBX</option>
          <option>GLTF</option>
        </select>
      </label>
      <label>
        细节增强
        <select v-model="modelForm.detail">
          <option>开启</option>
          <option>关闭</option>
        </select>
      </label>
    </form>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'render'"
    title="渲染进度"
    :showFooter="false"
    @close="closeModal"
  >
    <p>渲染引擎正在合成光照与材质。</p>
    <div class="progress-bar">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>渲染完成度 {{ progress }}%</p>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'tip'"
    title="可视化提示"
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
  id: `MODEL-${410 + index}`,
  part: ["车顶", "仪表台", "前脸", "轮毂", "尾灯"][index % 5],
  meshes: `${120 + index * 6}k`,
  quality: ["高", "标准", "超高"][index % 3],
  status: index % 2 === 0 ? "已完成" : "渲染中"
}));

const activeModal = ref("");
const progress = ref(45);
const modelForm = ref({
  precision: "高",
  format: "GLTF",
  detail: "开启"
});
const tipMessage = "建议在可视化阶段启用分层渲染以提升交互效率。";

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
    if (activeModal.value !== "render") {
      return;
    }
    progress.value = progress.value >= 100 ? 100 : progress.value + 6;
    if (progress.value === 100) {
      clearInterval(interval);
    }
  }, 260);
});
</script>
