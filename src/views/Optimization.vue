<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
    <div class="card">
      <div class="section-title">能耗优化趋势</div>
      <div class="chart-bars">
        <div v-for="item in plans" :key="item.name" class="chart-bar" :style="{ height: `${item.save}%` }">
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="chip-bar">
        <span class="badge success">节能累计 12.4%</span>
        <span class="badge info">峰谷自适应</span>
      </div>
    </div>
    <div class="card">
      <div class="section-title">策略操作</div>
      <div class="flex-row">
        <button class="btn primary" @click="showSim=true">模拟调度</button>
        <button class="btn success" @click="showApply=true">应用节能策略</button>
        <button class="btn outline" @click="showHint=true">查看提示</button>
      </div>
      <p class="muted">模拟结果会覆盖泵站开停、阀门开度并输出预测曲线。</p>
    </div>
  </div>

  <div class="card">
    <div class="section-title">优化建议列表</div>
    <table class="table">
      <thead>
        <tr>
          <th>建议</th><th>站点</th><th>预计节能</th><th>风险</th><th>调度窗口</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in advice" :key="item.title">
          <td>{{ item.title }}</td>
          <td>{{ item.site }}</td>
          <td>{{ item.saving }}%</td>
          <td><span class="badge" :class="item.risk === '低' ? 'success' : 'warning'">{{ item.risk }}</span></td>
          <td>{{ item.window }}</td>
          <td><button class="btn outline" @click="openAdvice(item)">查看</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-model="showSim" title="模拟调度">
    <form class="modal-form" @submit.prevent="runSim">
      <label>场景</label>
      <select v-model="simForm.scene" required>
        <option>暴雨入渗</option>
        <option>峰谷分时</option>
        <option>设备轮换</option>
      </select>
      <label>目标</label>
      <select v-model="simForm.target" required>
        <option>节能优先</option>
        <option>安全优先</option>
        <option>平衡模式</option>
      </select>
      <div class="modal-actions">
        <button class="btn outline" type="button" @click="showSim=false">取消</button>
        <button class="btn primary" type="submit">开始模拟</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-model="showApply" title="策略发布">
    <p>将把低谷泵运行前移30分钟，并降低阀门开度至75%，预计节能4.5%。</p>
    <div class="modal-actions">
      <button class="btn outline" @click="showApply=false">取消</button>
      <button class="btn success" @click="applyStrategy">应用策略</button>
    </div>
  </BaseModal>

  <BaseModal v-model="showHint" title="提示">
    <p>优化动作会同步到系统监控模块，建议在低峰时段执行。</p>
    <div class="modal-actions"><button class="btn primary" @click="showHint=false">关闭</button></div>
  </BaseModal>

  <BaseModal v-model="showInfo" :title="infoTitle">
    <p>{{ infoContent }}</p>
    <div class="modal-actions"><button class="btn primary" @click="showInfo=false">好的</button></div>
  </BaseModal>

  <BaseModal v-model="showProgress" title="模拟运行" width="520px">
    <p>正在计算泵站启停方案...</p>
    <div class="progress-track" style="margin-top:12px; height: 14px;">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const plans = reactive([
  { name: '商务区A', save: 68 },
  { name: '工业园B', save: 62 },
  { name: '住区C', save: 55 },
  { name: '医院D', save: 48 },
  { name: '学校E', save: 42 },
  { name: '会展中心F', save: 37 },
  { name: '公园G', save: 30 },
  { name: '物流H', save: 28 },
  { name: '酒店I', save: 25 },
  { name: '文创J', save: 22 }
]);

const advice = reactive([
  { title: '提前低谷注水，削峰补水', site: '商务区A', saving: 6.2, risk: '低', window: '02:00-05:00' },
  { title: '切换高效泵组运行', site: '工业园B', saving: 5.1, risk: '低', window: '22:00-06:00' },
  { title: '污水提升泵夜间轮换', site: '住区C', saving: 3.5, risk: '低', window: '23:00-07:00' },
  { title: '医院消毒泵避峰运行', site: '医院D', saving: 2.4, risk: '中', window: '11:00-15:00' },
  { title: '学校蓄水箱预充', site: '学校E', saving: 4.2, risk: '低', window: '21:00-06:00' },
  { title: '会展中心夜间排空', site: '会展中心F', saving: 3.8, risk: '中', window: '00:00-04:00' },
  { title: '公园喷灌错峰', site: '公园G', saving: 3.0, risk: '低', window: '01:00-05:00' },
  { title: '物流区提升泵削峰', site: '物流H', saving: 3.9, risk: '低', window: '22:30-06:30' },
  { title: '酒店冷却塔预冷', site: '酒店I', saving: 2.7, risk: '低', window: '23:00-07:00' },
  { title: '文创区景观水调度', site: '文创J', saving: 2.5, risk: '低', window: '05:00-09:00' }
]);

const showSim = ref(false);
const showApply = ref(false);
const showHint = ref(false);
const showInfo = ref(false);
const showProgress = ref(false);
const infoTitle = ref('');
const infoContent = ref('');
const progress = ref(0);
let timer;

const simForm = reactive({ scene: '暴雨入渗', target: '节能优先' });

const runSim = () => {
  showSim.value = false;
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      infoTitle.value = '模拟完成';
      infoContent.value = `${simForm.scene} - ${simForm.target} 方案完成，已生成调度曲线。`;
      showInfo.value = true;
      setTimeout(() => (showProgress.value = false), 400);
    }
  }, 500);
};

const applyStrategy = () => {
  showApply.value = false;
  infoTitle.value = '策略下发';
  infoContent.value = '节能策略已下发至各站PLC，并将在30分钟后开始执行。';
  showInfo.value = true;
};

const openAdvice = (item) => {
  infoTitle.value = item.title;
  infoContent.value = `${item.site} · 节能${item.saving}% · 风险${item.risk} · 窗口 ${item.window}`;
  showInfo.value = true;
};
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
