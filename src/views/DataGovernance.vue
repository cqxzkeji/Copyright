<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div class="card">
      <div class="badge">数据清洗</div>
      <h3>去噪任务 12 项</h3>
      <p>单位换算 98%，时序对齐 96%。</p>
    </div>
    <div class="card">
      <div class="badge">指标计算</div>
      <h3>积温 / VPD</h3>
      <p>灌溉量与蒸散估算已更新至 10:00。</p>
    </div>
    <div class="card">
      <div class="badge">规则引擎</div>
      <h3>规则 24 条</h3>
      <p>阈值告警 8 条，组合条件 6 条。</p>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-header">
      <div>
        <h3>指标口径管理</h3>
        <span>阈值、区间、组合条件管理</span>
      </div>
      <div class="actions">
        <button class="btn" @click="openModal('新增指标规则', 'rule')">新增规则</button>
        <button class="btn secondary" @click="openModal('单位换算配置', 'convert')">单位换算</button>
        <button class="btn ghost" @click="openModal('批量清洗进度', 'progress')">执行清洗</button>
        <button class="btn ghost" @click="openModal('指标口径提示', 'info')">按钮提示信息</button>
      </div>
    </div>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div class="metric-card">
        <h4>积温</h4>
        <p>日均积温 24.6℃ · 累积 682℃</p>
      </div>
      <div class="metric-card">
        <h4>VPD</h4>
        <p>阈值 0.8-1.2 kPa · 达标 92%</p>
      </div>
      <div class="metric-card">
        <h4>蒸散估算</h4>
        <p>参考 ET0 4.8 mm · 预测趋势稳定</p>
      </div>
      <div class="metric-card">
        <h4>长势指数</h4>
        <p>指数 86.4 · 关键驱动：温度、光照</p>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <div class="section-header">
      <div>
        <h3>规则与指标明细</h3>
        <span>清洗结果与规则策略</span>
      </div>
    </div>
    <div class="table-scroll">
      <table class="table">
        <thead>
          <tr>
            <th>规则编号</th>
            <th>指标名称</th>
            <th>规则类型</th>
            <th>阈值/区间</th>
            <th>适用地块</th>
            <th>状态</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.code }}</td>
            <td>{{ row.metric }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.range }}</td>
            <td>{{ row.plot }}</td>
            <td><span class="badge">{{ row.status }}</span></td>
            <td>{{ row.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-if="modal.open" :title="modal.title" @close="modal.open = false">
    <div v-if="modal.type === 'rule'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">指标名称</label>
        <input class="input" placeholder="如：VPD" />
      </div>
      <div>
        <label class="label">阈值区间</label>
        <input class="input" placeholder="0.8 - 1.2 kPa" />
      </div>
      <div>
        <label class="label">组合条件</label>
        <input class="input" placeholder="温度>20 且 湿度<75" />
      </div>
      <button class="btn">保存规则</button>
    </div>
    <div v-else-if="modal.type === 'convert'" class="grid" style="gap: 12px;">
      <div>
        <label class="label">原始单位</label>
        <input class="input" placeholder="Lux / ppm / mS" />
      </div>
      <div>
        <label class="label">目标单位</label>
        <input class="input" placeholder="PPFD / μmol" />
      </div>
      <button class="btn">确认换算</button>
    </div>
    <div v-else-if="modal.type === 'progress'" class="grid" style="gap: 12px;">
      <p>清洗任务已启动，正在进行去噪与时序对齐。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: '64%' }"></div>
      </div>
      <button class="btn">查看清洗日志</button>
    </div>
    <div v-else>
      <p>指标口径管理支持版本化与审批流程，建议定期复核规则。</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `RULE-${200 + index}`,
  metric: ['积温', 'VPD', '灌溉量', '蒸散估算', '长势指数'][index % 5],
  type: ['阈值', '区间', '组合条件'][index % 3],
  range: index % 2 === 0 ? '标准范围' : '高风险区间',
  plot: `地块-${(index % 8) + 1}`,
  status: index % 3 === 0 ? '启用' : '待复核',
  time: `2024-05-${(index % 20) + 1} 09:${(index % 6) * 10}`
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

.metric-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 6px;
}

.metric-card h4 {
  margin: 0;
}

.metric-card p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}
</style>
