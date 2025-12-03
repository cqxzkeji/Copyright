<template>
  <div class="grid-layout">
    <div>
      <div class="flex-between">
        <h3>销售跟踪</h3>
        <div class="flex" style="gap: 8px;">
          <button class="btn" @click="showVisit = true">新增拜访</button>
          <button class="btn secondary" @click="showMilestone = true">阶段进度</button>
          <button class="btn secondary" @click="notify">发送跟进提醒</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>客户</th>
            <th>项目</th>
            <th>负责人</th>
            <th>金额(万)</th>
            <th>阶段</th>
            <th>下次动作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pipelines" :key="item.client">
            <td>{{ item.client }}</td>
            <td>{{ item.project }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.value }}</td>
            <td><span class="badge">{{ item.stage }}</span></td>
            <td>{{ item.next }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h4>周跟进成果</h4>
      <div class="chart">
        <div v-for="week in weekChart" :key="week.label" class="chart-bar" :style="{ height: week.value * 5 + 'px' }">
          <div>{{ week.value }}</div>
          <small>{{ week.label }}</small>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showVisit" class="overlay">
    <div class="modal">
      <header>
        <h3>新增拜访记录</h3>
        <button class="btn secondary" @click="showVisit = false">关闭</button>
      </header>
      <div class="form-grid">
        <label>客户<input v-model="visit.client" class="input" /></label>
        <label>联系人<input v-model="visit.contact" class="input" /></label>
        <label>诉求<input v-model="visit.request" class="input" /></label>
      </div>
      <footer>
        <button class="btn secondary" @click="showVisit = false">取消</button>
        <button class="btn" @click="saveVisit">保存</button>
      </footer>
    </div>
  </div>

  <div v-if="showMilestone" class="overlay">
    <div class="modal">
      <header>
        <h3>阶段进度</h3>
        <button class="btn secondary" @click="showMilestone = false">关闭</button>
      </header>
      <div v-for="milestone in milestones" :key="milestone.label" style="margin-bottom: 8px;">
        <div class="flex-between">
          <span>{{ milestone.label }}</span>
          <span class="badge">{{ milestone.percent }}%</span>
        </div>
        <div class="progress-bar">
          <span :style="{ width: milestone.percent + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

const pipelines = ref([
  { client: '港机集团', project: '起重主梁', owner: '陈亮', value: 320, stage: '样品确认', next: '发送终检报告' },
  { client: '海洋装备', project: '耐蚀支撑', owner: '李雯', value: 210, stage: '商务谈判', next: '确认付款节点' },
  { client: '深蓝能源', project: '高温管件', owner: '刘京', value: 410, stage: '技术评审', next: '补充焊接PQR' },
  { client: '北岳重工', project: '调质轴类', owner: '张林', value: 180, stage: '样品确认', next: '寄送二次样' },
  { client: '川西轨道', project: '车轴钢', owner: '高原', value: 270, stage: '投标', next: '报价与交期澄清' },
  { client: '华润机电', project: '齿轮坯', owner: '王毅', value: 230, stage: '商务谈判', next: '对齐付款条款' },
  { client: '龙盛模具', project: '热作模具钢', owner: '李强', value: 150, stage: '样品确认', next: '安排现场验证' },
  { client: '恒力石化', project: '不锈耐蚀钢', owner: '丁楠', value: 360, stage: '技术评审', next: '补充腐蚀数据' },
  { client: '风电创新', project: '主轴钢', owner: '李然', value: 460, stage: '投标', next: '递交标书' },
  { client: '云谷精密', project: '轴承钢', owner: '陈晨', value: 190, stage: '样品确认', next: '更新热处理窗口' },
  { client: '齐鲁港口', project: '耐磨衬板', owner: '张旭', value: 205, stage: '商务谈判', next: '确认付款比例' }
]);

const visit = reactive({ client: '', contact: '', request: '' });
const showVisit = ref(false);
const showMilestone = ref(false);

const milestones = [
  { label: '需求挖掘', percent: 90 },
  { label: '价值证明', percent: 70 },
  { label: '商务条款', percent: 55 },
  { label: '样品转量产', percent: 35 }
];

const weekChart = computed(() =>
  ['周一', '周二', '周三', '周四', '周五'].map((day, idx) => ({
    label: day,
    value: 6 + idx * 2
  }))
);

const saveVisit = () => {
  if (!visit.client || !visit.contact) {
    alert('请填写客户与联系人');
    return;
  }
  pipelines.value = [
    {
      client: visit.client,
      project: '回访需求',
      owner: '销售团队',
      value: 80,
      stage: '需求确认',
      next: visit.request || '确认样品计划'
    },
    ...pipelines.value
  ];
  showVisit.value = false;
};

const notify = () => {
  alert('已向项目组发送跟进提醒并同步到周报。');
};
</script>
