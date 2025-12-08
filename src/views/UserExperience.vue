<template>
  <div class="grid" style="gap:16px">
    <div class="flex-between card" style="flex-wrap:wrap">
      <div>
        <div style="font-weight:700">用户体验与反馈</div>
        <p style="margin:4px 0;color:var(--muted)">收集体验反馈、满意度评分与改进动作。</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="button" @click="openFeedback">新增反馈</button>
        <button class="button secondary" @click="openProgress">发布优化包</button>
        <button class="button secondary" @click="openHint('已推送调查问卷')">推送问卷</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:2fr 1fr;gap:16px">
      <div class="card">
        <div class="flex-between">
          <strong>体验表</strong>
          <button class="button secondary" @click="openHint('反馈表已保存')">保存</button>
        </div>
        <table class="table" style="margin-top:10px">
          <thead>
            <tr>
              <th>访客</th>
              <th>感受</th>
              <th>满意度</th>
              <th>建议</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in feedbackList" :key="item.name + item.mood">
              <td>{{ item.name }}</td>
              <td>{{ item.mood }}</td>
              <td>{{ item.score }}分</td>
              <td>{{ item.idea }}</td>
              <td style="display:flex;gap:8px">
                <button class="button secondary" @click="openFeedback(item)">编辑</button>
                <button class="button secondary" @click="openHint(`已跟进 ${item.name}`)">跟进</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="flex-between">
          <strong>满意度分布</strong>
          <button class="button secondary" @click="openHint('分布图已刷新')">刷新</button>
        </div>
        <svg viewBox="0 0 260 160" style="width:100%;margin-top:12px">
          <rect v-for="(bar,index) in bars" :key="index" :x="20 + index*40" :y="160 - bar.height" width="24" :height="bar.height" :fill="bar.color" rx="6" />
          <text v-for="(bar,index) in bars" :key="'t'+index" :x="28 + index*40" :y="150" fill="#1b1b1b" font-size="12">{{ bar.label }}</text>
        </svg>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr));margin-top:12px">
          <div class="card" style="box-shadow:none;border:1px dashed var(--border)">
            <div class="flex-between"><span>好评转化</span><span class="badge success">68%</span></div>
            <p style="margin:6px 0;color:var(--muted)">持续发布体验包</p>
          </div>
          <div class="card" style="box-shadow:none;border:1px dashed var(--border)">
            <div class="flex-between"><span>吐槽修复</span><span class="badge warning">92%</span></div>
            <p style="margin:6px 0;color:var(--muted)">故障快速闭环</p>
          </div>
        </div>
      </div>
    </div>

    <ModalDialog :show="modal.feedback" title="反馈表单" @close="modal.feedback=false">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label>访客</label>
          <input v-model="form.name" class="input" />
        </div>
        <div>
          <label>满意度</label>
          <input v-model.number="form.score" type="number" class="input" />
        </div>
        <div>
          <label>感受</label>
          <input v-model="form.mood" class="input" />
        </div>
        <div>
          <label>建议</label>
          <input v-model="form.idea" class="input" />
        </div>
      </div>
      <template #actions>
        <button class="button secondary" @click="modal.feedback=false">取消</button>
        <button class="button" @click="saveFeedback">保存</button>
      </template>
    </ModalDialog>

    <ModalDialog :show="modal.progress" title="发布进度" @close="modal.progress=false">
      <p>体验优化包发布中，请稍候。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: publishProgress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog :show="modal.hint" title="提示" @close="modal.hint=false">
      <p style="margin:0">{{ hintText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const feedbackList = ref([
  { name: '李晨', mood: '舒适', score: 9, idea: '增加路灯' },
  { name: '王雅', mood: '惊喜', score: 10, idea: '保留篝火区' },
  { name: '张勇', mood: '一般', score: 7, idea: '厕所更干净' },
  { name: '刘迪', mood: '舒适', score: 8, idea: '增加导览牌' },
  { name: '许婷', mood: '满意', score: 9, idea: '市集延长时间' },
  { name: '周敏', mood: '一般', score: 6, idea: '停车指引' },
  { name: '陈奕', mood: '惊喜', score: 10, idea: '沉浸灯光秀' },
  { name: '黄博', mood: '舒适', score: 8, idea: '儿童游乐区' },
  { name: '赵越', mood: '满意', score: 9, idea: '补充折叠椅' },
  { name: '沈冉', mood: '一般', score: 7, idea: '噪音提示牌' }
]);

const bars = [
  { label: '6分', height: 70, color: '#ffcc80' },
  { label: '7分', height: 90, color: '#ffe082' },
  { label: '8分', height: 110, color: '#81c784' },
  { label: '9分', height: 130, color: '#4fc3f7' },
  { label: '10分', height: 150, color: '#42a5f5' }
];

const modal = reactive({ feedback: false, progress: false, hint: false });
const form = reactive({ name: '', mood: '', score: 8, idea: '' });
const hintText = ref('');
const publishProgress = ref(20);

const openFeedback = (row) => {
  if (row) Object.assign(form, row);
  else Object.assign(form, { name: '新访客', mood: '满意', score: 9, idea: '优化候车点' });
  modal.feedback = true;
};

const saveFeedback = () => {
  const index = feedbackList.value.findIndex((f) => f.name === form.name);
  if (index >= 0) feedbackList.value[index] = { ...form };
  else feedbackList.value.push({ ...form });
  modal.feedback = false;
  openHint('反馈已保存');
};

const openProgress = () => {
  modal.progress = true;
  publishProgress.value = 20;
  const timer = setInterval(() => {
    publishProgress.value += 25;
    if (publishProgress.value >= 100) {
      publishProgress.value = 100;
      clearInterval(timer);
      setTimeout(() => (modal.progress = false), 600);
    }
  }, 320);
};

const openHint = (text) => {
  hintText.value = text;
  modal.hint = true;
};
</script>
