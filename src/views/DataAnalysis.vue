<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const filters = reactive({ range: '近30天', group: '产品线', keyword: '' });
const progress = ref(0);
const recalcModal = ref(false);
const metricModal = ref(false);
const exportModal = ref(false);
const metricForm = reactive({ name: '', rule: '', owner: '' });

const chartData = reactive([
  { label: '转化率', value: 62 },
  { label: '复购率', value: 48 },
  { label: '客单价', value: 76 },
  { label: '毛利率', value: 54 },
  { label: '退货率', value: 9 },
  { label: '满意度', value: 91 },
  { label: '交付准时率', value: 84 },
  { label: '缺货率', value: 6 },
  { label: '工单解决率', value: 88 },
  { label: '净推荐值', value: 71 }
]);

const table = reactive([
  { name: '注册-下单转化', value: '18.2%', trend: '+1.4%', owner: '增长组' },
  { name: 'UV价值', value: '¥ 6.3', trend: '+0.8%', owner: '增长组' },
  { name: '高价值客数', value: '3,214', trend: '+3.1%', owner: '数据组' },
  { name: '平均交付周期', value: '2.8天', trend: '-0.3天', owner: '运营组' },
  { name: '质量合格率', value: '98.4%', trend: '+0.5%', owner: '质检组' },
  { name: '投诉率', value: '0.6%', trend: '-0.2%', owner: '客服组' },
  { name: 'SLA达标', value: '96.2%', trend: '+0.4%', owner: '平台组' },
  { name: '库存周转', value: '5.8', trend: '+0.3', owner: '供应链' },
  { name: '拉新成本', value: '¥ 42', trend: '-3', owner: '市场组' },
  { name: '活跃率', value: '72%', trend: '+2.2%', owner: '产品组' }
]);

const openRecalc = () => {
  progress.value = 0;
  recalcModal.value = true;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 400);
};

const addMetric = () => {
  table.unshift({ name: metricForm.name, value: metricForm.rule, trend: '+0.0%', owner: metricForm.owner });
  metricForm.name = '';
  metricForm.rule = '';
  metricForm.owner = '';
  metricModal.value = false;
};
</script>

<template>
  <div>
    <div class="section-header">
      <h2>数据分析与指标计算</h2>
      <div class="button-row">
        <button @click="openRecalc">重新计算</button>
        <button class="secondary" @click="metricModal = true">添加指标</button>
        <button class="ghost" @click="exportModal = true">导出结果</button>
      </div>
    </div>

    <div class="card" style="margin-bottom: 16px">
      <div class="form-grid">
        <label>
          时间范围
          <select v-model="filters.range">
            <option>近7天</option>
            <option>近30天</option>
            <option>近90天</option>
          </select>
        </label>
        <label>
          聚合方式
          <select v-model="filters.group">
            <option>产品线</option>
            <option>渠道</option>
            <option>区域</option>
          </select>
        </label>
        <label>
          关键字
          <input v-model="filters.keyword" placeholder="输入指标关键字" />
        </label>
      </div>
    </div>

    <div class="section-header">
      <h3>指标趋势卡片</h3>
      <span class="badge">10个指标</span>
    </div>
    <div class="bar-chart">
      <div v-for="item in chartData" :key="item.label" class="bar-item">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <strong>{{ item.label }}</strong>
          <span>{{ item.value }}%</span>
        </div>
        <div class="bar" :style="{ width: item.value + '%' }"></div>
      </div>
    </div>

    <div class="section-header" style="margin-top: 18px">
      <h3>指标看板</h3>
      <span class="badge">10条记录</span>
    </div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>指标</th>
            <th>数值</th>
            <th>环比</th>
            <th>负责人</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table" :key="row.name">
            <td>{{ row.name }}</td>
            <td>{{ row.value }}</td>
            <td>{{ row.trend }}</td>
            <td>{{ row.owner }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog title="重新计算" :show="recalcModal" @close="recalcModal = false">
      <p>正在重新计算指标并刷新缓存...</p>
      <div class="progress" style="margin: 12px 0">
        <div class="progress-inner" :style="{ width: progress + '%' }"></div>
      </div>
      <p>当前进度：{{ progress }}%</p>
    </ModalDialog>

    <ModalDialog title="新增指标" :show="metricModal" @close="metricModal = false">
      <div class="form-grid">
        <label>
          指标名称
          <input v-model="metricForm.name" placeholder="如：订单转化率" />
        </label>
        <label>
          计算规则/示例值
          <input v-model="metricForm.rule" placeholder="如：18.2%" />
        </label>
        <label>
          负责人
          <input v-model="metricForm.owner" placeholder="如：运营组" />
        </label>
      </div>
      <div class="button-row" style="margin-top: 12px">
        <button @click="addMetric">提交</button>
        <button class="ghost" @click="metricModal = false">取消</button>
      </div>
    </ModalDialog>

    <ModalDialog title="导出结果" :show="exportModal" @close="exportModal = false">
      <p>确认导出当前筛选的分析结果？</p>
      <div class="button-row" style="margin-top: 12px">
        <button @click="exportModal = false">确认导出</button>
        <button class="ghost" @click="exportModal = false">取消</button>
      </div>
    </ModalDialog>
  </div>
</template>
