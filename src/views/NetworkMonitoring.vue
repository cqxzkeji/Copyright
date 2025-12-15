<template>
  <div class="grid" style="gap: 16px;">
    <div class="header-actions" style="justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 10px; align-items: center;">
        <h2 style="margin: 0;">网络业务监测</h2>
        <span class="tag">实时健康</span>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="openForm">新增探测</button>
        <button class="secondary-btn" @click="showProgress = true">刷新数据</button>
        <button class="secondary-btn" @click="showHint = true">操作提示</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="card">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div style="color: #6b7280;">在线节点</div>
            <div style="font-size: 26px; font-weight: 800;">23</div>
          </div>
          <div class="status-chip" style="background: #dcfce7; color: #16a34a;">+3 新增</div>
        </div>
      </div>
      <div class="card">
        <div style="color: #6b7280;">平均延迟</div>
        <div style="font-size: 26px; font-weight: 800;">38 ms</div>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="progress-inner" :style="{ width: '76%' }"></div>
        </div>
      </div>
      <div class="card">
        <div style="color: #6b7280;">丢包率</div>
        <div style="font-size: 26px; font-weight: 800;">0.7%</div>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="progress-inner" :style="{ width: '30%', background: 'linear-gradient(90deg,#f97316,#fb923c)' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>链路流量分布</strong>
        <button class="secondary-btn" @click="showTrafficModal = true">查看说明</button>
      </div>
      <div class="chart-placeholder" style="margin-top: 14px;">
        <div v-for="item in traffic" :key="item.name" class="bar" :style="{ height: `${item.value}px` }">
          <span>{{ item.name }} {{ item.value }}Gbps</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>实时探测列表</strong>
        <button class="secondary-btn" @click="showTableHint = true">列表提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>源地址</th>
            <th>目标</th>
            <th>延迟</th>
            <th>丢包</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in probes" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.source }}</td>
            <td>{{ item.target }}</td>
            <td>{{ item.latency }} ms</td>
            <td>{{ item.loss }}%</td>
            <td>
              <span class="status-chip" :style="item.latency < 60 ? goodChip : warnChip">{{ item.status }}</span>
            </td>
            <td>
              <button class="secondary-btn" @click="openDetail(item)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showFormModal" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">新增探测任务</div>
      <div class="modal-body">
        <div class="form-group">
          <label>任务名称</label>
          <input v-model="form.name" placeholder="如：华北-核心延迟" />
        </div>
        <div class="form-group">
          <label>目标地址</label>
          <input v-model="form.target" placeholder="输入域名/IP" />
        </div>
        <div class="form-group">
          <label>采样频率</label>
          <select v-model="form.interval">
            <option value="30s">30s</option>
            <option value="60s">60s</option>
            <option value="120s">120s</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="secondary-btn" @click="showFormModal = false">取消</button>
        <button class="primary-btn" @click="submitTask">提交</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">刷新进度</div>
      <div class="modal-body">
        <div class="progress-bar">
          <div class="progress-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="margin-top: 8px;">正在同步最新探测数据...</p>
      </div>
      <div class="modal-footer">
        <button class="secondary-btn" @click="showProgress = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showHint" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">操作提示</div>
      <div class="modal-body">
        <p>新增探测用于快速验证链路质量，刷新按钮会执行实时同步。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showHint = false">知道了</button>
      </div>
    </div>
  </div>

  <div v-if="showTrafficModal" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">流量图例</div>
      <div class="modal-body">
        <p>柱状高度代表链路带宽占用，颜色越深表示负载越高。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showTrafficModal = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showTableHint" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">列表提示</div>
      <div class="modal-body">
        <p>延迟高于 80ms 将自动转入观察状态，连续三次异常会推送告警。</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="showTableHint = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="detail" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">探测详情 - {{ detail.name }}</div>
      <div class="modal-body">
        <p>源地址：{{ detail.source }}</p>
        <p>目标：{{ detail.target }}</p>
        <p>最近延迟：{{ detail.latency }}ms，丢包：{{ detail.loss }}%</p>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="detail = null">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

const goodChip = { background: '#dcfce7', color: '#166534' };
const warnChip = { background: '#fff7ed', color: '#ea580c' };

const probes = ref([
  { name: '链路-01', source: '10.1.1.1', target: '8.8.8.8', latency: 32, loss: 0, status: '正常' },
  { name: '链路-02', source: '10.1.1.2', target: '1.1.1.1', latency: 55, loss: 0.1, status: '正常' },
  { name: '链路-03', source: '10.1.1.3', target: '172.16.0.1', latency: 84, loss: 1.2, status: '观察' },
  { name: '链路-04', source: '10.1.1.4', target: '192.168.10.10', latency: 44, loss: 0.2, status: '正常' },
  { name: '链路-05', source: '10.1.1.5', target: '183.60.61.250', latency: 62, loss: 0.7, status: '正常' },
  { name: '链路-06', source: '10.1.1.6', target: '223.5.5.5', latency: 38, loss: 0.1, status: '正常' },
  { name: '链路-07', source: '10.1.1.7', target: '139.9.9.9', latency: 52, loss: 0.3, status: '正常' },
  { name: '链路-08', source: '10.1.1.8', target: '101.6.6.6', latency: 73, loss: 0.5, status: '观察' },
  { name: '链路-09', source: '10.1.1.9', target: '208.67.222.222', latency: 47, loss: 0.4, status: '正常' },
  { name: '链路-10', source: '10.1.1.10', target: '114.114.114.114', latency: 36, loss: 0.1, status: '正常' },
  { name: '链路-11', source: '10.1.1.11', target: '119.29.29.29', latency: 58, loss: 0.2, status: '正常' }
]);

const traffic = ref([
  { name: '核心-A', value: 120 },
  { name: '核心-B', value: 150 },
  { name: '出口-1', value: 190 },
  { name: '出口-2', value: 130 },
  { name: '云专线', value: 160 }
]);

const showFormModal = ref(false);
const showProgress = ref(false);
const showHint = ref(false);
const showTrafficModal = ref(false);
const showTableHint = ref(false);
const detail = ref(null);
const progress = ref(10);

const form = reactive({ name: '', target: '', interval: '60s' });

const openForm = () => (showFormModal.value = true);

const submitTask = () => {
  probes.value.unshift({
    name: form.name || `新任务-${probes.value.length + 1}`,
    source: '自动分配',
    target: form.target || '未知',
    latency: 40,
    loss: 0.2,
    status: '校验中'
  });
  showFormModal.value = false;
  showProgress.value = true;
};

const openDetail = (item) => {
  detail.value = item;
};

onMounted(() => {
  const timer = setInterval(() => {
    if (!showProgress.value) return;
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value >= 100) {
      showProgress.value = false;
      progress.value = 10;
    }
  }, 500);
  return () => clearInterval(timer);
});
</script>
