<template>
  <section class="module">
    <div class="module-actions">
      <button class="primary" @click="openForm('创建里程碑')">创建里程碑</button>
      <button class="secondary" @click="openForm('更新风险')">更新风险</button>
      <button class="secondary" @click="openProgress('生成周报进度')">生成周报</button>
      <button class="ghost" @click="openInfo('团队提示', '本周协作任务 6 项超期，请及时协调资源。')">团队提示</button>
    </div>

    <div class="cards">
      <div class="card">
        <h4>项目进度</h4>
        <p class="metric">78%</p>
        <span>目标进度 80%</span>
      </div>
      <div class="card">
        <h4>风险项</h4>
        <p class="metric">5</p>
        <span>需跟踪 2 项</span>
      </div>
      <div class="card">
        <h4>团队协作任务</h4>
        <p class="metric">24</p>
        <span>进行中 16 项</span>
      </div>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <h3>阶段任务完成情况</h3>
        <svg viewBox="0 0 300 120" class="chart">
          <rect v-for="(bar, index) in bars" :key="index" :x="20 + index * 40" :y="120 - bar" :width="22" :height="bar" fill="#f97316" />
        </svg>
      </div>
      <div class="panel">
        <h3>风险等级分布</h3>
        <div class="bars">
          <div v-for="item in risks" :key="item.label" class="bar-row">
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
        <h3>项目任务清单（20条）</h3>
        <button class="ghost" @click="openInfo('协作提醒', '跨团队协作清单已更新，请查看。')">协作提醒</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>任务名称</th>
            <th>负责人</th>
            <th>截止日期</th>
            <th>优先级</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.title }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.deadline }}</td>
            <td>{{ row.level }}</td>
            <td>{{ row.status }}</td>
            <td><button class="link" @click="openInfo('任务详情', row.detail)">查看详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalBase :open="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'form'" class="modal-form">
        <label>
          任务名称
          <input v-model="form.name" placeholder="请输入任务名称" />
        </label>
        <label>
          风险描述
          <textarea v-model="form.note" rows="3" placeholder="填写风险说明"></textarea>
        </label>
        <label>
          优先级
          <select v-model="form.level">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'progress'" class="modal-progress">
        <p>正在汇总项目周报数据...</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <small>已汇总 {{ progress }}%</small>
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

const bars = [50, 65, 78, 90, 72, 85];

const risks = [
  { label: '高风险', value: 30 },
  { label: '中风险', value: 45 },
  { label: '低风险', value: 25 }
];

const rows = ref([
  { id: 'PJ-001', title: '需求基线确认', owner: '林航', deadline: '2024-05-06', level: '高', status: '进行中', detail: '组织跨部门评审，完成需求冻结。' },
  { id: 'PJ-002', title: '车身结构设计评审', owner: '顾凡', deadline: '2024-05-08', level: '高', status: '进行中', detail: '输出评审纪要与整改清单。' },
  { id: 'PJ-003', title: '试制计划编排', owner: '康琳', deadline: '2024-05-10', level: '中', status: '待开始', detail: '确认试制物料与工装准备。' },
  { id: 'PJ-004', title: '碰撞测试排期', owner: '滕璐', deadline: '2024-05-12', level: '高', status: '进行中', detail: '协调实验室资源并排期。' },
  { id: 'PJ-005', title: '质量问题复盘', owner: '石楠', deadline: '2024-05-13', level: '中', status: '待开始', detail: '梳理问题清单并推进闭环。' },
  { id: 'PJ-006', title: '供应商同步会议', owner: '盛楠', deadline: '2024-05-14', level: '低', status: '已完成', detail: '确认供货周期与风险。' },
  { id: 'PJ-007', title: '样车评估报告', owner: '孔煜', deadline: '2024-05-15', level: '高', status: '进行中', detail: '整理样车问题与建议。' },
  { id: 'PJ-008', title: '工艺路线优化', owner: '罗玄', deadline: '2024-05-16', level: '中', status: '待开始', detail: '评估工序优化空间。' },
  { id: 'PJ-009', title: '成本目标拆解', owner: '段阳', deadline: '2024-05-17', level: '中', status: '进行中', detail: '分解成本目标到模块。' },
  { id: 'PJ-010', title: '团队绩效复盘', owner: '苏倩', deadline: '2024-05-18', level: '低', status: '待开始', detail: '总结协作效率与问题。' },
  { id: 'PJ-011', title: '质量验证方案', owner: '郑时', deadline: '2024-05-19', level: '高', status: '进行中', detail: '制定关键验证计划。' },
  { id: 'PJ-012', title: '风险预警评估', owner: '曹昕', deadline: '2024-05-20', level: '中', status: '待开始', detail: '更新风险矩阵与应对方案。' },
  { id: 'PJ-013', title: '跨部门资源协调', owner: '颜琪', deadline: '2024-05-21', level: '高', status: '进行中', detail: '保障关键资源按期到位。' },
  { id: 'PJ-014', title: '项目总结模板', owner: '童蔓', deadline: '2024-05-22', level: '低', status: '已完成', detail: '模板已更新并发布。' },
  { id: 'PJ-015', title: '试验结果评审', owner: '彭云', deadline: '2024-05-23', level: '高', status: '进行中', detail: '评审试验结果并提出整改。' },
  { id: 'PJ-016', title: '项目风险沟通', owner: '庄晨', deadline: '2024-05-24', level: '中', status: '待开始', detail: '准备风险沟通材料。' },
  { id: 'PJ-017', title: '生产线准备检查', owner: '季薇', deadline: '2024-05-25', level: '高', status: '进行中', detail: '检查产线工装准备。' },
  { id: 'PJ-018', title: '发布里程碑复核', owner: '梁翰', deadline: '2024-05-26', level: '中', status: '待开始', detail: '复核里程碑交付物。' },
  { id: 'PJ-019', title: '问题清单闭环', owner: '梁钰', deadline: '2024-05-27', level: '高', status: '进行中', detail: '推动问题关闭率提升。' },
  { id: 'PJ-020', title: '项目周会纪要', owner: '傅哲', deadline: '2024-05-28', level: '低', status: '已完成', detail: '周会纪要已同步。' }
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
      progress.value += 12;
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
    modal.title = '已提交任务';
    modal.message = `任务「${form.name || '新建任务'}」已加入项目计划。`;
  } else if (modal.type === 'progress') {
    modal.type = 'info';
    modal.title = '周报生成完成';
    modal.message = '项目周报已生成并同步给核心成员。';
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
  background: linear-gradient(90deg, #fdba74, #f97316);
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
  background: linear-gradient(90deg, #fdba74, #f97316);
}
</style>
