<template>
  <div class="grid" style="gap: 16px;">
    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <div>
          <p class="section-title" style="margin: 0;">综合信息采集与管理</p>
          <p class="subtext">采集任务、质量、入库状态全景展示</p>
        </div>
        <div class="toolbar">
          <button class="primary-btn" @click="showCreateForm = true">新增采集任务</button>
          <button class="secondary-btn" @click="startImportProgress">批量导入</button>
          <button class="ghost-btn" @click="showReminder = true">采集提醒</button>
        </div>
      </div>
      <SimpleBarChart
        title="采集完成度"
        subtitle="近一周数据入湖完成度"
        :data="chartData"
      />
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <p class="section-title" style="margin: 0;">采集任务列表</p>
        <span class="tag">共 {{ records.length }} 条</span>
      </div>
      <div class="table-wrapper" style="overflow: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>任务名称</th>
              <th>渠道</th>
              <th>负责人</th>
              <th>数据量</th>
              <th>质量指数</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in records" :key="row.name">
              <td>{{ row.name }}</td>
              <td>{{ row.channel }}</td>
              <td>{{ row.owner }}</td>
              <td>{{ row.volume }}</td>
              <td>{{ row.score }} 分</td>
              <td>
                <span :class="['status-chip', row.statusClass]">{{ row.status }}</span>
              </td>
              <td>
                <button class="secondary-btn" @click="openRowAction(row)">操作</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showCreateForm" title="创建采集任务" description="收集元数据、来源和调度周期">
    <form class="grid" style="gap: 12px;">
      <div>
        <label class="label">任务名称</label>
        <input class="input" v-model="form.name" placeholder="如：渠道日志采集" />
      </div>
      <div class="grid grid-2">
        <div>
          <label class="label">来源渠道</label>
          <input class="input" v-model="form.channel" placeholder="API / FTP / MQ" />
        </div>
        <div>
          <label class="label">调度频率</label>
          <select class="input" v-model="form.frequency">
            <option>每小时</option>
            <option>每日</option>
            <option>每周</option>
          </select>
        </div>
      </div>
      <div>
        <label class="label">备注</label>
        <textarea class="input" rows="3" v-model="form.remark" placeholder="填写字段校验、告警等要求"></textarea>
      </div>
      <div class="flex-between" style="gap: 10px;">
        <span class="subtext">保存后将进入待审核列表</span>
        <div class="toolbar">
          <button class="ghost-btn" type="button" @click="showCreateForm = false">取消</button>
          <button class="primary-btn" type="button" @click="submitForm">保存</button>
        </div>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showReminder" title="采集提醒" description="确保高峰时段带宽可用">
    <p class="subtext" style="margin: 0 0 12px 0;">本次提醒会发送至所有采集负责人与值班群。</p>
    <div class="grid grid-2">
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">提醒模板</p>
        <p class="subtext">高峰期 18:00-21:00 请提前完成高频采集任务，避免阻塞。</p>
      </div>
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">发送范围</p>
        <p class="subtext">数采团队、渠道团队、夜间巡检值班人员</p>
      </div>
    </div>
    <div style="text-align: right; margin-top: 12px;">
      <button class="primary-btn" @click="showReminder = false">发送提醒</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showRowModal" :title="activeRow?.name || '任务详情'" description="对单条任务执行快速操作">
    <p class="subtext">渠道：{{ activeRow?.channel }} · 负责人：{{ activeRow?.owner }}</p>
    <div class="grid grid-2" style="margin: 10px 0;">
      <button class="secondary-btn" @click="simulateSync">立即同步</button>
      <button class="ghost-btn" @click="openQualityCheck">质量检测</button>
    </div>
    <p class="subtext">数据量：{{ activeRow?.volume }} · 质量指数：{{ activeRow?.score }} 分</p>
  </ModalDialog>

  <ModalDialog v-model="showProgress" title="批量导入" description="实时查看导入进度">
    <div class="progress-track" aria-label="进度条">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p class="subtext" style="margin-top: 10px;">当前进度：{{ progress }}%</p>
    <div style="text-align: right;">
      <button class="primary-btn" :disabled="progress < 100" @click="showProgress = false">完成</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import SimpleBarChart from '../components/SimpleBarChart.vue';
import ModalDialog from '../components/ModalDialog.vue';

const chartData = [
  { label: '政务数据', value: 86 },
  { label: '渠道日志', value: 78 },
  { label: '客户反馈', value: 92 },
  { label: '物联网', value: 74 },
  { label: '接口采集', value: 88 },
  { label: '公共库', value: 95 }
];

const records = ref([
  { name: '渠道日志-晚高峰', channel: 'API', owner: '张敏', volume: '1.2 亿', score: 91, status: '运行中', statusClass: 'status-active' },
  { name: '政务公开-周同步', channel: 'HTTP', owner: '刘伟', volume: '1800 万', score: 88, status: '运行中', statusClass: 'status-active' },
  { name: '客户反馈-增量', channel: 'MQ', owner: '王旭', volume: '960 万', score: 83, status: '待确认', statusClass: 'status-warning' },
  { name: '物联网-设备日志', channel: 'MQ', owner: '陈静', volume: '2.1 亿', score: 79, status: '运行中', statusClass: 'status-active' },
  { name: '外部接口-夜间', channel: 'API', owner: '李磊', volume: '5400 万', score: 77, status: '异常', statusClass: 'status-danger' },
  { name: '公共数据-高教', channel: 'FTP', owner: '赵云', volume: '730 万', score: 90, status: '运行中', statusClass: 'status-active' },
  { name: '环境监测-空气', channel: 'API', owner: '周林', volume: '3200 万', score: 85, status: '运行中', statusClass: 'status-active' },
  { name: '气象-分钟级', channel: 'MQ', owner: '韩玥', volume: '1.6 亿', score: 82, status: '运行中', statusClass: 'status-active' },
  { name: '客服对话-质检', channel: 'API', owner: '郑爽', volume: '4100 万', score: 80, status: '待确认', statusClass: 'status-warning' },
  { name: '地理信息-每日', channel: 'HTTP', owner: '谢楠', volume: '2400 万', score: 87, status: '运行中', statusClass: 'status-active' },
  { name: '移动端埋点', channel: 'SDK', owner: '郭瑞', volume: '3.4 亿', score: 89, status: '运行中', statusClass: 'status-active' }
]);

const showCreateForm = ref(false);
const showReminder = ref(false);
const showProgress = ref(false);
const showRowModal = ref(false);
const activeRow = ref(null);
const form = ref({ name: '', channel: '', frequency: '每日', remark: '' });
const progress = ref(0);
let progressTimer;

function startImportProgress() {
  progress.value = 0;
  showProgress.value = true;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 10;
    } else {
      clearInterval(progressTimer);
    }
  }, 250);
}

function submitForm() {
  records.value = [
    { name: form.value.name || '新建采集任务', channel: form.value.channel || 'API', owner: '未分配', volume: '—', score: 80, status: '待确认', statusClass: 'status-warning' },
    ...records.value
  ];
  showCreateForm.value = false;
  form.value = { name: '', channel: '', frequency: '每日', remark: '' };
}

function openRowAction(row) {
  activeRow.value = row;
  showRowModal.value = true;
}

function simulateSync() {
  startImportProgress();
  showRowModal.value = false;
}

function openQualityCheck() {
  showRowModal.value = false;
  showReminder.value = true;
}
</script>
