<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom: 12px;">
      <div>
        <h3 class="section-title">智能分析预警</h3>
        <p style="color:var(--muted);">电压趋势分析，异常识别与风险预警提示。</p>
      </div>
      <div class="toolbar">
        <button class="btn btn-primary" @click="analysisModal = true">运行分析</button>
        <button class="btn btn-ghost" @click="forecastModal = true">趋势预测</button>
        <button class="btn btn-ghost" @click="alertModal = true">推送预警</button>
      </div>
    </div>

    <div class="panel-grid">
      <div class="card">
        <p style="font-weight:700;">趋势雷达</p>
        <svg viewBox="0 0 240 200" style="width:100%;">
          <polygon points="120,20 200,80 160,180 80,180 40,80" fill="rgba(31,122,236,0.1)" stroke="#1f7aec" stroke-width="2" />
          <polygon points="120,60 180,90 150,150 90,150 60,90" fill="rgba(35,193,154,0.25)" stroke="#23c19a" stroke-width="2" />
        </svg>
        <div class="chip-row">
          <div class="tag">稳定度 92%</div>
          <div class="tag">波动度 18%</div>
          <div class="tag">跌落敏感 12%</div>
        </div>
      </div>
      <div class="card">
        <p style="font-weight:700;">风险列表</p>
        <table class="table">
          <thead>
            <tr><th>设备</th><th>风险</th><th>概率</th><th>动作</th></tr>
          </thead>
          <tbody>
            <tr v-for="risk in risks" :key="risk.device">
              <td>{{ risk.device }}</td>
              <td>{{ risk.desc }}</td>
              <td>{{ risk.prob }}%</td>
              <td><button class="btn btn-ghost" @click="openRisk(risk)">详情</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ModalDialog v-model="analysisModal" title="运行分析">
    <p>系统将对最近 24h 数据进行趋势回放。</p>
    <div class="progress-track" style="margin-top:10px;">
      <div class="progress-bar" :style="{width: analysisProgress + '%'}"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="forecastModal" title="趋势预测" :withFooter="false">
    <p>预测 BV-004 未来 2 小时电压走势下降 0.3V，建议检修。</p>
  </ModalDialog>

  <ModalDialog v-model="alertModal" title="推送预警">
    <div>
      <label>推送渠道</label>
      <select class="select" v-model="alertForm.channel">
        <option>短信</option>
        <option>邮件</option>
        <option>企业微信</option>
      </select>
    </div>
    <div style="margin-top:10px;">
      <label>预警内容</label>
      <textarea class="input" rows="3" v-model="alertForm.message"></textarea>
    </div>
  </ModalDialog>

  <ModalDialog v-model="riskModal" title="风险详情" :withFooter="false">
    <p>设备：{{ currentRisk?.device }}</p>
    <p>风险：{{ currentRisk?.desc }}</p>
    <p>概率：{{ currentRisk?.prob }}%</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const risks = reactive([
  { device: 'BV-004', desc: '持续低压', prob: 78 },
  { device: 'BV-012', desc: '跌落后漂移', prob: 66 },
  { device: 'BV-016', desc: '采集波动异常', prob: 59 },
  { device: 'BV-007', desc: '温度敏感', prob: 44 }
]);

const analysisModal = ref(false);
const forecastModal = ref(false);
const alertModal = ref(false);
const riskModal = ref(false);
const analysisProgress = ref(72);
const alertForm = reactive({ channel: '短信', message: '检测到低压风险，请安排巡检。' });
const currentRisk = ref(null);

const openRisk = (risk) => {
  currentRisk.value = risk;
  riskModal.value = true;
};
</script>
