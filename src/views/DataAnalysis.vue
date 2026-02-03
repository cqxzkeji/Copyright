<template>
  <section class="grid-2">
    <div class="card">
      <div class="section-title">历史数据查询</div>
      <div class="form-grid">
        <div>
          <label>设备类型</label>
          <select v-model="queryForm.type">
            <option>消防泵</option>
            <option>喷淋系统</option>
            <option>灭火器</option>
            <option>烟感探测器</option>
          </select>
        </div>
        <div>
          <label>时间范围</label>
          <input v-model="queryForm.range" type="week" />
        </div>
      </div>
      <div class="button-row">
        <button class="btn" @click="openModal('search')">执行查询</button>
        <button class="btn secondary" @click="openModal('export')">导出分析报表</button>
        <button class="btn secondary" @click="openModal('progress')">数据清洗进度</button>
        <button class="btn secondary" @click="openModal('tips')">分析建议</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">运行趋势分析</div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: `${item.value}%` }"
        ></div>
      </div>
      <p style="margin-top: 12px; color: #607088">近三周设备运行波动下降，稳定性提升。</p>
    </div>
  </section>

  <section class="card" style="margin-top: 18px;">
    <div class="section-title">历史运行数据</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>日期</th>
          <th>设备类型</th>
          <th>平均运行时长</th>
          <th>异常次数</th>
          <th>趋势</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.runtime }}</td>
          <td>{{ item.alerts }}</td>
          <td><span class="status-pill">{{ item.trend }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal :show="modal.type === 'search'" title="执行查询" @close="closeModal">
    <p>已根据 {{ queryForm.type }} 与时间范围执行查询，结果已更新。</p>
  </BaseModal>

  <BaseModal :show="modal.type === 'export'" title="导出分析报表" @close="closeModal">
    <div class="form-grid">
      <div>
        <label>报表格式</label>
        <select v-model="exportForm.format">
          <option>PDF</option>
          <option>Excel</option>
          <option>图片摘要</option>
        </select>
      </div>
      <div>
        <label>包含内容</label>
        <select v-model="exportForm.section">
          <option>趋势图 + 运行表</option>
          <option>仅趋势分析</option>
          <option>仅异常记录</option>
        </select>
      </div>
      <div>
        <label>接收人</label>
        <input v-model="exportForm.receiver" placeholder="填写邮箱或账号" />
      </div>
    </div>
    <template #footer>
      <button class="btn secondary" @click="closeModal">取消</button>
      <button class="btn" @click="submitExport">确认导出</button>
    </template>
  </BaseModal>

  <BaseModal :show="modal.type === 'progress'" title="数据清洗进度" @close="closeModal">
    <p>正在进行历史数据清洗。</p>
    <div style="margin-top: 16px;">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <p style="margin-top: 8px;">完成度 {{ progress }}%</p>
    </div>
  </BaseModal>

  <BaseModal :show="modal.type === 'tips'" title="分析建议" @close="closeModal">
    <ul style="line-height: 1.8; color: #51647a; padding-left: 18px;">
      <li>建议在雨季提升喷淋系统巡检频次。</li>
      <li>烟感探测器连续误报设备建议更换。</li>
      <li>运行时长高的消防泵需加强润滑检查。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, onUnmounted } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  date: `2024-04-${String((index % 28) + 1).padStart(2, '0')}`,
  type: ['消防泵', '喷淋系统', '灭火器', '烟感探测器'][index % 4],
  runtime: `${4 + (index % 6)} 小时`,
  alerts: `${index % 5} 次`,
  trend: index % 3 === 0 ? '下降' : '平稳'
}));

const chartData = [
  { label: '第1周', value: 70 },
  { label: '第2周', value: 60 },
  { label: '第3周', value: 65 },
  { label: '第4周', value: 75 }
];

const modal = reactive({ type: '' });
const progress = ref(0);
let timer;

const queryForm = reactive({
  type: '消防泵',
  range: ''
});

const exportForm = reactive({
  format: 'PDF',
  section: '趋势图 + 运行表',
  receiver: ''
});

const openModal = (type) => {
  modal.type = type;
  if (type === 'progress') {
    progress.value = 10;
    timer = setInterval(() => {
      progress.value = Math.min(100, progress.value + 15);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 360);
  }
};

const closeModal = () => {
  modal.type = '';
  if (timer) {
    clearInterval(timer);
  }
};

const submitExport = () => {
  modal.type = 'tips';
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
