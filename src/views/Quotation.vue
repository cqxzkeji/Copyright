<template>
  <div class="grid" style="gap:16px">
    <div class="card" style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-weight:800;font-size:18px">报价与合同流程管理</div>
        <div style="color:#6b7c8c">基于成本模型与定价规则自动生成报价</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="btn ghost" @click="openModal('rule')">定价规则</button>
        <button class="btn" @click="openModal('newQuote')">新建报价</button>
      </div>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div style="font-weight:800">报价与合同</div>
          <div style="color:#6b7c8c">支持多轮审批与版本对比</div>
        </div>
        <button class="btn ghost" @click="openModal('contractTemplate')">合同模板</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>客户</th><th>钢种</th><th>吨价(元)</th><th>版本</th><th>审批状态</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in quotes" :key="item.id">
            <td>{{ item.customer }}</td>
            <td>{{ item.grade }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.version }}</td>
            <td><span class="badge" :class="item.status==='待审批' ? 'warning' : 'success'">{{ item.status }}</span></td>
            <td>
              <button class="btn ghost" style="padding:6px 8px" @click="openModal('approve')">审批</button>
              <button class="btn ghost" style="padding:6px 8px" @click="openModal('compare')">版本比对</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-weight:800">审批进度</div>
          <div style="color:#6b7c8c">实时反馈审批节点和签署进度</div>
        </div>
        <button class="btn ghost" @click="openModal('progress')">刷新进度</button>
      </div>
      <div class="timeline" style="margin-top:10px">
        <div class="timeline-item" v-for="step in flow" :key="step.name">
          <div style="font-weight:700">{{ step.name }}</div>
          <div>
            <div style="color:#6b7c8c">责任人：{{ step.owner }}</div>
            <div class="progress-bar" style="margin-top:8px"><div :style="{ width: step.progress + '%' }"></div></div>
          </div>
          <div style="text-align:right">
            <span class="badge info">{{ step.deadline }}</span>
            <div style="font-size:12px;color:#6b7c8c">{{ step.status }}</div>
          </div>
        </div>
      </div>
    </div>

    <ModalDialog v-if="activeModal" :title="modalTitle" @close="activeModal=''" @confirm="activeModal=''">
      <template v-if="activeModal==='newQuote'">
        <p>填写客户需求，自动匹配成本模型生成报价。</p>
        <div class="form-row">
          <div><label>客户</label><input class="input" placeholder="中联重科" /></div>
          <div><label>钢种</label><input class="input" placeholder="42CrMo" /></div>
          <div><label>规格</label><input class="input" placeholder="φ160mm" /></div>
          <div><label>吨价(元)</label><input class="input" type="number" placeholder="12000" /></div>
        </div>
      </template>
      <template v-else-if="activeModal==='rule'">
        <p>定价规则：原料成本 + 能耗 + 加工费 + 物流，支持浮动系数。</p>
        <div class="progress-bar"><div :style="{ width: '60%' }"></div></div>
      </template>
      <template v-else-if="activeModal==='contractTemplate'">
        <p>选择合同模板并绑定最新报价版本。</p>
        <select class="input"><option>标准合同 V3</option><option>能源行业专用</option></select>
      </template>
      <template v-else-if="activeModal==='approve'">
        <p>审批人：财务经理/技术经理/销售总监</p>
        <div class="form-row">
          <div><label>审批意见</label><input class="input" placeholder="同意报价" /></div>
          <div><label>风险提示</label><input class="input" placeholder="交付周期紧" /></div>
        </div>
      </template>
      <template v-else-if="activeModal==='compare'">
        <p>版本对比：显示 V1 与 V2 的吨价、交付周期与特殊条款差异。</p>
        <div class="progress-bar"><div :style="{ width: '48%' }"></div></div>
      </template>
      <template v-else-if="activeModal==='progress'">
        <p>刷新审批节点并推送提醒。</p>
        <div class="progress-bar"><div :style="{ width: '88%' }"></div></div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const quotes = [
  { id: 1, customer: '华能电力', grade: '20CrMo', price: 11500, version: 'V2', status: '待审批' },
  { id: 2, customer: '三一重工', grade: '42CrMo', price: 11800, version: 'V1', status: '已通过' },
  { id: 3, customer: '一汽模具', grade: 'H13', price: 14500, version: 'V3', status: '待审批' },
  { id: 4, customer: '宝钢汽配', grade: '20CrMnTi', price: 10200, version: 'V1', status: '已通过' }
];

const flow = [
  { name: '成本模型计算', owner: '工艺工程师', progress: 100, deadline: '06-02', status: '完成' },
  { name: '销售报价确认', owner: '销售经理', progress: 86, deadline: '06-03', status: '进行中' },
  { name: '财务审核', owner: '财务经理', progress: 64, deadline: '06-04', status: '待处理' },
  { name: '合同编制签署', owner: '法务经理', progress: 40, deadline: '06-05', status: '待处理' }
];

const activeModal = ref('');
const modalTitle = ref('');

const openModal = (key) => {
  activeModal.value = key;
  modalTitle.value = `操作：${key}`;
};
</script>
