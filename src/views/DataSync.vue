<template>
  <div class="grid two">
    <div class="card">
      <div class="section-title">同步健康度</div>
      <div style="font-size: 26px; font-weight: 700;">96.2%</div>
      <div style="font-size: 12px; color: #6b7a99;">过去24小时成功率</div>
      <div class="chart" style="margin-top: 16px;">
        <div v-for="item in syncChart" :key="item.label" class="chart-row">
          <span>{{ item.label }}</span>
          <div class="chart-bar">
            <span :style="{ width: item.value + '%' }"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">同步操作</div>
      <div class="actions">
        <button class="btn" type="button" @click="openModal('create')">新建同步</button>
        <button class="btn secondary" type="button" @click="openModal('run')">执行同步</button>
        <button class="btn outline" type="button" @click="openModal('log')">查看日志</button>
        <button class="btn secondary" type="button" @click="openModal('progress')">同步进度</button>
        <button class="btn outline" type="button" @click="openModal('tip')">操作提示</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">数据源同步清单</div>
    <table class="table">
      <thead>
        <tr>
          <th>数据源</th>
          <th>类型</th>
          <th>负责人</th>
          <th>上次同步</th>
          <th>延迟</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in syncTable" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.last }}</td>
          <td>{{ item.delay }}</td>
          <td><span class="badge" :class="item.badge">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal">
    <template v-if="activeModal === 'create'">
      <div class="form-grid">
        <div>
          <label>数据源名称</label>
          <input v-model="form.source" placeholder="输入数据源名称" />
        </div>
        <div>
          <label>同步频率</label>
          <select v-model="form.frequency">
            <option value="每30分钟">每30分钟</option>
            <option value="每小时">每小时</option>
            <option value="每天">每天</option>
          </select>
        </div>
        <div>
          <label>集成说明</label>
          <textarea v-model="form.note" rows="3" placeholder="填写集成说明"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'run'">
      <div class="form-grid">
        <div>
          <label>选择任务</label>
          <select v-model="form.task">
            <option value="全量同步">全量同步</option>
            <option value="增量同步">增量同步</option>
            <option value="异常补齐">异常补齐</option>
          </select>
        </div>
        <div>
          <label>执行窗口</label>
          <input v-model="form.window" placeholder="例如：03:00-05:00" />
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'log'">
      <p>最近同步日志已汇总，请确认异常项并安排重试。</p>
      <ul style="padding-left: 18px; margin: 10px 0; color: #5b6b82;">
        <li>CRM 数据源延迟 18 分钟</li>
        <li>财务指标校验失败 2 条</li>
        <li>营销线索同步完成</li>
      </ul>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>同步任务执行进度</p>
      <div style="display: grid; gap: 8px; margin-top: 12px;">
        <div>
          <div style="font-size: 12px; color: #6b7a99;">数据抽取</div>
          <div class="progress"><span style="width: 78%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">数据清洗</div>
          <div class="progress"><span style="width: 56%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">数据落库</div>
          <div class="progress"><span style="width: 44%"></span></div>
        </div>
      </div>
    </template>
    <template v-else>
      <p>建议在低峰期执行全量同步，异常任务可使用增量模式补齐。</p>
    </template>
    <template #actions>
      <button class="btn" type="button" @click="closeModal">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const form = ref({
  source: '',
  frequency: '每30分钟',
  note: '',
  task: '全量同步',
  window: ''
});

const syncChart = [
  { label: 'CRM', value: 90 },
  { label: '财务', value: 76 },
  { label: '营销', value: 84 },
  { label: '客户画像', value: 68 },
  { label: '库存', value: 72 }
];

const syncTable = Array.from({ length: 21 }, (_, index) => {
  const status = [
    { text: '已同步', badge: 'success' },
    { text: '同步中', badge: 'info' },
    { text: '延迟', badge: 'warning' }
  ][index % 3];
  return {
    name: `数据源-${index + 1}`,
    type: ['数据库', 'API', '文件'][index % 3],
    owner: ['韩雪', '周鹏', '林涛', '孙倩'][index % 4],
    last: `2024-07-${(index % 28 + 1).toString().padStart(2, '0')} 08:${(index % 6) * 10}`,
    delay: `${index % 5} 分钟`,
    status: status.text,
    badge: status.badge
  };
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const modalTitleMap = {
  create: '新建同步任务',
  run: '执行同步',
  log: '同步日志',
  progress: '同步进度',
  tip: '操作提示'
};

const modalTitle = computed(() => modalTitleMap[activeModal.value] || '提示');
</script>
