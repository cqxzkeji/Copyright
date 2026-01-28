<template>
  <section class="module">
    <div class="module-actions">
      <button class="primary" @click="openForm('创建测试')">创建测试</button>
      <button class="secondary" @click="openProgress('执行测试进度')">执行测试</button>
      <button class="secondary" @click="openForm('资源预约')">资源预约</button>
      <button class="ghost" @click="openInfo('测试提示', '当前有 8 项性能测试等待排期，请及时确认实验室资源。')">测试提示</button>
    </div>

    <div class="cards">
      <div class="card">
        <h4>测试用例总数</h4>
        <p class="metric">88</p>
        <span>本周新增 9 项</span>
      </div>
      <div class="card">
        <h4>验证通过率</h4>
        <p class="metric">91%</p>
        <span>目标 95%</span>
      </div>
      <div class="card">
        <h4>性能测试排期</h4>
        <p class="metric">6</p>
        <span>本周待执行</span>
      </div>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <h3>功能测试完成度</h3>
        <svg viewBox="0 0 300 120" class="chart">
          <rect v-for="(bar, index) in bars" :key="index" :x="20 + index * 40" :y="120 - bar" :width="22" :height="bar" fill="#38bdf8" />
        </svg>
      </div>
      <div class="panel">
        <h3>性能指标对比</h3>
        <div class="bars">
          <div v-for="item in metrics" :key="item.label" class="bar-row">
            <span>{{ item.label }}</span>
            <div class="bar">
              <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="table-header">
        <h3>测试计划（20条）</h3>
        <button class="ghost" @click="openInfo('报告提示', '测试报告模板已更新，请使用最新模板导出。')">报告提示</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>测试项目</th>
            <th>类型</th>
            <th>负责人</th>
            <th>状态</th>
            <th>计划日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.title }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.date }}</td>
            <td><button class="link" @click="openInfo('测试详情', row.detail)">查看详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalBase :open="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'form'" class="modal-form">
        <label>
          测试名称
          <input v-model="form.name" placeholder="请输入测试名称" />
        </label>
        <label>
          预期结果
          <textarea v-model="form.note" rows="3" placeholder="填写预期结果"></textarea>
        </label>
        <label>
          测试等级
          <select v-model="form.level">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'progress'" class="modal-progress">
        <p>正在执行测试任务，请保持设备联机...</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <small>已完成 {{ progress }}%</small>
      </div>
      <div v-else class="modal-info">
        <p>{{ modal.message }}</p>
      </div>
      <template #footer>
        <button class="ghost" @click="closeModal">取消</button>
        <button class="primary" @click="handleModalConfirm">确认</button>
      </template>
    </ModalBase>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalBase from '../components/ModalBase.vue';

const bars = [40, 68, 55, 80, 72, 90];

const metrics = [
  { label: '碰撞测试', value: 88 },
  { label: '耐久测试', value: 76 },
  { label: 'NVH', value: 84 },
  { label: '密封性', value: 79 }
];

