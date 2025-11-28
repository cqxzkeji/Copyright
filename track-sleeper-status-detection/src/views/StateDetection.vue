<template>
  <div class="grid">
    <section class="card">
      <div class="section-title">
        <h3>状态检测结果</h3>
        <button @click="rerun">重新检测</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>轨枕编号</th>
            <th>沉降</th>
            <th>裂纹</th>
            <th>枕端磨耗</th>
            <th>等级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in detections" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.settlement }} mm</td>
            <td>{{ row.crack }} mm</td>
            <td>{{ row.wear }}%</td>
            <td><span :class="['badge', row.levelClass]">{{ row.level }}</span></td>
          </tr>
        </tbody>
      </table>
      <div class="actions-row">
        <button @click="openAlert">风险提示</button>
        <button @click="openPlan">维护派工</button>
        <button @click="toggleTrend">查看趋势</button>
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <h3>指标趋势</h3>
        <button @click="toggleTrend">{{ showTrend ? '折叠' : '展开' }}</button>
      </div>
      <div v-if="showTrend" class="chart">
        <div v-for="trend in trends" :key="trend.label" class="chart-bar" :style="{ height: trend.value + '%' }">
          {{ trend.label }}
        </div>
      </div>
      <p class="note">趋势展示沉降与裂纹月度变化，柱高对应风险指数。</p>
    </section>
  </div>

  <div v-if="riskModal" class="modal-backdrop" @click.self="riskModal = false">
    <div class="modal">
      <h3>风险提示</h3>
      <p>检测到 02#、05# 轨枕裂纹增长加速，建议减速通过并立即复测。</p>
      <div class="actions-row">
        <button @click="riskModal = false">确认</button>
      </div>
    </div>
  </div>

  <div v-if="planModal" class="modal-backdrop" @click.self="planModal = false">
    <div class="modal">
      <h3>维护派工</h3>
      <div class="form-grid">
        <input class="input" v-model="plan.worker" placeholder="作业组" />
        <input class="input" v-model="plan.time" placeholder="时间" />
        <input class="input" v-model="plan.note" placeholder="工单备注" />
      </div>
      <div class="actions-row">
        <button @click="dispatch">下发工单</button>
        <button class="ghost" @click="planModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const detections = ref([
  { id: '01', settlement: 0.8, crack: 0.2, wear: 6, level: '正常', levelClass: 'success' },
  { id: '02', settlement: 1.6, crack: 0.5, wear: 12, level: '关注', levelClass: 'warning' },
  { id: '03', settlement: 0.5, crack: 0.1, wear: 4, level: '正常', levelClass: 'success' },
  { id: '04', settlement: 2.2, crack: 0.9, wear: 18, level: '预警', levelClass: 'danger' },
  { id: '05', settlement: 1.9, crack: 0.7, wear: 14, level: '关注', levelClass: 'warning' },
]);

const trends = ref([
  { label: '沉降指数', value: 62 },
  { label: '裂纹指数', value: 48 },
  { label: '磨耗指数', value: 55 },
  { label: '轨距变化', value: 38 },
  { label: '温漂补偿', value: 42 },
]);

const riskModal = ref(false);
const planModal = ref(false);
const showTrend = ref(true);
const plan = reactive({ worker: '工务一组', time: '今晚窗口', note: '重测并灌浆' });

const rerun = () => {
  alert('已重新加载检测模型并更新结果。');
};

const openAlert = () => {
  riskModal.value = true;
};

const openPlan = () => {
  planModal.value = true;
};

const toggleTrend = () => {
  showTrend.value = !showTrend.value;
};

const dispatch = () => {
  alert(`已派工给 ${plan.worker}，时间 ${plan.time}`);
  planModal.value = false;
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 14px;
}

.actions-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.note {
  color: #6b7280;
  margin-top: 6px;
}

.ghost {
  background: #eef2f7;
  color: #1f2937;
  box-shadow: none;
}
</style>
