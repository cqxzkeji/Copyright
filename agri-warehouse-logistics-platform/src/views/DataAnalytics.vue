<template>
  <div class="page">
    <div class="grid two">
      <div class="card">
        <div class="section-title">数据风险热力图</div>
        <p>市场波动指数 7.2，供应风险分布集中在华南区域。</p>
        <p style="margin-top: 8px; color: #6b7280;">模型识别 5 类潜在风险，已生成应对策略。</p>
      </div>
      <div class="card">
        <div class="section-title">预警指数趋势</div>
        <div class="chart-bars">
          <div v-for="bar in chartData" :key="bar.name" class="bar" :style="{ height: bar.value + '%' }">
            {{ bar.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">风险预警明细</div>
      <table class="table">
        <thead>
          <tr>
            <th>预警编号</th>
            <th>指标</th>
            <th>风险区域</th>
            <th>触发值</th>
            <th>等级</th>
            <th>建议动作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in alerts" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.metric }}</td>
            <td>{{ item.region }}</td>
            <td>{{ item.value }}</td>
            <td><span class="badge">{{ item.level }}</span></td>
            <td>{{ item.action }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="section-title">分析动作</div>
      <div class="grid three">
        <button class="primary-btn" @click="openForm">新增预警规则</button>
        <button class="ghost-btn" @click="openProgress">模型训练进度</button>
        <button class="ghost-btn" @click="openInfo">风险提示</button>
      </div>
    </div>

    <BaseModal v-if="showForm" title="新增预警规则" @close="showForm = false">
      <div class="input-group">
        <label>指标名称</label>
        <input v-model="form.metric" placeholder="如：价格波动" />
      </div>
      <div class="input-group">
        <label>阈值</label>
        <input v-model="form.threshold" placeholder="请输入阈值" />
      </div>
      <div class="input-group">
        <label>预警等级</label>
        <select v-model="form.level">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>
      </div>
      <div class="input-group">
        <label>响应策略</label>
        <textarea v-model="form.strategy" placeholder="请输入策略"></textarea>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showForm = false">取消</button>
        <button class="primary-btn" @click="submitForm">保存规则</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showProgress" title="模型训练进度" @close="showProgress = false">
      <p>预测模型已完成 72% 训练，预计 18 分钟完成。</p>
      <div class="progress-bar" style="margin-top: 12px;">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <div class="actions">
        <button class="ghost-btn" @click="showProgress = false">关闭</button>
        <button class="primary-btn" @click="boostProgress">提升算力</button>
      </div>
    </BaseModal>

    <BaseModal v-if="showInfo" title="风险提示" @close="showInfo = false">
      <p>近期柑橘价格波动加剧，建议提前锁定采购合同。</p>
      <div class="actions">
        <button class="primary-btn" @click="showInfo = false">确认</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { name: '周一', value: 40 },
  { name: '周二', value: 55 },
  { name: '周三', value: 62 },
  { name: '周四', value: 70 },
  { name: '周五', value: 82 },
  { name: '周六', value: 68 },
  { name: '周日', value: 75 }
];

const alerts = [
  { id: 'AL-001', metric: '价格波动', region: '华东', value: '+12%', level: '高', action: '锁定采购合同' },
  { id: 'AL-002', metric: '库存周转', region: '华北', value: '18天', level: '中', action: '调整库存结构' },
  { id: 'AL-003', metric: '运输时效', region: '华南', value: '延迟4h', level: '中', action: '调整路线' },
  { id: 'AL-004', metric: '供应稳定', region: '西南', value: '下降8%', level: '高', action: '启用备选供应商' },
  { id: 'AL-005', metric: '气象风险', region: '华中', value: '暴雨', level: '高', action: '增加安全库存' },
  { id: 'AL-006', metric: '订单取消率', region: '东北', value: '4.2%', level: '低', action: '加强客户沟通' },
  { id: 'AL-007', metric: '仓储损耗', region: '西北', value: '3.1%', level: '中', action: '优化冷链' },
  { id: 'AL-008', metric: '运力不足', region: '华东', value: '缺口15%', level: '中', action: '临时调车' },
  { id: 'AL-009', metric: '价格回落', region: '华南', value: '-6%', level: '低', action: '调整定价' },
  { id: 'AL-010', metric: '需求激增', region: '华北', value: '+20%', level: '高', action: '启动应急采购' },
  { id: 'AL-011', metric: '库存不足', region: '华中', value: '低于10天', level: '高', action: '提高补货频次' }
];

const showForm = ref(false);
const showProgress = ref(false);
const showInfo = ref(false);
const progress = ref(72);

const form = reactive({
  metric: '',
  threshold: '',
  level: '中',
  strategy: ''
});

const openForm = () => {
  showForm.value = true;
};

const openProgress = () => {
  showProgress.value = true;
};

const openInfo = () => {
  showInfo.value = true;
};

const submitForm = () => {
  showForm.value = false;
};

const boostProgress = () => {
  progress.value = Math.min(100, progress.value + 10);
};
</script>
