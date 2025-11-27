<template>
  <div class="grid">
    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">应急演练计划</h3>
        <div class="top-actions">
          <button class="primary-btn" @click="showCreate = true">安排演练</button>
          <button class="secondary-btn" @click="showTimeline = true">查看时间表</button>
          <button class="ghost-btn" @click="showAlert = true">演练须知</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>科目</th>
            <th>指挥官</th>
            <th>日期</th>
            <th>场地</th>
            <th>参与部门</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in drills" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.commander }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.site }}</td>
            <td>{{ item.dept }}</td>
            <td><span class="chip" :style="{ background: item.color, color: '#fff' }">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <h3 class="section-title">演练成果评估</h3>
      <div class="chart-bars">
        <div v-for="score in results" :key="score.label" class="chart-bar" :style="{ height: score.value + 70 + 'px' }">
          <strong>{{ score.value }}%</strong>
          <div style="padding: 6px 0 8px; font-weight: 700;">{{ score.label }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
    <div class="modal-card">
      <h3>安排演练</h3>
      <form class="form-grid" @submit.prevent="createDrill">
        <div>
          <label>演练科目</label>
          <input v-model="form.name" required placeholder="烟雾逃生" />
        </div>
        <div>
          <label>指挥官</label>
          <input v-model="form.commander" required placeholder="陈宇" />
        </div>
        <div>
          <label>日期</label>
          <input v-model="form.date" required placeholder="2024-06-10" />
        </div>
        <div>
          <label>场地</label>
          <input v-model="form.site" required placeholder="东区广场" />
        </div>
        <div>
          <label>参与部门</label>
          <input v-model="form.dept" required placeholder="生产部/行政部" />
        </div>
        <div>
          <label>状态</label>
          <select v-model="form.status">
            <option value="筹备中">筹备中</option>
            <option value="演练中">演练中</option>
            <option value="已复盘">已复盘</option>
          </select>
        </div>
      </form>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="ghost-btn" @click="showCreate = false">取消</button>
        <button class="primary-btn" @click="createDrill">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showTimeline" class="modal-backdrop" @click.self="showTimeline = false">
    <div class="modal-card">
      <h3>演练时间表</h3>
      <div v-for="item in drills" :key="item.name" style="margin-bottom: 10px;">
        <div class="flex-between">
          <strong>{{ item.name }}</strong>
          <span class="badge">{{ item.date }}</span>
        </div>
        <div class="progress-bar" style="margin-top: 4px;">
          <div class="progress-fill" :style="{ width: timelineRate(item.status) + '%' }"></div>
        </div>
      </div>
      <div class="flex-between" style="margin-top: 10px;">
        <button class="ghost-btn" @click="showTimeline = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showAlert" class="modal-backdrop" @click.self="showAlert = false">
    <div class="modal-card">
      <h3>演练须知</h3>
      <ul>
        <li>提前 2 天完成物资检查，确保对讲机和防烟面罩齐备。</li>
        <li>演练结束 30 分钟内提交简要复盘，24 小时内形成正式报告。</li>
        <li>所有按钮弹窗均已启用，使用时会给出进度提示。</li>
      </ul>
      <div class="flex-between" style="margin-top: 10px;">
        <button class="ghost-btn" @click="showAlert = false">我已知悉</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const drills = ref([
  { name: '高层疏散', commander: '刘昊', date: '2024-05-21', site: '塔楼A', dept: '行政/物业', status: '演练中', color: '#22c55e' },
  { name: '夜间火警', commander: '王俊', date: '2024-05-27', site: '宿舍区', dept: '后勤/保卫', status: '筹备中', color: '#f97316' },
  { name: '化学泄漏', commander: '陈璐', date: '2024-06-03', site: '实验室', dept: '研发/安全', status: '筹备中', color: '#f97316' },
  { name: '厨房油火', commander: '张瑞', date: '2024-06-08', site: '食堂', dept: '餐饮/保洁', status: '已复盘', color: '#6366f1' },
  { name: '仓库爆燃', commander: '李娜', date: '2024-06-12', site: '仓库东侧', dept: '仓储/配送', status: '演练中', color: '#22c55e' }
]);

const results = ref([
  { label: '指挥协调', value: 82 },
  { label: '通信联动', value: 75 },
  { label: '疏散效率', value: 88 },
  { label: '灭火响应', value: 71 },
  { label: '安全防护', value: 79 }
]);

const showCreate = ref(false);
const showTimeline = ref(false);
const showAlert = ref(false);

const form = reactive({
  name: '',
  commander: '',
  date: '',
  site: '',
  dept: '',
  status: '筹备中'
});

const statusColor = (status) => {
  if (status === '演练中') return '#22c55e';
  if (status === '已复盘') return '#6366f1';
  return '#f97316';
};

const createDrill = () => {
  drills.value = [
    { ...form, color: statusColor(form.status) },
    ...drills.value
  ];
  results.value = [
    { label: form.name || '新演练', value: 60 },
    ...results.value.slice(0, 4)
  ];
  showCreate.value = false;
  showAlert.value = true;
  form.name = '';
  form.commander = '';
  form.date = '';
  form.site = '';
  form.dept = '';
  form.status = '筹备中';
};

const timelineRate = (status) => {
  if (status === '演练中') return 60;
  if (status === '已复盘') return 100;
  return 30;
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
