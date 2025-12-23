<template>
  <div class="page">
    <div class="card-grid">
      <div class="section-card" v-for="card in cards" :key="card.label">
        <div style="font-size: 12px; color: #64748b;">{{ card.label }}</div>
        <div style="font-size: 24px; font-weight: 700; margin-top: 8px;">{{ card.value }}</div>
        <div class="badge" style="margin-top: 12px;">{{ card.tag }}</div>
      </div>
    </div>

    <div class="section-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 700;">实时服务能级</div>
        <div class="action-row">
          <button class="btn" @click="openReport">生成日报</button>
          <button class="btn secondary" @click="openInspect">数据巡检</button>
          <button class="btn warning" @click="openTip">指标说明</button>
        </div>
      </div>
      <div class="chart" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-top: 16px; align-items: end; height: 180px;">
        <div v-for="bar in bars" :key="bar.name" style="display: grid; gap: 8px;">
          <div style="background: linear-gradient(180deg, #38bdf8, #6366f1); border-radius: 10px;" :style="{ height: bar.value + 'px' }"></div>
          <div style="font-size: 12px; color: #64748b; text-align: center;">{{ bar.name }}</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">乡镇站点服务表</div>
      <table class="table">
        <thead>
          <tr>
            <th>站点</th>
            <th>在线服务员</th>
            <th>今日订单</th>
            <th>冷链匹配</th>
            <th>满意度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableRows" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.staff }}</td>
            <td>{{ row.orders }}</td>
            <td>{{ row.cold }}</td>
            <td>{{ row.rate }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="reportOpen" title="生成运营日报" :on-close="closeReport">
      <form class="modal-form" @submit.prevent="submitReport">
        <div>
          <label>日报日期</label>
          <input v-model="reportForm.date" type="date" required />
        </div>
        <div>
          <label>覆盖站点</label>
          <select v-model="reportForm.area">
            <option>全区 18 个站点</option>
            <option>东部 9 个站点</option>
            <option>西部 9 个站点</option>
          </select>
        </div>
        <div>
          <label>汇总指标</label>
          <input v-model="reportForm.metric" type="text" placeholder="订单/物流/营销" />
        </div>
        <div>
          <label>报告说明</label>
          <textarea v-model="reportForm.note" rows="2"></textarea>
        </div>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeReport">取消</button>
        <button class="btn" @click="submitReport">确认生成</button>
      </template>
    </BaseModal>

    <BaseModal :open="inspectOpen" title="数据巡检进度" :on-close="closeInspect">
      <p>正在核验站点数据完整度与物流时效。</p>
      <div class="progress" style="margin-top: 16px;">
        <span :style="{ width: '64%' }"></span>
      </div>
      <p style="margin-top: 12px; color: #64748b;">预计 2 分钟完成巡检。</p>
      <template #footer>
        <button class="btn" @click="closeInspect">后台继续</button>
      </template>
    </BaseModal>

    <BaseModal :open="tipOpen" title="指标说明" :on-close="closeTip">
      <ul style="padding-left: 18px; color: #475569;">
        <li>冷链匹配：当日完成冷链车辆调度的比例。</li>
        <li>满意度：通过售后回访统计的综合评分。</li>
        <li>在线服务员：当前在岗的运营与服务人员数量。</li>
      </ul>
      <template #footer>
        <button class="btn" @click="closeTip">好的</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const cards = [
  { label: '今日订单', value: '1,286', tag: '同比 +12%' },
  { label: '待发冷链', value: '42', tag: '需优先调度' },
  { label: '活跃站点', value: '18', tag: '覆盖率 100%' },
  { label: '在线客服', value: '56', tag: '峰值运营' }
];

const bars = [
  { name: '蔬菜', value: 130 },
  { name: '水果', value: 160 },
  { name: '粮油', value: 110 },
  { name: '畜牧', value: 140 },
  { name: '加工', value: 100 },
  { name: '文旅', value: 150 }
];

const tableRows = [
  { name: '安和镇', staff: 6, orders: 128, cold: '92%', rate: '96%' },
  { name: '丰谷镇', staff: 4, orders: 108, cold: '88%', rate: '95%' },
  { name: '双桥镇', staff: 5, orders: 96, cold: '90%', rate: '94%' },
  { name: '石岭镇', staff: 6, orders: 114, cold: '93%', rate: '97%' },
  { name: '新桥镇', staff: 3, orders: 87, cold: '85%', rate: '93%' },
  { name: '青山镇', staff: 5, orders: 102, cold: '89%', rate: '95%' },
  { name: '合兴镇', staff: 4, orders: 93, cold: '88%', rate: '92%' },
  { name: '观山镇', staff: 6, orders: 118, cold: '91%', rate: '96%' },
  { name: '临河镇', staff: 5, orders: 99, cold: '90%', rate: '94%' },
  { name: '南坪镇', staff: 4, orders: 105, cold: '87%', rate: '93%' }
];

const reportOpen = ref(false);
const inspectOpen = ref(false);
const tipOpen = ref(false);

const reportForm = reactive({
  date: '',
  area: '全区 18 个站点',
  metric: '订单、物流、营销',
  note: ''
});

const openReport = () => {
  reportOpen.value = true;
};
const closeReport = () => {
  reportOpen.value = false;
};
const submitReport = () => {
  reportOpen.value = false;
};

const openInspect = () => {
  inspectOpen.value = true;
};
const closeInspect = () => {
  inspectOpen.value = false;
};

const openTip = () => {
  tipOpen.value = true;
};
const closeTip = () => {
  tipOpen.value = false;
};
</script>
