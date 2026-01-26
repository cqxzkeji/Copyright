<template>
  <section class="module">
    <div class="metrics">
      <div class="metric-card">
        <h4>综合健康指数</h4>
        <p>92.5</p>
        <span>风险水平：低</span>
      </div>
      <div class="metric-card">
        <h4>库存周转</h4>
        <p>5.8 次</p>
        <span>高于目标 0.6 次</span>
      </div>
      <div class="metric-card">
        <h4>订单履约</h4>
        <p>94.1%</p>
        <span>客户满意度 96%</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>数据分析操作</h3>
        <div class="actions">
          <button class="primary" @click="openModal('mining')">数据挖掘</button>
          <button class="secondary" @click="openModal('inventory')">库存分析</button>
          <button class="secondary" @click="openModal('orders')">订单分析</button>
          <button class="secondary" @click="openModal('report')">绩效报告</button>
          <button class="ghost" @click="openModal('progress')">生成进度</button>
          <button class="ghost" @click="openModal('tips')">提示信息</button>
        </div>
      </div>
      <div class="panel-body">
        <div class="chart">
          <div class="chart-header">
            <h4>供应链指标趋势</h4>
            <span>近 6 个月</span>
          </div>
          <svg class="line-chart" viewBox="0 0 320 160">
            <polyline
              points="10,120 70,90 130,110 190,70 250,60 310,40"
              fill="none"
              stroke="#2f6bff"
              stroke-width="4"
              stroke-linecap="round"
            />
            <polyline
              points="10,140 70,110 130,120 190,90 250,85 310,70"
              fill="none"
              stroke="#7dd3fc"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
          <div class="legend">
            <span><i class="dot primary"></i>履约率</span>
            <span><i class="dot secondary"></i>库存周转</span>
          </div>
        </div>
        <div class="report-card">
          <div class="chart-header">
            <h4>风险分布</h4>
            <span>供应商/物流/库存</span>
          </div>
          <div class="risk-grid">
            <div class="risk-item" v-for="item in risks" :key="item.label">
              <div class="risk-ring" :style="{ background: item.color }">{{ item.value }}%</div>
              <div>
                <strong>{{ item.label }}</strong>
                <p>{{ item.note }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-card">
        <div class="table-header">
          <h4>分析明细</h4>
          <button class="primary" @click="openModal('report')">导出报告</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>维度</th>
              <th>当前值</th>
              <th>环比</th>
              <th>趋势</th>
              <th>结论</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in analysis" :key="item.id">
              <td>{{ item.metric }}</td>
              <td>{{ item.dimension }}</td>
              <td>{{ item.value }}</td>
              <td>{{ item.change }}</td>
              <td>{{ item.trend }}</td>
              <td>{{ item.summary }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <ModalBase :open="modals.mining" title="数据挖掘" @close="closeModal('mining')">
    <form class="form-grid" @submit.prevent="runMining">
      <label>
        数据源
        <select v-model="miningForm.source">
          <option>供应商数据</option>
          <option>库存数据</option>
          <option>订单数据</option>
          <option>物流数据</option>
        </select>
      </label>
      <label>
        挖掘目标
        <select v-model="miningForm.goal">
          <option>异常检测</option>
          <option>需求预测</option>
          <option>供应风险识别</option>
        </select>
      </label>
      <label>
        输出格式
        <select v-model="miningForm.output">
          <option>图表摘要</option>
          <option>数据透视表</option>
          <option>自动报告</option>
        </select>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('mining')">取消</button>
      <button class="primary" @click="runMining">开始挖掘</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.inventory" title="库存分析" @close="closeModal('inventory')">
    <form class="form-grid" @submit.prevent="analyzeInventory">
      <label>
        分析周期
        <select v-model="inventoryForm.period">
          <option>近 7 天</option>
          <option>近 30 天</option>
          <option>近 90 天</option>
        </select>
      </label>
      <label>
        重点仓库
        <select v-model="inventoryForm.warehouse">
          <option>华东中心仓</option>
          <option>华北成品仓</option>
          <option>西部冷链仓</option>
        </select>
      </label>
      <label>
        输出方式
        <select v-model="inventoryForm.output">
          <option>库存周转图</option>
          <option>安全库存表</option>
          <option>物料结构分析</option>
        </select>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('inventory')">关闭</button>
      <button class="primary" @click="analyzeInventory">生成分析</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.orders" title="订单分析" @close="closeModal('orders')">
    <form class="form-grid" @submit.prevent="analyzeOrders">
      <label>
        订单类型
        <select v-model="orderForm.type">
          <option>客户订单</option>
          <option>采购订单</option>
          <option>供应商订单</option>
        </select>
      </label>
      <label>
        分析指标
        <select v-model="orderForm.metric">
          <option>履约率</option>
          <option>交付周期</option>
          <option>订单波动</option>
        </select>
      </label>
      <label>
        分析说明
        <textarea v-model="orderForm.note" rows="3" placeholder="填写需求"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('orders')">取消</button>
      <button class="primary" @click="analyzeOrders">确认分析</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.report" title="绩效报告" @close="closeModal('report')">
    <form class="form-grid" @submit.prevent="generateReport">
      <label>
        报告周期
        <select v-model="reportForm.period">
          <option>月度报告</option>
          <option>季度报告</option>
          <option>年度报告</option>
        </select>
      </label>
      <label>
        报告范围
        <select v-model="reportForm.scope">
          <option>全链路</option>
          <option>供应商</option>
          <option>物流</option>
          <option>库存</option>
        </select>
      </label>
      <label>
        报告备注
        <textarea v-model="reportForm.note" rows="3" placeholder="填写报告摘要"></textarea>
      </label>
    </form>
    <template #footer>
      <button class="secondary" @click="closeModal('report')">取消</button>
      <button class="primary" @click="generateReport">生成报告</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.progress" title="报告生成进度" @close="closeModal('progress')">
    <div class="progress-block">
      <p>正在生成季度供应链绩效报告...</p>
      <div class="progress">
        <div class="progress-bar" style="width: 76%"></div>
      </div>
      <ul>
        <li>数据抽取：已完成</li>
        <li>指标建模：进行中</li>
        <li>报告输出：待处理</li>
      </ul>
    </div>
    <template #footer>
      <button class="primary" @click="closeModal('progress')">知道了</button>
    </template>
  </ModalBase>

  <ModalBase :open="modals.tips" title="分析提示" @close="closeModal('tips')">
    <p>建议每月复核供应链绩效指标，并将分析结果同步至供应商与物流团队。</p>
    <template #footer>
      <button class="primary" @click="closeModal('tips')">了解</button>
    </template>
  </ModalBase>
</template>

<script setup>
import { reactive } from "vue";
import ModalBase from "../components/ModalBase.vue";

const modals = reactive({
  mining: false,
  inventory: false,
  orders: false,
  report: false,
  progress: false,
  tips: false
});

const risks = [
  { label: "供应商", value: 18, note: "交付波动可控", color: "#e0f2fe" },
  { label: "库存", value: 12, note: "安全库存达标", color: "#d1fae5" },
  { label: "物流", value: 22, note: "部分路线拥堵", color: "#fde68a" }
];

const analysis = [
  { id: 1, metric: "履约率", dimension: "客户订单", value: "94%", change: "+1.2%", trend: "上升", summary: "保持稳定" },
  { id: 2, metric: "交付周期", dimension: "华东区域", value: "2.4 天", change: "-0.2 天", trend: "缩短", summary: "效率提升" },
  { id: 3, metric: "库存周转", dimension: "原材料", value: "6.1 次", change: "+0.4", trend: "上升", summary: "结构优化" },
  { id: 4, metric: "安全库存", dimension: "包装", value: "92%", change: "+3%", trend: "上升", summary: "风险下降" },
  { id: 5, metric: "供应风险", dimension: "关键供应商", value: "18%", change: "-2%", trend: "下降", summary: "风险可控" },
  { id: 6, metric: "物流准时率", dimension: "华南线路", value: "93%", change: "+1%", trend: "上升", summary: "持续改善" },
  { id: 7, metric: "退货率", dimension: "客户订单", value: "1.2%", change: "-0.1%", trend: "下降", summary: "质量提升" },
  { id: 8, metric: "采购成本", dimension: "原材料", value: "-3%", change: "-0.5%", trend: "下降", summary: "成本优化" },
  { id: 9, metric: "库存预警", dimension: "低库存物料", value: "7 项", change: "+2", trend: "上升", summary: "需补货" },
  { id: 10, metric: "供应商评级", dimension: "A级占比", value: "67%", change: "+4%", trend: "上升", summary: "质量提高" },
  { id: 11, metric: "订单完成", dimension: "采购订单", value: "89%", change: "+2%", trend: "上升", summary: "交付改善" },
  { id: 12, metric: "物流成本", dimension: "干线运输", value: "-1.8%", change: "-0.3%", trend: "下降", summary: "成本控制" },
  { id: 13, metric: "缺货率", dimension: "关键物料", value: "0.8%", change: "-0.1%", trend: "下降", summary: "风险降低" },
  { id: 14, metric: "预测准确率", dimension: "需求预测", value: "92%", change: "+1%", trend: "上升", summary: "模型优化" },
  { id: 15, metric: "资金周转", dimension: "供应链", value: "14.2 天", change: "-0.6 天", trend: "改善", summary: "现金流提升" },
  { id: 16, metric: "订单波动", dimension: "客户需求", value: "±8%", change: "-2%", trend: "下降", summary: "稳定" },
  { id: 17, metric: "配送准点", dimension: "直营网点", value: "95%", change: "+0.5%", trend: "上升", summary: "表现良好" },
  { id: 18, metric: "库存结构", dimension: "慢动品", value: "9%", change: "-1%", trend: "下降", summary: "去化中" },
  { id: 19, metric: "产能利用", dimension: "供应商", value: "88%", change: "+2%", trend: "上升", summary: "协同提升" },
  { id: 20, metric: "供应时效", dimension: "核心供应商", value: "97%", change: "+1%", trend: "上升", summary: "稳定" }
];

const miningForm = reactive({
  source: "供应商数据",
  goal: "异常检测",
  output: "图表摘要"
});

const inventoryForm = reactive({
  period: "近 30 天",
  warehouse: "华东中心仓",
  output: "库存周转图"
});

const orderForm = reactive({
  type: "客户订单",
  metric: "履约率",
  note: "关注高峰期间的履约能力。"
});

const reportForm = reactive({
  period: "季度报告",
  scope: "全链路",
  note: "强调供应商绩效与物流准时率。"
});

const openModal = (key) => {
  modals[key] = true;
};

const closeModal = (key) => {
  modals[key] = false;
};

const runMining = () => {
  modals.mining = false;
};

const analyzeInventory = () => {
  modals.inventory = false;
};

const analyzeOrders = () => {
  modals.orders = false;
};

const generateReport = () => {
  modals.report = false;
};
</script>

<style scoped>
@import "./shared-module.css";

.line-chart {
  width: 100%;
  height: 160px;
}

.legend {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
  color: #5b6475;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot.primary {
  background: #2f6bff;
}

.dot.secondary {
  background: #7dd3fc;
}

.risk-grid {
  display: grid;
  gap: 16px;
}

.risk-item {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 12px;
  align-items: center;
}

.risk-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #1f2937;
}

.risk-item p {
  margin: 6px 0 0;
  color: #6b7384;
  font-size: 13px;
}
</style>
