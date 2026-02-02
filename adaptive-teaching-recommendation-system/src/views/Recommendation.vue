<template>
  <div class="grid grid-2">
    <div class="page-card">
      <div class="section-title">推荐策略概览</div>
      <div class="grid grid-3">
        <div class="page-card">
          <div class="badge">内容优化</div>
          <h3>{{ metrics.content }}项</h3>
          <p>针对知识点难度分层</p>
        </div>
        <div class="page-card">
          <div class="badge">互动策略</div>
          <h3>{{ metrics.interaction }}项</h3>
          <p>提升课堂参与感</p>
        </div>
        <div class="page-card">
          <div class="badge">节奏建议</div>
          <h3>{{ metrics.pace }}条</h3>
          <p>优化课堂节奏</p>
        </div>
      </div>
      <div class="chart-card">
        <div class="section-title">推荐效果模拟</div>
        <svg viewBox="0 0 320 140" width="100%" height="140" aria-label="推荐效果图">
          <rect x="30" y="50" width="40" height="70" fill="#c7d2fe" rx="8" />
          <rect x="90" y="30" width="40" height="90" fill="#93c5fd" rx="8" />
          <rect x="150" y="20" width="40" height="100" fill="#60a5fa" rx="8" />
          <rect x="210" y="35" width="40" height="85" fill="#38bdf8" rx="8" />
          <rect x="270" y="15" width="40" height="105" fill="#4f7cff" rx="8" />
        </svg>
        <div class="chart-legend">
          <span>预估提升: {{ metrics.uplift }}%</span>
          <span>覆盖学生: {{ metrics.coverage }}人</span>
          <span>反馈延迟: {{ metrics.delay }}分钟</span>
        </div>
      </div>
    </div>
    <div class="page-card">
      <div class="section-title">推荐操作</div>
      <div class="grid grid-2">
        <button class="primary-btn" @click="openPlan">生成优化方案</button>
        <button class="secondary-btn" @click="openLesson">推送课堂活动</button>
        <button class="ghost-btn" @click="openHint">推荐提示信息</button>
        <button class="secondary-btn" @click="openProgress">策略编排进度</button>
      </div>
      <div class="section-title" style="margin-top: 20px;">推荐清单</div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>推荐类型</th>
            <th>重点对象</th>
            <th>预期效果</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.target }}</td>
            <td>{{ row.effect }}</td>
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
          方案名称
          <input v-model="form.name" placeholder="请输入方案名称" />
        </label>
        <label>
          目标群体
          <select v-model="form.group">
            <option value="全班">全班</option>
            <option value="专注提升组">专注提升组</option>
            <option value="能力拔高组">能力拔高组</option>
          </select>
        </label>
        <label>
          推荐强度
          <select v-model="form.level">
            <option value="温和">温和</option>
            <option value="标准">标准</option>
            <option value="强化">强化</option>
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
      <p class="tag">策略编排 {{ modal.progress }}%</p>
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
  content: 6,
  interaction: 8,
  pace: 5,
  uplift: 18,
  coverage: 46,
  delay: 2
};

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  type: index % 2 === 0 ? "内容分层" : "互动引导",
  target: index % 3 === 0 ? "后排学生" : "全班",
  effect: index % 2 === 0 ? "提升专注" : "增强参与"
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
  name: "课堂互动强化方案",
  group: "全班",
  level: "标准",
  note: "加入小组讨论与实时投票" 
});

const openPlan = () => {
  modal.open = true;
  modal.title = "生成优化方案";
  modal.type = "form";
};

const openLesson = () => {
  modal.open = true;
  modal.title = "推送课堂活动";
  modal.type = "info";
  modal.message = "即将推送 3 项互动活动到学生终端。";
  modal.list = ["快速问答", "协作板书", "即时反馈投票"];
};

const openHint = () => {
  modal.open = true;
  modal.title = "推荐提示";
  modal.type = "info";
  modal.message = "建议在关键知识点前后插入 2 次互动，保持节奏。";
  modal.list = ["难点拆解", "即时练习", "反馈复述"];
};

const openProgress = () => {
  modal.open = true;
  modal.title = "策略编排进度";
  modal.type = "progress";
  modal.message = "系统正在匹配教学目标与学生画像。";
  modal.progress = 58;
};

const openRow = (row) => {
  modal.open = true;
  modal.title = `推荐详情 - ${row.type}`;
  modal.type = "info";
  modal.message = `针对 ${row.target}，预期效果：${row.effect}`;
  modal.list = ["预计提升 12%", "匹配 2 个教学环节", "反馈时长 5 分钟"];
};

const submit = () => {
  modal.open = false;
};

const closeModal = () => {
  modal.open = false;
};
</script>
