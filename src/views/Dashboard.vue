<template>
  <div class="grid" style="gap:16px">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px,1fr));">
      <div class="card stat-card" v-for="card in stats" :key="card.label">
        <div>
          <div style="color:#6b7c8c;font-size:12px">{{ card.label }}</div>
          <div style="font-size:26px;font-weight:800">{{ card.value }}</div>
          <div class="badge" :class="card.trend>0?'success':'warning'">{{ card.trend>0 ? '+' : '' }}{{ card.trend }}%</div>
        </div>
        <div class="progress-bar" style="width:80%">
          <div :style="{ width: card.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:2fr 1fr;align-items:start">
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800">订单转化趋势</div>
            <div style="color:#6b7c8c">按周统计需求到订单的转化效率</div>
          </div>
          <button class="btn ghost" @click="openModal('trend')">刷新数据</button>
        </div>
        <div class="chart">
          <div class="bars">
            <div class="bar" v-for="item in trend" :key="item.label" :style="{ height: item.value + '%' }">
              <label>{{ item.label }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800">待办提醒</div>
            <div style="color:#6b7c8c">审批、排产与风险预警</div>
          </div>
          <button class="btn ghost" @click="openModal('todo')">处理全部</button>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:grid;gap:10px;">
          <li class="card" style="padding:12px" v-for="todo in todos" :key="todo.title">
            <div style="font-weight:700">{{ todo.title }}</div>
            <div style="color:#6b7c8c;font-size:12px">{{ todo.detail }}</div>
            <div style="margin-top:6px;display:flex;gap:8px;align-items:center;">
              <span class="badge" :class="todo.type">{{ todo.tag }}</span>
              <span class="tag">截止 {{ todo.deadline }}</span>
              <button class="btn ghost" style="padding:6px 10px" @click="openModal(todo.title)">立即处理</button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px,1fr));">
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800">生产协同节点</div>
            <div style="color:#6b7c8c">排产-炼钢-轧制-热处理-检测-发运</div>
          </div>
          <button class="btn ghost" @click="openModal('timeline')">节点确认</button>
        </div>
        <div class="timeline">
          <div class="timeline-item" v-for="node in timeline" :key="node.name">
            <div style="font-weight:700">{{ node.name }}</div>
            <div>
              <div style="color:#6b7c8c">负责人：{{ node.owner }}</div>
              <div class="progress-bar" style="margin-top:8px"><div :style="{ width: node.progress + '%' }"></div></div>
            </div>
            <div style="text-align:right">
              <span class="badge info">{{ node.date }}</span>
              <div style="font-size:12px;color:#6b7c8c">{{ node.status }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:800">销售漏斗</div>
            <div style="color:#6b7c8c">从需求到合同的各环节转化</div>
          </div>
          <button class="btn ghost" @click="openModal('funnel')">查看指标</button>
        </div>
        <div style="display:grid;gap:8px;margin-top:10px">
          <div class="card" style="padding:10px;display:flex;justify-content:space-between;align-items:center;" v-for="row in funnel" :key="row.stage">
            <div>
              <div style="font-weight:700">{{ row.stage }}</div>
              <div style="color:#6b7c8c;font-size:12px">{{ row.description }}</div>
            </div>
            <div style="min-width:120px">
              <div class="progress-bar"><div :style="{ width: row.rate + '%' }"></div></div>
              <div style="text-align:right;font-weight:700">{{ row.rate }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalDialog v-if="activeModal" :title="modalTitle" @close="activeModal=''" @confirm="activeModal=''">
      <template v-if="activeModal==='trend'">
        <p>正在根据最新订单数据重新计算周度转化率，预计耗时 12 秒。</p>
        <div class="progress-bar"><div :style="{ width: '64%' }"></div></div>
      </template>
      <template v-else-if="activeModal==='todo'">
        <p>一键触发审批、生产确认与风险复核流程。</p>
        <ul>
          <li>发送审批提醒给工艺、财务、销售负责人</li>
          <li>同步排产更新到生产计划</li>
          <li>标记超期风险并推送短信</li>
        </ul>
      </template>
      <template v-else-if="activeModal==='timeline'">
        <p>确认后会推送节点状态到 MES 与检测中心。</p>
        <div class="form-row">
          <div><label>当前节点</label><select><option>热处理</option><option>探伤检测</option></select></div>
          <div><label>责任人</label><input class="input" placeholder="周工" /></div>
        </div>
      </template>
      <template v-else-if="activeModal==='funnel'">
        <p>转化率已自动对齐近 90 天数据样本。</p>
        <div class="progress-bar" style="margin:10px 0"><div :style="{ width: '78%' }"></div></div>
        <p style="color:#5c6b7a">建议针对方案评审与报价审批环节重点优化。</p>
      </template>
      <template v-else>
        <p>已记录操作：{{ activeModal }}</p>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const stats = [
  { label: '本月新需求', value: 48, trend: 12, progress: 70 },
  { label: '报价通过率', value: '82%', trend: 4, progress: 82 },
  { label: '准时交付率', value: '95%', trend: 3, progress: 95 },
  { label: '利润率', value: '18.6%', trend: -2, progress: 62 }
];

const trend = [
  { label: 'W1', value: 55 },
  { label: 'W2', value: 62 },
  { label: 'W3', value: 74 },
  { label: 'W4', value: 68 },
  { label: 'W5', value: 79 }
];

const todos = [
  { title: '2 个报价待审批', detail: '涉及模具钢与轴承钢合计 680 吨', tag: '审批', deadline: '今日 18:00', type: 'warning' },
  { title: '1 个排产需确认', detail: '45CrNiMoVA 热处理计划更新', tag: '生产', deadline: '明日 10:00', type: 'info' },
  { title: '3 条风险预警', detail: '运输延迟与成分波动需复核', tag: '风险', deadline: '本周内', type: 'danger' }
];

const timeline = [
  { name: '排产确认', owner: '张工', progress: 100, status: '已完成', date: '06-01' },
  { name: '炼钢冶炼', owner: '李工', progress: 88, status: '在线生产', date: '06-03' },
  { name: '轧制精整', owner: '赵工', progress: 62, status: '工序排队', date: '06-05' },
  { name: '热处理', owner: '周工', progress: 38, status: '待炉次排程', date: '06-08' },
  { name: '检测交付', owner: '吴工', progress: 12, status: '计划中', date: '06-10' }
];

const funnel = [
  { stage: '需求受理', description: '客户需求与交期确认', rate: 96 },
  { stage: '技术评审', description: '成分、性能、执行标准评审', rate: 85 },
  { stage: '报价审批', description: '成本模型与价格审核', rate: 78 },
  { stage: '合同签署', description: '合同条款确认与盖章', rate: 72 },
  { stage: '排产执行', description: '计划排程与生产执行', rate: 68 }
];

const activeModal = ref('');
const modalTitle = ref('');

const openModal = (key) => {
  activeModal.value = key;
  modalTitle.value = `处理：${key}`;
};
</script>
