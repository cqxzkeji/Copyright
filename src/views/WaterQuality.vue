<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
    <div class="card">
      <div class="section-title">水质指标分布</div>
      <div class="muted">近期在线检测浊度/余氯趋势</div>
      <div class="chart-bars">
        <div v-for="item in indicators" :key="item.site" class="chart-bar" :style="{ height: `${item.turbidity * 12}%` }">
          <span>{{ item.site }}</span>
        </div>
      </div>
      <div class="chip-bar">
        <span class="badge success">达标率 98%</span>
        <span class="badge info">余氯稳定</span>
        <span class="badge warning">高温工况</span>
      </div>
    </div>
    <div class="card">
      <div class="section-title">快速操作</div>
      <div class="flex-row">
        <button class="btn primary" @click="showSample=true">下发采样任务</button>
        <button class="btn danger" @click="showDisinfect=true">触发在线消毒</button>
        <button class="btn outline" @click="showPrompt=true">查看提示</button>
      </div>
      <p class="muted">采样任务将同步到实验室排程，消毒操作会验证余氯安全阈值。</p>
    </div>
  </div>

  <div class="card">
    <div class="section-title">关键水质数据</div>
    <table class="table">
      <thead>
        <tr>
          <th>站点</th><th>浊度(NTU)</th><th>余氯(mg/L)</th><th>pH</th><th>电导率(μS/cm)</th><th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in indicators" :key="row.site">
          <td>{{ row.site }}</td>
          <td>{{ row.turbidity.toFixed(2) }}</td>
          <td>{{ row.chlorine.toFixed(2) }}</td>
          <td>{{ row.ph.toFixed(1) }}</td>
          <td>{{ row.ec }}</td>
          <td><span class="badge" :class="row.flag === '正常' ? 'success' : 'warning'">{{ row.flag }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-model="showSample" title="下发采样任务">
    <form class="modal-form" @submit.prevent="submitSample">
      <label>采样站点</label>
      <select v-model="sampleForm.site" required>
        <option v-for="item in indicators" :key="item.site" :value="item.site">{{ item.site }}</option>
      </select>
      <label>采样方式</label>
      <select v-model="sampleForm.mode" required>
        <option>在线自动</option>
        <option>人工抓样</option>
      </select>
      <label>备注</label>
      <textarea v-model="sampleForm.memo" placeholder="特殊环境、温度等"></textarea>
      <div class="modal-actions">
        <button class="btn outline" type="button" @click="showSample=false">取消</button>
        <button class="btn primary" type="submit">提交任务</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal v-model="showDisinfect" title="在线消毒验证">
    <p>系统将检查各站余氯是否低于0.3 mg/L后再执行。</p>
    <div class="modal-actions">
      <button class="btn outline" @click="showDisinfect=false">取消</button>
      <button class="btn danger" @click="triggerDisinfect">确认触发</button>
    </div>
  </BaseModal>

  <BaseModal v-model="showPrompt" title="提示信息">
    <p>水质数据超过预警阈值将自动推送到系统监控模块，并生成水质报告。</p>
    <div class="modal-actions"><button class="btn primary" @click="showPrompt=false">关闭</button></div>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const indicators = reactive([
  { site: '商务区A', turbidity: 0.6, chlorine: 0.45, ph: 7.1, ec: 223, flag: '正常' },
  { site: '工业园B', turbidity: 0.9, chlorine: 0.38, ph: 7.2, ec: 250, flag: '正常' },
  { site: '住区C', turbidity: 0.5, chlorine: 0.42, ph: 7.0, ec: 210, flag: '正常' },
  { site: '医院D', turbidity: 1.2, chlorine: 0.3, ph: 7.4, ec: 240, flag: '关注' },
  { site: '学校E', turbidity: 0.7, chlorine: 0.5, ph: 7.1, ec: 198, flag: '正常' },
  { site: '会展中心F', turbidity: 0.8, chlorine: 0.4, ph: 7.3, ec: 230, flag: '正常' },
  { site: '公园G', turbidity: 0.4, chlorine: 0.37, ph: 7.0, ec: 185, flag: '正常' },
  { site: '物流H', turbidity: 0.9, chlorine: 0.33, ph: 7.1, ec: 210, flag: '正常' },
  { site: '酒店I', turbidity: 0.6, chlorine: 0.36, ph: 7.2, ec: 190, flag: '正常' },
  { site: '文创J', turbidity: 0.5, chlorine: 0.35, ph: 7.2, ec: 205, flag: '正常' }
]);

const showSample = ref(false);
const showDisinfect = ref(false);
const showPrompt = ref(false);
const sampleForm = reactive({ site: '', mode: '在线自动', memo: '' });

const submitSample = () => {
  alert(`已安排 ${sampleForm.site} 的${sampleForm.mode}采样`);
  showSample.value = false;
};

const triggerDisinfect = () => {
  const lowSites = indicators.filter((i) => i.chlorine < 0.35).map((i) => i.site).join('、') || '全部达标';
  alert(`消毒指令已发送。余氯低于阈值的站点：${lowSites}`);
  showDisinfect.value = false;
};
</script>

<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-form textarea,
.modal-form input,
.modal-form select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d9e3f0;
  background: #f8fbff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
