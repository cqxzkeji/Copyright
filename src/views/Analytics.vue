<template>
  <div class="container">
    <section class="hero">
      <div class="flex-between">
        <div>
          <h2 style="margin: 0;">运营数据分析</h2>
          <p>销售、留存、渠道效果与活动表现一站式查看。</p>
        </div>
        <div class="action-bar">
          <button class="btn primary" @click="showExport = true">导出报表</button>
          <button class="btn" @click="showSegment = true">细分分析</button>
          <button class="btn ghost" @click="showNote = true">解读</button>
        </div>
      </div>
    </section>

    <div class="grid-3">
      <div class="card stat-card" v-for="kpi in kpis" :key="kpi.label">
        <div class="label">{{ kpi.label }}</div>
        <div class="stat-value">{{ kpi.value }}</div>
        <div class="stat-trend">{{ kpi.trend }}</div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">渠道 GMV 分布</h3>
        <span class="badge info dot">自动刷新</span>
      </div>
      <div class="list">
        <div class="list-item" v-for="item in channels" :key="item.name">
          <div>
            <strong>{{ item.name }}</strong>
            <div class="chart-bar"><span :style="{ width: item.percent + '%' }"></span></div>
          </div>
          <span class="badge success">¥{{ item.amount }}万 ({{ item.percent }}%)</span>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 16px;">
      <div class="card stat-card">
        <h3 class="section-title">活动表现</h3>
        <ul class="list">
          <li v-for="act in activities" :key="act.name"><span>{{ act.name }}</span><span class="badge info">{{ act.uplift }}</span></li>
        </ul>
      </div>
      <div class="card stat-card">
        <h3 class="section-title">留存 & 复购</h3>
        <ul class="list">
          <li><span>7 日留存</span><span class="badge success">62%</span></li>
          <li><span>30 日复购</span><span class="badge info">48%</span></li>
          <li><span>会员 ARPU</span><span class="badge warning">¥236</span></li>
        </ul>
      </div>
    </div>

    <ModalDialog v-model="showExport" title="导出报表" @confirm="showExport = false">
      <p>已生成本周 GMV、订单、用户留存报表，下载中。</p>
      <div class="progress-bar"><div class="fill" style="width: 75%"></div></div>
    </ModalDialog>

    <ModalDialog v-model="showSegment" title="人群细分" @confirm="showSegment = false">
      <div class="form-grid">
        <label><div class="label">标签</div><select class="input"><option>高客单 VIP</option><option>生鲜偏好</option><option>价格敏感</option></select></label>
        <label><div class="label">时间范围</div><input class="input" placeholder="近30天" /></label>
      </div>
    </ModalDialog>

    <ModalDialog v-model="showNote" title="运营解读" @confirm="showNote = false">
      <p>水果品类 GMV 环比+18%，主要来自直播场景转化提升；冷链水产需关注履约及时率。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const kpis = [
  { label: '今日 GMV', value: '¥182.6 万', trend: '日环比 +12.3%' },
  { label: '支付订单', value: '3,214 单', trend: '日环比 +9.8%' },
  { label: '新客转化', value: '23.6%', trend: '环比 +3.1%' },
  { label: '冷链占比', value: '38%', trend: '环比 +5.4%' },
  { label: '客单价', value: '¥186', trend: '环比 +2.7%' },
  { label: '毛利率', value: '21.5%', trend: '环比 +1.6%' }
];

const channels = [
  { name: '平台自营', amount: 92, percent: 38 },
  { name: '直播', amount: 54, percent: 22 },
  { name: '社区团购', amount: 48, percent: 20 },
  { name: '批发B2B', amount: 32, percent: 13 },
  { name: '小程序', amount: 15, percent: 7 }
];

const activities = [
  { name: '双十一巩固期', uplift: '+26% GMV' },
  { name: '冷链水产满减', uplift: '+14% 转化' },
  { name: '会员日', uplift: '+18% 客单' },
  { name: '直播专场', uplift: '+32% 曝光' }
];

const showExport = ref(false);
const showSegment = ref(false);
const showNote = ref(false);
</script>
