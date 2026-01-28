<template>
  <section class="module">
    <div class="module-actions">
      <button class="primary" @click="openForm('新增工艺')">新增工艺</button>
      <button class="secondary" @click="openForm('排产调整')">排产调整</button>
      <button class="secondary" @click="openProgress('启动监控进度')">启动监控</button>
      <button class="ghost" @click="openInfo('质量提示', '焊接工位合格率下降，请安排工装校准。')">质量提示</button>
    </div>

    <div class="cards">
      <div class="card">
        <h4>生产工艺节点</h4>
        <p class="metric">32</p>
        <span>本周新增 3 项</span>
      </div>
      <div class="card">
        <h4>质量合格率</h4>
        <p class="metric">96.3%</p>
        <span>保持稳定</span>
      </div>
      <div class="card">
        <h4>在线设备</h4>
        <p class="metric">18</p>
        <span>运行中</span>
      </div>
    </div>

    <div class="panel-grid">
      <div class="panel">
        <h3>工艺执行节拍</h3>
        <svg viewBox="0 0 300 120" class="chart">
          <polyline
            points="10,80 50,60 90,65 130,50 170,55 210,40 250,45 290,35"
            fill="none"
            stroke="#14b8a6"
            stroke-width="4"
          />
        </svg>
      </div>
      <div class="panel">
        <h3>工位质量得分</h3>
        <div class="bars">
          <div v-for="item in quality" :key="item.label" class="bar-row">
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
        <h3>生产工艺清单（20条）</h3>
        <button class="ghost" @click="openInfo('工艺提醒', '本周 4 项工艺需要更新作业指导书。')">工艺提醒</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>工艺名称</th>
            <th>工位</th>
            <th>负责人</th>
            <th>状态</th>
            <th>质量等级</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.title }}</td>
            <td>{{ row.station }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.grade }}</td>
            <td><button class="link" @click="openInfo('工艺详情', row.detail)">查看详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalBase :open="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'form'" class="modal-form">
        <label>
          工艺名称
          <input v-model="form.name" placeholder="请输入工艺名称" />
        </label>
        <label>
          调整说明
          <textarea v-model="form.note" rows="3" placeholder="填写调整说明"></textarea>
        </label>
        <label>
          影响工位
          <select v-model="form.station">
            <option>焊装</option>
            <option>涂装</option>
            <option>总装</option>
            <option>质检</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'progress'" class="modal-progress">
        <p>正在启动生产监控系统...</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <small>监控接入 {{ progress }}%</small>
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

const quality = [
  { label: '焊装', value: 94 },
  { label: '涂装', value: 97 },
  { label: '总装', value: 92 },
  { label: '质检', value: 96 }
];

const rows = ref([
  { id: 'PR-001', title: '侧围焊接工艺', station: '焊装', owner: '郝斌', status: '执行中', grade: 'A级', detail: '重点监控焊点质量。' },
  { id: 'PR-002', title: '车顶点焊工艺', station: '焊装', owner: '赵恒', status: '执行中', grade: 'A级', detail: '工装夹具需定期校准。' },
  { id: 'PR-003', title: '门槛梁涂装', station: '涂装', owner: '孙畅', status: '待调整', grade: 'B级', detail: '涂装厚度需增加 5%。' },
  { id: 'PR-004', title: '前舱涂装', station: '涂装', owner: '柯冉', status: '执行中', grade: 'A级', detail: '重点监控色差。' },
  { id: 'PR-005', title: '总装螺栓拧紧', station: '总装', owner: '郭霖', status: '执行中', grade: 'A级', detail: '扭矩范围 120-130Nm。' },
  { id: 'PR-006', title: '总装线束固定', station: '总装', owner: '康宇', status: '待调整', grade: 'B级', detail: '调整线束夹持角度。' },
  { id: 'PR-007', title: '底盘质检', station: '质检', owner: '范宁', status: '执行中', grade: 'A级', detail: '重点检查焊点缺陷。' },
  { id: 'PR-008', title: '整车外观质检', station: '质检', owner: '龚琪', status: '执行中', grade: 'A级', detail: '确认漆面光洁度。' },
  { id: 'PR-009', title: '车门装配', station: '总装', owner: '方澄', status: '执行中', grade: 'A级', detail: '门缝间隙需控制 3.5mm。' },
  { id: 'PR-010', title: '仪表板装配', station: '总装', owner: '安晨', status: '待调整', grade: 'B级', detail: '加强安装防错。' },
  { id: 'PR-011', title: '尾门装配', station: '总装', owner: '柯宇', status: '执行中', grade: 'A级', detail: '增加气动工具校验。' },
  { id: 'PR-012', title: '门槛梁焊缝检测', station: '质检', owner: '许帆', status: '执行中', grade: 'A级', detail: '焊缝需无气孔。' },
  { id: 'PR-013', title: '车顶涂装', station: '涂装', owner: '于安', status: '执行中', grade: 'A级', detail: '涂装均匀性检查。' },
  { id: 'PR-014', title: '后轮罩焊接', station: '焊装', owner: '余哲', status: '待调整', grade: 'B级', detail: '调整焊接电流。' },
  { id: 'PR-015', title: '前围板装配', station: '总装', owner: '邹扬', status: '执行中', grade: 'A级', detail: '关注装配定位销。' },
  { id: 'PR-016', title: '车顶内饰装配', station: '总装', owner: '梁洁', status: '执行中', grade: 'A级', detail: '注意防止刮擦。' },
  { id: 'PR-017', title: '车身电泳工艺', station: '涂装', owner: '倪嘉', status: '执行中', grade: 'A级', detail: '电泳电流稳定性监控。' },
  { id: 'PR-018', title: '车门铰链焊接', station: '焊装', owner: '陆恒', status: '待调整', grade: 'B级', detail: '定位偏差需调整。' },
  { id: 'PR-019', title: '侧围涂胶', station: '涂装', owner: '孟想', status: '执行中', grade: 'A级', detail: '涂胶宽度需满足标准。' },
  { id: 'PR-020', title: '整车终检', station: '质检', owner: '梁艺', status: '执行中', grade: 'A级', detail: '终检合格后入库。' }
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
  station: '焊装'
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
      progress.value += 15;
    }
  }, 220);
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
    modal.title = '工艺已更新';
    modal.message = `已提交：${form.name || '工艺调整'}，系统将同步到生产线。`;
  } else if (modal.type === 'progress') {
    modal.type = 'info';
    modal.title = '监控启动完成';
    modal.message = '生产监控已上线，实时数据已接入。';
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
  background: linear-gradient(90deg, #22d3ee, #14b8a6);
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
  background: linear-gradient(90deg, #22d3ee, #14b8a6);
}
</style>
