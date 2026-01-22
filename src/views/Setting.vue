<template>
  <section class="setting">
    <div class="panel">
      <div class="panel-header">
        <h3>系统参数配置</h3>
        <div class="panel-actions">
          <button class="ghost-button" @click="openModal('rule')">采集规则</button>
          <button class="primary-button" @click="openModal('save')">保存配置</button>
        </div>
      </div>
      <div class="config-grid">
        <div v-for="item in configs" :key="item.title" class="config-card">
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
          <button class="ghost-button" @click="openModal('edit')">编辑配置</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>数据导出与备份</h3>
        <div class="panel-actions">
          <button class="ghost-button" @click="openModal('template')">模板管理</button>
          <button class="primary-button" @click="openModal('export')">立即导出</button>
        </div>
      </div>
      <div class="export-grid">
        <div v-for="item in exports" :key="item.name" class="export-card">
          <h4>{{ item.name }}</h4>
          <p>{{ item.desc }}</p>
          <span>{{ item.range }}</span>
          <button class="primary-button" @click="openModal('progress')">生成</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>配置变更记录</h3>
        <button class="ghost-button" @click="openModal('log')">查看详情</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>变更内容</th>
              <th>负责人</th>
              <th>时间</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.content }}</td>
              <td>{{ row.owner }}</td>
              <td>{{ row.time }}</td>
              <td><span class="tag" :class="row.type">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :open="modalType === 'rule'" title="采集规则配置" @close="closeModal">
      <form class="modal-form">
        <label>采样频率上限
          <input type="text" placeholder="例如 1s" />
        </label>
        <label>阈值提醒策略
          <select>
            <option>即时提醒</option>
            <option>延时 5 分钟</option>
          </select>
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">保存</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'save'" title="保存配置" @close="closeModal">
      <p>系统将把当前参数配置同步至所有终端。</p>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">确认保存</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'edit'" title="编辑配置" @close="closeModal">
      <form class="modal-form">
        <label>配置项名称
          <input type="text" placeholder="请输入配置项" />
        </label>
        <label>当前值
          <input type="text" placeholder="数值或文本" />
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">更新</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'template'" title="模板管理" @close="closeModal">
      <p>当前已有 3 套导出模板可用。</p>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">查看模板</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'export'" title="立即导出" @close="closeModal">
      <p>请选择导出格式并确认。</p>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">CSV</button>
        <button class="primary-button" @click="closeModal">Excel</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'progress'" title="导出进度" @close="closeModal">
      <p>导出正在生成，请稍后。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">完成</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'log'" title="变更详情" @close="closeModal">
      <ul class="info-list">
        <li>最近一次变更：调整数据导出字段顺序。</li>
        <li>历史记录可导出为 CSV 留存。</li>
        <li>系统自动生成配置备份。</li>
      </ul>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">了解</button>
      </div>
    </Modal>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import Modal from "../components/Modal.vue";

const modalType = ref("");
const progress = ref(30);
let timer;

const openModal = (type) => {
  modalType.value = type;
  if (type === "progress") {
    progress.value = 30;
    clearInterval(timer);
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 12, 100);
    }, 500);
  }
};

const closeModal = () => {
  modalType.value = "";
  clearInterval(timer);
};

onBeforeUnmount(() => clearInterval(timer));

const configs = [
  { title: "采集频率", desc: "设置各传感器采样间隔" },
  { title: "数据保留周期", desc: "历史记录自动归档时间" },
  { title: "告警推送方式", desc: "短信 / 邮件 / 系统通知" }
];

const exports = [
  { name: "实时快照", desc: "导出当前实时数据", range: "近 30 分钟" },
  { name: "历史归档", desc: "导出归档数据", range: "最近 30 天" },
  { name: "告警日志", desc: "导出告警清单", range: "最近 7 天" }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  content: index % 2 === 0 ? "调整采样频率" : "更新告警通知策略",
  owner: index % 2 === 0 ? "王工" : "周工",
  time: `2024-03-${(index + 1).toString().padStart(2, "0")} 14:${(index + 10)
    .toString()
    .padStart(2, "0")}`,
  status: index % 3 === 0 ? "待发布" : "已生效",
  type: index % 3 === 0 ? "warn" : "good"
}));
</script>

<style scoped>
.setting {
  display: grid;
  gap: 20px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #e2e8f0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

.config-grid,
.export-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.config-card,
.export-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  display: grid;
  gap: 8px;
}

.config-card h4,
.export-card h4 {
  margin: 0;
}

.config-card p,
.export-card p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.export-card span {
  font-size: 12px;
  color: #2563eb;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

th {
  background: #f1f5f9;
}

.tag {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.tag.good {
  background: #dcfce7;
  color: #166534;
}

.tag.warn {
  background: #fef3c7;
  color: #92400e;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.modal-form input,
.modal-form select {
  border-radius: 8px;
  border: 1px solid #cbd5f5;
  padding: 8px 10px;
  background: #f8fafc;
}

.progress {
  margin: 16px 0;
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}

.info-list {
  padding-left: 18px;
  margin: 0;
}

.primary-button,
.ghost-button {
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  background: #2563eb;
  color: #fff;
}

.ghost-button {
  background: #fff;
  border-color: #d1d5db;
}
</style>
