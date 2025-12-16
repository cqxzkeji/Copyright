<template>
  <section>
    <div class="topbar" style="padding: 14px 16px;">
      <div class="title">风险识别与预测分析</div>
      <div class="actions">
        <button class="btn" @click="showConfig = true">配置预测参数</button>
        <button class="btn primary" @click="showRun = true">运行预测</button>
        <button class="btn" @click="showInsight = true">查看解释</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>概率分布</h3>
        <div class="summary-chart">
          <div v-for="item in probabilityBars" :key="item.label" class="column" :style="{ height: `${item.value * 1.5}px` }">
            <span>{{ item.label }}</span>
          </div>
        </div>
        <p class="hint">组合模型输出的三类风险概率分布，便于快速聚焦高风险区域。</p>
      </div>
      <div class="card">
        <h3>近期预测曲线</h3>
        <div class="small-chart">
          <span v-for="trend in riskTrend" :key="trend" :style="{ height: `${trend}px` }"></span>
        </div>
        <p class="hint">近 12 天预测风险指数波动曲线，均在可控范围内。</p>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>高风险事件列表</h3>
        <button class="btn primary" @click="showRun = true">立即重跑</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>事件</th>
            <th>位置</th>
            <th>预测概率</th>
            <th>影响环节</th>
            <th>建议缓解</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in risks" :key="item.event">
            <td>{{ item.event }}</td>
            <td>{{ item.location }}</td>
            <td><span class="badge">{{ item.probability }}</span></td>
            <td>{{ item.stage }}</td>
            <td>{{ item.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="showConfig" title="配置预测参数" @confirm="showConfig = false">
      <div class="form-grid">
        <label>
          模型版本
          <select>
            <option>XGBoost-2024Q4</option>
            <option>LSTM-实时</option>
            <option>规则融合</option>
          </select>
        </label>
        <label>
          预测窗口
          <select>
            <option>7 天</option>
            <option>14 天</option>
            <option>30 天</option>
          </select>
        </label>
        <label>
          触发阈值
          <input type="number" min="0" max="1" step="0.01" value="0.6" />
        </label>
      </div>
    </BaseModal>

    <BaseModal v-model="showRun" title="预测执行进度" @confirm="runPrediction">
      <p>正在拉取最新样本并执行批量预测，请保持网络通畅。</p>
      <div class="progress">
        <div class="bar" :style="{ width: `${runProgress}%` }"></div>
      </div>
      <p style="text-align: right; margin: 6px 0 0;">当前进度：{{ runProgress }}%</p>
    </BaseModal>

    <BaseModal v-model="showInsight" title="模型解释" @confirm="showInsight = false">
      <p>主要贡献特征：供应周期波动、库存周转、运输延误、需求突增、质量退货率。</p>
      <ul>
        <li>若运输延误占比超过 15%，系统自动提高预警级别。</li>
        <li>需求突增与供应周期波动的组合会触发应急补货建议。</li>
        <li>质量退货率持续高于 3% 将推送供应商整改任务。</li>
      </ul>
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showConfig = ref(false);
const showRun = ref(false);
const showInsight = ref(false);
const runProgress = ref(55);

const probabilityBars = reactive([
  { label: '低风险', value: 22 },
  { label: '中风险', value: 46 },
  { label: '高风险', value: 67 }
]);

const riskTrend = reactive([38, 44, 40, 46, 48, 50, 47, 45, 43, 41, 39, 42]);

const risks = reactive([
  { event: '供应延迟', location: '华东仓', probability: '68%', stage: '仓储', action: '增加提前量' },
  { event: '港口拥堵', location: '宁波港', probability: '64%', stage: '运输', action: '切换港口' },
  { event: '需求激增', location: '华南市场', probability: '62%', stage: '销售', action: '紧急补货' },
  { event: '设备故障', location: '苏州工厂', probability: '61%', stage: '生产', action: '预防性检修' },
  { event: '质量退货', location: '成都售后', probability: '60%', stage: '售后', action: '批次复检' },
  { event: '供应中断', location: '关键供应商B', probability: '59%', stage: '采购', action: '启用备选' },
  { event: '气候影响', location: '东北路线', probability: '58%', stage: '运输', action: '调整线路' },
  { event: '能耗限产', location: '华北工厂', probability: '57%', stage: '生产', action: '排产优化' },
  { event: '库存失衡', location: '华东仓', probability: '55%', stage: '仓储', action: '调拨平衡' },
  { event: '数据异常', location: '数据中心', probability: '54%', stage: '监测', action: '复核数据' }
]);

const runPrediction = () => {
  runProgress.value = 0;
  const timer = setInterval(() => {
    runProgress.value += 18;
    if (runProgress.value >= 100) {
      runProgress.value = 100;
      clearInterval(timer);
    }
  }, 200);
};
</script>
