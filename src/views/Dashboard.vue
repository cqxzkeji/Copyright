<template>
  <section class="grid-2">
    <div class="card">
      <div class="section-title">设备运行概况</div>
      <div class="grid-2">
        <div>
          <p>在线设备</p>
          <strong>128 台</strong>
        </div>
        <div>
          <p>今日巡检</p>
          <strong>36 次</strong>
        </div>
        <div>
          <p>异常告警</p>
          <strong>6 条</strong>
        </div>
        <div>
          <p>待处理工单</p>
          <strong>12 单</strong>
        </div>
      </div>
      <div class="button-row">
        <button class="btn" @click="openModal('report')">生成运行日报</button>
        <button class="btn secondary" @click="openModal('sync')">同步平台数据</button>
        <button class="btn secondary" @click="openModal('tips')">值班提示</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">运行健康趋势</div>
      <div class="chart">
        <div
          v-for="(item, index) in trendData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: `${item.value}%`, opacity: 0.5 + index * 0.04 }"
        ></div>
      </div>
      <p style="margin-top: 12px; color: #607088">健康度近7日保持稳定，重点设备在线率 98%。</p>
    </div>
  </section>

  <section class="card" style="margin-top: 18px;">
    <div class="section-title">今日运行明细</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>设备名称</th>
          <th>位置</th>
          <th>运行时长</th>
          <th>状态</th>
          <th>值班人员</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.runtime }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
          <td>{{ item.owner }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal :show="modal.type === 'report'" title="生成运行日报" @close="closeModal">
    <div class="form-grid">
      <div>
        <label>报告日期</label>
        <input v-model="reportForm.date" type="date" />
      </div>
      <div>
        <label>覆盖区域</label>
        <select v-model="reportForm.area">
          <option>全部园区</option>
          <option>东区机房</option>
          <option>西区仓库</option>
          <option>地库设备间</option>
        </select>
      </div>
      <div>
        <label>补充说明</label>
        <textarea v-model="reportForm.note" rows="3" placeholder="填写运行情况说明"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn secondary" @click="closeModal">取消</button>
      <button class="btn" @click="submitReport">确认生成</button>
    </template>
  </BaseModal>

  <BaseModal :show="modal.type === 'sync'" title="同步平台数据" @close="closeModal">
    <p>正在同步消防设备监控平台数据，请稍候。</p>
    <div style="margin-top: 16px;">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <p style="margin-top: 8px;">已完成 {{ progress }}%</p>
    </div>
  </BaseModal>

  <BaseModal :show="modal.type === 'tips'" title="值班提示" @close="closeModal">
    <ul style="line-height: 1.8; color: #51647a; padding-left: 18px;">
      <li>上午 10:00 请对喷淋泵房执行巡检。</li>
      <li>高压灭火系统维保将在 16:00 进行。</li>
      <li>请重点关注 3 号楼配电间温升异常。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, onUnmounted } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `消防设备-${index + 1}`,
  location: ['东区机房', '西区仓库', '地下泵房', '3号楼', '地库设备间'][index % 5],
  runtime: `${6 + (index % 7)} 小时`,
  status: index % 4 === 0 ? '维护中' : '运行正常',
  owner: ['张伟', '李娜', '王强', '赵敏'][index % 4]
}));

const trendData = [
  { label: '周一', value: 62 },
  { label: '周二', value: 70 },
  { label: '周三', value: 75 },
  { label: '周四', value: 68 },
  { label: '周五', value: 78 },
  { label: '周六', value: 72 },
  { label: '周日', value: 80 }
];

const modal = reactive({ type: '' });
const progress = ref(0);
let timer;

const reportForm = reactive({
  date: new Date().toISOString().slice(0, 10),
  area: '全部园区',
  note: ''
});

const openModal = (type) => {
  modal.type = type;
  if (type === 'sync') {
    progress.value = 10;
    timer = setInterval(() => {
      progress.value = Math.min(100, progress.value + 10);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 400);
  }
};

const closeModal = () => {
  modal.type = '';
  if (timer) {
    clearInterval(timer);
  }
};

const submitReport = () => {
  modal.type = 'tips';
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
