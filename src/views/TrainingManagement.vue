<template>
  <div class="grid">
    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">培训计划</h3>
        <div class="top-actions">
          <button class="primary-btn" @click="showCreate = true">新建培训计划</button>
          <button class="secondary-btn" @click="showProgress = true">查看执行进度</button>
          <button class="ghost-btn" @click="showNotice = true">操作提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>主题</th>
            <th>负责人</th>
            <th>时间</th>
            <th>地点</th>
            <th>人数</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in trainings" :key="row.title">
            <td>{{ row.title }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.location }}</td>
            <td>{{ row.participants }}</td>
            <td>
              <span class="chip" :style="{ background: row.color, color: '#fff' }">{{ row.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <h3 class="section-title">培训完成率</h3>
      <div class="chart-bars">
        <div v-for="stat in completion" :key="stat.name" class="chart-bar" :style="{ height: stat.rate + 80 + 'px' }">
          <strong>{{ stat.rate }}%</strong>
          <div style="padding: 6px 0 8px; font-weight: 700;">{{ stat.name }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
    <div class="modal-card">
      <h3>新建培训计划</h3>
      <form class="form-grid" @submit.prevent="submitCreate">
        <div>
          <label>培训主题</label>
          <input v-model="form.title" required placeholder="灭火器操作" />
        </div>
        <div>
          <label>负责人</label>
          <input v-model="form.owner" required placeholder="周安" />
        </div>
        <div>
          <label>时间</label>
          <input v-model="form.date" required placeholder="2024-06-18" />
        </div>
        <div>
          <label>地点</label>
          <input v-model="form.location" required placeholder="培训室A" />
        </div>
        <div>
          <label>计划人数</label>
          <input v-model.number="form.participants" type="number" min="1" required />
        </div>
        <div>
          <label>状态</label>
          <select v-model="form.status" required>
            <option value="计划中">计划中</option>
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
          </select>
        </div>
      </form>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="ghost-btn" @click="showCreate = false">取消</button>
        <button class="primary-btn" @click="submitCreate">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showProgress" class="modal-backdrop" @click.self="showProgress = false">
    <div class="modal-card">
      <h3>培训执行进度</h3>
      <p>动态汇总所有培训任务的签到、考试、反馈完成率。</p>
      <div v-for="row in progressList" :key="row.name" style="margin-bottom: 10px;">
        <div class="flex-between" style="margin-bottom: 4px;">
          <strong>{{ row.name }}</strong>
          <span class="badge">{{ row.rate }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: row.rate + '%' }"></div>
        </div>
      </div>
      <div class="flex-between" style="margin-top: 8px;">
        <button class="ghost-btn" @click="showProgress = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showNotice" class="modal-backdrop" @click.self="showNotice = false">
    <div class="modal-card">
      <h3>操作提示</h3>
      <ul>
        <li>新建计划后会同步至演练和人员考核模块。</li>
        <li>进度弹窗实时展示签到率与考试通过率。</li>
        <li>表格数据不少于 5 条，便于快速筛查。</li>
      </ul>
      <div class="flex-between" style="margin-top: 10px;">
        <button class="ghost-btn" @click="showNotice = false">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const trainings = ref([
  { title: '灭火器实操', owner: '李强', date: '2024-05-20', location: '培训室A', participants: 24, status: '进行中', color: '#22c55e' },
  { title: '高层逃生演练', owner: '王敏', date: '2024-05-25', location: '演练场', participants: 38, status: '计划中', color: '#f97316' },
  { title: '消防主机操作', owner: '周涛', date: '2024-05-28', location: '监控室', participants: 16, status: '计划中', color: '#f97316' },
  { title: '安全检查制度', owner: '赵雪', date: '2024-06-02', location: '会议室', participants: 45, status: '已完成', color: '#6366f1' },
  { title: '应急物资熟悉', owner: '陈林', date: '2024-06-06', location: '仓库', participants: 22, status: '进行中', color: '#22c55e' }
]);

const completion = ref([
  { name: '理论考试', rate: 86 },
  { name: '实操演示', rate: 74 },
  { name: '签到率', rate: 92 },
  { name: '反馈收集', rate: 68 },
  { name: '资料发放', rate: 81 }
]);

const progressList = ref([
  { name: '灭火器实操', rate: 76 },
  { name: '高层逃生演练', rate: 55 },
  { name: '消防主机操作', rate: 38 },
  { name: '安全检查制度', rate: 100 },
  { name: '应急物资熟悉', rate: 62 }
]);

const showCreate = ref(false);
const showProgress = ref(false);
const showNotice = ref(false);

const form = reactive({
  title: '',
  owner: '',
  date: '',
  location: '',
  participants: 10,
  status: '计划中'
});

const submitCreate = () => {
  trainings.value = [
    { ...form, color: form.status === '已完成' ? '#6366f1' : form.status === '进行中' ? '#22c55e' : '#f97316' },
    ...trainings.value
  ];
  progressList.value = [
    { name: form.title || '新建培训', rate: 30 },
    ...progressList.value.slice(0, 4)
  ];
  showCreate.value = false;
  showNotice.value = true;
  form.title = '';
  form.owner = '';
  form.date = '';
  form.location = '';
  form.participants = 10;
  form.status = '计划中';
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
