<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h3 class="section-title">数据分析</h3>
        <p style="color: var(--muted);">可视化监控冷链质量、效率与趋势</p>
      </div>
      <div class="chip-row">
        <button class="btn" @click="modals.export=true">导出报告</button>
        <button class="btn secondary" @click="modals.predict=true">生成预测</button>
        <button class="btn light" @click="modals.trend=true">查看趋势</button>
      </div>
    </div>

    <div class="summary-grid" style="margin-top: 12px;">
      <div class="summary-card" v-for="item in metrics" :key="item.title">
        <h4>{{ item.title }}</h4>
        <div class="flex-between">
          <strong>{{ item.value }}</strong>
          <span class="status" :class="item.level">{{ item.state }}</span>
        </div>
        <p style="margin: 6px 0 0; color: var(--muted);">{{ item.desc }}</p>
        <div class="progress" style="margin-top: 8px;"><span :style="{ width: item.progress }"></span></div>
      </div>
    </div>

    <div class="grid" style="margin-top: 16px; grid-template-columns: 2fr 1fr;">
      <div class="card">
        <div class="flex-between">
          <p class="section-title">温控达标率</p>
          <span class="badge">周度</span>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>线路</th>
              <th>批次</th>
              <th>达标率</th>
              <th>平均温度(℃)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in quality" :key="row.route">
              <td>{{ row.route }}</td>
              <td>{{ row.batch }}</td>
              <td>{{ row.rate }}</td>
              <td>{{ row.avgTemp }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="flex-between">
          <p class="section-title">业务占比</p>
          <span style="color: var(--muted);">订单数 320</span>
        </div>
        <div class="grid" style="gap: 8px;">
          <div v-for="seg in segments" :key="seg.name" class="card" style="padding: 10px;">
            <div class="flex-between">
              <strong>{{ seg.name }}</strong>
              <span class="tag">{{ seg.percent }}%</span>
            </div>
            <div class="progress"><span :style="{ width: seg.percent + '%' }"></span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: 16px;">
      <div class="flex-between">
        <p class="section-title">运营关键指标</p>
        <span class="badge">10 条以上</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>指标</th>
            <th>当前值</th>
            <th>目标</th>
            <th>趋势</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="kpi in kpis" :key="kpi.name">
            <td>{{ kpi.name }}</td>
            <td>{{ kpi.value }}</td>
            <td>{{ kpi.target }}</td>
            <td>
              <div class="chart-bar" style="width: 140px;">
                <span :style="{ width: kpi.trend }"></span>
              </div>
            </td>
            <td><span class="status" :class="kpi.level">{{ kpi.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog :visible="modals.export" title="导出分析报告" helper="生成 PDF" @close="modals.export=false" @confirm="modals.export=false">
    <p>包含周度温控达标、调度效率、设备在线率等可视化图表。</p>
  </ModalDialog>

  <ModalDialog :visible="modals.predict" title="生成预测" helper="预计 30 秒完成" @close="modals.predict=false" @confirm="modals.predict=false">
    <p>基于历史温控、订单量与天气数据，预测未来 7 天的需求。</p>
    <div class="progress" style="margin-top: 8px;"><span style="width: 43%"></span></div>
  </ModalDialog>

  <ModalDialog :visible="modals.trend" title="查看趋势" helper="可筛选时间区间" @close="modals.trend=false" @confirm="modals.trend=false">
    <ul>
      <li>温控达标率环比 +3.2%</li>
      <li>平均运输时长缩短 18 分钟</li>
      <li>夜配订单占比提升至 36%</li>
    </ul>
  </ModalDialog>
</template>

<script setup>
import { reactive } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const modals = reactive({ export: false, predict: false, trend: false });

const metrics = [
  { title: '达标线路', value: '92%', state: '稳健', desc: '温控达标线路', progress: '76%', level: 'safe' },
  { title: '在途时长', value: '6.2h', state: '优化中', desc: '较上周缩短 12%', progress: '58%', level: 'warn' },
  { title: '冷机能耗', value: '8.4 kWh', state: '节能', desc: '同比下降 6%', progress: '62%', level: 'safe' }
];

const quality = [
  { route: '广州 → 深圳', batch: 'CC-2301', rate: '98%', avgTemp: '3.6' },
  { route: '佛山 → 东莞', batch: 'CC-2302', rate: '95%', avgTemp: '3.9' },
  { route: '长沙 → 合肥', batch: 'CC-2304', rate: '93%', avgTemp: '4.1' },
  { route: '南京 → 上海', batch: 'CC-2308', rate: '91%', avgTemp: '4.0' },
  { route: '苏州 → 无锡', batch: 'CC-2309', rate: '96%', avgTemp: '3.7' },
  { route: '上海 → 嘉兴', batch: 'CC-2311', rate: '94%', avgTemp: '3.5' },
  { route: '杭州 → 宁波', batch: 'CC-2312', rate: '92%', avgTemp: '4.2' },
  { route: '温州 → 台州', batch: 'CC-2313', rate: '90%', avgTemp: '4.4' },
  { route: '广州 → 湘潭', batch: 'CC-2314', rate: '93%', avgTemp: '3.8' },
  { route: '合肥 → 南京', batch: 'CC-2315', rate: '95%', avgTemp: '3.6' }
];

const segments = [
  { name: '生鲜商超', percent: 32 },
  { name: '预制菜', percent: 24 },
  { name: '医药疫苗', percent: 18 },
  { name: '乳制品', percent: 16 },
  { name: '跨境冷链', percent: 10 }
];

const kpis = [
  { name: '订单准时率', value: '96.3%', target: '95%', trend: '82%', status: '超额', level: 'safe' },
  { name: '温控达标率', value: '94.1%', target: '93%', trend: '78%', status: '稳定', level: 'safe' },
  { name: '平均签收时长', value: '12.5h', target: '13h', trend: '68%', status: '优化', level: 'safe' },
  { name: '异常处置时效', value: '16min', target: '<20min', trend: '88%', status: '快速', level: 'safe' },
  { name: '能耗成本', value: '¥0.38/km', target: '¥0.40/km', trend: '72%', status: '节能', level: 'safe' },
  { name: '司机在线率', value: '98%', target: '97%', trend: '92%', status: '健康', level: 'safe' },
  { name: '车辆利用率', value: '82%', target: '85%', trend: '64%', status: '跟进', level: 'warn' },
  { name: '装载率', value: '89%', target: '90%', trend: '71%', status: '良好', level: 'safe' },
  { name: '投诉率', value: '0.3%', target: '<0.5%', trend: '18%', status: '低', level: 'safe' },
  { name: '冷机故障率', value: '0.8%', target: '<1%', trend: '24%', status: '低', level: 'safe' }
];
</script>
