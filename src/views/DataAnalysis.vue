<template>
  <div class="page">
    <div class="section-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 700;">数据统计分析</div>
        <div class="action-row">
          <button class="btn" @click="openExport">导出报表</button>
          <button class="btn secondary" @click="openModel">预测模型</button>
          <button class="btn warning" @click="openHint">统计提示</button>
        </div>
      </div>
      <div class="card-grid" style="margin-top: 16px;">
        <div class="section-card" v-for="item in summary" :key="item.label">
          <div style="font-size: 12px; color: #64748b;">{{ item.label }}</div>
          <div style="font-size: 22px; font-weight: 700; margin-top: 8px;">{{ item.value }}</div>
          <div class="badge" style="margin-top: 10px;">{{ item.tag }}</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">月度订单结构</div>
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; align-items: end; height: 180px;">
        <div v-for="bar in monthBars" :key="bar.label" style="display: grid; gap: 8px;">
          <div style="background: linear-gradient(180deg, #22d3ee, #38bdf8); border-radius: 10px;" :style="{ height: bar.value + 'px' }"></div>
          <div style="font-size: 12px; color: #64748b; text-align: center;">{{ bar.label }}</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div style="font-weight: 700; margin-bottom: 12px;">数据明细列表</div>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>本月</th>
            <th>上月</th>
            <th>环比</th>
            <th>建议</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.label">
            <td>{{ row.label }}</td>
            <td>{{ row.current }}</td>
            <td>{{ row.prev }}</td>
            <td>{{ row.rate }}</td>
            <td>{{ row.suggest }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :open="exportOpen" title="导出报表" :on-close="closeExport">
      <form class="modal-form" @submit.prevent="submitExport">
        <div>
          <label>报表类型</label>
          <select v-model="exportForm.type">
            <option>订单与物流报表</option>
            <option>营销与会员报表</option>
            <option>资源与库存报表</option>
          </select>
        </div>
        <div>
          <label>统计周期</label>
          <select v-model="exportForm.range">
            <option>近 7 天</option>
            <option>本月</option>
            <option>本季度</option>
          </select>
        </div>
        <div>
          <label>格式</label>
          <select v-model="exportForm.format">
            <option>Excel</option>
            <option>PDF</option>
          </select>
        </div>
      </form>
      <template #footer>
        <button class="btn secondary" @click="closeExport">取消</button>
        <button class="btn" @click="submitExport">确认导出</button>
      </template>
    </BaseModal>

    <BaseModal :open="modelOpen" title="预测模型运行" :on-close="closeModel">
      <p>正在计算未来 14 天订单与产量趋势。</p>
      <div class="progress" style="margin-top: 16px;">
        <span :style="{ width: '69%' }"></span>
      </div>
      <template #footer>
        <button class="btn" @click="closeModel">完成</button>
      </template>
    </BaseModal>

    <BaseModal :open="hintOpen" title="统计提示" :on-close="closeHint">
      <p>冷链利用率连续三周上升，建议提前规划车辆。</p>
      <p>农旅订单增长明显，可考虑增加周末体验名额。</p>
      <template #footer>
        <button class="btn" @click="closeHint">知道了</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const summary = [
  { label: '数据记录', value: '128,420 条', tag: '日增 3,200' },
  { label: '订单均价', value: '¥98.6', tag: '环比 +6%' },
  { label: '履约时效', value: '3.2 小时', tag: '持续优化' },
  { label: '用户满意度', value: '96.8%', tag: '稳中提升' }
];

const monthBars = [
  { label: '周一', value: 120 },
  { label: '周二', value: 150 },
  { label: '周三', value: 170 },
  { label: '周四', value: 130 },
  { label: '周五', value: 160 }
];

const rows = [
  { label: '下单转化', current: '5.2%', prev: '4.7%', rate: '+0.5%', suggest: '维持直播频次' },
  { label: '冷链利用率', current: '78%', prev: '72%', rate: '+6%', suggest: '提前预约车辆' },
  { label: '履约超时', current: '2.3%', prev: '3.1%', rate: '-0.8%', suggest: '继续优化线路' },
  { label: '售后工单', current: '86 单', prev: '94 单', rate: '-8 单', suggest: '强化预警' },
  { label: '会员复购', current: '38%', prev: '35%', rate: '+3%', suggest: '加大会员福利' },
  { label: '客单价', current: '¥98.6', prev: '¥92.1', rate: '+7%', suggest: '上新高值产品' },
  { label: '站点覆盖', current: '18 个', prev: '17 个', rate: '+1', suggest: '完善服务站点' },
  { label: '直播转化', current: '6.1%', prev: '5.4%', rate: '+0.7%', suggest: '丰富互动' },
  { label: '团购配送', current: '98%', prev: '97%', rate: '+1%', suggest: '保持' },
  { label: '农旅订单', current: '620 单', prev: '540 单', rate: '+80 单', suggest: '优化套餐' }
];

const exportOpen = ref(false);
const modelOpen = ref(false);
const hintOpen = ref(false);

const exportForm = reactive({
  type: '订单与物流报表',
  range: '本月',
  format: 'Excel'
});

const openExport = () => {
  exportOpen.value = true;
};
const closeExport = () => {
  exportOpen.value = false;
};
const submitExport = () => {
  exportOpen.value = false;
};

const openModel = () => {
  modelOpen.value = true;
};
const closeModel = () => {
  modelOpen.value = false;
};

const openHint = () => {
  hintOpen.value = true;
};
const closeHint = () => {
  hintOpen.value = false;
};
</script>
