<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h3>寿命与损伤分析</h3>
        <p>分析连接板疲劳寿命和损伤趋势，评估耐久性能。</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openModal('calculate')">计算寿命</button>
        <button class="btn light" @click="openModal('trend')">生成趋势</button>
        <button class="btn light" @click="openModal('diagnose')">损伤诊断</button>
        <button class="btn primary" @click="openModal('share')">分享结果</button>
      </div>
    </div>

    <div class="panel">
      <div class="card">
        <h4>寿命预测曲线</h4>
        <svg viewBox="0 0 520 200" class="chart" aria-label="寿命预测曲线">
          <polyline
            points="0,170 40,160 80,150 120,130 160,120 200,110 240,95 280,90 320,85 360,78 400,70 440,65 480,60 520,55"
            fill="none"
            stroke="#2b77f3"
            stroke-width="4"
          />
        </svg>
        <div class="legend">
          <span><i class="dot"></i>剩余寿命趋势</span>
        </div>
      </div>
      <div class="card">
        <h4>疲劳评估</h4>
        <ul>
          <li>预计剩余寿命：4,200 小时</li>
          <li>累计损伤：0.62</li>
          <li>风险等级：低</li>
          <li>建议维护周期：900 小时</li>
        </ul>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>位置</th>
            <th>主应力 (MPa)</th>
            <th>损伤值</th>
            <th>寿命预测 (h)</th>
            <th>趋势</th>
            <th>建议</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in analysisRows" :key="item.zone">
            <td>{{ item.zone }}</td>
            <td>{{ item.stress }}</td>
            <td>{{ item.damage }}</td>
            <td>{{ item.life }}</td>
            <td>{{ item.trend }}</td>
            <td>{{ item.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'calculate'" title="寿命计算" @close="closeModal">
      <p>系统将使用最新载荷谱重新计算疲劳寿命。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <button class="btn primary" @click="startProgress">开始计算</button>
    </BaseModal>

    <BaseModal v-if="activeModal === 'trend'" title="生成损伤趋势" @close="closeModal">
      <p>请选择分析范围生成趋势报告。</p>
      <div class="modal-grid">
        <button class="btn light" @click="handleSubmit('已生成 30 天损伤趋势报告')">近 30 天</button>
        <button class="btn light" @click="handleSubmit('已生成 90 天损伤趋势报告')">近 90 天</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'diagnose'" title="损伤诊断" @close="closeModal">
      <form class="modal-form" @submit.prevent="handleSubmit('诊断完成：重点关注连接板中部焊缝区域')">
        <label>
          诊断模型
          <select>
            <option>矿山作业模型</option>
            <option>田间作业模型</option>
            <option>高速运输模型</option>
          </select>
        </label>
        <label>
          阈值等级
          <select>
            <option>保守</option>
            <option>标准</option>
            <option>激进</option>
          </select>
        </label>
        <button class="btn primary" type="submit">开始诊断</button>
      </form>
    </BaseModal>

    <BaseModal v-if="activeModal === 'share'" title="分享分析结果" @close="closeModal">
      <p>已生成分析摘要，可发送给项目组成员。</p>
      <div class="modal-grid">
        <button class="btn light" @click="handleSubmit('已通过邮箱发送分析摘要')">发送邮件</button>
        <button class="btn light" @click="handleSubmit('已同步到企业微信')">同步企业微信</button>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'info'" title="操作完成" @close="closeModal">
      <p>{{ message }}</p>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const activeModal = ref("");
const message = ref("");
const progress = ref(0);

const analysisRows = Array.from({ length: 20 }, (_, index) => ({
  zone: `区域-${index + 1}`,
  stress: 180 + index * 3,
  damage: (0.2 + index * 0.02).toFixed(2),
  life: (5200 - index * 120).toLocaleString(),
  trend: index % 3 === 0 ? "平稳" : index % 3 === 1 ? "略升" : "下降",
  action: index % 4 === 0 ? "加强检测" : "按计划维护"
}));

const openModal = (type) => {
  activeModal.value = type;
  message.value = "";
};

const closeModal = () => {
  activeModal.value = "";
  progress.value = 0;
};

const handleSubmit = (text) => {
  message.value = text;
  activeModal.value = "info";
};

const startProgress = () => {
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 15;
    if (progress.value >= 100) {
      clearInterval(timer);
      handleSubmit("寿命计算完成，预测结果已刷新。");
    }
  }, 180);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
}

.module-header h3 {
  font-size: 20px;
  color: #1c2a4a;
  margin-bottom: 6px;
}

.module-header p {
  color: #6b7c98;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  border: none;
  background: #e8efff;
  color: #2a4b8d;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.btn.light {
  background: #f5f7ff;
}

.btn.primary {
  background: #2b77f3;
  color: #fff;
}

.panel {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.card h4 {
  margin-bottom: 12px;
  color: #24314d;
}

.card ul {
  list-style: none;
  display: grid;
  gap: 6px;
  color: #5f6f8c;
}

.chart {
  width: 100%;
  height: 160px;
}

.legend {
  margin-top: 8px;
  color: #5f6f8c;
  font-size: 13px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: #2b77f3;
}

.table-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

th,
td {
  padding: 12px 10px;
  text-align: left;
  font-size: 14px;
}

th {
  color: #6b7c98;
  font-weight: 600;
  border-bottom: 1px solid #e6edf7;
}

td {
  color: #2d3b55;
  border-bottom: 1px solid #f0f4fb;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  color: #41506a;
  font-weight: 600;
}

.modal-form select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d6deea;
  background: #f8faff;
}

.modal-grid {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.progress {
  height: 10px;
  background: #edf1f8;
  border-radius: 999px;
  overflow: hidden;
  margin: 16px 0 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2b77f3, #6aa8ff);
  transition: width 0.2s ease;
}

@media (max-width: 980px) {
  .panel {
    grid-template-columns: 1fr;
  }
}
</style>
