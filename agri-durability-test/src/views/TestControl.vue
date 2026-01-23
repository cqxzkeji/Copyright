<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>耐久工况设置</h3>
        <p>设置静载、循环载荷等耐久测试工况，模拟实际作业受力。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openModal('create')">新建工况</button>
        <button class="btn light" @click="openModal('template')">选择模板</button>
        <button class="btn light" @click="openModal('schedule')">排程任务</button>
        <button class="btn primary" @click="openModal('start')">启动试验</button>
      </div>
    </div>

    <div class="panel">
      <div class="chart-card">
        <h4>载荷波形预览</h4>
        <svg viewBox="0 0 480 180" class="wave" aria-label="载荷波形">
          <polyline
            points="0,120 40,80 80,130 120,60 160,120 200,70 240,140 280,80 320,130 360,70 400,120 440,90 480,120"
            fill="none"
            stroke="#2b77f3"
            stroke-width="4"
          />
          <line x1="0" y1="140" x2="480" y2="140" stroke="#cbd7ef" stroke-width="2" />
        </svg>
      </div>
      <div class="summary-card">
        <h4>试验控制摘要</h4>
        <ul>
          <li>当前工况：循环载荷 A3</li>
          <li>目标循环：180,000 次</li>
          <li>峰值载荷：92 kN</li>
          <li>温度范围：-10℃ ~ 65℃</li>
        </ul>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>工况编号</th>
            <th>类型</th>
            <th>峰值载荷 (kN)</th>
            <th>频率 (Hz)</th>
            <th>循环次数</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in conditions" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.peak }}</td>
            <td>{{ item.freq }}</td>
            <td>{{ item.cycles }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'create'" title="新建耐久工况" @close="closeModal">
      <form class="modal-form" @submit.prevent="handleSubmit('新建工况已保存，待排程')">
        <label>
          工况编号
          <input v-model="form.code" placeholder="例如：A3" required />
        </label>
        <label>
          载荷类型
          <select v-model="form.type">
            <option>静载</option>
            <option>循环载荷</option>
            <option>冲击载荷</option>
          </select>
        </label>
        <label>
          峰值载荷 (kN)
          <input v-model="form.peak" type="number" required />
        </label>
        <button class="btn primary" type="submit">保存工况</button>
      </form>
    </BaseModal>

    <BaseModal v-if="activeModal === 'template'" title="选择工况模板" @close="closeModal">
      <p>请选择预设的工况模板快速配置。</p>
      <div class="modal-grid">
        <button class="btn light" @click="handleSubmit('已加载田间作业循环模板')">田间作业循环模板</button>
        <button class="btn light" @click="handleSubmit('已加载高负载冲击模板')">高负载冲击模板</button>
        <button class="btn light" @click="handleSubmit('已加载运输静载模板')">运输静载模板</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'schedule'" title="排程耐久试验" @close="closeModal">
      <p>选择将工况排程到可用试验台。</p>
      <form class="modal-form" @submit.prevent="handleSubmit('试验已排程至 2 号试验台，计划开始时间 09:30')">
        <label>
          试验台
          <select>
            <option>1 号试验台</option>
            <option>2 号试验台</option>
            <option>3 号试验台</option>
          </select>
        </label>
        <label>
          开始时间
          <input type="time" required value="09:30" />
        </label>
        <button class="btn primary" type="submit">确认排程</button>
      </form>
    </BaseModal>

    <BaseModal v-if="activeModal === 'start'" title="启动试验进度" @close="closeModal">
      <p>系统正在初始化控制通道并校验传感器。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <button class="btn primary" @click="startProgress">开始启动</button>
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
const form = ref({
  code: "A3",
  type: "循环载荷",
  peak: 92
});

const conditions = Array.from({ length: 20 }, (_, index) => ({
  code: `C-${index + 1}`,
  type: index % 3 === 0 ? "静载" : index % 3 === 1 ? "循环载荷" : "冲击载荷",
  peak: 60 + index * 2,
  freq: (0.5 + (index % 5) * 0.2).toFixed(1),
  cycles: (60000 + index * 3500).toLocaleString(),
  status: index < 6 ? "已验证" : index < 12 ? "待执行" : "待优化"
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
    progress.value += 12;
    if (progress.value >= 100) {
      clearInterval(timer);
      handleSubmit("试验启动成功，控制通道全部在线。");
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
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.chart-card,
.summary-card {
  background: white;
  padding: 16px 18px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.chart-card h4,
.summary-card h4 {
  margin-bottom: 12px;
  color: #24314d;
}

.wave {
  width: 100%;
  height: 160px;
}

.summary-card ul {
  list-style: none;
  display: grid;
  gap: 6px;
  color: #5f6f8c;
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
  background: #e8f2ff;
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

@media (max-width: 980px) {
  .panel {
    grid-template-columns: 1fr;
  }
}
</style>
