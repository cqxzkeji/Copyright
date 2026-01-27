<template>
  <section class="card">
    <h2>光学扫描数据采集</h2>
    <p>连接高精度光学扫描设备，覆盖车辆外部与内部纹理细节。</p>
    <div class="toolbar">
      <button @click="openModal('scan')">启动扫描任务</button>
      <button class="secondary" @click="openModal('device')">设备校准</button>
      <button class="ghost" @click="openModal('tip')">采集提示</button>
    </div>
  </section>

  <section class="card hero">
    <div>
      <h3>采集覆盖区域</h3>
      <ul>
        <li>外观：车身面板、灯罩、玻璃曲面</li>
        <li>内饰：中控台、座椅纹理、功能按键</li>
        <li>底盘：电池包外壳、悬挂结构</li>
      </ul>
    </div>
    <img :src="heroImage" alt="采集区域示意" />
  </section>

  <section class="card">
    <h3>采集任务清单</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>区域</th>
            <th>设备</th>
            <th>分辨率</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.area }}</td>
            <td>{{ item.device }}</td>
            <td>{{ item.resolution }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <ModalDialog
    v-if="activeModal === 'scan'"
    title="启动扫描任务"
    @close="closeModal"
    @confirm="confirmModal"
  >
    <form>
      <label>
        任务名称
        <input v-model="scanForm.name" type="text" />
      </label>
      <label>
        扫描区域
        <select v-model="scanForm.area">
          <option>整车外观</option>
          <option>座舱内饰</option>
          <option>电池仓区域</option>
        </select>
      </label>
      <label>
        精度等级
        <select v-model="scanForm.precision">
          <option>超高精度</option>
          <option>高精度</option>
          <option>标准</option>
        </select>
      </label>
      <label>
        备注
        <textarea v-model="scanForm.note" rows="3"></textarea>
      </label>
    </form>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'device'"
    title="设备校准进度"
    :showFooter="false"
    @close="closeModal"
  >
    <p>正在校准激光扫描仪，请保持设备静止。</p>
    <div class="progress-bar">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>校准完成度 {{ progress }}%</p>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'tip'"
    title="采集提示"
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
  id: `COL-${200 + index}`,
  area: ["车顶", "车门", "仪表台", "座椅", "后备厢"][index % 5],
  device: ["激光扫描仪", "摄影测量阵列", "结构光扫描仪"][index % 3],
  resolution: `${0.2 + (index % 4) * 0.05} mm`,
  status: index % 2 === 0 ? "已完成" : "待采集"
}));

const activeModal = ref("");
const progress = ref(40);
const scanForm = ref({
  name: "外观高精度扫描",
  area: "整车外观",
  precision: "高精度",
  note: ""
});
const tipMessage = "采集前请确保车身清洁且环境光稳定，以减少反射噪声。";

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
    if (activeModal.value !== "device") {
      return;
    }
    progress.value = progress.value >= 100 ? 100 : progress.value + 10;
    if (progress.value === 100) {
      clearInterval(interval);
    }
  }, 300);
});
</script>
