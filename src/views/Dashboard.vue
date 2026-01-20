<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
    <div class="card">
      <div class="badge">总览大屏</div>
      <h3>覆盖地块 36 个</h3>
      <p>今日采收预测 12.4 吨，批次合格率 96.2%。</p>
    </div>
    <div class="card">
      <div class="badge">关键KPI</div>
      <h3>平均积温 682℃</h3>
      <p>VPD 达标率 92%，灌溉执行 18 次。</p>
    </div>
    <div class="card">
      <div class="badge">风险预警</div>
      <h3>风险事件 4 项</h3>
      <p>病害概率高 2 项，采收延迟 1 项。</p>
    </div>
  </div>

  <div class="grid" style="grid-template-columns: 1.3fr 1fr; margin-top: 16px;">
    <div class="card">
      <div class="section-header">
        <div>
          <h3>地块分布与实时曲线</h3>
          <span>多维分析 · 实时曲线</span>
        </div>
        <div class="actions">
          <button class="btn" @click="openModal('筛选条件设置', 'filter')">筛选条件</button>
          <button class="btn secondary" @click="openModal('导出看板快照', 'export')">导出快照</button>
        </div>
      </div>
      <div class="dashboard-map">
        <div class="map-grid">
          <div v-for="plot in plots" :key="plot" class="map-cell">
            <span>{{ plot }}</span>
            <small>实时指数 {{ (70 + plot) % 98 }}%</small>
          </div>
        </div>
        <div class="mini-chart">
          <svg viewBox="0 0 480 160" aria-hidden="true">
            <polyline
              fill="none"
              stroke="#38bdf8"
              stroke-width="4"
              points="10,120 70,90 130,100 190,70 250,80 310,60 370,75 430,50 470,60"
            />
          </svg>
          <div class="chart-legend">
            <span class="badge">实时长势指数</span>
            <span>更新时间：10:30</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <div>
          <h3>报表管理</h3>
          <span>日报 / 周报 / 月报</span>
        </div>
        <button class="btn ghost" @click="openModal('报表生成进度', 'progress')">生成报表</button>
      </div>
      <ul class="report-list">
        <li v-for="item in reports" :key="item.id">
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.desc }}</p>
          </div>
          <button class="btn secondary" @click="openModal('报表导出', 'report')">导出</button>
        </li>
      </ul>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-header">
      <div>
        <h3>对标分析清单</h3>
        <span>批次 / 品种 / 时间范围</span>
      </div>
      <button class="btn ghost" @click="openModal('对标说明', 'info')">按钮提示信息</button>
    </div>
    <div class="table-scroll">
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>作物</th>
            <th>品种</th>
            <th>时间范围</th>
            <th>长势指数</th>
            <th>品质评分</th>
            <th>合规留痕</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.batch }}</td>
            <td>{{ row.crop }}</td>
            <td>{{ row.variety }}</td>
            <td>{{ row.range }}</td>
            <td>{{ row.growth }}</td>
            <td>{{ row.quality }}</td>
            <td>{{ row.audit }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" @close="modal.open = false">
    <div v-if="modal.type === 'filter'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">地块范围</label>
        <input class="input" placeholder="全部地块 / 指定编号" />
      </div>
      <div>
        <label class="label">作物与品种</label>
        <input class="input" placeholder="番茄 / 草莓 / 叶菜" />
      </div>
      <div>
        <label class="label">时间范围</label>
        <input class="input" placeholder="2024-04-01 至 2024-05-20" />
      </div>
      <button class="btn">应用筛选</button>
    </div>
    <div v-else-if="modal.type === 'export'" class="grid" style="gap: 12px;">
      <p>正在导出看板快照，请选择保存位置。</p>
      <button class="btn">下载 PNG</button>
    </div>
    <div v-else-if="modal.type === 'progress'" class="grid" style="gap: 12px;">
      <p>报表生成中，预计剩余 2 分钟。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: '58%' }"></div>
      </div>
      <button class="btn">查看生成日志</button>
    </div>
    <div v-else-if="modal.type === 'report'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">导出格式</label>
        <input class="input" placeholder="PDF / Excel / CSV" />
      </div>
      <div>
        <label class="label">接收邮箱</label>
        <input class="input" placeholder="example@farm.com" />
      </div>
      <button class="btn">确认导出</button>
    </div>
    <div v-else>
      <p>对标分析用于评估批次绩效与合规留痕，建议每周生成一次。</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const plots = Array.from({ length: 12 }, (_, index) => index + 1);

const reports = [
  { id: 1, name: '日报 - 2024/05/20', desc: '包含实时曲线、预警记录与产量预测。' },
  { id: 2, name: '周报 - 第20周', desc: '多维对标分析与趋势汇总。' },
  { id: 3, name: '月报 - 2024/04', desc: '合规留痕与关键指标复盘。' }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  batch: `BATCH-24${index + 10}`,
  crop: ['番茄', '草莓', '黄瓜', '生菜'][index % 4],
  variety: ['春秀', '红玉', '清甜', '翠绿'][index % 4],
  range: `2024/04/${(index % 20) + 1} - 2024/05/${(index % 20) + 1}`,
  growth: `${82 + (index % 8)}%`,
  quality: `${88 + (index % 6)}分`,
  audit: index % 2 === 0 ? '已留痕' : '待复核'
}));

const modal = reactive({
  open: false,
  title: '',
  type: ''
});

const openModal = (title, type) => {
  modal.open = true;
  modal.title = title;
  modal.type = type;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.section-header span {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dashboard-map {
  display: grid;
  gap: 16px;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.map-cell {
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
  display: grid;
  gap: 4px;
  font-size: 12px;
}

.map-cell span {
  font-weight: 600;
}

.mini-chart svg {
  width: 100%;
  height: 140px;
  background: #f8fafc;
  border-radius: 16px;
}

.chart-legend {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
}

.report-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.report-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border-radius: 14px;
  padding: 12px;
  gap: 12px;
}

.report-list p {
  margin: 6px 0 0;
  font-size: 12px;
  color: #64748b;
}
</style>
