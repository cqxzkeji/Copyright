<template>
  <div class="section">
    <div class="section-title">销售数据概览</div>
    <div class="card-grid">
      <div class="card">
        <h3>本月销售额</h3>
        <p>¥ {{ stats.sales }} 万</p>
      </div>
      <div class="card">
        <h3>订单转化率</h3>
        <p>{{ stats.conversion }}%</p>
      </div>
      <div class="card">
        <h3>客单价</h3>
        <p>¥ {{ stats.avgOrder }} 万</p>
      </div>
      <div class="card">
        <h3>重点行业覆盖</h3>
        <p>{{ stats.coverage }}%</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">行业销售占比</div>
    <div class="chart">
      <div v-for="item in chart" :key="item.label" class="chart-bar" :style="{ height: item.value + '%' }">
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">分析工具</div>
    <div class="button-row">
      <button class="btn" type="button" @click="openModal('filter')">筛选维度</button>
      <button class="btn secondary" type="button" @click="openModal('report')">生成分析报告</button>
      <button class="btn ghost" type="button" @click="openModal('alert')">策略提醒</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">关键指标明细</div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>本月数值</th>
            <th>同比</th>
            <th>环比</th>
            <th>目标值</th>
            <th>建议</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in metrics" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.yoy }}</td>
            <td>{{ item.mom }}</td>
            <td>{{ item.target }}</td>
            <td>{{ item.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="activeModal === 'filter'" title="筛选维度" @close="activeModal = ''">
    <form>
      <div>
        <label>时间范围</label>
        <select>
          <option>近 30 天</option>
          <option>近 90 天</option>
          <option>本年度</option>
        </select>
      </div>
      <div>
        <label>行业分类</label>
        <select>
          <option>装备制造</option>
          <option>能源</option>
          <option>基建</option>
          <option>海工</option>
        </select>
      </div>
      <div class="button-row">
        <button class="btn" type="button">应用筛选</button>
        <button class="btn ghost" type="button" @click="activeModal = ''">取消</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-if="activeModal === 'report'" title="生成分析报告" @close="activeModal = ''">
    <p style="margin-top: 0;">正在汇总销售与订单数据生成报告。</p>
    <div class="progress-bar">
      <span style="width: 80%;"></span>
    </div>
    <p style="margin: 12px 0 0; color: var(--muted);">已完成 80%，预计 30 秒。</p>
  </BaseModal>

  <BaseModal v-if="activeModal === 'alert'" title="策略提醒" @close="activeModal = ''">
    <p style="margin-top: 0;">高强度结构钢订单增长放缓，建议增加重点客户回访。</p>
    <button class="btn" type="button" @click="activeModal = ''">收到</button>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = {
  sales: 1860,
  conversion: 64,
  avgOrder: 92,
  coverage: 78
};

const chart = [
  { label: '装备', value: 70 },
  { label: '能源', value: 56 },
  { label: '基建', value: 62 },
  { label: '海工', value: 48 },
  { label: '矿山', value: 52 },
  { label: '轨交', value: 40 }
];

const metrics = [
  { name: '订单转化率', value: '64%', yoy: '+6%', mom: '+3%', target: '65%', action: '提升重点客户跟进' },
  { name: '平均交付周期', value: '12 天', yoy: '-1 天', mom: '-0.5 天', target: '10 天', action: '优化排产' },
  { name: '高强钢占比', value: '38%', yoy: '+5%', mom: '+2%', target: '40%', action: '拓展高端需求' },
  { name: '报价响应时间', value: '2.1 小时', yoy: '-0.3 小时', mom: '-0.1 小时', target: '2 小时', action: '强化报价效率' },
  { name: '订单退订率', value: '3.6%', yoy: '-1%', mom: '-0.2%', target: '3%', action: '加强合同确认' },
  { name: '重点客户覆盖', value: '78%', yoy: '+4%', mom: '+1%', target: '80%', action: '扩大客户池' },
  { name: '交付合格率', value: '98.4%', yoy: '+0.4%', mom: '+0.2%', target: '99%', action: '提升质检' },
  { name: '库存周转', value: '4.2 次', yoy: '+0.6 次', mom: '+0.1 次', target: '4.5 次', action: '加强库存管理' },
  { name: '高韧钢销量', value: '320 吨', yoy: '+12%', mom: '+5%', target: '350 吨', action: '提升产能' },
  { name: '特种合金占比', value: '18%', yoy: '+2%', mom: '+1%', target: '20%', action: '提升客户教育' },
  { name: '项目回款率', value: '92%', yoy: '+3%', mom: '+1%', target: '95%', action: '优化回款流程' },
  { name: '售后响应时间', value: '4 小时', yoy: '-1 小时', mom: '-0.5 小时', target: '3 小时', action: '完善服务机制' },
  { name: '销售覆盖城市', value: '32 城', yoy: '+4', mom: '+1', target: '35 城', action: '开拓区域' },
  { name: '订单复购率', value: '46%', yoy: '+4%', mom: '+2%', target: '50%', action: '提高客户粘性' },
  { name: '月度新增客户', value: '16 家', yoy: '+2', mom: '+1', target: '18 家', action: '强化渠道' },
  { name: '定制方案采纳率', value: '72%', yoy: '+6%', mom: '+2%', target: '75%', action: '优化方案呈现' },
  { name: '报价精准率', value: '94%', yoy: '+1%', mom: '+0.5%', target: '95%', action: '强化成本核算' },
  { name: '跨行业订单占比', value: '22%', yoy: '+3%', mom: '+1%', target: '25%', action: '丰富产品线' },
  { name: '合同周期', value: '18 天', yoy: '-2 天', mom: '-1 天', target: '16 天', action: '优化审批流程' },
  { name: '客户满意度', value: '4.6/5', yoy: '+0.2', mom: '+0.1', target: '4.7/5', action: '持续服务提升' }
];

const activeModal = ref('');

const openModal = (name) => {
  activeModal.value = name;
};
</script>
