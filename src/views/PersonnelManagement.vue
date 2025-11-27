<template>
  <div class="grid">
    <div class="card">
      <div class="flex-between">
        <h3 class="section-title">人员管理与考核</h3>
        <div class="top-actions">
          <button class="primary-btn" @click="showAssign = true">分配培训</button>
          <button class="secondary-btn" @click="showScore = true">考核成绩</button>
          <button class="ghost-btn" @click="showHint = true">考核提示</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>岗位</th>
            <th>部门</th>
            <th>必修课程</th>
            <th>完成率</th>
            <th>考试成绩</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in people" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.dept }}</td>
            <td>{{ item.course }}</td>
            <td>
              <div class="progress-bar" style="width: 120px;">
                <div class="progress-fill" :style="{ width: item.rate + '%' }"></div>
              </div>
            </td>
            <td><span class="chip" :style="{ background: gradeColor(item.score), color: '#fff' }">{{ item.score }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <h3 class="section-title">部门成绩分布</h3>
      <div class="chart-bars">
        <div v-for="dept in distribution" :key="dept.label" class="chart-bar" :style="{ height: dept.score + 70 + 'px' }">
          <strong>{{ dept.score }}%</strong>
          <div style="padding: 6px 0 8px; font-weight: 700;">{{ dept.label }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showAssign" class="modal-backdrop" @click.self="showAssign = false">
    <div class="modal-card">
      <h3>分配培训任务</h3>
      <form class="form-grid" @submit.prevent="assignCourse">
        <div>
          <label>姓名</label>
          <input v-model="form.name" required placeholder="张帆" />
        </div>
        <div>
          <label>岗位</label>
          <input v-model="form.role" required placeholder="安全员" />
        </div>
        <div>
          <label>部门</label>
          <input v-model="form.dept" required placeholder="设备部" />
        </div>
        <div>
          <label>课程</label>
          <input v-model="form.course" required placeholder="高层逃生" />
        </div>
        <div>
          <label>完成率</label>
          <input v-model.number="form.rate" type="number" min="0" max="100" />
        </div>
        <div>
          <label>考试成绩</label>
          <input v-model="form.score" placeholder="A/B/C" />
        </div>
      </form>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="ghost-btn" @click="showAssign = false">取消</button>
        <button class="primary-btn" @click="assignCourse">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showScore" class="modal-backdrop" @click.self="showScore = false">
    <div class="modal-card">
      <h3>考核成绩</h3>
      <div v-for="dept in distribution" :key="dept.label" style="margin-bottom: 10px;">
        <div class="flex-between">
          <strong>{{ dept.label }}</strong>
          <span class="badge">{{ dept.score }}%</span>
        </div>
        <div class="progress-bar" style="margin-top: 4px;">
          <div class="progress-fill" :style="{ width: dept.score + '%' }"></div>
        </div>
      </div>
      <div class="flex-between" style="margin-top: 8px;">
        <button class="ghost-btn" @click="showScore = false">关闭</button>
      </div>
    </div>
  </div>

  <div v-if="showHint" class="modal-backdrop" @click.self="showHint = false">
    <div class="modal-card">
      <h3>考核提示</h3>
      <ul>
        <li>录入的人员会同步到培训、演练和数据统计模块。</li>
        <li>完成率进度条展示课件学习与考核状态。</li>
        <li>每个按钮均带有弹窗反馈，包含表单与进度条。</li>
      </ul>
      <div class="flex-between" style="margin-top: 10px;">
        <button class="ghost-btn" @click="showHint = false">明白</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const people = ref([
  { name: '周航', role: '安全员', dept: '设备部', course: '灭火器实操', rate: 88, score: 'A' },
  { name: '张美', role: '前台', dept: '行政部', course: '疏散指引', rate: 76, score: 'B' },
  { name: '李伟', role: '厨师长', dept: '后勤部', course: '厨房油火', rate: 64, score: 'B' },
  { name: '陈凯', role: '仓库主管', dept: '仓储部', course: '物资管理', rate: 72, score: 'C' },
  { name: '赵敏', role: '班组长', dept: '生产部', course: '高层逃生', rate: 90, score: 'A' }
]);

const distribution = ref([
  { label: '行政部', score: 82 },
  { label: '设备部', score: 74 },
  { label: '后勤部', score: 69 },
  { label: '仓储部', score: 71 },
  { label: '生产部', score: 85 }
]);

const showAssign = ref(false);
const showScore = ref(false);
const showHint = ref(false);

const form = reactive({
  name: '',
  role: '',
  dept: '',
  course: '',
  rate: 50,
  score: 'B'
});

const gradeColor = (score) => {
  if (score === 'A') return '#22c55e';
  if (score === 'B') return '#0ea5e9';
  return '#f97316';
};

const assignCourse = () => {
  people.value = [
    { ...form },
    ...people.value
  ];
  distribution.value = [
    { label: form.dept || '新部门', score: Math.min(100, Math.max(40, form.rate)) },
    ...distribution.value.slice(0, 4)
  ];
  showAssign.value = false;
  showScore.value = true;
  form.name = '';
  form.role = '';
  form.dept = '';
  form.course = '';
  form.rate = 50;
  form.score = 'B';
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
