<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>结果与报告管理</h3>
        <p>保存测试结果，生成并导出耐久性测试报告。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openModal('generate')">生成报告</button>
        <button class="btn light" @click="openModal('archive')">归档结果</button>
        <button class="btn light" @click="openModal('share')">共享报告</button>
        <button class="btn primary" @click="openModal('export')">导出报告</button>
      </div>
    </div>

    <div class="panel">
      <div class="card">
        <h4>报告概览</h4>
        <ul>
          <li>已生成报告：12 份</li>
          <li>待审核报告：3 份</li>
          <li>最新版本：RPT-2024-09</li>
          <li>审核通过率：96%</li>
        </ul>
      </div>
      <div class="card">
        <h4>报告封面预览</h4>
        <div class="cover">
          <div>
            <strong>连接板耐久性测试报告</strong>
            <p>版本：2024-Q3</p>
            <span>生成日期：2024-06-15</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>报告编号</th>
            <th>对应型号</th>
            <th>试验批次</th>
            <th>完成时间</th>
            <th>审核状态</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reports" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.batch }}</td>
            <td>{{ item.date }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
            <td>{{ item.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'generate'" title="生成报告" @close="closeModal">
      <form class="modal-form" @submit.prevent="handleSubmit('报告已生成，已进入审核队列')">
        <label>
          报告模板
          <select>
            <option>标准耐久模板</option>
            <option>关键部件深度模板</option>
            <option>客户定制模板</option>
          </select>
        </label>
        <label>
          审核人
          <input value="李工" />
        </label>
        <button class="btn primary" type="submit">开始生成</button>
      </form>
    </BaseModal>

    <BaseModal v-if="activeModal === 'archive'" title="归档测试结果" @close="closeModal">
      <p>已筛选 6 条试验结果可归档。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <button class="btn primary" @click="startProgress">确认归档</button>
    </BaseModal>

    <BaseModal v-if="activeModal === 'share'" title="共享报告" @close="closeModal">
      <p>选择共享方式。</p>
      <div class="modal-grid">
        <button class="btn light" @click="handleSubmit('已生成共享链接，有效期 7 天')">生成共享链接</button>
        <button class="btn light" @click="handleSubmit('已同步至企业知识库')">同步知识库</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'export'" title="导出报告" @close="closeModal">
      <p>请选择导出格式。</p>
      <div class="modal-grid">
        <button class="btn light" @click="handleSubmit('已导出 PDF 报告')">PDF</button>
        <button class="btn light" @click="handleSubmit('已导出 Word 报告')">Word</button>
        <button class="btn light" @click="handleSubmit('已导出 图片摘要包')">图片摘要包</button>
      </div>
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

const reports = Array.from({ length: 20 }, (_, index) => ({
  id: `RPT-2024-${String(index + 1).padStart(2, "0")}`,
  model: `LP-${320 + index}`,
  batch: `B-${1200 + index}`,
  date: `2024-06-${String((index % 28) + 1).padStart(2, "0")}`,
  status: index % 3 === 0 ? "已通过" : index % 3 === 1 ? "待审核" : "修订中",
  owner: ["李工", "张工", "王工"][index % 3]
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
    progress.value += 25;
    if (progress.value >= 100) {
      clearInterval(timer);
      handleSubmit("结果归档完成，已生成归档目录。");
    }
  }, 180);
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
  flex-wrap: wrap;
  gap: 20px;
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

.panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.cover {
  height: 150px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e0ebff, #f5f7ff);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #2a4b8d;
  padding: 12px;
}

.cover p {
  margin-top: 6px;
  color: #4b5d7c;
}

.cover span {
  display: block;
  margin-top: 4px;
  color: #6b7c98;
  font-size: 12px;
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
  background: #e9f7ef;
  color: #1f7a4c;
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

.modal-form select,
.modal-form input {
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

@media (max-width: 980px) {
  .panel {
    grid-template-columns: 1fr;
  }
}
</style>
