<template>
  <div class="container">
    <div class="flex">
      <div class="card stats">
        <h3>采集概览</h3>
        <div class="stat-grid">
          <div class="stat">
            <p class="label">接入源</p>
            <h2>{{ sources.length }}</h2>
            <span class="chip">实时连通</span>
          </div>
          <div class="stat">
            <p class="label">今日数据量</p>
            <h2>58.3 万条</h2>
            <span class="chip">+12% 提升</span>
          </div>
          <div class="stat">
            <p class="label">异常告警</p>
            <h2>3</h2>
            <span class="chip">已定位</span>
          </div>
        </div>
        <div class="actions">
          <button @click="showAdd = true">新增采集源</button>
          <button class="ghost" @click="triggerCollect">立即采集</button>
          <button @click="showSchedule = true">调整调度</button>
        </div>
      </div>
      <div class="card chart">
        <h3>最近 7 天采集趋势</h3>
        <div class="bars">
          <div v-for="(item, idx) in trend" :key="idx" class="bar">
            <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3>采集源列表</h3>
          <p class="muted">列表含 10 个以上采集点，支持快速维护</p>
        </div>
        <button class="ghost" @click="showTips = true">操作提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>地区</th>
            <th>状态</th>
            <th>延迟</th>
            <th>最近同步</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="source in sources" :key="source.name">
            <td>{{ source.name }}</td>
            <td>{{ source.type }}</td>
            <td>{{ source.region }}</td>
            <td><span class="badge" :style="{ background: source.statusColor }">{{ source.status }}</span></td>
            <td>{{ source.latency }}</td>
            <td>{{ source.sync }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <modal-dialog v-model="showAdd" title="新增采集源">
      <div class="form-grid">
        <label>采集名称<input placeholder="如：网点摄像头" /></label>
        <label>类型<select>
          <option>API</option>
          <option>数据库</option>
          <option>物联网</option>
          <option>文件流</option>
        </select></label>
        <label>采集频率<input placeholder="每 5 分钟" /></label>
      </div>
      <template #footer>
        <button class="ghost" @click="showAdd = false">取消</button>
        <button @click="showAdd = false; showTips = true;">提交</button>
      </template>
    </modal-dialog>

    <modal-dialog v-model="showSchedule" title="调度计划" width="520px">
      <p>选择要调整的采集窗口并确认保存。</p>
      <div class="form-grid">
        <label>时间窗口<input type="time" /></label>
        <label>并发数<input type="number" value="6" /></label>
      </div>
      <template #footer>
        <button class="ghost" @click="showSchedule = false">关闭</button>
        <button @click="showSchedule = false; showProgress = true; startProgress();">保存调整</button>
      </template>
    </modal-dialog>

    <modal-dialog v-model="showProgress" title="采集任务执行中" width="460px">
      <p>正在调度采集任务，请勿关闭窗口。</p>
      <div class="progress"><div class="progress-bar" :style="{ width: progress + '%' }"></div></div>
    </modal-dialog>

    <modal-dialog v-model="showTips" title="操作提示">
      <ul class="bullet">
        <li>点击“立即采集”会触发全局采集并显示进度。</li>
        <li>新增采集源提交后会自动测试连通性。</li>
        <li>调度调整完成后会推送至节点。</li>
      </ul>
    </modal-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showAdd = ref(false);
const showSchedule = ref(false);
const showProgress = ref(false);
const showTips = ref(false);
const progress = ref(20);

const sources = [
  { name: '金融接口-A1', type: 'API', region: '上海', status: '健康', statusColor: '#43a047', latency: '180ms', sync: '10:05' },
  { name: 'IoT-摄像头-南区', type: '物联网', region: '深圳', status: '健康', statusColor: '#43a047', latency: '220ms', sync: '10:02' },
  { name: '交易数据库', type: '数据库', region: '北京', status: '稍高', statusColor: '#fb8c00', latency: '360ms', sync: '09:58' },
  { name: '外部天气 API', type: 'API', region: '广州', status: '健康', statusColor: '#43a047', latency: '240ms', sync: '09:55' },
  { name: '物流 Kafka 流', type: '文件流', region: '成都', status: '健康', statusColor: '#43a047', latency: '190ms', sync: '09:51' },
  { name: '网点网闸日志', type: '文件流', region: '南京', status: '健康', statusColor: '#43a047', latency: '210ms', sync: '09:50' },
  { name: '用户行为埋点', type: 'API', region: '杭州', status: '健康', statusColor: '#43a047', latency: '170ms', sync: '09:47' },
  { name: '工单系统库', type: '数据库', region: '青岛', status: '稍高', statusColor: '#fb8c00', latency: '340ms', sync: '09:42' },
  { name: '设备心跳监测', type: '物联网', region: '郑州', status: '健康', statusColor: '#43a047', latency: '200ms', sync: '09:41' },
  { name: '业务报表文件', type: '文件流', region: '西安', status: '健康', statusColor: '#43a047', latency: '230ms', sync: '09:35' },
  { name: '合作方支付接口', type: 'API', region: '合肥', status: '注意', statusColor: '#e53935', latency: '520ms', sync: '09:32' }
];

const trend = [
  { label: '周一', value: 35 },
  { label: '周二', value: 52 },
  { label: '周三', value: 48 },
  { label: '周四', value: 60 },
  { label: '周五', value: 65 },
  { label: '周六', value: 58 },
  { label: '周日', value: 44 }
];

const startProgress = () => {
  progress.value = 10;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
      showTips.value = true;
    }
  }, 350);
};

const triggerCollect = () => {
  showProgress.value = true;
  startProgress();
};
</script>

<style scoped>
.stats {
  flex: 2 1 420px;
}

.chart {
  flex: 1 1 320px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.stat {
  background: #f7fbff;
  padding: 12px;
  border-radius: 12px;
}

.label {
  margin: 0;
  color: #6b7280;
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.chart .bars {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  height: 180px;
}

.bar {
  flex: 1;
  background: #eef3fb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 6px;
  gap: 6px;
}

.bar-fill {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(180deg, #4fc3f7, #1e88e5);
  transition: height 0.3s ease;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.muted {
  margin: 0;
  color: #94a3b8;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid input,
.form-grid select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d7deea;
}

button.ghost {
  background: #eef2f7;
  color: #1f2933;
}
</style>
