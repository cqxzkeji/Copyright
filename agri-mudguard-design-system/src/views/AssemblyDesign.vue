<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h2>组合方案配置与装配设计</h2>
        <p>支持前后轮、左右轮多挡泥板模块化组合与装配关系校验。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('scheme')">新建组合方案</button>
        <button class="ghost" @click="openModal('check')">空间干涉检查</button>
        <button class="ghost" @click="openModal('tip')">装配提示信息</button>
      </div>
    </header>

    <div class="layout">
      <div class="panel">
        <h3>组合装配示意</h3>
        <img :src="hero" alt="组合装配示意" />
        <ul class="list">
          <li>前轮挡泥板：双片式组合</li>
          <li>后轮挡泥板：分段式包覆</li>
          <li>装配基准：底盘节点 A-12</li>
        </ul>
        <button class="primary" @click="openModal('progress')">自动装配生成</button>
      </div>
      <div class="panel">
        <h3>组合方案清单</h3>
        <table>
          <thead>
            <tr>
              <th>方案编号</th>
              <th>组合形式</th>
              <th>轮位</th>
              <th>安装基准</th>
              <th>干涉等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in schemes" :key="item.code">
              <td>{{ item.code }}</td>
              <td>{{ item.mode }}</td>
              <td>{{ item.position }}</td>
              <td>{{ item.base }}</td>
              <td>{{ item.level }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppModal
      :show="activeModal === 'scheme'"
      title="新建组合方案"
      width="560px"
      :onClose="closeModal"
    >
      <form class="modal-form" @submit.prevent="submitScheme">
        <label>
          方案名称
          <input v-model="schemeForm.name" placeholder="例如：前后轮一体化" required />
        </label>
        <div class="form-grid">
          <label>
            轮位
            <select v-model="schemeForm.position">
              <option>前轮-左右</option>
              <option>后轮-左右</option>
              <option>全轮覆盖</option>
            </select>
          </label>
          <label>
            组合形式
            <select v-model="schemeForm.mode">
              <option>双片式</option>
              <option>分段式</option>
              <option>一体式</option>
            </select>
          </label>
          <label>
            装配基准
            <input v-model="schemeForm.base" />
          </label>
          <label>
            安装孔位数量
            <input v-model="schemeForm.holes" type="number" />
          </label>
        </div>
        <label>
          说明
          <textarea v-model="schemeForm.note" rows="3"></textarea>
        </label>
        <button class="primary" type="submit">保存方案</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'check'"
      title="空间干涉检查"
      width="520px"
      :onClose="closeModal"
    >
      <p>选择需要校验的装配方案，系统将自动完成空间干涉分析。</p>
      <form class="modal-form" @submit.prevent="openModal('progress')">
        <label>
          目标方案
          <select>
            <option>AS-01 前轮双片式</option>
            <option>AS-08 后轮分段式</option>
            <option>AS-14 全轮一体式</option>
          </select>
        </label>
        <label>
          精度等级
          <select>
            <option>标准</option>
            <option>高精度</option>
          </select>
        </label>
        <button class="primary" type="submit">开始检查</button>
      </form>
    </AppModal>

    <AppModal
      :show="activeModal === 'tip'"
      title="装配提示信息"
      width="420px"
      :onClose="closeModal"
    >
      <p>装配完成后可生成装配关系报告，并自动标注干涉位置。</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">了解</button>
      </template>
    </AppModal>

    <AppModal
      :show="activeModal === 'progress'"
      title="装配关系计算中"
      width="480px"
      :onClose="closeModal"
    >
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>正在匹配轮位与支架位置，计算干涉系数。</p>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">关闭</button>
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

const schemeForm = reactive({
  name: "前后轮一体化",
  position: "全轮覆盖",
  mode: "一体式",
  base: "节点 A-12",
  holes: 6,
  note: "适配大扭矩底盘。",
});

const schemes = Array.from({ length: 20 }, (_, index) => ({
  code: `AS-${String(index + 1).padStart(2, "0")}`,
  mode: index % 3 === 0 ? "一体式" : index % 3 === 1 ? "双片式" : "分段式",
  position: index % 2 === 0 ? "前轮" : "后轮",
  base: `节点 B-${index + 5}`,
  level: index % 4 === 0 ? "低" : index % 4 === 1 ? "中" : "高",
}));

const openModal = (name) => {
  activeModal.value = name;
  if (name === "progress") {
    progress.value = 0;
    const timer = setInterval(() => {
      progress.value += 14;
      if (progress.value >= 100) {
        progress.value = 100;
        clearInterval(timer);
      }
    }, 220);
  }
};

const closeModal = () => {
  activeModal.value = "";
};

const submitScheme = () => {
  activeModal.value = "tip";
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

.layout {
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

.list {
  padding-left: 18px;
  color: #475569;
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
.modal-form select,
.modal-form textarea {
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
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
