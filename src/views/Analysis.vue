<template>
  <section class="page">
    <div class="toolbar">
      <button class="primary" @click="openReportModal">生成分析报告</button>
      <button class="secondary" @click="openAlertModal">配置风险预警</button>
      <button class="secondary" @click="openTipModal">查看提示</button>
    </div>

    <div class="grid grid-4">
      <div class="card" v-for="stat in stats" :key="stat.label">
        <strong>{{ stat.value }}</strong>
        <p>{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid" style="margin-top: 16px; grid-template-columns: minmax(260px, 1fr) 2fr;">
      <div class="card">
        <h3>风险趋势分析</h3>
        <div class="chart">
          <div class="chart-row" v-for="item in chartData" :key="item.name">
            <span>{{ item.name }}</span>
            <div class="chart-bar">
              <span :style="{ width: item.value + '%' }"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>分析维度</th>
              <th>统计范围</th>
              <th>预警等级</th>
              <th>触发时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.scope }}</td>
              <td>{{ row.level }}</td>
              <td>{{ row.time }}</td>
              <td>
                <button class="secondary" @click="openRowModal(row)">查看预警</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeModal" class="modal-mask">
      <div class="modal">
        <div class="modal-header">
          <strong>{{ activeModal.title }}</strong>
          <button class="secondary" @click="closeModal">关闭</button>
        </div>
        <div class="modal-body">
          <template v-if="activeModal.type === 'form'">
            <label>
              报告名称
              <input class="input" v-model="form.report" />
            </label>
            <label>
              分析维度
              <select v-model="form.dimension">
                <option>行业分布</option>
                <option>风险等级</option>
                <option>地区热力</option>
                <option>舆情趋势</option>
              </select>
            </label>
            <label>
              输出格式
              <select v-model="form.format">
                <option>PDF</option>
                <option>Excel</option>
                <option>在线仪表板</option>
              </select>
            </label>
          </template>
          <template v-else-if="activeModal.type === 'progress'">
            <p>{{ activeModal.message }}</p>
            <div class="progress">
              <span :style="{ width: '60%' }"></span>
            </div>
          </template>
          <template v-else>
            <p>{{ activeModal.message }}</p>
          </template>
        </div>
        <div class="modal-footer">
          <button class="secondary" @click="closeModal">取消</button>
          <button class="primary" @click="confirmModal">确认</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const stats = [
  { label: '预警企业', value: '238' },
  { label: '高风险提示', value: '54' },
  { label: '分析报告', value: '16' },
  { label: '实时监测指标', value: '92' }
];

const chartData = [
  { name: '经营异常', value: 68 },
  { name: '司法风险', value: 74 },
  { name: '舆情热度', value: 56 },
  { name: '招投标波动', value: 49 }
];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: ['舆情指数', '司法案件', '招投标异常', '经营异常'][index % 4],
  scope: ['华东区域', '全国重点', '高新企业', '制造行业'][index % 4],
  level: ['高', '中', '低'][index % 3],
  time: `2024-10-${(index % 30) + 1} 11:${(index % 50) + 10}`
}));

const activeModal = ref(null);
const form = reactive({
  report: '季度风险分析报告',
  dimension: '风险等级',
  format: 'PDF'
});

const openReportModal = () => {
  activeModal.value = { title: '生成分析报告', type: 'form' };
};

const openAlertModal = () => {
  activeModal.value = {
    title: '配置风险预警',
    type: 'progress',
    message: '正在加载预警指标与阈值策略。'
  };
};

const openTipModal = () => {
  activeModal.value = {
    title: '分析提示',
    type: 'info',
    message: '建议结合舆情与司法数据进行交叉分析，提升预警准确性。'
  };
};

const openRowModal = (row) => {
  activeModal.value = {
    title: '预警详情',
    type: 'info',
    message: `${row.scope} 的 ${row.name} 触发 ${row.level} 级预警。`
  };
};

const closeModal = () => {
  activeModal.value = null;
};

const confirmModal = () => {
  activeModal.value = {
    title: '操作成功',
    type: 'info',
    message: '分析任务已提交，报告完成后将推送至下载中心。'
  };
};
</script>

<style scoped>
.card h3 {
  margin-top: 0;
}

.card p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}
</style>
