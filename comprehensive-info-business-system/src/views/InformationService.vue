<template>
  <div class="grid" style="gap: 16px;">
    <div class="card">
      <div class="flex-between" style="margin-bottom: 8px;">
        <div>
          <p class="section-title" style="margin: 0;">信息服务与智能支撑</p>
          <p class="subtext">API、知识库与智能问答统一管理</p>
        </div>
        <div class="toolbar">
          <button class="primary-btn" @click="showApiForm = true">注册接口</button>
          <button class="secondary-btn" @click="startPublish">发布版本</button>
          <button class="ghost-btn" @click="showServiceTip = true">使用提示</button>
        </div>
      </div>
      <SimpleBarChart
        title="接口调用量"
        subtitle="近七日调用趋势"
        :data="chartData"
      />
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <p class="section-title" style="margin: 0;">服务清单</p>
        <span class="tag">共 {{ services.length }} 项</span>
      </div>
      <div class="table-wrapper" style="overflow: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>服务名称</th>
              <th>类型</th>
              <th>负责人</th>
              <th>调用量</th>
              <th>状态</th>
              <th>SLA</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.name">
              <td>{{ service.name }}</td>
              <td>{{ service.type }}</td>
              <td>{{ service.owner }}</td>
              <td>{{ service.calls }}</td>
              <td><span :class="['status-chip', service.statusClass]">{{ service.status }}</span></td>
              <td>{{ service.sla }}</td>
              <td><button class="secondary-btn" @click="openService(service)">操作</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showApiForm" title="注册接口" description="录入接口基础信息与能力">
    <form class="grid" style="gap: 12px;">
      <div>
        <label class="label">接口名称</label>
        <input class="input" v-model="apiForm.name" placeholder="如：知识检索" />
      </div>
      <div class="grid grid-2">
        <div>
          <label class="label">协议</label>
          <select class="input" v-model="apiForm.protocol">
            <option>HTTPS</option>
            <option>HTTP</option>
            <option>GRPC</option>
          </select>
        </div>
        <div>
          <label class="label">QPS 上限</label>
          <input class="input" v-model="apiForm.qps" placeholder="500" />
        </div>
      </div>
      <div>
        <label class="label">描述</label>
        <textarea class="input" rows="3" v-model="apiForm.desc" placeholder="功能描述与使用示例"></textarea>
      </div>
      <div class="flex-between" style="gap: 10px;">
        <span class="subtext">保存后将进入灰度发布</span>
        <div class="toolbar">
          <button class="ghost-btn" type="button" @click="showApiForm = false">取消</button>
          <button class="primary-btn" type="button" @click="saveApi">保存</button>
        </div>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showServiceTip" title="服务提示" description="常用能力快速上手">
    <p class="subtext" style="margin: 0 0 8px 0;">开放的接口支持多种鉴权方式，请选择合适的授权策略。</p>
    <div class="grid grid-2">
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">智能问答</p>
        <p class="subtext">连接知识库后可提供自然语言检索与摘要。</p>
      </div>
      <div class="card" style="box-shadow: none; border-style: dashed;">
        <p class="section-title" style="margin: 0 0 6px 0;">文件解析</p>
        <p class="subtext">支持 PDF/Word/Excel 解析，返回结构化字段。</p>
      </div>
    </div>
    <div style="text-align: right; margin-top: 12px;">
      <button class="primary-btn" @click="showServiceTip = false">关闭</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showPublishProgress" title="发布中" description="发布期间调用保持不中断">
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${publishProgress}%` }"></div>
    </div>
    <p class="subtext" style="margin-top: 10px;">发布进度 {{ publishProgress }}%</p>
    <div style="text-align: right;">
      <button class="primary-btn" :disabled="publishProgress < 100" @click="showPublishProgress = false">完成</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showServiceModal" :title="activeService?.name || '服务详情'" description="执行服务级操作">
    <p class="subtext">类型：{{ activeService?.type }} · SLA：{{ activeService?.sla }}</p>
    <div class="grid grid-2" style="margin: 10px 0;">
      <button class="secondary-btn" @click="toggleServiceState">启停控制</button>
      <button class="ghost-btn" @click="showApiForm = true">编辑配置</button>
    </div>
    <p class="subtext">调用量 {{ activeService?.calls }}，负责人 {{ activeService?.owner }}</p>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import SimpleBarChart from '../components/SimpleBarChart.vue';
import ModalDialog from '../components/ModalDialog.vue';

const chartData = [
  { label: '知识检索', value: 6200 },
  { label: '智能问答', value: 5400 },
  { label: '文件解析', value: 4600 },
  { label: '指标查询', value: 3900 },
  { label: '工单查询', value: 3500 },
  { label: '通知推送', value: 2800 }
];

const services = ref([
  { name: '知识检索', type: 'API', owner: '李倩', calls: '1.2M', status: '运行中', statusClass: 'status-active', sla: '99.95%' },
  { name: '智能问答', type: 'AI', owner: '周航', calls: '980K', status: '运行中', statusClass: 'status-active', sla: '99.9%' },
  { name: '文件解析', type: 'API', owner: '陈飞', calls: '820K', status: '运行中', statusClass: 'status-active', sla: '99.9%' },
  { name: '指标查询', type: 'API', owner: '刘畅', calls: '760K', status: '待确认', statusClass: 'status-warning', sla: '99.8%' },
  { name: '工单查询', type: 'API', owner: '王一', calls: '540K', status: '运行中', statusClass: 'status-active', sla: '99.9%' },
  { name: '消息推送', type: 'MQ', owner: '钱越', calls: '480K', status: '运行中', statusClass: 'status-active', sla: '99.7%' },
  { name: '短信发送', type: 'API', owner: '孙悦', calls: '1.8M', status: '异常', statusClass: 'status-danger', sla: '99.5%' },
  { name: '知识训练', type: 'AI', owner: '曹磊', calls: '210K', status: '运行中', statusClass: 'status-active', sla: '99.6%' },
  { name: '文档摘要', type: 'AI', owner: '赵川', calls: '320K', status: '运行中', statusClass: 'status-active', sla: '99.7%' },
  { name: '接口聚合', type: 'API', owner: '宋颖', calls: '270K', status: '待确认', statusClass: 'status-warning', sla: '99.5%' },
  { name: '通知推送', type: 'MQ', owner: '林琪', calls: '430K', status: '运行中', statusClass: 'status-active', sla: '99.8%' }
]);

const showApiForm = ref(false);
const showServiceTip = ref(false);
const showPublishProgress = ref(false);
const publishProgress = ref(0);
const showServiceModal = ref(false);
const activeService = ref(null);
const apiForm = ref({ name: '', protocol: 'HTTPS', qps: '500', desc: '' });
let publishTimer;

function startPublish() {
  publishProgress.value = 0;
  showPublishProgress.value = true;
  clearInterval(publishTimer);
  publishTimer = setInterval(() => {
    if (publishProgress.value < 100) {
      publishProgress.value += 14;
    } else {
      clearInterval(publishTimer);
    }
  }, 240);
}

function saveApi() {
  services.value = [
    {
      name: apiForm.value.name || '新接口',
      type: 'API',
      owner: '未分配',
      calls: '—',
      status: '待确认',
      statusClass: 'status-warning',
      sla: '99.0%'
    },
    ...services.value
  ];
  showApiForm.value = false;
  apiForm.value = { name: '', protocol: 'HTTPS', qps: '500', desc: '' };
}

function openService(service) {
  activeService.value = service;
  showServiceModal.value = true;
}

function toggleServiceState() {
  if (activeService.value) {
    activeService.value.status = activeService.value.status === '运行中' ? '暂停' : '运行中';
    activeService.value.statusClass = activeService.value.status === '运行中' ? 'status-active' : 'status-warning';
  }
  showServiceModal.value = false;
}
</script>
