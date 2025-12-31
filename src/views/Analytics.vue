<template>
  <div>
    <div class="section-header">
      <h3>可视化分析与绩效评估</h3>
      <div class="tag-row">
        <button class="btn" @click="showReport = true">报表导出</button>
        <button class="btn secondary" @click="showCompare = true">方案对比</button>
        <button class="btn" @click="showCarbon = true">碳排估算</button>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-card">
        <div class="section-header">
          <strong>关键指标</strong>
          <span>吞吐 {{ kpi.throughput }} TEU</span>
        </div>
        <div class="grid-2">
          <div>
            <div class="section-header" style="margin: 0;">
              <span>桥吊效率</span>
              <span>{{ kpi.qc }} moves/h</span>
            </div>
            <div class="progress-track">
              <div class="bar" :style="{ width: `${(kpi.qc / 40) * 100}%` }"></div>
            </div>
          </div>
          <div>
            <div class="section-header" style="margin: 0;">
              <span>准点率</span>
              <span>{{ kpi.onTime }}%</span>
            </div>
            <div class="progress-track">
              <div class="bar" :style="{ width: `${kpi.onTime}%` }"></div>
            </div>
          </div>
        </div>
        <p>基于甘特图与泊位占用图的统计，实时刷新。</p>
      </div>
      <div class="chart-card">
        <div class="section-header">
          <strong>堆场热力</strong>
          <span>动态刷新</span>
        </div>
        <div class="grid-2">
          <div v-for="zone in yardHeat" :key="zone.name">
            <div class="section-header" style="margin: 0;">
              <span>{{ zone.name }}</span>
              <span>{{ zone.fill }}%</span>
            </div>
            <div class="progress-track">
              <div class="bar" :style="{ width: `${zone.fill}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>船名</th>
          <th>航线</th>
          <th>泊位</th>
          <th>完工</th>
          <th>桥吊效率</th>
          <th>滞港</th>
          <th>准点率</th>
          <th>能耗</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in analyticsRows" :key="row.ship">
          <td>{{ row.ship }}</td>
          <td>{{ row.route }}</td>
          <td>{{ row.berth }}</td>
          <td>{{ row.done }} h</td>
          <td>{{ row.qc }} moves/h</td>
          <td>{{ row.dwelling }} h</td>
          <td>{{ row.onTime }}%</td>
          <td>{{ row.energy }} kWh</td>
        </tr>
      </tbody>
    </table>

    <BaseModal v-model="showReport" title="报表导出与审计追溯">
      <p>支持导出 PDF/Excel，包含甘特图、占用图、关键指标。</p>
      <div class="input-group">
        <label>周期</label>
        <select>
          <option>本班次</option>
          <option>本日</option>
          <option>本周</option>
        </select>
      </div>
      <div class="section-header" style="margin-top: 12px;">
        <span>导出时同时固化日志以便审计追溯。</span>
        <button class="btn" @click="showProgress = true">导出</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showCompare" title="方案对比">
      <p>对比遗传算法生成的多方案在完工、等待、能耗、换位上的差异。</p>
      <ul>
        <li>方案-K1 完工 17.8h，等待 42min，能耗 975kWh。</li>
        <li>方案-A1 完工 18.6h，等待 46min，能耗 920kWh。</li>
        <li>方案-E1 完工 17.9h，等待 44min，能耗 940kWh。</li>
      </ul>
    </BaseModal>

    <BaseModal v-model="showCarbon" title="成本与碳排估算">
      <div class="form-grid">
        <div class="input-group">
          <label>岸桥电耗</label>
          <input value="120 kWh/h" disabled />
        </div>
        <div class="input-group">
          <label>AGV 能耗</label>
          <input value="18 kWh/h" disabled />
        </div>
        <div class="input-group">
          <label>拖车油耗</label>
          <input value="6 L/h" disabled />
        </div>
      </div>
      <p>估算本班次碳排 3.2 tCO2e，能耗成本 5.8 万元。</p>
    </BaseModal>

    <ProgressModal v-model="showProgress" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ProgressModal from '../components/ProgressModal.vue';

