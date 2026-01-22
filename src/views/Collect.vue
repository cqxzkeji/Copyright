<template>
  <section class="collect">
    <div class="panel">
      <div class="panel-header">
        <h3>采集任务控制</h3>
        <div class="panel-actions">
          <button class="ghost-button" @click="openModal('add')">新增传感器</button>
          <button class="primary-button" @click="openModal('start')">启动采集</button>
        </div>
      </div>
      <div class="task-grid">
        <div v-for="task in tasks" :key="task.name" class="task-card">
          <h4>{{ task.name }}</h4>
          <p>{{ task.desc }}</p>
          <div class="task-meta">
            <span>采样间隔：{{ task.interval }}</span>
            <span>通道：{{ task.channel }}</span>
          </div>
          <div class="task-actions">
            <button class="ghost-button" @click="openModal('calibrate')">校准</button>
            <button class="ghost-button" @click="openModal('config')">配置</button>
            <button class="primary-button" @click="openModal('manual')">手动录入</button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>采集数据列表</h3>
        <div class="panel-actions">
          <button class="ghost-button" @click="openModal('rule')">采集规则</button>
          <button class="primary-button" @click="openModal('progress')">上传进度</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>设备</th>
              <th>传感器</th>
              <th>采集值</th>
              <th>单位</th>
              <th>采集时间</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.device }}</td>
              <td>{{ row.sensor }}</td>
              <td>{{ row.value }}</td>
              <td>{{ row.unit }}</td>
              <td>{{ row.time }}</td>
              <td><span class="tag" :class="row.type">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :open="modalType === 'add'" title="新增传感器" @close="closeModal">
      <form class="modal-form">
        <label>传感器名称
          <input type="text" placeholder="例如：压力-04" />
        </label>
        <label>采样频率
          <select>
            <option>1s</option>
            <option>5s</option>
            <option>10s</option>
          </select>
        </label>
        <label>接入通道
          <input type="text" placeholder="CH-09" />
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">保存</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'start'" title="启动采集" @close="closeModal">
      <p>已选择 12 路传感器进入采集模式。</p>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">稍后</button>
        <button class="primary-button" @click="closeModal">立即启动</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'calibrate'" title="传感器校准" @close="closeModal">
      <form class="modal-form">
        <label>校准模式
          <select>
            <option>标准校准</option>
            <option>快速校准</option>
          </select>
        </label>
        <label>基准值
          <input type="number" placeholder="请输入基准值" />
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">确认校准</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'config'" title="采集配置" @close="closeModal">
      <p>可调整采集任务的间隔与阈值策略。</p>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">关闭</button>
        <button class="primary-button" @click="closeModal">保存配置</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'manual'" title="手动录入" @close="closeModal">
      <form class="modal-form">
        <label>参数类型
          <select>
            <option>温度</option>
            <option>压力</option>
            <option>电流</option>
          </select>
        </label>
        <label>测量值
          <input type="number" placeholder="填写数值" />
        </label>
        <label>备注
          <input type="text" placeholder="备注说明" />
        </label>
      </form>
      <div class="modal-actions">
        <button class="ghost-button" @click="closeModal">取消</button>
        <button class="primary-button" @click="closeModal">提交</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'rule'" title="采集规则" @close="closeModal">
      <ul class="info-list">
        <li>默认采样间隔 5 秒，自动波动优化。</li>
        <li>连续 3 次异常即标记为高风险。</li>
        <li>采集失败将自动补采 2 次。</li>
      </ul>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">确认</button>
      </div>
    </Modal>

    <Modal :open="modalType === 'progress'" title="上传进度" @close="closeModal">
      <p>数据正在上传至集中存储。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="modal-actions">
        <button class="primary-button" @click="closeModal">完成</button>
      </div>
    </Modal>
  </section>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import Modal from "../components/Modal.vue";

const modalType = ref("");
const progress = ref(42);
let timer;

const openModal = (type) => {
  modalType.value = type;
  if (type === "progress") {
    progress.value = 42;
    clearInterval(timer);
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 8, 100);
    }, 400);
  }
};

const closeModal = () => {
  modalType.value = "";
  clearInterval(timer);
};

onBeforeUnmount(() => clearInterval(timer));

const tasks = [
  { name: "环境温度", desc: "车间温度趋势监控", interval: "5 秒", channel: "CH-02" },
  { name: "压力反馈", desc: "压力舱体持续监测", interval: "3 秒", channel: "CH-05" },
  { name: "电流监测", desc: "电源模块电流曲线", interval: "2 秒", channel: "CH-08" }
];

const rows = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  device: `设备-${(index % 6) + 1}`,
  sensor: ["温度", "压力", "电流"][index % 3],
  value: (20 + (index % 9) * 1.2).toFixed(1),
  unit: index % 3 === 0 ? "°C" : index % 3 === 1 ? "kPa" : "A",
  time: `09:${(index + 10).toString().padStart(2, "0")}`,
  status: index % 7 === 0 ? "异常" : "正常",
  type: index % 7 === 0 ? "alert" : "good"
}));
</script>

<style scoped>
.collect {
  display: grid;
  gap: 20px;
}

.panel {
  background: white;
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

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.task-card {
  padding: 16px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.task-card h4 {
  margin: 0 0 6px;
}

.task-card p {
  margin: 0 0 10px;
  color: #64748b;
  font-size: 13px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #475569;
  margin-bottom: 12px;
}

.task-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.tag.alert {
  background: #fee2e2;
  color: #991b1b;
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

.info-list {
  padding-left: 18px;
  margin: 0;
}

.progress {
  margin: 16px 0;
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  border-radius: 999px;
  transition: width 0.3s ease;
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
