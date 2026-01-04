<template>
  <div class="grid">
    <div class="section-title">
      <h2>统计分析与决策</h2>
      <div class="actions">
        <button class="btn" @click="openModal('finance')">资金分析</button>
        <button class="btn secondary" @click="openModal('effect')">成效对比</button>
        <button class="btn secondary" @click="openModal('export')">导出报告</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="card">
        <p class="tip">年度计划 / 执行</p>
        <h3 style="margin: 4px 0;">6.8 亿 / 4.2 亿</h3>
        <div class="progress-bar"><span :style="{ width: '62%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">节点达成率</p>
        <h3 style="margin: 4px 0;">87%</h3>
        <div class="progress-bar"><span :style="{ width: '87%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">居民满意度</p>
        <h3 style="margin: 4px 0;">94%</h3>
        <div class="progress-bar"><span :style="{ width: '94%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">施工安全指数</p>
        <h3 style="margin: 4px 0;">95 分</h3>
        <div class="progress-bar"><span :style="{ width: '95%' }"></span></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">
        <h3>资金拨付与成效</h3>
        <p class="tip">对比资金进度与改造成效，辅助决策</p>
      </div>
      <div class="chart-bar" style="background:#f8fbff;border:1px dashed #dbe6ff;">
        <div v-for="item in chartData" :key="item.label" class="bar" :style="{ height: item.value + 'px' }">
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>街道</th>
              <th>项目数量</th>
              <th>累计拨付(万)</th>
              <th>完成率</th>
              <th>满意度</th>
              <th>节能减排(吨)</th>
              <th>特色亮点</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in analysis" :key="row.street">
              <td>{{ row.street }}</td>
              <td>{{ row.count }}</td>
              <td>{{ row.fund }}</td>
              <td>{{ row.rate }}</td>
              <td>{{ row.satisfy }}</td>
              <td>{{ row.green }}</td>
              <td>{{ row.highlight }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="section-title">
          <h3>{{ modalTitle }}</h3>
          <button class="btn secondary" @click="closeModal">关闭</button>
        </div>
        <div v-if="modal === 'finance'" class="grid" style="gap: 12px;">
          <p class="tip">选择时间区间生成资金曲线与拨付明细。</p>
          <div class="form-grid">
            <div>
              <label>开始月份</label>
              <input type="month" />
            </div>
            <div>
              <label>结束月份</label>
              <input type="month" />
            </div>
          </div>
          <button class="btn">生成分析</button>
        </div>
        <div v-else-if="modal === 'effect'" class="grid" style="gap: 12px;">
          <p class="tip">选择对比维度查看改造成效。</p>
          <select>
            <option>资金拨付 vs 满意度</option>
            <option>节点达成率 vs 投资额</option>
            <option>节能减排 vs 改造类型</option>
          </select>
          <div class="progress-bar"><span :style="{ width: '68%' }"></span></div>
          <button class="btn">生成对比</button>
        </div>
        <div v-else class="grid" style="gap: 12px;">
          <p class="tip">导出 PDF 报告包含五大模块核心指标。</p>
          <div class="progress-bar"><span :style="{ width: '74%' }"></span></div>
          <button class="btn">导出报告</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const analysis = reactive([
  { street: '新华街道', count: 8, fund: 16800, rate: '82%', satisfy: '94%', green: 220, highlight: '雨污分流成效突出' },
  { street: '文化路街道', count: 7, fund: 15200, rate: '79%', satisfy: '92%', green: 180, highlight: '立面示范街区' },
  { street: '迎宾路街道', count: 9, fund: 17400, rate: '84%', satisfy: '95%', green: 240, highlight: '道路白改黑+口袋公园' },
  { street: '东城街道', count: 6, fund: 11800, rate: '76%', satisfy: '90%', green: 160, highlight: '充电桩先行示范' },
  { street: '和平街道', count: 6, fund: 12600, rate: '74%', satisfy: '91%', green: 150, highlight: '雨污分流联动社区治理' },
  { street: '青年路街道', count: 4, fund: 9600, rate: '68%', satisfy: '88%', green: 110, highlight: '老旧庭院微更新' },
  { street: '建设路街道', count: 5, fund: 10200, rate: '71%', satisfy: '89%', green: 130, highlight: '燃气入户攻坚' },
  { street: '复兴路街道', count: 5, fund: 9800, rate: '70%', satisfy: '90%', green: 140, highlight: '小区车位扩容' },
  { street: '银杏街道', count: 4, fund: 8600, rate: '67%', satisfy: '87%', green: 120, highlight: '林荫景观提升' },
  { street: '杏花街道', count: 5, fund: 9200, rate: '69%', satisfy: '88%', green: 125, highlight: '老旧楼道亮化' },
  { street: '望江路街道', count: 6, fund: 11000, rate: '72%', satisfy: '90%', green: 155, highlight: '雨水花园示范' },
  { street: '长安街道', count: 7, fund: 13400, rate: '78%', satisfy: '93%', green: 175, highlight: '慢行系统优化' },
  { street: '城南街道', count: 5, fund: 9900, rate: '71%', satisfy: '89%', green: 135, highlight: '供电线路入地' },
  { street: '城北街道', count: 6, fund: 10500, rate: '73%', satisfy: '90%', green: 145, highlight: '老厂房活化' },
  { street: '铁西街道', count: 4, fund: 8800, rate: '66%', satisfy: '86%', green: 115, highlight: '棚改收尾' },
  { street: '春晖路街道', count: 5, fund: 9300, rate: '69%', satisfy: '88%', green: 128, highlight: '社区食堂改造' },
  { street: '紫荆街道', count: 4, fund: 8500, rate: '65%', satisfy: '85%', green: 108, highlight: '口袋公园连通' },
  { street: '桂林街道', count: 5, fund: 9700, rate: '70%', satisfy: '89%', green: 132, highlight: '立体车库试点' },
  { street: '松柏街道', count: 4, fund: 8200, rate: '64%', satisfy: '84%', green: 102, highlight: '老旧管网更新' },
  { street: '清波街道', count: 5, fund: 9400, rate: '71%', satisfy: '90%', green: 138, highlight: '口袋公园+雨污分流' }
]);

const chartData = computed(() => [
  { label: '资金', value: 190 },
  { label: '进度', value: 170 },
  { label: '满意', value: 180 },
  { label: '绿色', value: 160 }
]);

const modal = ref('');

const openModal = (type) => {
  modal.value = type;
};

const closeModal = () => {
  modal.value = '';
};

const modalTitle = computed(() => {
  if (modal.value === 'finance') return '资金使用分析';
  if (modal.value === 'effect') return '成效对比';
  if (modal.value === 'export') return '导出分析报告';
  return '';
});
</script>
