<template>
  <section>
    <div class="section-header">
      <div>
        <div class="section-title">质量控制</div>
        <div style="color: #6b7a99;">记录抽检、缺陷追踪，自动生成整改动作</div>
      </div>
      <div class="section-actions">
        <button class="primary-btn" @click="showRecord = true">录入抽检</button>
        <button class="secondary-btn" @click="openAudit">启动巡检</button>
        <button class="secondary-btn" @click="openProgress('正在生成 8D 报告...')">生成8D报告</button>
      </div>
    </div>

    <div class="card-grid" style="margin: 16px 0;">
      <div class="card">
        <h3>缺陷类型分布</h3>
        <div class="inline-chart">
          <div v-for="issue in defectChart" :key="issue.label" class="chart-bar" :style="{ '--bar-height': issue.height + 'px' }" :title="issue.label + ' ' + issue.count">
          </div>
        </div>
      </div>
      <div class="card">
        <h3>抽检结果</h3>
        <div class="info-row">
          <div>
            <div class="label" style="margin-bottom: 4px;">合格率</div>
            <div class="stat-value">98.4%</div>
          </div>
          <div>
            <div class="label" style="margin-bottom: 4px;">缺陷数</div>
            <div class="stat-value">12</div>
          </div>
          <div>
            <div class="label" style="margin-bottom: 4px;">返工完成</div>
            <div class="stat-value">7</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <div class="section-title" style="font-size: 18px;">抽检记录</div>
        <div class="section-actions">
          <button class="secondary-btn" @click="openProgress('正在导出质检记录...')">导出记录</button>
          <button class="secondary-btn" @click="openProgress('推送整改通知...')">推送整改</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>产品</th>
            <th>抽检人</th>
            <th>缺陷</th>
            <th>等级</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in qcRows" :key="row.batch">
            <td>{{ row.batch }}</td>
            <td>{{ row.product }}</td>
            <td>{{ row.inspector }}</td>
            <td>{{ row.defect }}</td>
            <td>
              <span class="chip" :class="row.level === '严重' ? 'danger' : row.level === '轻微' ? 'success' : 'warning'">{{ row.level }}</span>
            </td>
            <td>
              <span class="chip" :class="row.status === '关闭' ? 'success' : 'warning'">{{ row.status }}</span>
            </td>
            <td>
              <button class="text-btn" @click="openDetail(row)">处理</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 录入抽检 -->
    <div v-if="showRecord" class="modal-overlay" @click.self="showRecord = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">录入抽检</div>
          <button class="text-btn" @click="showRecord = false">关闭</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="label">批次</label>
              <input v-model="record.batch" />
            </div>
            <div>
              <label class="label">产品型号</label>
              <input v-model="record.product" />
            </div>
            <div>
              <label class="label">抽检人</label>
              <input v-model="record.inspector" />
            </div>
            <div>
              <label class="label">缺陷描述</label>
              <input v-model="record.defect" />
            </div>
          </div>
          <div class="form-grid" style="margin-top: 10px;">
            <div>
              <label class="label">严重度</label>
              <select v-model="record.level">
                <option value="轻微">轻微</option>
                <option value="一般">一般</option>
                <option value="严重">严重</option>
              </select>
            </div>
            <div>
              <label class="label">责任机台</label>
              <select v-model="record.machine">
                <option v-for="m in machines" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showRecord = false">取消</button>
          <button class="primary-btn" @click="submitRecord">保存</button>
        </div>
      </div>
    </div>

    <!-- 巡检进度 -->
    <div v-if="progressMessage" class="modal-overlay" @click.self="progressMessage = ''">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">质检任务</div>
          <button class="text-btn" @click="progressMessage = ''">关闭</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 10px;">{{ progressMessage }}</div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 缺陷处理 -->
    <div v-if="selectedRow" class="modal-overlay" @click.self="selectedRow = null">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">缺陷处理 - {{ selectedRow.batch }}</div>
          <button class="text-btn" @click="selectedRow = null">关闭</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="label">立即措施</label>
              <textarea v-model="selectedRow.action" rows="2" placeholder="停机，调校模具间隙..." />
            </div>
            <div>
              <label class="label">复检人</label>
              <input v-model="selectedRow.reviewer" />
            </div>
            <div>
              <label class="label">复检时间</label>
              <input v-model="selectedRow.recheck" type="datetime-local" />
            </div>
            <div>
              <label class="label">状态</label>
              <select v-model="selectedRow.status">
                <option value="处理中">处理中</option>
                <option value="关闭">关闭</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="selectedRow = null">取消</button>
          <button class="primary-btn" @click="saveAction">提交处理</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const qcRows = reactive([
  { batch: 'Q2-A1', product: 'CSB-32', inspector: '王伟', defect: '孔径偏小', level: '一般', status: '处理中', machine: 'M1', action: '', reviewer: '', recheck: '' },
  { batch: 'Q2-A2', product: 'CSB-48', inspector: '李静', defect: '打磨毛刺', level: '轻微', status: '关闭', machine: 'M2', action: '', reviewer: '', recheck: '' },
  { batch: 'Q2-B1', product: 'CSB-42', inspector: '韩斌', defect: '镀层划伤', level: '一般', status: '处理中', machine: 'M3', action: '', reviewer: '', recheck: '' },
  { batch: 'Q2-B3', product: 'CSB-32', inspector: '江涛', defect: '尺寸偏差', level: '严重', status: '处理中', machine: 'M4', action: '', reviewer: '', recheck: '' },
  { batch: 'Q2-C1', product: 'CSB-55', inspector: '陆雅', defect: '表面气孔', level: '一般', status: '关闭', machine: 'M5', action: '', reviewer: '', recheck: '' },
  { batch: 'Q2-C2', product: 'CSB-48', inspector: '陈晨', defect: '孔内氧化', level: '轻微', status: '关闭', machine: 'M6', action: '', reviewer: '', recheck: '' },
  { batch: 'Q2-D1', product: 'CSB-32', inspector: '范鑫', defect: '螺纹损伤', level: '严重', status: '处理中', machine: 'M2', action: '', reviewer: '', recheck: '' },
  { batch: 'Q2-D2', product: 'CSB-28', inspector: '周畅', defect: '打磨不均', level: '一般', status: '处理中', machine: 'M4', action: '', reviewer: '', recheck: '' },
  { batch: 'Q2-E1', product: 'CSB-42', inspector: '吴勇', defect: '夹具印痕', level: '轻微', status: '关闭', machine: 'M1', action: '', reviewer: '', recheck: '' },
  { batch: 'Q2-E2', product: 'CSB-55', inspector: '孟倩', defect: '尺寸波动', level: '一般', status: '处理中', machine: 'M3', action: '', reviewer: '', recheck: '' }
]);

