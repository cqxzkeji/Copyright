<template>
  <section>
    <div class="section-header">
      <div>
        <div class="section-title">生产调度</div>
        <div style="color: #6b7a99;">自动分配工单、班次与打磨节拍</div>
      </div>
      <div class="section-actions">
        <button class="primary-btn" @click="showCreate = true">新建工单</button>
        <button class="secondary-btn" @click="openOptimize">优化节拍</button>
        <button class="secondary-btn" @click="openNotice">发布班次公告</button>
      </div>
    </div>

    <div class="card-grid" style="margin: 16px 0;">
      <div class="card" v-for="stat in stats" :key="stat.label">
        <h3>{{ stat.label }}</h3>
        <div class="stat-value">{{ stat.value }}</div>
        <div style="color: #6b7a99;">{{ stat.desc }}</div>
      </div>
      <div class="card" style="grid-column: span 2;">
        <h3>小时产出曲线</h3>
        <div class="inline-chart">
          <div
            v-for="(point, idx) in throughput"
            :key="idx"
            class="chart-bar"
            :style="{ '--bar-height': point + 'px' }"
            :title="'第' + (idx + 1) + '小时: ' + point + '件'"
          ></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <div class="section-title" style="font-size: 18px;">今日工单</div>
        <div class="section-actions">
          <button class="secondary-btn" @click="openProgress('排程导出中...')">导出排程</button>
          <button class="secondary-btn" @click="openProgress('推送到机台中...')">推送到机台</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>工单号</th>
            <th>产品</th>
            <th>批次</th>
            <th>计划时间</th>
            <th>产量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.product }}</td>
            <td>{{ order.batch }}</td>
            <td>{{ order.shift }}</td>
            <td>{{ order.qty }} 件</td>
            <td>
              <span class="chip" :class="order.status === '进行中' ? 'warning' : order.status === '排产' ? 'success' : 'danger'">
                {{ order.status }}
              </span>
            </td>
            <td>
              <button class="text-btn" @click="openAssign(order)">调整</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 创建工单 -->
    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">新建工单</div>
          <button class="text-btn" @click="showCreate = false">关闭</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="label">产品型号</label>
              <input v-model="newOrder.product" placeholder="如: CSB-42" />
            </div>
            <div>
              <label class="label">批次号</label>
              <input v-model="newOrder.batch" placeholder="Q2-..." />
            </div>
            <div>
              <label class="label">计划班次</label>
              <select v-model="newOrder.shift">
                <option value="早班">早班</option>
                <option value="中班">中班</option>
                <option value="晚班">晚班</option>
              </select>
            </div>
            <div>
              <label class="label">计划产量</label>
              <input v-model.number="newOrder.qty" type="number" min="100" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showCreate = false">取消</button>
          <button class="primary-btn" @click="createOrder">保存</button>
        </div>
      </div>
    </div>

    <!-- 进度弹窗 -->
    <div v-if="progressMessage" class="modal-overlay" @click.self="progressMessage = ''">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">处理中</div>
          <button class="text-btn" @click="progressMessage = ''">关闭</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 12px;">{{ progressMessage }}</div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 调整机台弹窗 -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">调整机台与顺序</div>
          <button class="text-btn" @click="selectedOrder = null">关闭</button>
        </div>
        <div class="modal-body">
          <div style="font-weight: 700; margin-bottom: 8px;">工单 {{ selectedOrder.id }}</div>
          <div class="form-grid">
            <div>
              <label class="label">指定机台</label>
              <select v-model="selectedOrder.machine">
                <option v-for="m in machines" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
            <div>
              <label class="label">起始时间</label>
              <input v-model="selectedOrder.start" type="time" />
            </div>
            <div>
              <label class="label">节拍(件/小时)</label>
              <input v-model.number="selectedOrder.rate" type="number" />
            </div>
            <div>
              <label class="label">备注</label>
              <textarea v-model="selectedOrder.note" rows="2" placeholder="打磨刀头需要预热..." />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="selectedOrder = null">取消</button>
          <button class="primary-btn" @click="saveAssign">确认调整</button>
        </div>
      </div>
    </div>

    <!-- 公告弹窗 -->
    <div v-if="showNotice" class="modal-overlay" @click.self="showNotice = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">班次公告</div>
          <button class="text-btn" @click="showNotice = false">关闭</button>
        </div>
        <div class="modal-body">
          <textarea v-model="notice" rows="4" placeholder="例：晚班改为 18:30 入场，磨具#3 优先处理加急单"></textarea>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showNotice = false">取消</button>
          <button class="primary-btn" @click="sendNotice">发布公告</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const stats = [
  { label: '今日排产', value: '1,260 件', desc: '已覆盖 3 个班次' },
  { label: '加急工单', value: '4 单', desc: '优先机台 M2/M4' },
  { label: '打磨刀头寿命', value: '72%', desc: '剩余 3.2 小时' },
  { label: '待确认换线', value: '2 台', desc: '等待班长确认' }
];

