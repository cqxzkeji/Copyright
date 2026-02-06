<template>
  <section class="page">
    <div class="card">
      <div class="card-header">
        <div>
          <h2>流处理调度中心</h2>
          <p>分布式流处理任务运行状态与实时负载。</p>
        </div>
        <div class="actions">
          <button class="primary" @click="openPipeline">新建处理链路</button>
          <button class="secondary" @click="openScale">弹性扩缩容</button>
          <button class="ghost" @click="openTip">处理策略提示</button>
        </div>
      </div>
      <div class="stats">
        <div class="stat">
          <h3>活跃作业</h3>
          <p>42</p>
        </div>
        <div class="stat">
          <h3>平均延迟</h3>
          <p>280ms</p>
        </div>
        <div class="stat">
          <h3>容错恢复</h3>
          <p>自动启用</p>
        </div>
      </div>
      <div class="line-chart">
        <div class="line" v-for="(point, index) in latencyTrend" :key="point.time">
          <span class="dot" :style="{ bottom: point.value + '%' }"></span>
          <label>{{ point.time }}</label>
          <div class="stem" :style="{ height: point.value + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h2>处理作业列表</h2>
          <p>展示实时清洗、过滤、聚合与变换作业的执行情况。</p>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>作业编号</th>
              <th>作业名称</th>
              <th>处理逻辑</th>
              <th>吞吐量</th>
              <th>延迟</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobs" :key="job.id">
              <td>{{ job.id }}</td>
              <td>{{ job.name }}</td>
              <td>{{ job.logic }}</td>
              <td>{{ job.throughput }}</td>
              <td><span :class="['badge', job.delayLevel]">{{ job.delay }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-model="showPipeline" title="新建流处理链路" @confirm="savePipeline">
      <div class="form-grid">
        <label>
          链路名称
          <input v-model="pipelineForm.name" placeholder="实时告警处理" />
        </label>
        <label>
          处理规则
          <select v-model="pipelineForm.rule">
            <option>清洗 + 去重 + 聚合</option>
            <option>过滤 + 窗口聚合</option>
            <option>异常检测 + 路由</option>
          </select>
        </label>
        <label>
          资源优先级
          <select v-model="pipelineForm.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </div>
    </Modal>

    <Modal v-model="showScale" title="扩缩容进度" @confirm="closeScale">
      <div>
        <div class="progress-label">正在扩容计算节点</div>
        <div class="progress-bar"><span :style="{ width: scaleProgress + '%' }" /></div>
        <p class="progress-note">预计 2 分钟完成资源扩充。</p>
      </div>
    </Modal>

    <Modal v-model="showTip" title="处理策略提示" @confirm="closeTip">
      <ul class="tip-list">
        <li>高峰时段建议开启批量窗口聚合以降低延迟。</li>
        <li>异常检测作业可采用自适应阈值模型。</li>
        <li>支持基于延迟的优先级调度策略。</li>
      </ul>
    </Modal>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Modal from '../components/Modal.vue';

const showPipeline = ref(false);
const showScale = ref(false);
const showTip = ref(false);

const pipelineForm = reactive({
  name: '',
  rule: '清洗 + 去重 + 聚合',
  priority: '高'
});

const latencyTrend = [
  { time: '09:00', value: 30 },
  { time: '09:15', value: 36 },
  { time: '09:30', value: 42 },
  { time: '09:45', value: 40 },
  { time: '10:00', value: 46 },
  { time: '10:15', value: 54 },
  { time: '10:30', value: 50 },
  { time: '10:45', value: 58 },
  { time: '11:00', value: 52 },
  { time: '11:15', value: 60 }
];

const jobs = Array.from({ length: 20 }, (_, index) => ({
  id: `JOB-${1001 + index}`,
  name: `实时处理-${index + 1}`,
  logic: index % 3 === 0 ? '过滤 + 聚合' : index % 3 === 1 ? '清洗 + 去重' : '路由 + 变换',
  throughput: `${(1.2 + index * 0.08).toFixed(2)}M/s`,
  delay: `${(180 + index * 8)}ms`,
  delayLevel: index % 4 === 0 ? 'warning' : 'success'
}));

const scaleProgress = ref(64);

const openPipeline = () => {
  showPipeline.value = true;
};

const openScale = () => {
  showScale.value = true;
};

const openTip = () => {
  showTip.value = true;
};

const savePipeline = () => {
  showPipeline.value = false;
};

const closeScale = () => {
  showScale.value = false;
};

const closeTip = () => {
  showTip.value = false;
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.card-header h2 {
  font-size: 18px;
  margin-bottom: 6px;
}

.card-header p {
  font-size: 13px;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.primary,
.secondary,
.ghost {
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e2e8f0;
}

.ghost {
  background: #f8fafc;
  border: 1px dashed #cbd5f5;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.stat {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.stat h3 {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.stat p {
  font-size: 20px;
  font-weight: 600;
}

.line-chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  height: 200px;
  align-items: end;
  gap: 10px;
  padding-top: 12px;
}

.line {
  position: relative;
  display: grid;
  justify-items: center;
  height: 100%;
}

.line .stem {
  width: 10px;
  background: linear-gradient(180deg, #60a5fa, #2563eb);
  border-radius: 999px;
}

.line .dot {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1d4ed8;
}

.line label {
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
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
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

thead {
  background: #f1f5f9;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.success {
  background: #dcfce7;
  color: #15803d;
}

.warning {
  background: #fef9c3;
  color: #a16207;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.progress-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.progress-bar {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #f97316, #facc15);
}

.progress-note {
  margin-top: 10px;
  font-size: 13px;
  color: #64748b;
}

.tip-list {
  display: grid;
  gap: 8px;
  padding-left: 16px;
  color: #475569;
}
</style>