const defectChart = [
  { label: '孔径', height: 120, count: '5 次' },
  { label: '毛刺', height: 80, count: '3 次' },
  { label: '划伤', height: 60, count: '2 次' },
  { label: '气孔', height: 90, count: '4 次' },
  { label: '螺纹', height: 100, count: '5 次' }
];

const machines = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
const showRecord = ref(false);
const record = reactive({ batch: 'Q2-F1', product: 'CSB-42', inspector: '质检组', defect: '待填写', level: '轻微', machine: 'M1' });
const progressMessage = ref('');
const progress = ref(10);
const selectedRow = ref(null);

const openProgress = (msg) => {
  progressMessage.value = msg;
  progress.value = 10;
  const timer = setInterval(() => {
    progress.value = Math.min(progress.value + 18, 100);
    if (progress.value >= 100) clearInterval(timer);
  }, 380);
};

const openAudit = () => openProgress('巡检任务创建并下发至移动端...');

const submitRecord = () => {
  qcRows.unshift({ ...record, status: '处理中' });
  showRecord.value = false;
  openProgress('抽检记录已保存并提醒责任机台');
};

const openDetail = (row) => {
  selectedRow.value = { ...row };
};

const saveAction = () => {
  if (!selectedRow.value) return;
  const idx = qcRows.findIndex((r) => r.batch === selectedRow.value.batch);
  if (idx !== -1) qcRows[idx] = { ...selectedRow.value };
  selectedRow.value = null;
  openProgress('整改措施已保存');
};
</script>
