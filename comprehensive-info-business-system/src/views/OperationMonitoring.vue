<template>
  <div class="grid" style="gap: 16px;">
    <div class="card">
      <div class="flex-between" style="margin-bottom: 8px;">
        <div>
          <p class="section-title" style="margin: 0;">业务运行监控与分析</p>
          <p class="subtext">核心交易、接口与告警动态监控</p>
        </div>
        <div class="toolbar">
          <button class="primary-btn" @click="showAlertForm = true">新增告警</button>
          <button class="secondary-btn" @click="startHealthCheck">健康巡检</button>
          <button class="ghost-btn" @click="showMonitorTip = true">阈值说明</button>
        </div>
      </div>
      <SimpleBarChart
        title="关键指标监控"
        subtitle="单位：次/分钟"
        :data="chartData"
      />
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <p class="section-title" style="margin: 0;">实时运行列表</p>
        <span class="tag">{{ monitors.length }} 条记录</span>
      </div>
      <div class="table-wrapper" style="overflow: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>监控对象</th>
              <th>类型</th>
              <th>负责人</th>
              <th>当前值</th>
              <th>阈值</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in monitors" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.owner }}</td>
              <td>{{ item.value }}</td>
              <td>{{ item.threshold }}</td>
              <td><span :class="['status-chip', item.statusClass]">{{ item.status }}</span></td>
              <td><button class="secondary-btn" @click="openMonitor(item)">详情</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showAlertForm" title="新增告警策略" description="设置指标、阈值与通知对象">
    <form class="grid" style="gap: 12px;">
      <div>
        <label class="label">告警名称</label>
        <input class="input" v-model="alertForm.name" placeholder="如：支付超时率" />
      </div>
      <div class="grid grid-2">
        <div>
          <label class="label">监控对象</label>
          <input class="input" v-model="alertForm.target" placeholder="接口/交易/资源" />
        </div>
        <div>
          <label class="label">阈值</label>
          <input class="input" v-model="alertForm.threshold" placeholder="> 5%" />
        </div>
      </div>
      <div>
        <label class="label">通知渠道</label>
        <textarea class="input" rows="3" v-model="alertForm.channel" placeholder="邮件、短信、群机器人"></textarea>
      </div>
      <div class="flex-between" style="gap: 10px;">
        <span class="subtext">保存后立即启用并同步到监控列表</span>
        <div class="toolbar">
          <button class="ghost-btn" type="button" @click="showAlertForm = false">取消</button>
          <button class="primary-btn" type="button" @click="saveAlert">保存</button>
        </div>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showMonitorTip" title="阈值说明" description="帮助快速理解各指标阈值">
    <div class="grid grid-2">
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">接口指标</p>
        <p class="subtext">超时率 &lt; 1%、错误率 &lt; 0.5%、P99 时延 &lt; 800ms</p>
      </div>
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">资源指标</p>
        <p class="subtext">CPU &lt; 75%、内存 &lt; 80%、磁盘 &lt; 70%</p>
      </div>
    </div>
    <div style="margin-top: 12px; text-align: right;">
      <button class="primary-btn" @click="showMonitorTip = false">关闭说明</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showHealthProgress" title="健康巡检" description="巡检过程中请勿关闭窗口">
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${healthProgress}%` }"></div>
    </div>
    <p class="subtext" style="margin-top: 10px;">巡检完成度 {{ healthProgress }}%</p>
    <div style="text-align: right;">
      <button class="primary-btn" :disabled="healthProgress < 100" @click="showHealthProgress = false">完成</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showMonitorModal" :title="activeMonitor?.name || '监控详情'" description="查看并执行快捷操作">
    <p class="subtext">类型：{{ activeMonitor?.type }} · 阈值：{{ activeMonitor?.threshold }}</p>
    <div class="grid grid-2" style="margin: 10px 0;">
      <button class="secondary-btn" @click="muteMonitor">暂缓 30 分钟</button>
      <button class="ghost-btn" @click="showAlertForm = true">调整告警</button>
    </div>
    <p class="subtext">当前值 {{ activeMonitor?.value }}，责任人 {{ activeMonitor?.owner }}</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import SimpleBarChart from '../components/SimpleBarChart.vue';
import ModalDialog from '../components/ModalDialog.vue';

const chartData = [
  { label: '支付成功率', value: 98 },
  { label: '下单响应', value: 86 },
  { label: '接口成功率', value: 97 },
  { label: '服务可用性', value: 99 },
  { label: '告警恢复', value: 82 },
  { label: '缓存命中', value: 93 }
];

const monitors = ref([
  { name: '支付超时率', type: '交易', owner: '唐云', value: '0.8%', threshold: '1%', status: '正常', statusClass: 'status-active' },
  { name: '下单 P99 时延', type: '接口', owner: '许楠', value: '730ms', threshold: '800ms', status: '正常', statusClass: 'status-active' },
  { name: '库存同步延迟', type: '任务', owner: '曾华', value: '12s', threshold: '10s', status: '告警', statusClass: 'status-danger' },
  { name: '消息积压', type: 'MQ', owner: '黄莉', value: '4.3 万', threshold: '5 万', status: '正常', statusClass: 'status-active' },
  { name: '接口错误率', type: '接口', owner: '汪洋', value: '0.4%', threshold: '0.5%', status: '正常', statusClass: 'status-active' },
  { name: '节点 CPU', type: '资源', owner: '程威', value: '63%', threshold: '75%', status: '正常', statusClass: 'status-active' },
  { name: '磁盘容量', type: '资源', owner: '白鹭', value: '71%', threshold: '70%', status: '告警', statusClass: 'status-danger' },
  { name: '链路可用性', type: '网络', owner: '马腾', value: '99.4%', threshold: '98%', status: '正常', statusClass: 'status-active' },
  { name: '告警未关闭', type: '运营', owner: '陈媛', value: '12', threshold: '10', status: '待确认', statusClass: 'status-warning' },
  { name: '缓存命中率', type: '资源', owner: '刘梦', value: '92%', threshold: '90%', status: '正常', statusClass: 'status-active' },
  { name: '接口 TPS', type: '接口', owner: '孙祺', value: '3200', threshold: '4000', status: '正常', statusClass: 'status-active' }
]);

const showAlertForm = ref(false);
const showMonitorTip = ref(false);
const showHealthProgress = ref(false);
const healthProgress = ref(0);
const showMonitorModal = ref(false);
const activeMonitor = ref(null);
const alertForm = ref({ name: '', target: '', threshold: '', channel: '' });
let healthTimer;

function startHealthCheck() {
  healthProgress.value = 0;
  showHealthProgress.value = true;
  clearInterval(healthTimer);
  healthTimer = setInterval(() => {
    if (healthProgress.value < 100) {
      healthProgress.value += 15;
    } else {
      clearInterval(healthTimer);
    }
  }, 300);
}

function saveAlert() {
  monitors.value = [
    {
      name: alertForm.value.name || '新建告警',
      type: alertForm.value.target || '接口',
      owner: '未分配',
      value: '—',
      threshold: alertForm.value.threshold || '自定义',
      status: '待确认',
      statusClass: 'status-warning'
    },
    ...monitors.value
  ];
  showAlertForm.value = false;
  alertForm.value = { name: '', target: '', threshold: '', channel: '' };
}

function openMonitor(item) {
  activeMonitor.value = item;
  showMonitorModal.value = true;
}

function muteMonitor() {
  showMonitorModal.value = false;
  showMonitorTip.value = true;
}
</script>
