<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>挡泥板参数化建模</h2>
        <p>支持长度、宽度、弯曲半径、厚度与安装孔位的参数化输入。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('create')">新增参数模型</button>
        <button class="ghost" @click="openModal('import')">导入模板</button>
        <button class="ghost" @click="openModal('preview')">模型预览提示</button>
      </div>
    </header>

    <div class="content-grid">
      <div class="panel">
        <h3>建模示意</h3>
        <img :src="hero" alt="参数化建模示意" />
        <div class="specs">
          <div>
            <span>当前模板</span>
            <strong>MT-Front-220</strong>
          </div>
          <div>
            <span>适配底盘</span>
            <strong>四驱农机 A1</strong>
          </div>
          <div>
            <span>标准厚度</span>
            <strong>6.5 mm</strong>
          </div>
        </div>
        <button class="primary" @click="openModal('progress')">生成三维模型</button>
      </div>
      <div class="panel">
        <h3>参数库列表</h3>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>长度(mm)</th>
              <th>宽度(mm)</th>
              <th>弯曲半径(mm)</th>
              <th>厚度(mm)</th>
              <th>孔位数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paramRows" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.length }}</td>
              <td>{{ item.width }}</td>
              <td>{{ item.radius }}</td>
              <td>{{ item.thickness }}</td>
              <td>{{ item.holes }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModal
      :show="activeModal === 'create'"
      title="新增参数模型"
      width="560px"
      :onClose="closeModal"
    >
      <form class="modal-form" @submit.prevent="submitModel">
        <label>
          模型名称
          <input v-model="modelForm.name" placeholder="请输入模型名称" required />
        </label>
        <div class="form-grid">
          <label>
            长度(mm)
            <input v-model="modelForm.length" type="number" />
          </label>
          <label>
            宽度(mm)
            <input v-model="modelForm.width" type="number" />
          </label>
          <label>
            弯曲半径(mm)
            <input v-model="modelForm.radius" type="number" />
          </label>
          <label>
            厚度(mm)
            <input v-model="modelForm.thickness" type="number" />
          </label>
          <label>
            孔位数量
            <input v-model="modelForm.holes" type="number" />
          </label>
          <label>
            适配底盘
            <input v-model="modelForm.chassis" />
          </label>
        </div>
        <button class="primary" type="submit">保存模型</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'import'"
      title="导入参数模板"
      width="520px"
      :onClose="closeModal"
    >
      <p>请选择需要导入的模板文件，并设置版本标签。</p>
      <form class="modal-form" @submit.prevent="closeModal">
        <label>
          模板文件
          <input type="text" placeholder="例如：front-mudguard.xlsx" />
        </label>
        <label>
          版本标签
          <input type="text" placeholder="V2.1" />
        </label>
        <button class="primary" type="submit">确认导入</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'preview'"
      title="模型预览提示"
      width="420px"
      :onClose="closeModal"
    >
      <p>预览将展示不同参数下的挡泥板形态，支持快速比对。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">开始预览</button>
      </template>
    </AppModal>

    <AppModal
      :show="activeModal === 'progress'"
      title="三维模型生成中"
      width="480px"
      :onClose="closeModal"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>正在计算参数曲面并输出模型文件。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">后台运行</button>
      </template>
    </AppModal>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import AppModal from "../components/AppModal.vue";
import hero from "../assets/mudguard.svg";

const activeModal = ref("");
const progress = ref(0);

const modelForm = reactive({
  name: "前轮防护挡泥板",
  length: 780,
  width: 260,
  radius: 120,
  thickness: 6.5,
  holes: 4,
  chassis: "四驱农机 A1",
});

const paramRows = Array.from({ length: 20 }, (_, index) => ({
  id: `PM-${index + 1}`,
  length: 700 + index * 8,
  width: 220 + (index % 4) * 8,
  radius: 90 + (index % 5) * 6,
  thickness: (5.5 + (index % 3) * 0.5).toFixed(1),
  holes: 4 + (index % 3),
}));

const openModal = (name) => {
  activeModal.value = name;
  if (name === "progress") {
    progress.value = 0;
    const timer = setInterval(() => {
      progress.value += 15;
      if (progress.value >= 100) {
        progress.value = 100;
        clearInterval(timer);
      }
    }, 240);
  }
};

const closeModal = () => {
  activeModal.value = "";
};

const submitModel = () => {
  activeModal.value = "preview";
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin-top: 6px;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: #f1f5f9;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 18px;
}

.panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
}

.panel h3 {
  margin-top: 0;
}

.specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin: 12px 0 18px;
}

.specs span {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

.specs strong {
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  border-bottom: 1px solid #e5e7eb;
  padding: 8px;
  text-align: left;
}

thead {
  background: #f8fafc;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-form input,
.modal-form textarea,
.modal-form select {
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.progress {
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.3s ease;
}

@media (max-width: 1100px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
