<template>
  <section class="module">
    <div class="module-actions">
      <button class="primary" @click="openForm('新增需求')">新增需求</button>
      <button class="secondary" @click="openForm('批量变更')">批量变更</button>
      <button class="secondary" @click="openProgress('导入需求进度')">导入需求</button>
      <button class="ghost" @click="openInfo('需求提示', '当前共有 28 条需求处于评审阶段，请优先处理高风险项。')">需求提示</button>
    </div>

    <div class="cards">
      <div class="card">
        <h4>待确认需求</h4>
        <p class="metric">18</p>
        <span>本周新增 6 条</span>
      </div>
      <div class="card">
        <h4>变更审批中</h4>
        <p class="metric">9</p>
        <span>今日新增 2 条</span>
      </div>
      <div class="card">
        <h4>需求满足度</h4>
        <p class="metric">92%</p>
        <span>客户满意度提升</span>
      </div>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <h3>需求完成趋势</h3>
        <svg viewBox="0 0 300 120" class="chart">
          <polyline
            points="10,90 50,70 90,75 130,40 170,50 210,30 250,35 290,20"
            fill="none"
            stroke="#3b82f6"
            stroke-width="4"
          />
          <circle v-for="(point, index) in chartPoints" :key="index" :cx="point.x" :cy="point.y" r="5" fill="#93c5fd" />
        </svg>
      </div>
      <div class="panel">
        <h3>需求来源分布</h3>
        <div class="bars">
          <div v-for="source in sources" :key="source.label" class="bar-row">
            <span>{{ source.label }}</span>
            <div class="bar">
              <div class="bar-fill" :style="{ width: source.value + '%' }"></div>
            </div>
            <strong>{{ source.value }}%</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="table-header">
        <h3>需求清单（28条）</h3>
        <button class="ghost" @click="openInfo('导出提示', '需求清单已同步至需求仓库，可前往导出中心下载。')">导出提示</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>需求名称</th>
            <th>来源</th>
            <th>优先级</th>
            <th>负责人</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.title }}</td>
            <td>{{ row.source }}</td>
            <td><span :class="['tag', row.priority]">{{ row.priority }}</span></td>
            <td>{{ row.owner }}</td>
            <td>{{ row.status }}</td>
            <td>
              <button class="link" @click="openInfo('需求详情', row.detail)">查看详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalBase :open="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'form'" class="modal-form">
        <label>
          需求名称
          <input v-model="form.name" placeholder="请输入需求名称" />
        </label>
        <label>
          变更说明
          <textarea v-model="form.note" rows="3" placeholder="填写变更说明"></textarea>
        </label>
        <label>
          优先级
          <select v-model="form.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'progress'" class="modal-progress">
        <p>{{ progressLabel }}</p>
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

