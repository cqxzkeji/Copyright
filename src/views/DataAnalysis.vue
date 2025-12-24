<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h3>数据统计与分析</h3>
        <p>监控访问、交易、物流时效等指标，为乡村运营提供决策依据。</p>
      </div>
      <div class="actions">
        <button class="primary-btn" @click="openRefresh">刷新数据</button>
        <button class="secondary-btn" @click="openConfig">看板设置</button>
        <button class="secondary-btn" @click="openExport">导出报告</button>
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric-card" v-for="card in cards" :key="card.label">
        <div style="color:#5c6c80;font-size:13px;">{{ card.label }}</div>
        <div style="font-size:22px;font-weight:800;">{{ card.value }}</div>
        <div class="progress-bar" style="margin-top:6px;"><span :style="{ width: card.progress + '%' }"></span></div>
      </div>
    </div>

    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4 style="margin:0;">渠道访问趋势</h4>
        <span style="color:#5c6c80;">周对比</span>
      </div>
      <div class="chart-row" style="margin-top:12px;">
        <div v-for="channel in channels" :key="channel.name" class="chart-bar" :style="{ height: channel.height + 'px' }">
          <small>{{ channel.name }}</small>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4 style="margin:0;">关键指标</h4>
        <span style="color:#5c6c80;">共 {{ metrics.length }} 条</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>指标</th>
            <th>数值</th>
            <th>环比</th>
            <th>责任人</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in metrics" :key="m.name">
            <td>{{ m.name }}</td>
            <td>{{ m.value }}</td>
            <td><span class="tag" :class="m.ring > 0 ? 'green' : 'orange'">{{ m.ring }}%</span></td>
            <td>{{ m.owner }}</td>
            <td>{{ m.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :show="showRefresh" title="刷新数据" @close="showRefresh = false">
      <p>正在同步近 7 日访问、订单、履约等数据...</p>
      <div class="progress-bar" style="margin:12px 0;height:14px;"><span :style="{ width: refreshProgress + '%' }"></span></div>
      <p style="margin:0;color:#6d7b8f;">{{ refreshProgress }}% 完成</p>
      <div style="text-align:right;margin-top:10px;">
        <button class="secondary-btn" @click="showRefresh = false">完成</button>
      </div>
    </BaseModal>

    <BaseModal :show="showConfig" title="看板设置" @close="showConfig = false">
      <form class="form-grid" @submit.prevent="saveConfig">
        <label>展示周期<select v-model="config.period"><option>近7日</option><option>近30日</option></select></label>
        <label>关注指标<select v-model="config.focus">
          <option>访问量</option>
          <option>交易额</option>
          <option>履约时效</option>
        </select></label>
        <label>提醒邮箱<input v-model="config.email" type="email" required /></label>
        <label>备注<textarea v-model="config.note"></textarea></label>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button type="button" class="secondary-btn" @click="showConfig = false">取消</button>
          <button class="primary-btn">保存</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal :show="showExport" title="导出提示" @close="showExport = false">
      <p>报告生成中，生成后将自动下载并推送到邮箱 {{ config.email || 'demo@local' }}。</p>
      <div style="text-align:right;margin-top:10px;">
        <button class="primary-btn" @click="showExport = false">好的</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const cards = [
  { label: '访问量', value: '18,920', progress: 72 },
  { label: '交易额', value: '¥3.2M', progress: 64 },
  { label: '履约准时率', value: '96.2%', progress: 90 }
];

const channels = [
  { name: '小程序', height: 120 },
  { name: '网页', height: 90 },
  { name: '直播', height: 150 },
  { name: '抖音', height: 80 },
  { name: '服务号', height: 70 }
];

const metrics = reactive([
  { name: '近7日访问', value: '98,210', ring: 12, owner: '运营-李', note: '短视频拉新' },
  { name: '下单转化', value: '13.5%', ring: 2.1, owner: '产品-周', note: '优化下单路径' },
  { name: '订单完成率', value: '94.6%', ring: 1.6, owner: '运营-李', note: '督促催收签收' },
  { name: '冷链准点率', value: '96.2%', ring: -0.3, owner: '物流-王', note: '雨天耽误' },
  { name: '退货率', value: '1.4%', ring: -0.2, owner: '客服-陈', note: '包装改进' },
  { name: '客单价', value: '¥186', ring: 3.4, owner: '产品-周', note: '主推大包装' },
  { name: '复购率', value: '28.6%', ring: 1.1, owner: '运营-李', note: '会员复投' },
  { name: '支付成功率', value: '99.2%', ring: 0.1, owner: '技术-何', note: '支付网关优化' },
  { name: '客服响应', value: '92 秒', ring: 4.2, owner: '客服-陈', note: 'AI 分流' },
  { name: '库存周转', value: '21 天', ring: -1.5, owner: '供应链-赵', note: '低温品类' },
  { name: '直播成交', value: '¥620k', ring: 6.5, owner: '运营-李', note: '双主播联动' },
  { name: '团购订单', value: '1,820 单', ring: 2.8, owner: '渠道-许', note: '社区团购' },
  { name: '批发订单', value: '980 单', ring: 1.9, owner: '渠道-许', note: '商超渠道' },
  { name: '物流投诉', value: '9 起', ring: -1.2, owner: '物流-王', note: '改进包装' },
  { name: '短信触达', value: '16,800', ring: 5.0, owner: '运营-李', note: '农忙提醒' },
  { name: '新客数', value: '4,280', ring: 7.2, owner: '运营-李', note: '投放提效' },
  { name: '订单异常', value: '12 单', ring: -0.5, owner: '运营-李', note: '自动预警' },
  { name: '供应商活跃', value: '82 家', ring: 3.8, owner: '供应链-赵', note: '上新激励' },
  { name: '乡镇活跃', value: '118 个', ring: 2.4, owner: '运营-李', note: '培训巡讲' },
  { name: '履约超时', value: '6 单', ring: -0.8, owner: '物流-王', note: '改进路线' }
]);

const showRefresh = ref(false);
const showConfig = ref(false);
const showExport = ref(false);
const refreshProgress = ref(0);
const config = reactive({ period: '近7日', focus: '访问量', email: '', note: '' });

const openRefresh = () => {
  showRefresh.value = true;
  refreshProgress.value = 0;
  const timer = setInterval(() => {
    refreshProgress.value += 25;
    if (refreshProgress.value >= 100) {
      refreshProgress.value = 100;
      clearInterval(timer);
    }
  }, 300);
};

const openConfig = () => {
  showConfig.value = true;
};

const openExport = () => {
  showExport.value = true;
};

const saveConfig = () => {
  showConfig.value = false;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d8e4f4;
  background: #f9fbff;
}

.form-grid textarea {
  min-height: 80px;
}
</style>
