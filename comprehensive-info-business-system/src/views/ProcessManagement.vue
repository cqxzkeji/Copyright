<template>
  <div class="grid" style="gap: 16px;">
    <div class="card">
      <div class="flex-between" style="margin-bottom: 8px;">
        <div>
          <p class="section-title" style="margin: 0;">业务流程管理与协同</p>
          <p class="subtext">流程准入、审批、协同状态一览</p>
        </div>
        <div class="toolbar">
          <button class="primary-btn" @click="showFlowForm = true">新建流程</button>
          <button class="secondary-btn" @click="startFlowDeploy">部署流程</button>
          <button class="ghost-btn" @click="showFlowTip = true">操作提示</button>
        </div>
      </div>
      <SimpleBarChart
        title="流程协同效率"
        subtitle="节点平均耗时（分钟）"
        :data="chartData"
      />
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px;">
        <p class="section-title" style="margin: 0;">流程任务队列</p>
        <span class="tag">{{ flows.length }} 个运行中流程</span>
      </div>
      <div class="table-wrapper" style="overflow: auto;">
        <table class="table">
          <thead>
            <tr>
              <th>流程名称</th>
              <th>发起部门</th>
              <th>当前节点</th>
              <th>负责人</th>
              <th>耗时</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in flows" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.department }}</td>
              <td>{{ item.stage }}</td>
              <td>{{ item.owner }}</td>
              <td>{{ item.duration }}</td>
              <td><span :class="['status-chip', item.statusClass]">{{ item.status }}</span></td>
              <td><button class="secondary-btn" @click="openFlow(item)">处理</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showFlowForm" title="创建业务流程" description="配置触发条件与节点责任人">
    <form class="grid" style="gap: 12px;">
      <div>
        <label class="label">流程名称</label>
        <input class="input" v-model="flowForm.name" placeholder="如：合同审批" />
      </div>
      <div class="grid grid-2">
        <div>
          <label class="label">发起部门</label>
          <input class="input" v-model="flowForm.department" placeholder="市场部 / 技术部" />
        </div>
        <div>
          <label class="label">优先级</label>
          <select class="input" v-model="flowForm.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </div>
      </div>
      <div>
        <label class="label">节点与责任人</label>
        <textarea class="input" rows="3" v-model="flowForm.nodes" placeholder="设计->评审->审批->归档"></textarea>
      </div>
      <div class="flex-between" style="gap: 10px;">
        <span class="subtext">创建后将同步到协同看板</span>
        <div class="toolbar">
          <button class="ghost-btn" type="button" @click="showFlowForm = false">取消</button>
          <button class="primary-btn" type="button" @click="saveFlow">保存</button>
        </div>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog v-model="showFlowTip" title="协同提示" description="常见操作指引">
    <ul class="subtext" style="margin: 0; line-height: 1.6;">
      <li>部署前请确认节点角色与通知人完整。</li>
      <li>跨部门流程可启用抄送与跟踪提醒。</li>
      <li>流程长时间未流转会自动推送催办。</li>
    </ul>
    <div style="text-align: right; margin-top: 12px;">
      <button class="primary-btn" @click="showFlowTip = false">关闭提示</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showFlowProgress" title="部署中" description="实时查看流程部署进度">
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${flowProgress}%` }"></div>
    </div>
    <p class="subtext" style="margin-top: 10px;">完成度 {{ flowProgress }}%</p>
    <div style="text-align: right;">
      <button class="primary-btn" :disabled="flowProgress < 100" @click="showFlowProgress = false">完成</button>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showFlowModal" :title="selectedFlow?.name || '流程详情'" description="处理当前环节">
    <p class="subtext">当前节点：{{ selectedFlow?.stage }} · 责任人：{{ selectedFlow?.owner }}</p>
    <div class="grid grid-2" style="margin: 10px 0;">
      <button class="secondary-btn" @click="approveFlow">通过</button>
      <button class="ghost-btn" @click="rejectFlow">驳回</button>
    </div>
    <textarea class="input" rows="3" v-model="actionComment" placeholder="备注操作原因"></textarea>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import SimpleBarChart from '../components/SimpleBarChart.vue';
import ModalDialog from '../components/ModalDialog.vue';

const chartData = [
  { label: '合同审批', value: 12 },
  { label: '采购申请', value: 18 },
  { label: '运营变更', value: 9 },
  { label: '接口联调', value: 7 },
  { label: '人事流程', value: 6 },
  { label: '市场活动', value: 8 }
];

const flows = ref([
  { name: '合同审批-202406', department: '市场部', stage: '法务校验', owner: '周扬', duration: '1.4h', status: '进行中', statusClass: 'status-active' },
  { name: '采购申请-存储扩容', department: '技术部', stage: '财务审核', owner: '陈晨', duration: '3.1h', status: '进行中', statusClass: 'status-active' },
  { name: '运营变更-夜间', department: '运营部', stage: '变更会签', owner: '吴桐', duration: '2.8h', status: '待确认', statusClass: 'status-warning' },
  { name: '接口联调-支付', department: '研发中心', stage: '联调验证', owner: '刘洋', duration: '0.8h', status: '进行中', statusClass: 'status-active' },
  { name: '人事流程-入职', department: '人力', stage: '资料审核', owner: '李娜', duration: '1.0h', status: '进行中', statusClass: 'status-active' },
  { name: '市场活动-审批', department: '市场部', stage: '预算确认', owner: '赵欣', duration: '2.2h', status: '进行中', statusClass: 'status-active' },
  { name: '安全审计-整改', department: '安全部', stage: '复核', owner: '蒋楠', duration: '4.5h', status: '待确认', statusClass: 'status-warning' },
  { name: '客服知识库-更新', department: '客服部', stage: '发布审批', owner: '林溪', duration: '1.1h', status: '进行中', statusClass: 'status-active' },
  { name: '合规检查-季度', department: '内控', stage: '材料补充', owner: '何峰', duration: '5.2h', status: '异常', statusClass: 'status-danger' },
  { name: '合作伙伴-上线', department: '生态部', stage: '终验', owner: '秦越', duration: '0.9h', status: '进行中', statusClass: 'status-active' },
  { name: '培训课程-发布', department: '学院', stage: '内容审核', owner: '丁宁', duration: '1.6h', status: '进行中', statusClass: 'status-active' }
]);

const showFlowForm = ref(false);
const showFlowTip = ref(false);
const showFlowProgress = ref(false);
const flowProgress = ref(0);
const showFlowModal = ref(false);
const selectedFlow = ref(null);
const flowForm = ref({ name: '', department: '', priority: '中', nodes: '' });
const actionComment = ref('');
let timer;

function startFlowDeploy() {
  flowProgress.value = 0;
  showFlowProgress.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    if (flowProgress.value < 100) {
      flowProgress.value += 12;
    } else {
      clearInterval(timer);
    }
  }, 280);
}

function saveFlow() {
  flows.value = [
    {
      name: flowForm.value.name || '新建流程',
      department: flowForm.value.department || '未分配',
      stage: '待部署',
      owner: '未指定',
      duration: '0h',
      status: '待确认',
      statusClass: 'status-warning'
    },
    ...flows.value
  ];
  showFlowForm.value = false;
  flowForm.value = { name: '', department: '', priority: '中', nodes: '' };
}

function openFlow(item) {
  selectedFlow.value = item;
  showFlowModal.value = true;
}

function approveFlow() {
  actionComment.value = '';
  showFlowModal.value = false;
  startFlowDeploy();
}

function rejectFlow() {
  actionComment.value = '';
  showFlowModal.value = false;
  showFlowTip.value = true;
}
</script>