const rows = ref([
  { id: 'RQ-001', title: '车身轻量化材料方案', source: '市场调研', priority: '高', owner: '李昕', status: '评审中', detail: '轻量化材料需要与供应商同步测试。' },
  { id: 'RQ-002', title: '侧围加强结构设计', source: '法规需求', priority: '高', owner: '王涛', status: '待确认', detail: '需满足侧碰法规最新要求。' },
  { id: 'RQ-003', title: '后门开启角度优化', source: '用户反馈', priority: '中', owner: '周琳', status: '实施中', detail: '改善上下车便利性。' },
  { id: 'RQ-004', title: '前舱吸能结构升级', source: '安全试验', priority: '高', owner: '陈晨', status: '评审中', detail: '与NVH团队协同。' },
  { id: 'RQ-005', title: '外观曲面精度提升', source: '造型需求', priority: '中', owner: '郑琪', status: '待确认', detail: '需确认模具精度与成本。' },
  { id: 'RQ-006', title: '电池托盘防护加强', source: '质量问题', priority: '高', owner: '刘洋', status: '实施中', detail: '提升抗冲击性能。' },
  { id: 'RQ-007', title: '后地板减重', source: '性能优化', priority: '中', owner: '张健', status: '评审中', detail: '目标减重 6%。' },
  { id: 'RQ-008', title: '顶盖装配定位优化', source: '生产反馈', priority: '低', owner: '冯雪', status: '待确认', detail: '提升装配稳定性。' },
  { id: 'RQ-009', title: '侧围焊点优化', source: '生产反馈', priority: '中', owner: '宋浩', status: '实施中', detail: '焊点数量与位置调整。' },
  { id: 'RQ-010', title: '尾门密封性提升', source: '售后问题', priority: '中', owner: '胡静', status: '评审中', detail: '重点改善雨天渗水。' },
  { id: 'RQ-011', title: '前翼子板冲击强化', source: '法规需求', priority: '高', owner: '韩梅', status: '待确认', detail: '满足行人保护法规。' },
  { id: 'RQ-012', title: '仪表板安装支架轻量化', source: '成本优化', priority: '低', owner: '蔡宁', status: '实施中', detail: '优化支架断面。' },
  { id: 'RQ-013', title: '底盘遮蔽板升级', source: '用户反馈', priority: '中', owner: '赵峰', status: '评审中', detail: '提升防尘性能。' },
  { id: 'RQ-014', title: '车门碰撞吸能块', source: '安全试验', priority: '高', owner: '秦潇', status: '评审中', detail: '增加吸能块厚度。' },
  { id: 'RQ-015', title: '尾灯安装支架优化', source: '生产反馈', priority: '低', owner: '叶茜', status: '待确认', detail: '减少装配时间。' },
  { id: 'RQ-016', title: '发动机舱隔热板改进', source: '质量问题', priority: '中', owner: '顾宇', status: '实施中', detail: '降低高温变形风险。' },
  { id: 'RQ-017', title: '侧围板材替代方案', source: '成本优化', priority: '中', owner: '段飞', status: '评审中', detail: '成本下降 8%。' },
  { id: 'RQ-018', title: '车顶行李架预留', source: '市场调研', priority: '低', owner: '苏悦', status: '待确认', detail: '考虑后期改装需求。' },
  { id: 'RQ-019', title: '后备箱地板平整度提升', source: '用户反馈', priority: '中', owner: '许强', status: '实施中', detail: '提升装载体验。' },
  { id: 'RQ-020', title: '前柱内衬改进', source: '安全试验', priority: '中', owner: '沈佳', status: '评审中', detail: '提升侧碰保护。' },
  { id: 'RQ-021', title: '顶盖雨槽加强', source: '质量问题', priority: '低', owner: '傅林', status: '待确认', detail: '防止雨水溢流。' },
  { id: 'RQ-022', title: '后保险杠支架优化', source: '成本优化', priority: '低', owner: '严博', status: '实施中', detail: '压缩件数量。' },
  { id: 'RQ-023', title: 'B柱加强板提升', source: '法规需求', priority: '高', owner: '任澜', status: '评审中', detail: '提升侧碰安全。' },
  { id: 'RQ-024', title: '后轮罩隔音材料更新', source: '用户反馈', priority: '中', owner: '罗涛', status: '评审中', detail: '降低路噪。' },
  { id: 'RQ-025', title: '门槛梁焊接改进', source: '生产反馈', priority: '中', owner: '魏娜', status: '实施中', detail: '减少焊接变形。' },
  { id: 'RQ-026', title: '前围板加强筋优化', source: '性能优化', priority: '中', owner: '黄鹏', status: '待确认', detail: '提升扭转刚度。' },
  { id: 'RQ-027', title: '车门密封条升级', source: '售后问题', priority: '中', owner: '汤敏', status: '评审中', detail: '降低风噪。' },
  { id: 'RQ-028', title: '后备箱支撑杆位置调整', source: '用户反馈', priority: '低', owner: '顾雪', status: '实施中', detail: '优化开启力矩。' }
]);

const sources = [
  { label: '市场调研', value: 35 },
  { label: '法规需求', value: 25 },
  { label: '用户反馈', value: 20 },
  { label: '生产反馈', value: 20 }
];

const chartPoints = [
  { x: 10, y: 90 },
  { x: 50, y: 70 },
  { x: 90, y: 75 },
  { x: 130, y: 40 },
  { x: 170, y: 50 },
  { x: 210, y: 30 },
  { x: 250, y: 35 },
  { x: 290, y: 20 }
];

const modal = reactive({
  open: false,
  type: 'info',
  title: '',
  message: ''
});

const form = reactive({
  name: '',
  note: '',
  priority: '高'
});

const progress = ref(0);
let timer = null;

const progressLabel = '正在同步需求数据，请稍候';

const openForm = (title) => {
  modal.open = true;
  modal.type = 'form';
  modal.title = title;
  modal.message = '';
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
      progress.value += 10;
    }
  }, 300);
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
    modal.title = '操作成功';
    modal.message = `已提交：${form.name || '需求变更'}。审批流将于 2 小时内完成。`;
  } else if (modal.type === 'progress') {
    modal.type = 'info';
    modal.title = '导入完成';
    modal.message = '需求导入完成，系统已自动生成对比报告。';
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

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: #fff;
}

.tag.高 {
  background: #ef4444;
}

.tag.中 {
  background: #f59e0b;
}

.tag.低 {
  background: #22c55e;
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
