<template>
  <div class="grid" style="gap:16px">
    <div class="card" style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-weight:800;font-size:18px">数据分析与决策支持</div>
        <div style="color:#6b7c8c">分析订单转化、交付周期、利润结构与客户贡献度</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="btn ghost" @click="openModal('refresh')">刷新报表</button>
        <button class="btn" @click="openModal('export')">导出分析</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px,1fr));">
      <div class="card">
        <div style="font-weight:800">订单转化率</div>
        <div class="chart" style="margin-top:8px;">
          <div class="bars">
            <div class="bar" v-for="item in conversion" :key="item.label" :style="{ height: item.value + '%' }">
              <label>{{ item.label }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div style="font-weight:800">利润结构</div>
        <ul style="list-style:none;padding:0;margin:8px 0;display:grid;gap:8px;">
          <li class="card" style="padding:10px;display:flex;justify-content:space-between;align-items:center;" v-for="row in profit" :key="row.item">
            <div>
              <div style="font-weight:700">{{ row.item }}</div>
              <div style="color:#6b7c8c;font-size:12px">{{ row.desc }}</div>
            </div>
            <div style="min-width:120px">
              <div class="progress-bar"><div :style="{ width: row.rate + '%' }"></div></div>
              <div style="text-align:right;font-weight:700">{{ row.rate }}%</div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom:10px;">
        <div>
          <div style="font-weight:800">客户贡献度</div>
          <div style="color:#6b7c8c">根据订单金额与利润率评估</div>
        </div>
        <button class="btn ghost" @click="openModal('segment')">调整分层</button>
      </div>
      <table class="table">
        <thead>
          <tr><th>客户</th><th>行业</th><th>订单金额(万)</th><th>利润率</th><th>分层</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.name">
            <td>{{ client.name }}</td>
            <td>{{ client.industry }}</td>
            <td>{{ client.amount }}</td>
            <td>{{ client.margin }}%</td>
            <td><span class="badge info">{{ client.tier }}</span></td>
            <td><button class="btn ghost" style="padding:6px 8px" @click="openModal(client.name)">查看</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-if="activeModal" :title="modalTitle" @close="activeModal=''" @confirm="activeModal=''">
      <template v-if="activeModal==='refresh'">
        <p>重新计算近 90 天订单与交付数据，更新时间 30 秒。</p>
        <div class="progress-bar"><div :style="{ width: '70%' }"></div></div>
      </template>
      <template v-else-if="activeModal==='export'">
        <p>导出可视化报表为 PDF，并发送到邮箱。</p>
        <div class="progress-bar"><div :style="{ width: '42%' }"></div></div>
      </template>
      <template v-else-if="activeModal==='segment'">
        <p>调整客户分层阈值，优先保障 A 类客户交付。</p>
        <div class="form-row">
          <div><label>A 类阈值(万)</label><input class="input" type="number" value="500" /></div>
          <div><label>B 类阈值(万)</label><input class="input" type="number" value="200" /></div>
        </div>
      </template>
      <template v-else>
        <p>查看客户 {{ activeModal }} 的贡献度详情。</p>
        <p style="color:#5c6b7a">包含订单金额、利润率、准时交付率等指标。</p>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const conversion = [
  { label: '需求', value: 95 },
  { label: '评审', value: 88 },
  { label: '报价', value: 78 },
  { label: '合同', value: 72 },
  { label: '交付', value: 68 }
];

const profit = [
  { item: '材料成本', desc: '原料与合金成本占比', rate: 42 },
  { item: '加工费', desc: '轧制与热处理加工费', rate: 26 },
  { item: '物流与包装', desc: '运输、包装与保险', rate: 12 },
  { item: '利润', desc: '毛利润贡献', rate: 20 }
];

const clients = [
  { name: '华能电力', industry: '能源', amount: 860, margin: 18, tier: 'A' },
  { name: '三一重工', industry: '装备', amount: 620, margin: 16, tier: 'A' },
  { name: '一汽模具', industry: '模具', amount: 380, margin: 22, tier: 'B' },
  { name: '宝钢汽配', industry: '汽车', amount: 420, margin: 19, tier: 'B' },
  { name: '宁德时代', industry: '能源', amount: 500, margin: 15, tier: 'A' },
  { name: '哈电汽轮', industry: '能源', amount: 280, margin: 17, tier: 'B' }
];

const activeModal = ref('');
const modalTitle = ref('');

const openModal = (key) => {
  activeModal.value = key;
  modalTitle.value = `操作：${key}`;
};
</script>
