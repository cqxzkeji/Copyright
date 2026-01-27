<template>
  <div class="grid grid-2">
    <div class="card">
      <h3>风险评估指数</h3>
      <p>智能预警模型对当前车队风险进行评估。</p>
      <div class="grid grid-3">
        <div>
          <p class="tag">高风险</p>
          <h2>{{ stats.high }}</h2>
        </div>
        <div>
          <p class="tag">中风险</p>
          <h2>{{ stats.medium }}</h2>
        </div>
        <div>
          <p class="tag">低风险</p>
          <h2>{{ stats.low }}</h2>
        </div>
      </div>
      <svg width="100%" height="130" viewBox="0 0 420 130" role="img" style="margin-top: 12px;">
        <rect x="30" y="40" width="60" height="70" fill="#ffb74d" />
        <rect x="120" y="20" width="60" height="90" fill="#ff8a65" />
        <rect x="210" y="55" width="60" height="55" fill="#81c784" />
        <rect x="300" y="35" width="60" height="75" fill="#64b5f6" />
      </svg>
    </div>
    <div class="card">
      <h3>预警配置</h3>
      <p>根据检测结果自动触发告警，并支持手动确认。</p>
      <div style="margin-top: 16px;">
        <button class="primary" type="button" @click="openRiskForm">更新风险阈值</button>
        <button class="secondary" type="button" @click="openAlertModal">发送告警</button>
        <button class="ghost" type="button" @click="openTip">模型解释</button>
      </div>
      <div class="card" style="margin-top: 16px; background: #f7f9ff;">
        <h4>最新告警</h4>
        <ul>
          <li v-for="item in alerts" :key="item.id">{{ item.time }} - {{ item.msg }}</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="card">
    <h3>预警事件列表</h3>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>车辆</th>
          <th>风险等级</th>
          <th>异常指标</th>
          <th>触发时间</th>
          <th>处理状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.id }}</td>
          <td>{{ row.vehicle }}</td>
          <td><span class="badge" :class="row.badge">{{ row.level }}</span></td>
          <td>{{ row.metric }}</td>
          <td>{{ row.time }}</td>
          <td>{{ row.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="showRisk" title="风险阈值设置" @close="showRisk = false">
    <div class="form-grid">
      <div>
        <label>高风险阈值</label>
        <input v-model="riskForm.high" type="number" />
      </div>
      <div>
        <label>中风险阈值</label>
        <input v-model="riskForm.medium" type="number" />
      </div>
      <div>
        <label>模型版本</label>
        <select v-model="riskForm.model">
          <option>2024-Q3 基础模型</option>
          <option>2024-Q4 增强模型</option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="primary" type="button" @click="submitRisk">保存配置</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showAlert" title="发送告警" @close="showAlert = false">
    <div class="form-grid">
      <div>
        <label>告警级别</label>
        <select v-model="alertForm.level">
          <option>高风险</option>
          <option>中风险</option>
          <option>低风险</option>
        </select>
      </div>
      <div>
        <label>告警内容</label>
        <textarea v-model="alertForm.message" rows="3"></textarea>
      </div>
      <div>
        <label>通知渠道</label>
        <input v-model="alertForm.channel" type="text" />
      </div>
    </div>
    <template #footer>
      <button class="primary" type="button" @click="sendAlert">确认发送</button>
    </template>
  </BaseModal>

  <BaseModal v-if="showTip" title="模型解释" @close="showTip = false">
    <p>当前模型结合温度波动、SOC 漂移与电流过载三类指标生成风险得分，得分高于阈值即触发告警。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const stats = reactive({
  high: 3,
  medium: 9,
  low: 18
});

const alerts = [
  { id: 1, time: '09:10', msg: 'EV-2024-011 温度波动异常' },
  { id: 2, time: '09:26', msg: 'EV-2024-017 SOC 漂移风险' }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  const levels = ['高风险', '中风险', '低风险'];
  const badges = ['danger', 'warning', 'success'];
  const levelIndex = index % 3;
  return {
    id: `W-${String(id).padStart(3, '0')}`,
    vehicle: `EV-2024-${String(30 + id).padStart(3, '0')}`,
    level: levels[levelIndex],
    badge: badges[levelIndex],
    metric: ['温度波动', '电流过载', 'SOC 漂移'][index % 3],
    time: `2024-10-0${(index % 8) + 1} 0${(index % 9) + 8}:30`,
    status: index % 2 === 0 ? '待处理' : '已确认'
  };
});

const showRisk = ref(false);
const showAlert = ref(false);
const showTip = ref(false);

const riskForm = reactive({
  high: 85,
  medium: 60,
  model: '2024-Q4 增强模型'
});

const alertForm = reactive({
  level: '高风险',
  message: '电池温度连续 3 次超阈值，请立即检查。',
  channel: '短信 + APP 推送'
});

const openRiskForm = () => {
  showRisk.value = true;
};

const openAlertModal = () => {
  showAlert.value = true;
};

const openTip = () => {
  showTip.value = true;
};

const submitRisk = () => {
  showRisk.value = false;
  showTip.value = true;
};

const sendAlert = () => {
  showAlert.value = false;
  showTip.value = true;
};
</script>
