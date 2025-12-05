<template>
  <div class="card">
    <div class="flex-between">
      <h2>报告生成</h2>
      <div class="actions">
        <button class="ghost" @click="openGenerate">立即生成</button>
        <button class="ghost" @click="openSchedule">生成计划</button>
      </div>
    </div>
    <div class="grid" style="margin-top: 10px">
      <div class="card">
        <div class="flex-between">
          <div>最近生成</div>
          <span class="chip">{{ reports.length }} 份</span>
        </div>
        <p class="hint">报告数据包含 KPI、资源成本及 SLA。</p>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>模板</div>
          <span class="chip">实时 + 离线</span>
        </div>
        <p class="hint">可自定义维度、时间范围与导出格式。</p>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>报告</th>
          <th>类型</th>
          <th>生成时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports" :key="report.name">
          <td>{{ report.name }}</td>
          <td>{{ report.type }}</td>
          <td>{{ report.time }}</td>
          <td>{{ report.status }}</td>
          <td>
            <button class="ghost" @click="preview(report)">预览</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showGenerate" class="modal-backdrop" @click.self="showGenerate = false">
    <div class="modal">
      <header>生成报告</header>
      <div class="body">
        <div class="input-row">
          <label>时间范围</label>
          <select>
            <option>近 24 小时</option>
            <option>本周</option>
            <option>本月</option>
          </select>
        </div>
        <div class="input-row">
          <label>格式</label>
          <select>
            <option>PDF</option>
            <option>HTML</option>
            <option>CSV</option>
          </select>
        </div>
      </div>
      <div class="footer">
        <button @click="showGenerate = false">取消</button>
        <button @click="startGenerate">开始</button>
      </div>
    </div>
  </div>

  <div v-if="showSchedule" class="modal-backdrop" @click.self="showSchedule = false">
    <div class="modal">
      <header>生成计划</header>
      <div class="body">
        <div class="input-row">
          <label>频率</label>
          <select>
            <option>每天</option>
            <option>每周</option>
            <option>每月</option>
          </select>
        </div>
        <div class="input-row">
          <label>时间</label>
          <input type="time" value="08:00" />
        </div>
      </div>
      <div class="footer">
        <button @click="showSchedule = false">关闭</button>
        <button @click="showSchedule = false">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showPreview" class="modal-backdrop" @click.self="showPreview = false">
    <div class="modal">
      <header>预览：{{ previewReport?.name }}</header>
      <div class="body">
        <p>内容摘要：{{ previewReport?.summary }}</p>
        <div class="progress-bar" style="margin-top: 8px">
          <div :style="{ width: `${previewReport?.complete ?? 0}%` }"></div>
        </div>
      </div>
      <div class="footer">
        <button @click="showPreview = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const reports = reactive([
  { name: '实时调度概览', type: '实时', time: '08:10', status: '完成', summary: '实时吞吐、队列长度、成功率', complete: 100 },
  { name: '资源成本周报', type: '离线', time: '周一 09:00', status: '完成', summary: 'CPU/GPU 成本与利用率', complete: 100 },
  { name: 'SLA 月报', type: '混合', time: '08-01 12:00', status: '完成', summary: 'SLA 达标率及长尾分析', complete: 100 },
  { name: '分发策略评估', type: '实验', time: '昨日 22:00', status: '完成', summary: '策略 A/B 效果对比', complete: 100 },
  { name: '节点健康度', type: '实时', time: '今日 10:00', status: '完成', summary: '节点健康与告警', complete: 100 },
  { name: '流量预测', type: '预测', time: '今日 09:40', status: '完成', summary: '高峰预测与预案', complete: 100 },
  { name: '成本优化建议', type: '优化', time: '周三 14:00', status: '完成', summary: '缩容与调度建议', complete: 100 },
  { name: '备份与恢复测试', type: '维护', time: '今日 07:30', status: '完成', summary: '备份成功率与恢复用时', complete: 100 },
  { name: '队列深度分析', type: '实时', time: '今日 06:20', status: '完成', summary: '各队列深度与滞留', complete: 100 },
  { name: '异常告警分析', type: '告警', time: '今日 05:50', status: '完成', summary: '告警分布与处理效率', complete: 100 },
]);

const showGenerate = ref(false);
const showSchedule = ref(false);
const showPreview = ref(false);
const previewReport = ref(null);

const openGenerate = () => (showGenerate.value = true);
const openSchedule = () => (showSchedule.value = true);

const startGenerate = () => {
  showGenerate.value = false;
  previewReport.value = { name: '新报告', summary: '正在汇总最新指标', complete: 68 };
  showPreview.value = true;
};

const preview = (report) => {
  previewReport.value = report;
  showPreview.value = true;
};
</script>

<style scoped>
h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.hint {
  color: #6a7a8b;
  margin: 4px 0;
}
</style>
