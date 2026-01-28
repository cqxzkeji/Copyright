<template>
  <section class="module">
    <div class="module-actions">
      <button class="primary" @click="openForm('上传图纸')">上传图纸</button>
      <button class="secondary" @click="openForm('协作评审')">协作评审</button>
      <button class="secondary" @click="openProgress('同步版本进度')">同步版本</button>
      <button class="ghost" @click="openInfo('设计提示', '今日有 5 份图纸等待审签，请确认版本备注完整。')">设计提示</button>
    </div>

    <div class="cards">
      <div class="card">
        <h4>图纸库总量</h4>
        <p class="metric">126</p>
        <span>本周新增 12 份</span>
      </div>
      <div class="card">
        <h4>协同任务</h4>
        <p class="metric">14</p>
        <span>正在进行</span>
      </div>
      <div class="card">
        <h4>模型版本一致率</h4>
        <p class="metric">95%</p>
        <span>最新版本已同步</span>
      </div>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <h3>设计协作负载</h3>
        <div class="circle-chart">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" stroke="#e2e8f0" stroke-width="12" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#4f46e5"
              stroke-width="12"
              fill="none"
              stroke-dasharray="314"
              stroke-dashoffset="90"
              stroke-linecap="round"
            />
          </svg>
          <div class="circle-value">72%</div>
        </div>
      </div>
      <div class="panel">
        <h3>版本审签进度</h3>
        <div class="bars">
          <div v-for="item in reviews" :key="item.label" class="bar-row">
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
        <h3>设计图纸清单（20条）</h3>
        <button class="ghost" @click="openInfo('设计归档', '已完成归档提醒发送，可在归档中心查看。')">归档提示</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>图纸名称</th>
            <th>版本</th>
            <th>负责工程师</th>
            <th>状态</th>
            <th>审签</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.title }}</td>
            <td>{{ row.version }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.review }}</td>
            <td><button class="link" @click="openInfo('图纸详情', row.detail)">查看详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalBase :open="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'form'" class="modal-form">
        <label>
          图纸名称
          <input v-model="form.name" placeholder="请输入图纸名称" />
        </label>
        <label>
          协作内容
          <textarea v-model="form.note" rows="3" placeholder="填写协作要点"></textarea>
        </label>
        <label>
          目标版本
          <select v-model="form.version">
            <option>V1.0</option>
            <option>V1.1</option>
            <option>V2.0</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'progress'" class="modal-progress">
        <p>正在同步云端图纸版本，请稍候...</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <small>已同步 {{ progress }}%</small>
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
  { id: 'DS-001', title: '前围板结构图', version: 'V2.1', owner: '曹景', status: '待审签', review: '2/5', detail: '需要完成焊接点校核。' },
  { id: 'DS-002', title: '侧围内板总成', version: 'V1.8', owner: '丁锐', status: '协作中', review: '3/5', detail: '与工艺团队确认冲压工序。' },
  { id: 'DS-003', title: '前保险杠支架', version: 'V3.0', owner: '蔡宁', status: '已归档', review: '5/5', detail: '已归档进入生产资料库。' },
  { id: 'DS-004', title: '车顶骨架图', version: 'V2.5', owner: '欧阳霖', status: '待审签', review: '1/5', detail: '需要补充材料清单。' },
  { id: 'DS-005', title: '后门内板', version: 'V1.4', owner: '秦越', status: '协作中', review: '3/5', detail: '优化装配定位孔。' },
  { id: 'DS-006', title: '仪表板支架', version: 'V2.0', owner: '章琪', status: '待审签', review: '2/5', detail: '补充NVH评估报告。' },
  { id: 'DS-007', title: '前翼子板', version: 'V2.2', owner: '孟然', status: '已归档', review: '5/5', detail: '已同步供应商文件。' },
  { id: 'DS-008', title: '后备箱地板', version: 'V1.9', owner: '石磊', status: '协作中', review: '4/5', detail: '需确认加筋布局。' },
  { id: 'DS-009', title: '门槛梁结构', version: 'V2.3', owner: '卓峰', status: '待审签', review: '2/5', detail: '正在更新材料编码。' },
  { id: 'DS-010', title: '底盘护板', version: 'V1.7', owner: '严瑾', status: '协作中', review: '3/5', detail: '需要更新风阻数据。' },
  { id: 'DS-011', title: 'B柱加强板', version: 'V3.1', owner: '熊倩', status: '待审签', review: '1/5', detail: '需进行碰撞仿真补充。' },
  { id: 'DS-012', title: '后保险杠梁', version: 'V2.6', owner: '费航', status: '已归档', review: '5/5', detail: '已完成版本冻结。' },
  { id: 'DS-013', title: '车门玻璃导轨', version: 'V1.5', owner: '宋雯', status: '协作中', review: '3/5', detail: '协作供应商接口。' },
  { id: 'DS-014', title: '前舱盖内板', version: 'V2.4', owner: '祁辰', status: '待审签', review: '2/5', detail: '补充铰链强度校核。' },
  { id: 'DS-015', title: '后窗框架', version: 'V1.6', owner: '陆扬', status: '协作中', review: '4/5', detail: '需更新尺寸链。' },
  { id: 'DS-016', title: '电池包护板', version: 'V2.0', owner: '靳浩', status: '待审签', review: '2/5', detail: '确认防护等级。' },
  { id: 'DS-017', title: '前围隔音板', version: 'V1.9', owner: '郝菁', status: '已归档', review: '5/5', detail: '配套图纸已归档。' },
  { id: 'DS-018', title: '侧围加强筋', version: 'V2.2', owner: '钱枫', status: '协作中', review: '3/5', detail: '与试制团队讨论材料。' },
  { id: 'DS-019', title: '车顶行李架预留孔', version: 'V1.3', owner: '潘悦', status: '待审签', review: '2/5', detail: '需要确认密封方式。' },
  { id: 'DS-020', title: '仪表板横梁', version: 'V2.7', owner: '魏琪', status: '协作中', review: '4/5', detail: '待确认CAE结果。' }
]);

const reviews = [
  { label: '结构图', value: 78 },
  { label: '总成图', value: 64 },
  { label: '装配图', value: 52 },
  { label: '标准件', value: 83 }
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
  version: 'V1.0'
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
  }, 260);
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
    modal.title = '协作已发起';
    modal.message = `已提交：${form.name || '图纸协作'}，协作提醒已发送给相关人员。`;
  } else if (modal.type === 'progress') {
    modal.type = 'info';
    modal.title = '同步完成';
    modal.message = '设计版本同步完成，系统已生成差异报告。';
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

.circle-chart {
  position: relative;
  width: 120px;
  height: 120px;
  margin-top: 12px;
}

.circle-chart svg {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
}

.circle-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #4f46e5;
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