const orders = reactive([
  { id: 'WO-1001', product: 'CSB-32', batch: 'Q2-A1', shift: '早班', qty: 220, status: '进行中', machine: 'M1', start: '07:00', rate: 42, note: '' },
  { id: 'WO-1002', product: 'CSB-48', batch: 'Q2-A2', shift: '早班', qty: 180, status: '排产', machine: 'M2', start: '08:30', rate: 36, note: '' },
  { id: 'WO-1003', product: 'CSB-42', batch: 'Q2-B1', shift: '中班', qty: 260, status: '排产', machine: 'M3', start: '13:10', rate: 40, note: '' },
  { id: 'WO-1004', product: 'CSB-32', batch: 'Q2-B3', shift: '中班', qty: 140, status: '进行中', machine: 'M4', start: '12:45', rate: 34, note: '' },
  { id: 'WO-1005', product: 'CSB-55', batch: 'Q2-C1', shift: '晚班', qty: 180, status: '待检', machine: 'M5', start: '18:20', rate: 30, note: '' },
  { id: 'WO-1006', product: 'CSB-48', batch: 'Q2-C2', shift: '晚班', qty: 210, status: '排产', machine: 'M6', start: '19:15', rate: 32, note: '' },
  { id: 'WO-1007', product: 'CSB-32', batch: 'Q2-D1', shift: '早班', qty: 200, status: '进行中', machine: 'M2', start: '09:10', rate: 41, note: '' },
  { id: 'WO-1008', product: 'CSB-28', batch: 'Q2-D2', shift: '中班', qty: 150, status: '排产', machine: 'M4', start: '14:35', rate: 38, note: '' },
  { id: 'WO-1009', product: 'CSB-42', batch: 'Q2-E1', shift: '晚班', qty: 190, status: '排产', machine: 'M1', start: '20:10', rate: 33, note: '' },
  { id: 'WO-1010', product: 'CSB-55', batch: 'Q2-E2', shift: '早班', qty: 120, status: '进行中', machine: 'M3', start: '07:45', rate: 35, note: '' }
]);

const throughput = [60, 72, 90, 110, 126, 122, 118, 133, 128, 140];
const machines = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
const showCreate = ref(false);
const showNotice = ref(false);
const notice = ref('');
const progressMessage = ref('');
const progress = ref(15);
const selectedOrder = ref(null);
const newOrder = reactive({ product: 'CSB-32', batch: 'Q2-X1', shift: '早班', qty: 200 });

const openProgress = (message) => {
  progressMessage.value = message;
  progress.value = 15;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 15);
    if (progress.value >= 100) clearInterval(timer);
  }, 400);
};

const openOptimize = () => openProgress('正在重新计算节拍与换线顺序...');
const openNotice = () => {
  showNotice.value = true;
};

const openAssign = (order) => {
  selectedOrder.value = { ...order };
};

const saveAssign = () => {
  if (!selectedOrder.value) return;
  const idx = orders.findIndex((o) => o.id === selectedOrder.value.id);
  if (idx !== -1) orders[idx] = { ...selectedOrder.value };
  selectedOrder.value = null;
  openProgress('已更新机台顺序');
};

const createOrder = () => {
  orders.push({
    id: `WO-${Math.floor(Math.random() * 9000 + 1100)}`,
    product: newOrder.product,
    batch: newOrder.batch,
    shift: newOrder.shift,
    qty: newOrder.qty,
    status: '排产',
    machine: 'M1',
    start: '07:30',
    rate: 36,
    note: ''
  });
  showCreate.value = false;
  openProgress('正在保存并排产新工单...');
};

const sendNotice = () => {
  showNotice.value = false;
  openProgress('公告已推送到看板与短信');
  notice.value = '';
};
</script>
