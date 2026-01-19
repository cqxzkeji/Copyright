<template>
  <div class="module-page">
    <section class="summary">
      <div class="summary-card">
        <h3>统一接入</h3>
        <p>接入中数据源</p>
        <strong>18</strong>
      </div>
      <div class="summary-card">
        <h3>清洗任务</h3>
        <p>今日处理批次</p>
        <strong>42</strong>
      </div>
      <div class="summary-card">
        <h3>特征库</h3>
        <p>已发布特征</p>
        <strong>126</strong>
      </div>
    </section>

    <section class="panel">
      <header class="panel-header">
        <h2>数据接入与特征构建</h2>
        <div class="actions">
          <button class="primary" @click="openModal('source')">新增数据源</button>
          <button class="ghost" @click="openModal('clean')">启动清洗任务</button>
          <button class="ghost" @click="openModal('version')">保存数据版本</button>
        </div>
      </header>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-title">数据接入趋势</div>
          <div class="bars">
            <span v-for="bar in chartBars" :key="bar.label" :style="{ height: bar.value + '%' }">
              <em>{{ bar.label }}</em>
            </span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>数据集</th>
                <th>类型</th>
                <th>状态</th>
                <th>特征数</th>
                <th>负责人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.name">
                <td>{{ row.name }}</td>
                <td>{{ row.type }}</td>
                <td>
                  <span :class="['tag', row.statusClass]">{{ row.status }}</span>
                </td>
                <td>{{ row.features }}</td>
                <td>{{ row.owner }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <Modal :show="modal.type === 'source'" title="新增数据源" @close="closeModal">
      <form class="modal-form" @submit.prevent="submitModal('已创建新的数据源配置')">
        <label>
          数据源名称
          <input v-model="form.sourceName" required placeholder="请输入名称" />
        </label>
        <label>
          接入类型
          <select v-model="form.sourceType">
            <option>数据库</option>
            <option>对象存储</option>
            <option>流式日志</option>
          </select>
        </label>
        <label>
          采集周期
          <input v-model="form.schedule" required placeholder="例如：每2小时" />
        </label>
        <button class="primary" type="submit">提交创建</button>
      </form>
    </Modal>

    <Modal :show="modal.type === 'clean'" title="清洗进度" @close="closeModal">
      <p>正在执行字段去重、缺失值填补和异常检测。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: modal.progress + '%' }" />
      </div>
      <p class="progress-text">当前完成度：{{ modal.progress }}%</p>
      <template #footer>
        <button class="primary" type="button" @click="closeModal">了解</button>
      </template>
    </Modal>

    <Modal :show="modal.type === 'version'" title="版本保存提醒" @close="closeModal">
      <p>当前数据版本将被标记为 V{{ nextVersion }}，并生成特征统计报告。</p>
      <div class="info-box">
        <p>覆盖字段：{{ form.coverFields }}</p>
        <p>预计耗时：12 分钟</p>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="submitModal('数据版本已归档')">确认保存</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import Modal from "../components/Modal.vue";

const chartBars = [
  { label: "08:00", value: 40 },
  { label: "10:00", value: 55 },
  { label: "12:00", value: 70 },
  { label: "14:00", value: 65 },
  { label: "16:00", value: 80 },
  { label: "18:00", value: 60 },
  { label: "20:00", value: 75 }
];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  name: `数据集-${index + 1}`,
  type: index % 3 === 0 ? "非结构化" : "结构化",
  status: index % 2 === 0 ? "已发布" : "处理中",
  statusClass: index % 2 === 0 ? "success" : "warning",
  features: 80 + index * 3,
  owner: ["刘晨", "王璐", "张珂", "赵敏"][index % 4]
}));

const modal = reactive({ type: "", progress: 68 });
const form = reactive({
  sourceName: "用户行为日志",
  sourceType: "数据库",
  schedule: "每2小时",
  coverFields: "用户ID、时间戳、渠道"
});
const nextVersion = ref("3.8");

const openModal = (type) => {
  modal.type = type;
};

const closeModal = () => {
  modal.type = "";
};

const submitModal = (message) => {
  modal.type = "";
  form.sourceName = form.sourceName;
  form.sourceType = form.sourceType;
  form.schedule = form.schedule;
  form.coverFields = form.coverFields;
  modal.progress = 92;
  form.toast = message;
};
</script>

<style scoped>
.module-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.summary-card h3 {
  margin: 0;
  font-size: 15px;
}

.summary-card p {
  margin: 6px 0 12px;
  color: #64748b;
  font-size: 13px;
}

.summary-card strong {
  font-size: 24px;
  color: #2563eb;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary,
.ghost {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.ghost {
  background: #e0f2fe;
  color: #0f172a;
}

.panel-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  margin-top: 20px;
}

.chart {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  height: 280px;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 14px;
  color: #64748b;
}

.bars {
  margin-top: auto;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  align-items: end;
  height: 200px;
}

.bars span {
  background: linear-gradient(180deg, #38bdf8, #2563eb);
  border-radius: 8px 8px 0 0;
  position: relative;
}

.bars em {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #64748b;
  white-space: nowrap;
}

.table-wrap {
  overflow-x: auto;
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-wrap th,
.table-wrap td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.success {
  background: #dcfce7;
  color: #166534;
}

.tag.warning {
  background: #fef9c3;
  color: #854d0e;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.modal-form input,
.modal-form select {
  border: 1px solid #cbd5f5;
  padding: 8px 10px;
  border-radius: 8px;
}

.progress {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
}

.progress-text {
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
}

.info-box {
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
  margin-top: 12px;
}

@media (max-width: 960px) {
  .panel-body {
    grid-template-columns: 1fr;
  }
}
</style>