const kpi = { throughput: 18540, qc: 34, onTime: 92 };
const yardHeat = [
  { name: 'C1', fill: 78 },
  { name: 'C2', fill: 66 },
  { name: 'D1', fill: 82 },
  { name: 'D2', fill: 59 },
  { name: '冷藏', fill: 74 },
  { name: '危品', fill: 52 }
];

const analyticsRows = [
  { ship: '东方01', route: 'CEX', berth: 'A1', done: 18.6, qc: 32, dwelling: 4.2, onTime: 95, energy: 920 },
  { ship: '东方02', route: 'CEX', berth: 'A2', done: 19.1, qc: 30, dwelling: 4.8, onTime: 93, energy: 940 },
  { ship: '宁海', route: 'AEM', berth: 'A2', done: 20.3, qc: 29, dwelling: 5.1, onTime: 90, energy: 960 },
  { ship: '海星', route: 'AEM', berth: 'B1', done: 18.9, qc: 31, dwelling: 4.0, onTime: 94, energy: 915 },
  { ship: '星河', route: 'FAL', berth: 'B1', done: 21.0, qc: 28, dwelling: 5.6, onTime: 89, energy: 980 },
  { ship: '东盛', route: 'FAL', berth: 'B2', done: 19.5, qc: 30, dwelling: 4.3, onTime: 92, energy: 930 },
  { ship: '远航', route: 'TPM', berth: 'A1', done: 22.2, qc: 27, dwelling: 6.0, onTime: 88, energy: 1000 },
  { ship: '绿洲', route: 'TPM', berth: 'B2', done: 20.8, qc: 29, dwelling: 5.4, onTime: 90, energy: 970 },
  { ship: '晨曦', route: 'TPM', berth: 'B1', done: 18.7, qc: 33, dwelling: 4.1, onTime: 94, energy: 905 },
  { ship: '远景', route: 'AEM', berth: 'A1', done: 21.4, qc: 28, dwelling: 5.9, onTime: 87, energy: 995 },
  { ship: '启航', route: 'CEX', berth: 'A2', done: 19.8, qc: 30, dwelling: 4.7, onTime: 93, energy: 945 },
  { ship: '晨光', route: 'FAL', berth: 'B2', done: 20.0, qc: 29, dwelling: 5.0, onTime: 91, energy: 960 },
  { ship: '曙光', route: 'TPM', berth: 'B1', done: 18.5, qc: 34, dwelling: 3.9, onTime: 95, energy: 900 },
  { ship: '海洋', route: 'AEM', berth: 'A1', done: 22.6, qc: 26, dwelling: 6.4, onTime: 86, energy: 1020 },
  { ship: '天成', route: 'CEX', berth: 'A2', done: 19.2, qc: 31, dwelling: 4.5, onTime: 94, energy: 930 },
  { ship: '明珠', route: 'FAL', berth: 'B2', done: 20.6, qc: 28, dwelling: 5.3, onTime: 90, energy: 975 },
  { ship: '皓月', route: 'TPM', berth: 'B1', done: 18.3, qc: 35, dwelling: 3.8, onTime: 96, energy: 890 },
  { ship: '晨帆', route: 'AEM', berth: 'A1', done: 21.1, qc: 30, dwelling: 5.7, onTime: 89, energy: 980 },
  { ship: '远帆', route: 'CEX', berth: 'A2', done: 19.0, qc: 31, dwelling: 4.6, onTime: 92, energy: 940 },
  { ship: '远航二', route: 'TPM', berth: 'B2', done: 20.4, qc: 29, dwelling: 5.2, onTime: 91, energy: 965 },
  { ship: '华海', route: 'AEM', berth: 'A1', done: 22.0, qc: 27, dwelling: 6.2, onTime: 87, energy: 1010 }
];

const showReport = ref(false);
const showCompare = ref(false);
const showCarbon = ref(false);
const showProgress = ref(false);
</script>
