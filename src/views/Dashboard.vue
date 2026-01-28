<template>
  <div class="dashboard">
    <div class="header">
      <div>
        <h2>仿真结果总览</h2>
        <p>集中展示各模块仿真进度与关键指标。</p>
      </div>
      <div class="actions">
        <button class="outline" type="button" @click="showCreateModal = true">快速创建项目</button>
        <button class="primary" type="button" @click="showRefreshModal = true">刷新概览</button>
        <button class="outline" type="button" @click="showExportModal = true">导出总览</button>
        <button class="ghost" type="button" @click="showTipModal = true">提示信息</button>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <h3>本周仿真任务</h3>
        <strong>42</strong>
        <p>已完成 31 项，正在执行 11 项。</p>
      </div>
      <div class="summary-card">
        <h3>高风险工况</h3>
        <strong>7</strong>
        <p>涉及碰撞、热冲击与NVH峰值。</p>
      </div>
      <div class="summary-card">
        <h3>能耗优化</h3>
        <strong>-6.8%</strong>
        <p>气动与热管理优化综合收益。</p>
      </div>
      <div class="summary-card">
        <h3>最近更新</h3>
        <strong>2 小时前</strong>
        <p>流体与热模块数据已同步。</p>
      </div>
    </div>

    <div class="overview">
      <img :src="caeVisual" alt="仿真总览图" />
      <div class="overview-info">
        <h3>数据融合中心</h3>
        <p>统一汇聚五大模块数据，形成跨域协同分析结果。</p>
        <ul>
          <li>结构安全裕度 1.38</li>
          <li>操稳指数 87 分</li>
          <li>综合风阻系数 0.27</li>
          <li>温控裕度 13 ℃</li>
          <li>车内噪声目标达成</li>
        </ul>
      </div>
    </div>

    <div class="table-card">
      <h3>仿真任务清单</h3>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>模块</th>
            <th>任务名称</th>
            <th>负责人</th>
            <th>状态</th>
            <th>完成度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.module }}</td>
            <td>{{ row.task }}</td>
            <td>{{ row.owner }}</td>
            <td><span :class="['status', row.statusClass]">{{ row.status }}</span></td>
            <td>{{ row.progress }}</td>
            <td>
              <button class="link" type="button" @click="openDetail(row)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="showCreateModal" title="快速创建项目" @close="showCreateModal = false">
      <form class="modal-form">
        <label>
          项目名称
          <input type="text" placeholder="整车多物理场评估" />
        </label>
        <label>
          模块组合
          <select>
            <option>结构 + CFD + 热</option>
            <option>结构 + MBD + NVH</option>
            <option>全部模块</option>
          </select>
        </label>
        <label>
          项目负责人
          <input type="text" placeholder="张晨" />
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showCreateModal = false">取消</button>
        <button class="primary" type="button" @click="showCreateModal = false">创建</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showRefreshModal" title="刷新概览" @close="showRefreshModal = false">
      <p>系统将重新同步最新仿真数据，预计耗时约 30 秒。</p>
      <div class="progress-track large">
        <div class="progress-bar" style="width: 72%"></div>
      </div>
      <p class="progress-text">同步中 72%</p>
      <template #footer>
        <button class="primary" type="button" @click="showRefreshModal = false">完成</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showExportModal" title="导出总览" @close="showExportModal = false">
      <form class="modal-form">
        <label>
          导出格式
          <select>
            <option>PDF</option>
            <option>Excel</option>
            <option>PowerPoint</option>
          </select>
        </label>
        <label>
          报告范围
          <select>
            <option>本周任务</option>
            <option>全部任务</option>
          </select>
        </label>
      </form>
      <template #footer>
        <button class="ghost" type="button" @click="showExportModal = false">取消</button>
        <button class="primary" type="button" @click="showExportModal = false">导出</button>
      </template>
    </BaseModal>

    <BaseModal v-if="showTipModal" title="提示信息" @close="showTipModal = false">
      <p>建议优先处理碰撞与热冲击工况，以保障验证进度。</p>
      <template #footer>
        <button class="primary" type="button" @click="showTipModal = false">知道了</button>
      </template>
    </BaseModal>

    <BaseModal v-if="detailModal" title="任务详情" @close="detailModal = null">
      <p>模块：{{ detailModal?.module }}</p>
      <p>任务：{{ detailModal?.task }}</p>
      <p>负责人：{{ detailModal?.owner }}</p>
      <p>完成度：{{ detailModal?.progress }}</p>
      <template #footer>
        <button class="primary" type="button" @click="detailModal = null">关闭</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import caeVisual from '../assets/cae-visual.svg';

const showCreateModal = ref(false);
const showRefreshModal = ref(false);
const showExportModal = ref(false);
const showTipModal = ref(false);
const detailModal = ref(null);

const modules = ['FEA', 'MBD', 'CFD', '热分析', 'NVH'];

const tableRows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  const module = modules[index % modules.length];
  return {
    id,
    module,
    task: `${module}任务-${id}`,
    owner: id % 2 === 0 ? '李娜' : '周明',
    status: id % 5 === 0 ? '待复核' : '进行中',
    statusClass: id % 5 === 0 ? 'warn' : 'ok',
    progress: `${55 + id * 2}%`
  };
});

const openDetail = (row) => {
  detailModal.value = row;
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.header p {
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.actions button {
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 13px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.outline {
  background: #fff;
  border: 1px solid #cbd5f5;
}

.ghost {
  background: #f1f5f9;
  border: none;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
  display: grid;
  gap: 8px;
}

.summary-card strong {
  font-size: 22px;
}

.overview {
  display: grid;
  grid-template-columns: minmax(260px, 360px) 1fr;
  gap: 24px;
  align-items: center;
}

@media (max-width: 960px) {
  .overview {
    grid-template-columns: 1fr;
  }
}

.overview img {
  width: 100%;
  border-radius: 20px;
}

.overview-info {
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}

.overview-info ul {
  margin-top: 12px;
  padding-left: 18px;
  color: #475569;
  display: grid;
  gap: 6px;
}

.table-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
  overflow-x: auto;
}

.table-card h3 {
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status.ok {
  background: #dcfce7;
  color: #15803d;
}

.status.warn {
  background: #fef3c7;
  color: #b45309;
}

.link {
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
}

.modal-form {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cbd5f5;
  border-radius: 8px;
}

.progress-track {
  background: #e2e8f0;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-track.large {
  height: 14px;
  margin: 16px 0 8px;
}

.progress-bar {
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  height: 100%;
  border-radius: inherit;
}

.progress-text {
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
}
</style>
