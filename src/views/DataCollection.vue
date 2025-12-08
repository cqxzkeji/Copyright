<template>
  <div class="grid" style="gap:16px">
    <div class="flex-between card" style="flex-wrap:wrap">
      <div>
        <div style="font-weight:700">数据采集与分析</div>
        <p style="margin:4px 0;color:var(--muted)">采集设备、问卷与指标分析统一管理。</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="button" @click="openCollector">新增采集任务</button>
        <button class="button secondary" @click="openProgress">导出报表</button>
        <button class="button secondary" @click="openHint('已推送采集提醒')">推送提醒</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:2fr 1fr;gap:16px">
      <div class="card">
        <div class="flex-between">
          <strong>指标总览</strong>
          <button class="button secondary" @click="openHint('指标刷新完成')">刷新</button>
        </div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin-top:12px">
          <div v-for="metric in metrics" :key="metric.name" class="card" style="box-shadow:none;border:1px dashed var(--border)">
            <div class="flex-between">
              <span style="font-weight:700">{{ metric.name }}</span>
              <span class="badge info">{{ metric.value }}</span>
            </div>
            <p style="margin:6px 0;color:var(--muted)">{{ metric.desc }}</p>
            <div class="progress">
              <div class="progress-bar" :style="{ width: metric.rate + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <strong>日采集量折线</strong>
          <button class="button secondary" @click="openHint('导入传感器成功')">导入传感器</button>
        </div>
        <svg viewBox="0 0 260 160" style="width:100%;margin-top:12px">
          <polyline fill="none" stroke="#1e88e5" stroke-width="4" :points="linePoints" stroke-linejoin="round" />
          <circle v-for="(p,index) in chart" :key="index" :cx="p.x" :cy="p.y" r="5" fill="#ffca28" />
        </svg>
      </div>
    </div>

    <div class="card">
      <div class="flex-between">
        <strong>采集记录</strong>
        <button class="button secondary" @click="openHint('已提交清洗任务')">清洗任务</button>
      </div>
      <table class="table" style="margin-top:10px">
        <thead>
          <tr>
            <th>日期</th>
            <th>来源</th>
            <th>采集量</th>
            <th>异常</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in records" :key="row.date + row.source">
            <td>{{ row.date }}</td>
            <td>{{ row.source }}</td>
            <td>{{ row.count }}</td>
            <td><span class="badge" :class="row.abnormal ? 'warning' : 'success'">{{ row.abnormal ? '有' : '无' }}</span></td>
            <td style="display:flex;gap:8px">
              <button class="button secondary" @click="openCollector(row)">编辑</button>
              <button class="button secondary" @click="openHint(`已回滚 ${row.source}`)">回滚</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :show="modal.collector" title="采集任务" @close="modal.collector=false">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label>来源</label>
          <input v-model="collectorForm.source" class="input" />
        </div>
        <div>
          <label>日期</label>
          <input v-model="collectorForm.date" class="input" />
        </div>
        <div>
          <label>数量</label>
          <input v-model.number="collectorForm.count" type="number" class="input" />
        </div>
        <div>
          <label>是否异常</label>
          <select v-model="collectorForm.abnormal" class="select">
            <option :value="false">否</option>
            <option :value="true">是</option>
          </select>
        </div>
      </div>
      <template #actions>
        <button class="button secondary" @click="modal.collector=false">取消</button>
        <button class="button" @click="saveCollector">保存</button>
      </template>
    </ModalDialog>

    <ModalDialog :show="modal.progress" title="导出进度" @close="modal.progress=false">
      <p>正在导出周报，请勿关闭窗口。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: exportProgress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog :show="modal.hint" title="提示" @close="modal.hint=false">
      <p style="margin:0">{{ hintText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const metrics = [
  { name: '场景采集', value: '1.2w', desc: '无人机、三脚架影像', rate: 80 },
  { name: '问卷回收', value: '864', desc: '体验反馈、满意度', rate: 60 },
  { name: '物联传感', value: '3120', desc: '温湿度、客流', rate: 72 },
  { name: '人工抽检', value: '142', desc: '现场校准', rate: 40 }
];

const chart = ref([
  { x: 20, y: 120 },
  { x: 60, y: 100 },
  { x: 100, y: 90 },
  { x: 140, y: 110 },
  { x: 180, y: 70 },
  { x: 220, y: 80 }
]);

const linePoints = computed(() => chart.value.map((p) => `${p.x},${p.y}`).join(' '));

const records = ref([
  { date: '6-01', source: '无人机航拍', count: 320, abnormal: false },
  { date: '6-02', source: '环境传感', count: 280, abnormal: false },
  { date: '6-03', source: '学员问卷', count: 120, abnormal: true },
  { date: '6-04', source: '夜景拍摄', count: 260, abnormal: false },
  { date: '6-05', source: '实地访谈', count: 90, abnormal: false },
  { date: '6-06', source: '场地噪声', count: 180, abnormal: true },
  { date: '6-07', source: '游客流量', count: 340, abnormal: false },
  { date: '6-08', source: '河道水质', count: 210, abnormal: false },
  { date: '6-09', source: '夜间人流', count: 190, abnormal: false },
  { date: '6-10', source: '智慧灯杆', count: 260, abnormal: false }
]);

const modal = reactive({ collector: false, progress: false, hint: false });
const collectorForm = reactive({ source: '', date: '', count: 200, abnormal: false });
const exportProgress = ref(12);
const hintText = ref('');

const openCollector = (row) => {
  if (row) Object.assign(collectorForm, row);
  else Object.assign(collectorForm, { source: '巡检补录', date: '6-11', count: 180, abnormal: false });
  modal.collector = true;
};

const saveCollector = () => {
  const index = records.value.findIndex((r) => r.date === collectorForm.date && r.source === collectorForm.source);
  if (index >= 0) records.value[index] = { ...collectorForm };
  else records.value.push({ ...collectorForm });
  modal.collector = false;
  openHint('采集记录已保存');
};

const openProgress = () => {
  modal.progress = true;
  exportProgress.value = 12;
  const timer = setInterval(() => {
    exportProgress.value += 20;
    if (exportProgress.value >= 100) {
      exportProgress.value = 100;
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
