<template>
  <div class="card">
    <div class="section-header">
      <div>
        <p class="badge">运营洞察</p>
        <h3 style="margin:6px 0 0;">数据统计与分析</h3>
      </div>
      <div class="tag-row">
        <button class="primary-btn" @click="showProgress('生成周报')">生成周报</button>
        <button class="secondary-btn" @click="showProgress('导出数据看板')">导出数据看板</button>
      </div>
    </div>

    <div class="card-grid" style="margin-top: 12px;">
      <div class="card" v-for="card in cards" :key="card.label">
        <div class="section-header">
          <div>
            <p class="badge" :style="card.badgeStyle">{{ card.label }}</p>
            <h4 style="margin:4px 0 0;">{{ card.value }}</h4>
          </div>
          <span style="color:#16a34a;font-weight:700;">{{ card.trend }}</span>
        </div>
        <div class="chart-bar" style="margin-top:10px;">
          <span :style="{ width: card.percent + '%', background: card.color }"></span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="section-header">
        <div>
          <p class="badge">渠道表现</p>
          <h4 style="margin:6px 0 0;">销售渠道趋势</h4>
        </div>
        <div class="tag-row">
          <span class="badge" style="background:#dcfce7;color:#166534;">订单量趋势</span>
          <span class="badge" style="background:#e0f2fe;color:#0369a1;">GMV趋势</span>
        </div>
      </div>
      <svg width="100%" height="220" viewBox="0 0 320 200" preserveAspectRatio="none">
        <polyline points="0,130 60,120 120,98 180,82 240,70 300,58" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" />
        <polyline points="0,150 60,142 120,128 180,110 240,96 300,86" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
        <g v-for="(label, idx) in months" :key="label">
          <text :x="idx * 60" y="180" font-size="12" fill="#475569">{{ label }}</text>
        </g>
      </svg>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="section-header">
        <div>
          <p class="badge">商品贡献</p>
          <h4 style="margin:6px 0 0;">Top10 热销商品</h4>
        </div>
        <button class="secondary-btn" @click="showProgress('刷新排行榜')">刷新排行榜</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>排名</th>
            <th>商品</th>
            <th>销售额</th>
            <th>转化率</th>
            <th>动销天数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ranking" :key="item.rank">
            <td>{{ item.rank }}</td>
            <td>{{ item.name }}</td>
            <td>¥{{ item.amount }}</td>
            <td>{{ item.cv }}%</td>
            <td>{{ item.days }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-model="showProgressModal" :title="progressTitle">
    <p style="color:#475569;margin-top:0;">处理中，请稍候。</p>
    <div class="progress-track" style="margin:10px 0 12px;">
      <div class="progress-thumb" :style="{ width: progress + '%' }"></div>
    </div>
    <p style="margin:0;color:#16a34a;">当前进度：{{ progress }}%</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const cards = [
  { label: 'GMV', value: '¥1,820,000', trend: '+12%', percent: 76, color: '#22c55e', badgeStyle: { background: '#dcfce7', color: '#166534' } },
  { label: '订单数', value: '18,260', trend: '+9%', percent: 68, color: '#38bdf8', badgeStyle: { background: '#e0f2fe', color: '#0369a1' } },
  { label: '客单价', value: '¥99.6', trend: '+3%', percent: 55, color: '#f97316', badgeStyle: { background: '#fff7ed', color: '#c2410c' } },
  { label: '复购率', value: '32%', trend: '+2%', percent: 46, color: '#a855f7', badgeStyle: { background: '#f3e8ff', color: '#6b21a8' } }
];

const months = ['1月', '2月', '3月', '4月', '5月', '6月'];

const ranking = [
  { rank: 1, name: '赣南脐橙', amount: 245600, cv: 12.6, days: 28 },
  { rank: 2, name: '东北大米', amount: 198400, cv: 10.3, days: 26 },
  { rank: 3, name: '五常稻花香', amount: 176300, cv: 11.1, days: 27 },
  { rank: 4, name: '冷鲜鸡胸肉', amount: 154200, cv: 9.8, days: 25 },
  { rank: 5, name: '散养土鸡蛋', amount: 146800, cv: 8.9, days: 23 },
  { rank: 6, name: '高山绿茶', amount: 138900, cv: 7.4, days: 22 },
  { rank: 7, name: '赣州脆枣', amount: 124600, cv: 6.8, days: 21 },
  { rank: 8, name: '生态黑猪肉', amount: 118400, cv: 6.1, days: 20 },
  { rank: 9, name: '云南松茸干片', amount: 106300, cv: 5.9, days: 19 },
  { rank: 10, name: '有机西红柿', amount: 98200, cv: 5.5, days: 18 }
];

const showProgressModal = ref(false);
const progressTitle = ref('');
const progress = ref(30);

const showProgress = (title) => {
  progressTitle.value = title;
  showProgressModal.value = true;
  progress.value = 20;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 22);
    if (progress.value >= 100) clearInterval(timer);
  }, 450);
};
</script>
