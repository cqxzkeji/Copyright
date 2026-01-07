<template>
  <div class="module">
    <div class="card-grid">
      <div class="card">
        <h3>0-72h 预报趋势</h3>
        <p>预测未来 3 天 PM2.5 峰值集中在夜间时段。</p>
        <div class="chart">
          <div v-for="(item, index) in forecastTrend" :key="index" class="bar">
            <span :style="{ height: item.value + '%' }"></span>
            <label>{{ item.label }}</label>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>预警等级分布</h3>
        <div class="alert-grid">
          <div class="alert level-1">
            <strong>轻度</strong>
            <span>12 时段</span>
          </div>
          <div class="alert level-2">
            <strong>中度</strong>
            <span>8 时段</span>
          </div>
          <div class="alert level-3">
            <strong>重度</strong>
            <span>4 时段</span>
          </div>
        </div>
        <ul class="status">
          <li>峰值时段：08-16 02:00</li>
          <li>最大浓度：128 μg/m³</li>
          <li>影响范围：华北核心城市群</li>
        </ul>
      </div>
      <div class="card action-card">
        <h3>预报发布操作</h3>
        <div class="actions">
          <button class="primary" type="button" @click="openModal('发布预报产品')">发布预报</button>
          <button class="ghost" type="button" @click="openModal('阈值预警设置')">阈值预警</button>
          <button class="ghost" type="button" @click="openModal('会商简报生成')">会商简报</button>
          <button class="ghost" type="button" @click="openModal('API 分发配置')">API分发</button>
        </div>
        <ul class="status">
          <li>已发布产品：7 套</li>
          <li>预警推送：22 条</li>
          <li>API 订阅方：14 家</li>
        </ul>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>未来 24 小时预报明细</h3>
        <button class="ghost" type="button" @click="openModal('预报产品打包')">产品打包</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>时次</th>
              <th>平均浓度</th>
              <th>污染等级</th>
              <th>峰值城市</th>
              <th>推送状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.time }}</td>
              <td>{{ row.value }}</td>
              <td>{{ row.level }}</td>
              <td>{{ row.city }}</td>
              <td>
                <span class="tag" :class="row.statusClass">{{ row.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalShell
    v-if="activeModal"
    :title="activeModal"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="modal-section">
      <h4>发布表单</h4>
      <div class="modal-grid">
        <label>
          产品类型
          <select>
            <option>时序曲线</option>
            <option>空间分布图</option>
            <option>污染等级清单</option>
            <option>API 推送</option>
          </select>
        </label>
        <label>
          覆盖范围
          <input placeholder="华北区域" />
        </label>
        <label>
          预警阈值
          <input placeholder="例如：75 μg/m³" />
        </label>
        <label>
          推送渠道
          <select>
            <option>短信</option>
            <option>邮件</option>
            <option>政务系统</option>
          </select>
        </label>
      </div>
    </div>
    <div class="modal-section">
      <h4>发布进度</h4>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">当前处理进度 {{ progress }}%</p>
    </div>
    <div class="modal-section info">
      <strong>提示信息：</strong>
      <span>发布完成后系统将同步生成预警短信与API订阅数据。</span>
    </div>
  </ModalShell>
</template>

<script setup>
import { ref } from "vue";
import ModalShell from "../components/ModalShell.vue";

const activeModal = ref("");
const progress = ref(60);

const forecastTrend = [
  { label: "12h", value: 45 },
  { label: "24h", value: 58 },
  { label: "36h", value: 68 },
  { label: "48h", value: 72 },
  { label: "60h", value: 66 },
  { label: "72h", value: 70 },
];

const tableRows = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  time: `08-${String(15 + Math.floor(index / 6)).padStart(2, "0")} ${String(index % 24).padStart(2, "0")}:00`,
  value: `${64 + index} μg/m³`,
  level: index % 4 === 0 ? "优" : index % 4 === 1 ? "良" : index % 4 === 2 ? "轻度" : "中度",
  city: ["北京", "天津", "石家庄", "济南", "太原", "郑州"][index % 6],
  status: index % 3 === 0 ? "已推送" : index % 3 === 1 ? "待确认" : "准备中",
  statusClass: index % 3 === 0 ? "ok" : index % 3 === 1 ? "warn" : "info",
}));

const openModal = (title) => {
  activeModal.value = title;
  progress.value = 48;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 12);
    if (progress.value >= 100) {
      clearInterval(timer);
    }
  }, 160);
};
</script>

<style scoped>
.module {
  display: grid;
  gap: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.card h3 {
  margin: 0 0 12px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 160px;
  margin-top: 16px;
}

.bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.bar span {
  width: 100%;
  background: linear-gradient(180deg, #fde68a, #f97316);
  border-radius: 8px 8px 4px 4px;
}

.alert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.alert {
  border-radius: 14px;
  padding: 14px;
  color: #fff;
  display: grid;
  gap: 6px;
}

.level-1 {
  background: #38bdf8;
}

.level-2 {
  background: #f59e0b;
}

.level-3 {
  background: #ef4444;
}

.action-card {
  display: grid;
  gap: 16px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.status {
  margin: 16px 0 0;
  padding-left: 16px;
  color: #64748b;
  font-size: 14px;
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  text-align: left;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ok {
  background: #dcfce7;
  color: #15803d;
}

.tag.warn {
  background: #fef9c3;
  color: #b45309;
}

.tag.info {
  background: #e0f2fe;
  color: #0369a1;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.ghost {
  background: #ffffff;
  border: 1px solid #cbd5f5;
  color: #334155;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
}

.modal-section {
  margin-bottom: 20px;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
}

.info {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  color: #475569;
}
</style>
