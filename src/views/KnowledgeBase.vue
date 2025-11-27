<template>
  <div class="grid">
    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">消防知识库</h3>
        <div class="top-actions">
          <button class="primary-btn" @click="showCreate = true">添加知识点</button>
          <button class="secondary-btn" @click="showReview = true">复习提醒</button>
          <button class="ghost-btn" @click="showTip = true">操作提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>标题</th>
            <th>标签</th>
            <th>来源</th>
            <th>更新时间</th>
            <th>阅读数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in articles" :key="item.title">
            <td>{{ item.title }}</td>
            <td><span class="chip" :style="{ background: item.color, color: '#fff' }">{{ item.tag }}</span></td>
            <td>{{ item.source }}</td>
            <td>{{ item.updated }}</td>
            <td>{{ item.views }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <h3 class="section-title">知识掌握度</h3>
      <div class="chart-bars">
        <div v-for="item in mastery" :key="item.label" class="chart-bar" :style="{ height: item.value + 80 + 'px' }">
          <strong>{{ item.value }}%</strong>
          <div style="padding: 6px 0 8px; font-weight: 700;">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
    <div class="modal-card">
      <h3>新增知识点</h3>
      <form class="form-grid" @submit.prevent="addArticle">
        <div>
          <label>标题</label>
          <input v-model="form.title" required placeholder="防火巡查要求" />
        </div>
        <div>
          <label>标签</label>
          <input v-model="form.tag" required placeholder="制度" />
        </div>
        <div>
          <label>来源</label>
          <input v-model="form.source" required placeholder="内部制度" />
        </div>
        <div>
          <label>阅读数</label>
          <input v-model.number="form.views" type="number" min="0" />
        </div>
      </form>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="ghost-btn" @click="showCreate = false">取消</button>
        <button class="primary-btn" @click="addArticle">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showReview" class="modal-backdrop" @click.self="showReview = false">
    <div class="modal-card">
      <h3>复习进度</h3>
      <p>根据阅读数和考核成绩计算的掌握进度。</p>
      <div v-for="item in mastery" :key="item.label" style="margin-bottom: 10px;">
        <div class="flex-between">
          <strong>{{ item.label }}</strong>
          <span class="badge">{{ item.value }}%</span>
        </div>
        <div class="progress-bar" style="margin-top: 4px;">
          <div class="progress-fill" :style="{ width: item.value + '%' }"></div>
        </div>
      </div>
      <div class="flex-between" style="margin-top: 8px;">
        <button class="ghost-btn" @click="showReview = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showTip" class="modal-backdrop" @click.self="showTip = false">
    <div class="modal-card">
      <h3>操作提示</h3>
      <ul>
        <li>点击“添加知识点”后填写来源、标签和阅读数，便于统计。</li>
        <li>复习提醒弹窗会展示掌握度进度条。</li>
        <li>保持至少 5 条知识点以便于按标签筛选。</li>
      </ul>
      <div class="flex-between" style="margin-top: 10px;">
        <button class="ghost-btn" @click="showTip = false">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const articles = ref([
  { title: '火灾报警流程', tag: '流程', source: '企业标准', updated: '2024-05-18', views: 320, color: '#22c55e' },
  { title: '高层逃生注意事项', tag: '逃生', source: '培训讲义', updated: '2024-05-19', views: 280, color: '#6366f1' },
  { title: '灭火器月检要点', tag: '检查', source: '设备科', updated: '2024-05-20', views: 260, color: '#0ea5e9' },
  { title: '电气火灾预防', tag: '预防', source: '能源科', updated: '2024-05-21', views: 195, color: '#f97316' },
  { title: '食堂油火扑救', tag: '案例', source: '现场案例', updated: '2024-05-22', views: 175, color: '#a855f7' }
]);

const mastery = ref([
  { label: '报警处置', value: 78 },
  { label: '疏散指引', value: 82 },
  { label: '设施巡检', value: 69 },
  { label: '用火用电', value: 74 },
  { label: '实战案例', value: 63 }
]);

const showCreate = ref(false);
const showReview = ref(false);
const showTip = ref(false);

const form = reactive({
  title: '',
  tag: '',
  source: '',
  views: 100
});

const palette = ['#22c55e', '#6366f1', '#0ea5e9', '#f97316', '#a855f7'];

const addArticle = () => {
  const color = palette[Math.floor(Math.random() * palette.length)];
  articles.value = [
    { ...form, updated: new Date().toISOString().slice(0, 10), color },
    ...articles.value
  ];
  mastery.value = [
    { label: form.tag || '新标签', value: 60 },
    ...mastery.value.slice(0, 4)
  ];
  showCreate.value = false;
  showReview.value = true;
  form.title = '';
  form.tag = '';
  form.source = '';
  form.views = 100;
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 14px;
}

.top-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

ul {
  margin: 0;
  padding-left: 18px;
}

@media (max-width: 1080px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
