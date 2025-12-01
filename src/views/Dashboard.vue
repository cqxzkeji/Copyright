<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
    <div class="card">
      <div class="section-title">供水运行概览</div>
      <div class="muted">最近12小时供水量与回收量</div>
      <div class="chart-bars">
        <div v-for="item in summary" :key="item.hour" class="chart-bar" :style="{ height: `${item.volume / 2}%` }">
          <span>{{ item.hour }}h</span>
        </div>
      </div>
      <div class="chip-bar">
        <span class="badge success">总供水 {{ totalWater }} m³</span>
        <span class="badge info">回收 {{ recycle }} m³</span>
        <span class="badge warning">夜峰剔除</span>
      </div>
    </div>
    <div class="card">
      <div class="section-title">场站态势</div>
      <div class="tag-list">
        <span class="badge" :class="site.status === '正常' ? 'success' : 'warning'" v-for="site in sites" :key="site.name">{{ site.name }} · {{ site.status }}</span>
      </div>
      <div class="flex-row" style="margin-top:12px;">
        <button class="btn primary" @click="showNotice = true">发布调度通知</button>
        <button class="btn success" @click="startPatrol">开启安全巡检</button>
        <button class="btn outline" @click="showTip = true">提示</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">压力/流量监测</div>
    <table class="table">
      <thead>
        <tr>
          <th>建筑群</th><th>供水压力(MPa)</th><th>回水流量(m³/h)</th><th>阀门开度</th><th>告警</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in monitorRows" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.pressure }}</td>
          <td>{{ row.flow }}</td>
          <td>
            <div class="progress-track"><div class="progress-bar" :style="{ width: `${row.valve}%` }"></div></div>
          </td>
          <td><span class="badge" :class="row.alert ? 'danger' : 'success'">{{ row.alert ? '需要关注' : '正常' }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-model="showNotice" title="发布调度通知">
    <form class="modal-form" @submit.prevent="submitNotice">
      <label>通知对象</label>
      <select v-model="notice.target" required>
        <option v-for="site in sites" :key="site.name" :value="site.name">{{ site.name }}</option>
      </select>
      <label>调度内容</label>
      <textarea v-model="notice.content" placeholder="如：夜间切换至低峰泵组" required></textarea>
      <label>生效时间</label>
      <input type="datetime-local" v-model="notice.time" required />
      <div class="modal-actions">
        <button class="btn outline" type="button" @click="showNotice=false">取消</button>
        <button class="btn primary" type="submit">发布</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-model="showTip" title="提示信息">
    <p>所有调度操作会自动记录到日志并生成报告，不需要手工备份。</p>
    <div class="modal-actions">
      <button class="btn primary" @click="showTip=false">知道了</button>
    </div>
  </BaseModal>

  <BaseModal v-model="showPatrol" title="巡检进度" width="520px">
    <p>自动巡检任务正在逐站检查阀门和泵运行状态。</p>
    <div class="progress-track" style="margin:12px 0; height:14px;">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p class="muted">当前站点：{{ currentSite }}</p>
    <div class="modal-actions">
      <button class="btn outline" @click="showPatrol=false">关闭</button>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const summary = [
  { hour: '00', volume: 70 }, { hour: '02', volume: 60 }, { hour: '04', volume: 55 },
  { hour: '06', volume: 90 }, { hour: '08', volume: 110 }, { hour: '10', volume: 130 },
  { hour: '12', volume: 145 }, { hour: '14', volume: 150 }, { hour: '16', volume: 160 },
  { hour: '18', volume: 155 }, { hour: '20', volume: 120 }, { hour: '22', volume: 95 }
];

const sites = reactive([
  { name: '商务区A', status: '正常' }, { name: '工业园B', status: '正常' },
  { name: '住区C', status: '正常' }, { name: '医院D', status: '关注' },
  { name: '学校E', status: '正常' }, { name: '会展中心F', status: '正常' },
  { name: '公园G', status: '正常' }, { name: '物流H', status: '正常' },
  { name: '酒店I', status: '正常' }, { name: '文创J', status: '正常' }
]);

const monitorRows = [
  { name: '商务区A', pressure: 0.46, flow: 380, valve: 82, alert: false },
  { name: '工业园B', pressure: 0.5, flow: 420, valve: 80, alert: false },
  { name: '住区C', pressure: 0.38, flow: 300, valve: 65, alert: false },
  { name: '医院D', pressure: 0.35, flow: 280, valve: 72, alert: true },
  { name: '学校E', pressure: 0.4, flow: 260, valve: 68, alert: false },
  { name: '会展中心F', pressure: 0.45, flow: 340, valve: 75, alert: false },
  { name: '公园G', pressure: 0.32, flow: 180, valve: 54, alert: false },
  { name: '物流H', pressure: 0.48, flow: 390, valve: 81, alert: false },
  { name: '酒店I', pressure: 0.44, flow: 320, valve: 70, alert: false },
  { name: '文创J', pressure: 0.36, flow: 240, valve: 60, alert: false }
];

const totalWater = computed(() => monitorRows.reduce((sum, r) => sum + r.flow, 0));
const recycle = computed(() => Math.round(totalWater.value * 0.35));

const showNotice = ref(false);
const showTip = ref(false);
const showPatrol = ref(false);
const notice = reactive({ target: '', content: '', time: '' });
const progress = ref(0);
const currentSite = ref('—');
let timer;

const submitNotice = () => {
  alert(`已向${notice.target || '全部'}发布：${notice.content}`);
  showNotice.value = false;
};

const startPatrol = () => {
  progress.value = 0;
  currentSite.value = '准备中';
  showPatrol.value = true;
  clearInterval(timer);
  const stations = sites.map((s) => s.name);
  let step = 0;
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 10);
    currentSite.value = stations[step % stations.length];
    step += 1;
    if (progress.value >= 100) {
      clearInterval(timer);
      currentSite.value = '完成';
    }
  }, 600);
};

onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-form textarea,
.modal-form input,
.modal-form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d9e3f0;
  background: #f8fbff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