const rows = ref([
  { id: 'TS-001', title: '正面碰撞试验', type: '安全', owner: '鲁宁', status: '执行中', date: '2024-05-06', detail: '车辆前部吸能验证。' },
  { id: 'TS-002', title: '侧碰撞试验', type: '安全', owner: '尹航', status: '待排期', date: '2024-05-08', detail: '侧围加强效果验证。' },
  { id: 'TS-003', title: '顶压强度测试', type: '结构', owner: '卓君', status: '待排期', date: '2024-05-09', detail: '车顶骨架强度校核。' },
  { id: 'TS-004', title: '耐久道路测试', type: '性能', owner: '彭朗', status: '执行中', date: '2024-05-10', detail: '模拟 10 万公里工况。' },
  { id: 'TS-005', title: '淋雨密封测试', type: '密封', owner: '江楠', status: '待排期', date: '2024-05-11', detail: '检测门缝密封性能。' },
  { id: 'TS-006', title: '高温暴晒测试', type: '耐候', owner: '乔笙', status: '完成', date: '2024-05-05', detail: '验证内饰材料耐热。' },
  { id: 'TS-007', title: '低温冲击测试', type: '耐候', owner: '万雪', status: '完成', date: '2024-05-04', detail: '低温环境冲击验证。' },
  { id: 'TS-008', title: '道路噪声测试', type: 'NVH', owner: '梅朗', status: '执行中', date: '2024-05-07', detail: '车辆噪声控制验证。' },
  { id: 'TS-009', title: '车门耐久开关', type: '耐久', owner: '段煜', status: '待排期', date: '2024-05-12', detail: '车门开关 3 万次。' },
  { id: 'TS-010', title: '尾门开启力测试', type: '功能', owner: '林悦', status: '完成', date: '2024-05-03', detail: '尾门开启力矩评估。' },
  { id: 'TS-011', title: '车顶行李架承载', type: '性能', owner: '傅昭', status: '待排期', date: '2024-05-13', detail: '行李架承载能力测试。' },
  { id: 'TS-012', title: '高压水枪测试', type: '密封', owner: '于帆', status: '完成', date: '2024-05-02', detail: '验证密封条质量。' },
  { id: 'TS-013', title: '车门下垂测试', type: '结构', owner: '翟梓', status: '执行中', date: '2024-05-08', detail: '车门下垂风险验证。' },
  { id: 'TS-014', title: '后碰撞试验', type: '安全', owner: '许灿', status: '待排期', date: '2024-05-14', detail: '后部结构吸能分析。' },
  { id: 'TS-015', title: '气密性测试', type: '密封', owner: '魏语', status: '完成', date: '2024-05-01', detail: '检测车身气密性。' },
  { id: 'TS-016', title: '车身刚度测试', type: '结构', owner: '黎澜', status: '执行中', date: '2024-05-09', detail: '扭转刚度与弯曲刚度验证。' },
  { id: 'TS-017', title: '门槛梁疲劳测试', type: '耐久', owner: '鲁钧', status: '待排期', date: '2024-05-15', detail: '门槛梁疲劳强度检测。' },
  { id: 'TS-018', title: '声学包覆测试', type: 'NVH', owner: '司雯', status: '完成', date: '2024-05-06', detail: '噪声包覆材料效果。' },
  { id: 'TS-019', title: '车门玻璃导轨磨损', type: '耐久', owner: '卫铎', status: '执行中', date: '2024-05-11', detail: '导轨磨损寿命评估。' },
  { id: 'TS-020', title: '尾门雨水侵入测试', type: '密封', owner: '章媛', status: '待排期', date: '2024-05-16', detail: '检测后尾门密封性。' }
]);

const modal = reactive({
  open: false,
  type: 'info',
  title: '',
  message: ''
});

const form = reactive({
  name: '',
  note: '',
  level: '高'
});

const progress = ref(0);
let timer = null;

const openForm = (title) => {
  modal.open = true;
  modal.type = 'form';
  modal.title = title;
};

const openProgress = (title) => {
  modal.open = true;
  modal.type = 'progress';
  modal.title = title;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
    } else {
      progress.value += 8;
    }
  }, 240);
};

const openInfo = (title, message) => {
  modal.open = true;
  modal.type = 'info';
  modal.title = title;
  modal.message = message;
};

const closeModal = () => {
  modal.open = false;
  clearInterval(timer);
};

const handleModalConfirm = () => {
  if (modal.type === 'form') {
    modal.type = 'info';
    modal.title = '已创建测试';
    modal.message = `测试任务「${form.name || '新建测试'}」已进入排期队列。`;
  } else if (modal.type === 'progress') {
    modal.type = 'info';
    modal.title = '执行完成';
    modal.message = '测试执行完成，性能数据已入库。';
  } else {
    closeModal();
  }
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
}

.secondary {
  background: #e0e7ff;
  color: #1e3a8a;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
}

.ghost {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 16px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}

.card .metric {
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.panel {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
}

.chart {
  width: 100%;
  height: 140px;
  margin-top: 12px;
}

.bars {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.bar {
  background: #e5e7eb;
  border-radius: 999px;
  height: 8px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #38bdf8);
}

.table-panel {
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  overflow-x: auto;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-header h3 {
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f8fafc;
}

th,
td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.link {
  border: none;
  background: none;
  color: #2563eb;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.modal-form input,
.modal-form textarea,
.modal-form select {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #f8fafc;
}

.modal-progress {
  display: grid;
  gap: 12px;
}

.progress-track {
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #38bdf8);
}
</style>
