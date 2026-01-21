<template>
  <div class="grid grid-2">
    <div class="card">
      <h3>风险热度预测</h3>
      <p>结合供应中断、延迟与波动风险预测未来两周趋势。</p>
      <div class="chart">
        <div v-for="(item, index) in heatData" :key="index" class="chart-bar" :style="{ height: item + '%' }" />
      </div>
      <div class="flex">
        <button @click="openModal('scan')">启动风险扫描</button>
        <button class="secondary" @click="openModal('model')">调整预测模型</button>
        <button class="ghost" @click="openModal('signal')">推送风险提示</button>
      </div>
    </div>
    <div class="card">
      <h3>风险类型分布</h3>
      <div class="grid grid-3">
        <div class="card">
          <h4>供应中断</h4>
          <h2>18%</h2>
        </div>
        <div class="card">
          <h4>运输延迟</h4>
          <h2>26%</h2>
        </div>
        <div class="card">
          <h4>需求波动</h4>
          <h2>32%</h2>
        </div>
      </div>
      <div class="flex">
        <button class="secondary" @click="openModal('mitigate')">缓释策略库</button>
        <button class="ghost" @click="openModal('impact')">影响范围评估</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 16px;">
    <h3>风险识别明细</h3>
    <table class="table">
      <thead>
        <tr>
          <th>风险事件</th>
          <th>类型</th>
          <th>概率</th>
          <th>影响范围</th>
          <th>预测趋势</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.event">
          <td>{{ item.event }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.rate }}</td>
          <td>{{ item.scope }}</td>
          <td><span class="tag">{{ item.trend }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal === 'scan'" title="风险扫描进度" @close="closeModal">
    <p>正在扫描外部舆情、气象、供应商交付数据。</p>
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <p>扫描完成度：{{ progress }}%</p>
    <button class="secondary" @click="closeModal">后台继续</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'model'" title="调整预测模型" @close="closeModal">
    <div class="form-field">
      <label>预测周期</label>
      <select>
        <option>未来7天</option>
        <option>未来14天</option>
        <option>未来30天</option>
      </select>
    </div>
    <div class="form-field">
      <label>关键权重</label>
      <input placeholder="供应稳定性 40%" />
    </div>
    <button @click="closeModal">更新模型参数</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'signal'" title="推送风险提示" @close="closeModal">
    <div class="form-field">
      <label>通知范围</label>
      <select>
        <option>采购经理</option>
        <option>物流调度</option>
        <option>全链路负责人</option>
      </select>
    </div>
    <div class="form-field">
      <label>提示内容</label>
      <textarea rows="3" placeholder="请输入风险提示内容"></textarea>
    </div>
    <button @click="closeModal">发送提示</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'mitigate'" title="缓释策略库" @close="closeModal">
    <p>策略包括供应商备选、运输转移、库存提升等预案。</p>
    <button class="secondary" @click="closeModal">已同步策略</button>
  </BaseModal>

  <BaseModal v-if="activeModal === 'impact'" title="影响范围评估" @close="closeModal">
    <div class="form-field">
      <label>潜在影响区域</label>
      <input placeholder="华东、华北供应节点" />
    </div>
    <div class="form-field">
      <label>预计损失等级</label>
      <select>
        <option>轻度</option>
        <option>中度</option>
        <option>严重</option>
      </select>
    </div>
    <button @click="closeModal">生成评估结果</button>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const heatData = [32, 45, 52, 60, 55, 62, 70, 76, 68, 80];
const tableData = [
  { event: "东南亚原料供应波动", type: "供应中断", rate: "28%", scope: "华南/华东", trend: "上升" },
  { event: "港口拥堵延迟", type: "运输延迟", rate: "32%", scope: "国际物流", trend: "上升" },
  { event: "核心零部件涨价", type: "需求波动", rate: "24%", scope: "生产基地", trend: "稳定" },
  { event: "台风影响航线", type: "运输延迟", rate: "30%", scope: "华东港口", trend: "上升" },
  { event: "海外供应商减产", type: "供应中断", rate: "22%", scope: "国际采购", trend: "稳定" },
  { event: "需求峰值提前", type: "需求波动", rate: "26%", scope: "终端市场", trend: "上升" },
  { event: "陆运干线管制", type: "运输延迟", rate: "18%", scope: "华北区域", trend: "下降" },
  { event: "电力紧张", type: "供应中断", rate: "20%", scope: "华中制造", trend: "稳定" },
  { event: "库存波动", type: "需求波动", rate: "21%", scope: "区域仓储", trend: "上升" },
  { event: "原材料交付延期", type: "供应中断", rate: "19%", scope: "华南供应商", trend: "稳定" },
  { event: "海外运费上涨", type: "运输延迟", rate: "23%", scope: "国际物流", trend: "上升" },
  { event: "终端订单取消", type: "需求波动", rate: "15%", scope: "销售渠道", trend: "下降" },
  { event: "高铁货运受限", type: "运输延迟", rate: "17%", scope: "华东内陆", trend: "稳定" },
  { event: "供应商质量波动", type: "供应中断", rate: "16%", scope: "核心供应", trend: "上升" },
  { event: "替代材料审批慢", type: "供应中断", rate: "14%", scope: "研发链路", trend: "稳定" },
  { event: "渠道备货不足", type: "需求波动", rate: "18%", scope: "渠道库存", trend: "上升" },
  { event: "跨境清关延迟", type: "运输延迟", rate: "21%", scope: "国际港口", trend: "稳定" },
  { event: "海外政治波动", type: "供应中断", rate: "25%", scope: "国际采购", trend: "上升" },
  { event: "本地需求下降", type: "需求波动", rate: "12%", scope: "区域销售", trend: "下降" },
  { event: "仓储爆仓风险", type: "运输延迟", rate: "20%", scope: "华东仓库", trend: "稳定" },
  { event: "冷链失效风险", type: "供应中断", rate: "13%", scope: "医药仓储", trend: "上升" }
];

const activeModal = ref("");
const progress = ref(0);
let timer;

const openModal = (name) => {
  activeModal.value = name;
  if (name === "scan") {
    progress.value = 18;
    clearInterval(timer);
    timer = setInterval(() => {
      progress.value = Math.min(progress.value + 14, 100);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 380);
  }
};

const closeModal = () => {
  activeModal.value = "";
  clearInterval(timer);
};
</script>
