<template>
  <div class="grid grid-2">
    <div class="page-card">
      <div class="section-title">课堂诊断指标</div>
      <div class="grid grid-3">
        <div class="page-card">
          <div class="badge">注意力</div>
          <h3>{{ metrics.attention }}%</h3>
          <p>高专注区间占比</p>
        </div>
        <div class="page-card">
          <div class="badge">互动密度</div>
          <h3>{{ metrics.interaction }}次/分钟</h3>
          <p>师生互动频率</p>
        </div>
        <div class="page-card">
          <div class="badge">节奏匹配</div>
          <h3>{{ metrics.pace }}%</h3>
          <p>教学节奏适配度</p>
        </div>
      </div>
      <div class="chart-card">
        <div class="section-title">注意力波动趋势</div>
        <svg viewBox="0 0 320 140" width="100%" height="140" aria-label="注意力趋势图">
          <defs>
            <linearGradient id="attention" x1="0" x2="1">
              <stop offset="0%" stop-color="#4f7cff" />
              <stop offset="100%" stop-color="#67d1ff" />
            </linearGradient>
          </defs>
          <path
            d="M0 100 C40 60, 80 90, 120 70 C160 50, 200 80, 240 55 C280 30, 320 60, 320 60"
            fill="none"
            stroke="url(#attention)"
            stroke-width="4"
          />
        </svg>
        <div class="chart-legend">
          <span>专注峰值: {{ metrics.peak }}%</span>
          <span>掉线预警: {{ metrics.warning }}次</span>
          <span>均值: {{ metrics.avg }}%</span>
        </div>
      </div>
    </div>
    <div class="page-card">
      <div class="section-title">诊断操作</div>
      <div class="grid grid-2">
        <button class="primary-btn" @click="openReport">生成诊断报告</button>
        <button class="secondary-btn" @click="openAlert">注意力预警配置</button>
        <button class="ghost-btn" @click="openHint">诊断提示信息</button>
        <button class="secondary-btn" @click="openProgress">模型分析进度</button>
      </div>
      <div class="section-title" style="margin-top: 20px;">诊断记录</div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>诊断时间</th>
            <th>核心发现</th>
            <th>风险等级</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.finding }}</td>
            <td>{{ row.risk }}</td>
            <td>
              <button class="ghost-btn" @click="openRow(row)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-if="modal.open" :title="modal.title" @close="closeModal">
    <div v-if="modal.type === 'form'" class="modal-body">
      <div class="form-grid">
        <label>
          报告范围
          <select v-model="form.scope">
            <option value="全班">全班</option>
            <option value="分组">分组</option>
            <option value="个体">个体</option>
          </select>
        </label>
        <label>
          指标重点
          <input v-model="form.focus" placeholder="如：注意力、互动" />
        </label>
        <label>
          输出格式
          <select v-model="form.format">
            <option value="PDF">PDF</option>
            <option value="PPT">PPT</option>
            <option value="课堂看板">课堂看板</option>
          </select>
        </label>
        <label>
          补充说明
          <textarea v-model="form.note" rows="3" placeholder="请输入"></textarea>
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'progress'" class="modal-body">
      <p>{{ modal.message }}</p>
      <div class="progress">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <p class="tag">模型推理 {{ modal.progress }}%</p>
    </div>
    <div v-else class="modal-body">
      <p>{{ modal.message }}</p>
      <ul>
        <li v-for="item in modal.list" :key="item">{{ item }}</li>
      </ul>
    </div>
    <template #actions>
      <button class="secondary-btn" @click="closeModal">关闭</button>
      <button v-if="modal.type === 'form'" class="primary-btn" @click="submit">确认生成</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive } from "vue";
import ModalDialog from "../components/ModalDialog.vue";

const metrics = {
  attention: 86,
  interaction: 4.2,
  pace: 91,
  peak: 98,
  warning: 3,
  avg: 84
};

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  time: `第${index + 1}节 09:${String(10 + index).padStart(2, "0")}`,
  finding: index % 2 === 0 ? "注意力分布不均" : "互动低于均值",
  risk: index % 3 === 0 ? "中" : "低"
}));

const modal = reactive({
  open: false,
  title: "",
  type: "info",
  message: "",
  list: [],
  progress: 0
});

const form = reactive({
  scope: "全班",
  focus: "注意力、互动",
  format: "课堂看板",
  note: "强调后排区域的注意力波动" 
});

const openReport = () => {
  modal.open = true;
  modal.title = "生成诊断报告";
  modal.type = "form";
};

const openAlert = () => {
  modal.open = true;
  modal.title = "注意力预警配置";
  modal.type = "info";
  modal.message = "当前预警阈值为 70%，可在课堂中动态调整。";
  modal.list = ["预警频率 2 次/10 分钟", "通知方式：桌面提醒", "建议策略：增加互动"];
};

const openHint = () => {
  modal.open = true;
  modal.title = "诊断提示";
  modal.type = "info";
  modal.message = "建议结合情绪识别与笔记记录提升诊断精度。";
  modal.list = ["同步作业提交", "补充板书区域视频", "开启表情识别"];
};

const openProgress = () => {
  modal.open = true;
  modal.title = "模型分析进度";
  modal.type = "progress";
  modal.message = "模型正在计算课堂瓶颈与节奏偏差。";
  modal.progress = 65;
};

const openRow = (row) => {
  modal.open = true;
  modal.title = `诊断详情 - ${row.time}`;
  modal.type = "info";
  modal.message = `${row.finding}，风险等级 ${row.risk}`;
  modal.list = ["建议增加提问", "适当放缓节奏", "关注后排学生"];
};

const submit = () => {
  modal.open = false;
};

const closeModal = () => {
  modal.open = false;
};
</script>
