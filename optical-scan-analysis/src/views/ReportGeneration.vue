<template>
  <section class="card">
    <h2>报告生成与导出</h2>
    <p>自动整理分析结果，生成可导出的技术报告。</p>
    <div class="toolbar">
      <button @click="openModal('report')">生成报告</button>
      <button class="secondary" @click="openModal('export')">导出进度</button>
      <button class="ghost" @click="openModal('tip')">导出提示</button>
    </div>
  </section>

  <section class="card hero">
    <div>
      <h3>报告内容</h3>
      <ul>
        <li>采集流程记录与设备参数</li>
        <li>分析结果摘要与图表</li>
        <li>优化建议与风险提示</li>
      </ul>
    </div>
    <img :src="heroImage" alt="报告生成示意" />
  </section>

  <section class="card">
    <h3>报告清单</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>报告编号</th>
            <th>车型</th>
            <th>格式</th>
            <th>生成时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.format }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <ModalDialog
    v-if="activeModal === 'report'"
    title="报告生成配置"
    @close="closeModal"
    @confirm="confirmModal"
  >
    <form>
      <label>
        报告模板
        <select v-model="reportForm.template">
          <option>综合技术报告</option>
          <option>光学性能摘要</option>
          <option>建模细节说明</option>
        </select>
      </label>
      <label>
        输出格式
        <select v-model="reportForm.format">
          <option>PDF</option>
          <option>Excel</option>
          <option>PDF + Excel</option>
        </select>
      </label>
      <label>
        追加说明
        <textarea v-model="reportForm.note" rows="3"></textarea>
      </label>
    </form>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'export'"
    title="导出进度"
    :showFooter="false"
    @close="closeModal"
  >
    <p>正在导出技术报告，请稍候。</p>
    <div class="progress-bar">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>导出完成度 {{ progress }}%</p>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'tip'"
    title="导出提示"
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
  id: `REP-${610 + index}`,
  model: `智行EV-${index + 1}`,
  format: index % 2 === 0 ? "PDF" : "Excel",
  time: `2024-0${(index % 9) + 1}-1${index % 9}`,
  status: index % 3 === 0 ? "已发送" : "可下载"
}));

const activeModal = ref("");
const progress = ref(35);
const reportForm = ref({
  template: "综合技术报告",
  format: "PDF",
  note: ""
});
const tipMessage = "导出前请确认分析结果已锁定，避免版本冲突。";

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
    if (activeModal.value !== "export") {
      return;
    }
    progress.value = progress.value >= 100 ? 100 : progress.value + 9;
    if (progress.value === 100) {
      clearInterval(interval);
    }
  }, 320);
});
</script>
