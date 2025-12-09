<template>
  <div class="card">
    <div class="section-title">📄 报告生成</div>
    <p>整合仪表板、情绪、认知与行为模块结果，生成阶段性心理健康报告。</p>
    <div class="button-group">
      <button class="btn" @click="showRecipient = true">添加推送对象</button>
      <button class="btn secondary" @click="startProgress">生成报告</button>
      <button class="btn ghost" @click="showTip = true">查看生成说明</button>
    </div>
  </div>

  <div class="grid two" style="margin-top: 16px;">
    <div class="card">
      <div class="section-title">📈 模块贡献度</div>
      <div class="simple-chart">
        <div v-for="item in contributions" :key="item.label" class="bar-row">
          <span>{{ item.label }}</span>
          <div class="bar"><span :style="{ width: item.value + '%' }"></span></div>
          <span style="text-align: right; font-weight: 700;">{{ item.value }}%</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">📝 报告条目预览（10+条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>主题</th>
            <th>摘要</th>
            <th>敏感度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in entries" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.summary }}</td>
            <td>{{ item.level }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showRecipient" class="modal-overlay" @click.self="showRecipient = false">
    <div class="modal">
      <h3>添加推送对象</h3>
      <form @submit.prevent="addRecipient">
        <label>
          姓名
          <input v-model="recipientForm.name" required placeholder="辅导员 / 班主任" />
        </label>
        <label>
          邮箱
          <input v-model="recipientForm.email" type="email" required placeholder="name@example.com" />
        </label>
        <label>
          报告类型
          <select v-model="recipientForm.type">
            <option>完整</option>
            <option>摘要</option>
            <option>风险提醒</option>
          </select>
        </label>
        <div class="button-group" style="justify-content: flex-end;">
          <button class="btn ghost" type="button" @click="showRecipient = false">取消</button>
          <button class="btn" type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="showTip" class="modal-overlay" @click.self="showTip = false">
    <div class="modal">
      <h3>生成说明</h3>
      <p>生成过程包括数据脱敏、指标汇总、异常标记与个性化建议拼装，预计 6 秒内完成。</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn" @click="showTip = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="progressing" class="modal-overlay" @click.self="progressing = false">
    <div class="modal">
      <h3>报告生成中</h3>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p style="margin-top: 10px;">正在聚合跨模块指标，准备导出 PDF...</p>
      <div class="button-group" style="justify-content: flex-end;">
        <button class="btn ghost" type="button" @click="progressing = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const contributions = [
  { label: '仪表板', value: 22 },
  { label: '情绪追踪', value: 24 },
  { label: '认知分析', value: 18 },
  { label: '行为洞察', value: 20 },
  { label: '自定义指标', value: 16 }
];

const entries = reactive([
  { id: 1, title: '总体风险', summary: '当前风险低，保持规律作息。', level: '低' },
  { id: 2, title: '情绪稳定度', summary: '积极与平稳占比 70%。', level: '低' },
  { id: 3, title: '认知负荷', summary: '高负荷任务占比 30%，建议分段练习。', level: '中' },
  { id: 4, title: '行为节律', summary: '夜间学习集中，注意休息。', level: '中' },
  { id: 5, title: '睡眠质量', summary: '平均 7h，轻度碎片化。', level: '低' },
  { id: 6, title: '社交互动', summary: '日均 2-3 次积极互动。', level: '低' },
  { id: 7, title: '运动习惯', summary: '每周 3 次中强度运动。', level: '低' },
  { id: 8, title: '专注力', summary: '课堂响应时间下降 3%。', level: '低' },
  { id: 9, title: '压力指数', summary: '近期考试压力升高，需呼吸放松。', level: '中' },
  { id: 10, title: '支持建议', summary: '推荐每日晚间 10 分钟冥想。', level: '低' },
  { id: 11, title: '后续跟进', summary: '两周后复评，关注考试周。', level: '中' }
]);

const showRecipient = ref(false);
const showTip = ref(false);
const progressing = ref(false);
const progress = ref(0);
const recipientForm = reactive({ name: '', email: '', type: '完整' });
let timer;

const addRecipient = () => {
  entries.push({
    id: entries.length + 1,
    title: `推送给 ${recipientForm.name}`,
    summary: `邮件：${recipientForm.email} 类型：${recipientForm.type}`,
    level: '低'
  });
  recipientForm.name = '';
  recipientForm.email = '';
  recipientForm.type = '完整';
  showRecipient.value = false;
};

const startProgress = () => {
  progressing.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value >= 100) clearInterval(timer);
  }, 300);
};
</script>
