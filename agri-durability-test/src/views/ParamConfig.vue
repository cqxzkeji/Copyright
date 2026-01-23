<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>连接板参数配置</h3>
        <p>配置连接板型号、尺寸、材料与安装方式，作为耐久测试基础数据。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openModal('add')">新增型号</button>
        <button class="btn light" @click="openModal('import')">批量导入</button>
        <button class="btn light" @click="openModal('check')">安装校验</button>
        <button class="btn primary" @click="openModal('save')">保存配置</button>
      </div>
    </div>

    <div class="panel grid">
      <div class="card">
        <h4>参数概览</h4>
        <ul>
          <li>已配置型号：{{ configs.length }} 个</li>
          <li>材料库：8 种</li>
          <li>安装方式：螺栓 + 焊接组合</li>
          <li>计划使用寿命：12,000 小时</li>
        </ul>
      </div>
      <div class="card">
        <h4>结构示意</h4>
        <div class="chart">
          <svg viewBox="0 0 320 160" aria-label="连接板结构示意">
            <rect x="20" y="30" width="280" height="100" rx="18" fill="#e3ecff" />
            <circle cx="70" cy="80" r="16" fill="#2b77f3" />
            <circle cx="160" cy="80" r="16" fill="#2b77f3" />
            <circle cx="250" cy="80" r="16" fill="#2b77f3" />
            <line x1="40" y1="120" x2="280" y2="120" stroke="#8fb0f7" stroke-width="6" />
          </svg>
        </div>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>型号</th>
            <th>尺寸 (mm)</th>
            <th>材料</th>
            <th>安装方式</th>
            <th>设计载荷 (kN)</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in configs" :key="item.model">
            <td>{{ item.model }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.material }}</td>
            <td>{{ item.mount }}</td>
            <td>{{ item.load }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'add'" title="新增连接板型号" @close="closeModal">
      <form class="modal-form" @submit.prevent="handleSubmit('已新增型号并进入待检列表')">
        <label>
          型号编号
          <input v-model="form.model" required placeholder="例如：LP-300" />
        </label>
        <label>
          尺寸组合
          <input v-model="form.size" required placeholder="300×120×16" />
        </label>
        <label>
          材料
          <select v-model="form.material">
            <option>高强度钢 40Cr</option>
            <option>低合金钢 Q345</option>
            <option>耐磨钢 NM400</option>
          </select>
        </label>
        <button class="btn primary" type="submit">提交新增</button>
      </form>
    </BaseModal>

    <BaseModal v-if="activeModal === 'import'" title="批量导入配置" @close="closeModal">
      <p>已检测到 3 份参数模板，可选择导入并合并现有配置。</p>
      <div class="modal-grid">
        <button class="btn light" @click="handleSubmit('已导入 20 条模板配置')">导入默认模板</button>
        <button class="btn light" @click="handleSubmit('已导入供应商型号清单')">导入供应商清单</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'check'" title="安装方式校验" @close="closeModal">
      <p>系统将检查螺栓间距、焊缝长度与安装角度。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <button class="btn primary" @click="startProgress">开始校验</button>
    </BaseModal>

    <BaseModal v-if="activeModal === 'save'" title="保存配置提示" @close="closeModal">
      <p>当前配置已同步到测试任务库，版本号：V{{ version }}。</p>
      <p>是否继续生成新的耐久试验工况？</p>
      <button class="btn primary" @click="handleSubmit('已生成新的耐久工况任务')">继续生成</button>
    </BaseModal>

    <BaseModal v-if="activeModal === 'info'" title="操作完成" @close="closeModal">
      <p>{{ message }}</p>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const activeModal = ref("");
const message = ref("");
const progress = ref(0);
const version = ref("2.3.1");
const form = ref({
  model: "",
  size: "",
  material: "高强度钢 40Cr"
});

const configs = Array.from({ length: 20 }, (_, index) => ({
  model: `LP-${300 + index}`,
  size: `${280 + index * 2}×${120 + (index % 5)}×${14 + (index % 3)}`,
  material: ["高强度钢 40Cr", "低合金钢 Q345", "耐磨钢 NM400"][index % 3],
  mount: index % 2 === 0 ? "螺栓-焊接" : "双螺栓固定",
  load: 55 + index,
  status: index % 2 === 0 ? "已验证" : "待校验"
}));

const openModal = (type) => {
  activeModal.value = type;
  message.value = "";
};

const closeModal = () => {
  activeModal.value = "";
  progress.value = 0;
};

const handleSubmit = (text) => {
  message.value = text;
  activeModal.value = "info";
};

const startProgress = () => {
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      clearInterval(timer);
      handleSubmit("安装方式校验完成，全部连接板满足装配规范。");
    }
  }, 200);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.module-header h3 {
  font-size: 20px;
  color: #1c2a4a;
  margin-bottom: 6px;
}

.module-header p {
  color: #6b7c98;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  border: none;
  background: #e8efff;
  color: #2a4b8d;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.btn.light {
  background: #f5f7ff;
}

.btn.primary {
  background: #2b77f3;
  color: #fff;
}

.panel.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.card h4 {
  margin-bottom: 12px;
  color: #24314d;
}

.card ul {
  list-style: none;
  display: grid;
  gap: 6px;
  color: #5f6f8c;
}

.chart {
  display: grid;
  place-items: center;
  height: 160px;
}

.table-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

th,
td {
  padding: 12px 10px;
  text-align: left;
  font-size: 14px;
}

th {
  color: #6b7c98;
  font-weight: 600;
  border-bottom: 1px solid #e6edf7;
}

td {
  color: #2d3b55;
  border-bottom: 1px solid #f0f4fb;
}

.tag {
  background: #e6f1ff;
  color: #2463d6;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  color: #41506a;
  font-weight: 600;
}

.modal-form input,
.modal-form select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d6deea;
  background: #f8faff;
}

.modal-grid {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.progress {
  height: 10px;
  background: #edf1f8;
  border-radius: 999px;
  overflow: hidden;
  margin: 16px 0 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2b77f3, #6aa8ff);
  transition: width 0.2s ease;
}
</style>
