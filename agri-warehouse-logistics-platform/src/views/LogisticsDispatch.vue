<template>
  <div class="page">
    <div class="grid two">
      <div class="card">
        <div class="section-title">运输线路态势</div>
        <div class="hero-image">干线与支线运力图</div>
      </div>
      <div class="card">
        <div class="section-title">车辆载重利用率</div>
        <div class="chart-bars">
          <div v-for="bar in chartData" :key="bar.name" class="bar" :style="{ height: bar.value + '%' }">
            {{ bar.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">运输任务列表</div>
      <table class="table">
        <thead>
          <tr>
            <th>任务编号</th>
            <th>线路</th>
            <th>司机</th>
            <th>车辆</th>
            <th>发车时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.route }}</td>
            <td>{{ task.driver }}</td>
            <td>{{ task.truck }}</td>
            <td>{{ task.time }}</td>
            <td><span class="badge">{{ task.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-title">调度协同</div>
      <div class="grid three">
        <button class="primary-btn" @click="openForm">创建运输调度</button>
        <button class="ghost-btn" @click="openProgress">车辆装载进度</button>
        <button class="ghost-btn" @click="openInfo">路线提示</button>
      </div>
    </div>

    <BaseModal v-if="showForm" title="创建运输调度" @close="showForm = false">
      <div class="input-group">
        <label>线路</label>
        <input v-model="form.route" placeholder="如：南京-上海" />
      </div>
      <div class="input-group">
        <label>车辆</label>
        <input v-model="form.truck" placeholder="车牌号" />
      </div>
      <div class="input-group">
        <label>预计载重(吨)</label>
        <input v-model="form.load" placeholder="请输入载重" />
      </div>
      <div class="input-group">
        <label>协同仓库</label>
        <select v-model="form.coop">
          <option>华东一号仓</option>
          <option>华北二号仓</option>
          <option>华南冷链仓</option>
        </select>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showForm = false">取消</button>
        <button class="primary-btn" @click="submitForm">确认调度</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showProgress" title="车辆装载进度" @close="showProgress = false">
      <p>当前共有 8 辆车进入装载，已完成 65% 装载任务。</p>
      <div class="progress-bar" style="margin-top: 12px;">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showProgress = false">关闭</button>
        <button class="primary-btn" @click="boostProgress">刷新</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showInfo" title="路线提示" @close="showInfo = false">
      <p>沪昆高速部分路段施工，建议调整至平行省道以避免延迟。</p>
      <div class="actions">
        <button class="primary-btn" @click="showInfo = false">确认</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { name: '苏A', value: 75 },
  { name: '沪B', value: 68 },
  { name: '浙C', value: 82 },
  { name: '皖D', value: 60 },
  { name: '鲁E', value: 72 },
  { name: '粤F', value: 90 }
];

const tasks = [
  { id: 'DL-2401', route: '南京-上海', driver: '何伟', truck: '苏A-8293', time: '08:30', status: '运输中' },
  { id: 'DL-2402', route: '合肥-杭州', driver: '张凯', truck: '皖D-4401', time: '09:10', status: '待装载' },
  { id: 'DL-2403', route: '郑州-广州', driver: '周翔', truck: '豫A-7790', time: '09:45', status: '运输中' },
  { id: 'DL-2404', route: '济南-青岛', driver: '李鹏', truck: '鲁E-5566', time: '10:10', status: '装载中' },
  { id: 'DL-2405', route: '成都-重庆', driver: '陈雷', truck: '川A-3333', time: '10:40', status: '待装载' },
  { id: 'DL-2406', route: '昆明-南宁', driver: '王博', truck: '云A-2211', time: '11:00', status: '运输中' },
  { id: 'DL-2407', route: '武汉-长沙', driver: '许洋', truck: '鄂A-9988', time: '11:20', status: '装载中' },
  { id: 'DL-2408', route: '西安-兰州', driver: '高健', truck: '陕A-8877', time: '11:40', status: '待装载' },
  { id: 'DL-2409', route: '南昌-福州', driver: '孙伟', truck: '赣A-2255', time: '12:00', status: '运输中' },
  { id: 'DL-2410', route: '沈阳-大连', driver: '赵军', truck: '辽A-6655', time: '12:30', status: '运输中' },
  { id: 'DL-2411', route: '贵阳-成都', driver: '李楠', truck: '贵A-5566', time: '13:00', status: '待装载' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(65);

const form = reactive({
  route: '',
  truck: '',
  load: '',
  coop: '华东一号仓'
});

const openForm = () => {
  showForm.value = true;
};

const openProgress = () => {
  showProgress.value = true;
};

const openInfo = () => {
  showInfo.value = true;
};

const submitForm = () => {
  showForm.value = false;
};

const boostProgress = () => {
  progress.value = Math.min(100, progress.value + 10);
};
</script>
