<template>
  <div class="grid">
    <ChartPanel
      title="协同服务可用率"
      subtitle="近7日"
      :labels="chart.labels"
      :values="chart.values"
    />
    <div class="card">
      <div class="section-title">
        <h3>系统配置与协同</h3>
        <div class="actions">
          <button class="btn" @click="showService = true">新增协同服务</button>
          <button class="btn secondary" @click="startReload">重载配置</button>
          <button class="btn ghost" @click="showNotice = true">系统提示</button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>服务名</th>
              <th>类型</th>
              <th>状态</th>
              <th>负责人</th>
              <th class="hide-mobile">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.name">
              <td>{{ service.name }}</td>
              <td>{{ service.type }}</td>
              <td><span class="status-pill" :class="service.status === '正常' ? 'success' : 'warning'">{{ service.status }}</span></td>
              <td>{{ service.owner }}</td>
              <td class="hide-mobile">{{ service.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <BaseModal v-model="showService" title="新增协同服务">
    <div class="form-grid">
      <label>服务名称<input v-model="serviceForm.name" placeholder="如：ERP库存同步" /></label>
      <label>类型
        <select v-model="serviceForm.type">
          <option>消息</option>
          <option>数据集成</option>
          <option>自动化</option>
        </select>
      </label>
      <label>负责人<input v-model="serviceForm.owner" placeholder="填写负责人" /></label>
      <label class="full-width">描述
        <textarea v-model="serviceForm.note" rows="3" placeholder="说明接口作用"></textarea>
      </label>
    </div>
    <template #actions>
      <button class="btn ghost" @click="showService = false">取消</button>
      <button class="btn" @click="addService">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="showNotice" title="系统提示">
    <div class="toast">跨模块协同需要先完成主数据同步，再打开外部消息推送通道。</div>
  </BaseModal>

  <BaseModal v-model="showProgress" title="配置重载中">
    <p>正在刷新缓存与路由表。</p>
    <div class="progress-bar"><div class="progress-bar__fill" :style="{ width: progress + '%' }"></div></div>
    <p>{{ progress }}% 已完成</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import ChartPanel from '../components/ChartPanel.vue';

const showService = ref(false);
const showNotice = ref(false);
const showProgress = ref(false);
const progress = ref(0);

const chart = {
  labels: ['一', '二', '三', '四', '五', '六', '日'],
  values: [95, 96, 92, 94, 98, 97, 99]
};

const services = ref([
  { name: '渠道订单回传', type: '消息', status: '正常', owner: '李芳', note: '消息队列+补偿' },
  { name: '仓库库存同步', type: '数据集成', status: '正常', owner: '杨俊', note: '每5分钟增量同步' },
  { name: '冷链预警推送', type: '消息', status: '正常', owner: '韩旭', note: '温控异常短信' },
  { name: '财务对账', type: '数据集成', status: '正常', owner: '吴静', note: '日终对账' },
  { name: '内容合规审核', type: '自动化', status: '告警', owner: '刘畅', note: 'AI审核延时' },
  { name: '会员分层', type: '自动化', status: '正常', owner: '沈舟', note: '周一分层' },
  { name: '供应商考核', type: '自动化', status: '正常', owner: '陈思思', note: '季度考核' },
  { name: '农残检测上报', type: '消息', status: '正常', owner: '苏清', note: '日报上报' },
  { name: '客服工单', type: '数据集成', status: '正常', owner: '魏扬', note: '工单同步' },
  { name: '渠道价格监控', type: '自动化', status: '告警', owner: '张源', note: '异常价提醒' }
]);

const serviceForm = reactive({ name: '', type: '消息', owner: '', note: '' });

const addService = () => {
  if (!serviceForm.name) return;
  services.value.unshift({ ...serviceForm, status: '正常' });
  showService.value = false;
};

const startReload = () => {
  progress.value = 0;
  showProgress.value = true;
  const timer = setInterval(() => {
    progress.value += 25;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 700);
    }
  }, 350);
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
