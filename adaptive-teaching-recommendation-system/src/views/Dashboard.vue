<template>
  <div class="grid grid-2">
    <div class="page-card">
      <div class="section-title">课堂效果仪表盘</div>
      <div class="grid grid-3">
        <div class="page-card">
          <div class="badge">满意度</div>
          <h3>{{ stats.satisfaction }}%</h3>
          <p>学生反馈平均值</p>
        </div>
        <div class="page-card">
          <div class="badge">参与率</div>
          <h3>{{ stats.participation }}%</h3>
          <p>有效互动覆盖</p>
        </div>
        <div class="page-card">
          <div class="badge">达标率</div>
          <h3>{{ stats.goal }}%</h3>
          <p>教学目标达成</p>
        </div>
      </div>
      <div class="chart-card">
        <div class="section-title">效果评分趋势</div>
        <svg viewBox="0 0 320 140" width="100%" height="140" aria-label="效果趋势图">
          <polyline
            fill="none"
            stroke="#4f7cff"
            stroke-width="4"
            points="0,90 40,80 80,70 120,72 160,60 200,55 240,45 280,50 320,40"
          />
          <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="4" fill="#67d1ff" />
        </svg>
        <div class="chart-legend">
          <span>本周提升: {{ stats.weekly }}%</span>
          <span>实时评分: {{ stats.realtime }}</span>
          <span>建议更新: {{ stats.suggestions }}项</span>
        </div>
      </div>
    </div>
    <div class="page-card">
      <div class="section-title">反馈操作</div>
      <div class="grid grid-2">
        <button class="primary-btn" @click="openFeedback">发布反馈问卷</button>
        <button class="secondary-btn" @click="openBroadcast">课堂看板推送</button>
        <button class="ghost-btn" @click="openHint">反馈提示信息</button>
        <button class="secondary-btn" @click="openProgress">数据汇总进度</button>
      </div>
      <div class="section-title" style="margin-top: 20px;">反馈记录</div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>反馈来源</th>
            <th>评分</th>
            <th>关键词</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.source }}</td>
            <td>{{ row.score }}</td>
            <td>{{ row.keyword }}</td>
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
          反馈主题
          <input v-model="form.topic" placeholder="请输入主题" />
        </label>
        <label>
          覆盖范围
          <select v-model="form.range">
            <option value="全班">全班</option>
            <option value="随机抽样">随机抽样</option>
            <option value="重点关注">重点关注</option>
          </select>
        </label>
        <label>
          反馈问题
          <textarea v-model="form.question" rows="3" placeholder="请输入"></textarea>
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'progress'" class="modal-body">
      <p>{{ modal.message }}</p>
      <div class="progress">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <p class="tag">汇总完成度 {{ modal.progress }}%</p>
    </div>
    <div v-else class="modal-body">
      <p>{{ modal.message }}</p>
      <ul>
        <li v-for="item in modal.list" :key="item">{{ item }}</li>
      </ul>
    </div>
    <template #actions>
      <button class="secondary-btn" @click="closeModal">关闭</button>
      <button v-if="modal.type === 'form'" class="primary-btn" @click="submit">确认发布</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive } from "vue";
import ModalDialog from "../components/ModalDialog.vue";

const stats = {
  satisfaction: 93,
  participation: 88,
  goal: 91,
  weekly: 6,
  realtime: "A-",
  suggestions: 4
};

const points = [
  { x: 0, y: 90 },
  { x: 40, y: 80 },
  { x: 80, y: 70 },
  { x: 120, y: 72 },
  { x: 160, y: 60 },
  { x: 200, y: 55 },
  { x: 240, y: 45 },
  { x: 280, y: 50 },
  { x: 320, y: 40 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  source: index % 2 === 0 ? "学生端" : "课堂观察员",
  score: `${85 + (index % 10)}分`,
  keyword: index % 3 === 0 ? "互动" : "节奏"
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
  topic: "课堂反馈问卷",
  range: "全班",
  question: "本节课最需要改进的环节是？" 
});

const openFeedback = () => {
  modal.open = true;
  modal.title = "发布反馈问卷";
  modal.type = "form";
};

const openBroadcast = () => {
  modal.open = true;
  modal.title = "课堂看板推送";
  modal.type = "info";
  modal.message = "系统将把关键指标实时推送到教师大屏。";
  modal.list = ["满意度得分", "互动密度", "节奏提示"];
};

const openHint = () => {
  modal.open = true;
  modal.title = "反馈提示";
  modal.type = "info";
  modal.message = "建议在课后 10 分钟内发布反馈问卷。";
  modal.list = ["即时收集", "自动整理", "生成改进建议"];
};

const openProgress = () => {
  modal.open = true;
  modal.title = "数据汇总进度";
  modal.type = "progress";
  modal.message = "正在聚合课堂反馈与系统日志。";
  modal.progress = 76;
};

const openRow = (row) => {
  modal.open = true;
  modal.title = `反馈详情 - ${row.source}`;
  modal.type = "info";
  modal.message = `评分 ${row.score}，关键词：${row.keyword}`;
  modal.list = ["情绪积极", "反馈清晰", "可执行建议"];
};

const submit = () => {
  modal.open = false;
};

const closeModal = () => {
  modal.open = false;
};
</script>
