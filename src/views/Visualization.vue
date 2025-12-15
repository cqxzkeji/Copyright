<template>
  <div class="container">
    <div class="flex">
      <div class="card" style="flex: 2 1 460px;">
        <div class="header">
          <div>
            <h3>指标走势</h3>
            <p class="muted">含图表与数据表格，支持导出</p>
          </div>
          <button class="ghost" @click="showExport = true">导出报表</button>
        </div>
        <div class="line-chart">
          <div class="line" v-for="(point, idx) in metrics" :key="idx" :style="{ left: idx * step + '%', bottom: point.value + '%' }"></div>
          <div class="area" :style="areaStyle"></div>
        </div>
      </div>
      <div class="card" style="flex: 1 1 320px;">
        <h3>报表操作</h3>
        <div class="actions">
          <button @click="showExport = true">导出</button>
          <button class="ghost" @click="showRefresh = true; startRefresh();">刷新缓存</button>
          <button @click="showShare = true">分享链接</button>
        </div>
        <p class="muted">按钮均配备模态弹窗与进度反馈</p>
      </div>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3>指标明细</h3>
          <p class="muted">列表不少于 10 行</p>
        </div>
        <button class="ghost" @click="showShare = true">复制分享</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>指标</th>
            <th>当日值</th>
            <th>环比</th>
            <th>同比</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in detail" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.qoq }}</td>
            <td>{{ item.yoy }}</td>
            <td>{{ item.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <modal-dialog v-model="showExport" title="导出报表" width="500px">
      <div class="form-grid">
        <label>报表名称<input value="日度数据概览" /></label>
        <label>格式<select><option>Excel</option><option>CSV</option><option>PDF</option></select></label>
        <label>发送邮箱<input type="email" value="team@example.com" /></label>
      </div>
      <template #footer>
        <button class="ghost" @click="showExport = false">取消</button>
        <button @click="showExport = false; showRefresh = true; startRefresh();">导出</button>
      </template>
    </modal-dialog>

    <modal-dialog v-model="showRefresh" title="刷新缓存" width="460px">
      <p>正在刷新可视化缓存，请稍候...</p>
      <div class="progress"><div class="progress-bar" :style="{ width: refresh + '%' }"></div></div>
    </modal-dialog>

    <modal-dialog v-model="showShare" title="分享报表">
      <p>已生成临时访问链接：<strong>https://report.local/abc123</strong></p>
      <p class="muted">链接有效期 2 小时，可在系统管理中手动失效。</p>
    </modal-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showExport = ref(false);
const showRefresh = ref(false);
const showShare = ref(false);
const refresh = ref(20);

const metrics = [
  { label: 'Mon', value: 45 },
  { label: 'Tue', value: 60 },
  { label: 'Wed', value: 54 },
  { label: 'Thu', value: 70 },
  { label: 'Fri', value: 64 },
  { label: 'Sat', value: 58 },
  { label: 'Sun', value: 62 }
];

const detail = [
  { id: 1, name: 'PV', value: '128k', qoq: '+8%', yoy: '+19%', owner: '陈静' },
  { id: 2, name: 'UV', value: '63k', qoq: '+6%', yoy: '+12%', owner: '李泽' },
  { id: 3, name: '转化率', value: '4.6%', qoq: '+0.6%', yoy: '+1.2%', owner: '王晓' },
  { id: 4, name: '活跃设备', value: '21k', qoq: '+4%', yoy: '+8%', owner: '赵涵' },
  { id: 5, name: '消息送达', value: '93%', qoq: '+2%', yoy: '+4%', owner: '刘敏' },
  { id: 6, name: '接口成功率', value: '99.8%', qoq: '+0.3%', yoy: '+0.6%', owner: '杨晨' },
  { id: 7, name: '数据延迟', value: '2.3s', qoq: '-0.2s', yoy: '-0.4s', owner: '苏瑾' },
  { id: 8, name: 'API QPS', value: '1.8k', qoq: '+0.2k', yoy: '+0.4k', owner: '韩旭' },
  { id: 9, name: '告警命中', value: '142', qoq: '+11', yoy: '+24', owner: '周琪' },
  { id: 10, name: '报表导出', value: '320', qoq: '+14', yoy: '+28', owner: '何云' },
  { id: 11, name: '工单关闭', value: '280', qoq: '+9', yoy: '+16', owner: '史诺' }
];

const step = computed(() => (metrics.length > 1 ? 100 / (metrics.length - 1) : 100));
const areaStyle = computed(() => {
  const gradient = metrics
    .map((point, idx) => `${point.value}% ${idx * step.value}%`)
    .join(', ');
  return { background: `linear-gradient(180deg, rgba(30,136,229,0.4) 0%, rgba(79,195,247,0.15) 100%)` };
});

const startRefresh = () => {
  refresh.value = 10;
  const timer = setInterval(() => {
    refresh.value += 25;
    if (refresh.value >= 100) {
      clearInterval(timer);
      showRefresh.value = false;
      showShare.value = true;
    }
  }, 320);
};
</script>

<style scoped>
.line-chart {
  position: relative;
  height: 240px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef3fb 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px #e5edff;
}

.line {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #1e88e5;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  box-shadow: 0 10px 30px rgba(30, 136, 229, 0.2);
}

.area {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button.ghost {
  background: #eef2f7;
  color: #1f2933;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
