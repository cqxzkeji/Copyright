<template>
  <div class="grid two">
    <div class="card">
      <div class="section-title">系统状态</div>
      <div class="grid two">
        <div>
          <div style="font-size: 26px; font-weight: 700;">稳定</div>
          <div style="font-size: 12px; color: #6b7a99;">运行状态</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 700;">45ms</div>
          <div style="font-size: 12px; color: #6b7a99;">平均响应</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 700;">8</div>
          <div style="font-size: 12px; color: #6b7a99;">待更新策略</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 700;">3.1GB</div>
          <div style="font-size: 12px; color: #6b7a99;">缓存占用</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">系统容量</div>
      <div class="chart">
        <div v-for="item in capacityChart" :key="item.label" class="chart-row">
          <span>{{ item.label }}</span>
          <div class="chart-bar">
            <span :style="{ width: item.value + '%' }"></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">配置操作</div>
    <div class="actions">
      <button class="btn" type="button" @click="openModal('update')">更新参数</button>
      <button class="btn secondary" type="button" @click="openModal('backup')">备份配置</button>
      <button class="btn outline" type="button" @click="openModal('notify')">通知策略</button>
      <button class="btn secondary" type="button" @click="openModal('progress')">更新进度</button>
      <button class="btn outline" type="button" @click="openModal('tip')">操作提示</button>
    </div>
  </div>

  <div class="card">
    <div class="section-title">系统参数清单</div>
    <table class="table">
      <thead>
        <tr>
          <th>参数名称</th>
          <th>当前值</th>
          <th>说明</th>
          <th>负责人</th>
          <th>更新时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in settingsTable" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.desc }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.updated }}</td>
          <td><span class="badge" :class="item.badge">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal">
    <template v-if="activeModal === 'update'">
      <div class="form-grid">
        <div>
          <label>配置项</label>
          <input v-model="form.setting" placeholder="输入配置项" />
        </div>
        <div>
          <label>新值</label>
          <input v-model="form.value" placeholder="输入新的配置值" />
        </div>
        <div>
          <label>变更说明</label>
          <textarea v-model="form.note" rows="3" placeholder="填写变更说明"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'backup'">
      <div class="form-grid">
        <div>
          <label>备份方式</label>
          <select v-model="form.backupType">
            <option value="即时备份">即时备份</option>
            <option value="定时备份">定时备份</option>
            <option value="离线导出">离线导出</option>
          </select>
        </div>
        <div>
          <label>备份说明</label>
          <textarea v-model="form.backupNote" rows="3" placeholder="填写备份说明"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'notify'">
      <div class="form-grid">
        <div>
          <label>通知级别</label>
          <select v-model="form.notifyLevel">
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
        </div>
        <div>
          <label>通知渠道</label>
          <input v-model="form.channel" placeholder="企业微信/邮件" />
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>系统更新进度</p>
      <div style="display: grid; gap: 8px; margin-top: 12px;">
        <div>
          <div style="font-size: 12px; color: #6b7a99;">配置同步</div>
          <div class="progress"><span style="width: 58%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">缓存刷新</div>
          <div class="progress"><span style="width: 44%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">服务健康检查</div>
          <div class="progress"><span style="width: 32%"></span></div>
        </div>
      </div>
    </template>
    <template v-else>
      <p>配置更新将自动同步到日报流程与指标服务，建议在低峰期执行。</p>
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
  setting: '',
  value: '',
  note: '',
  backupType: '即时备份',
  backupNote: '',
  notifyLevel: '高',
  channel: ''
});

const capacityChart = [
  { label: '存储', value: 70 },
  { label: '日志', value: 52 },
  { label: '同步队列', value: 63 },
  { label: '报表缓存', value: 46 },
  { label: '权限缓存', value: 58 }
];

const settingsTable = Array.from({ length: 22 }, (_, index) => {
  const status = [
    { text: '正常', badge: 'success' },
    { text: '待更新', badge: 'warning' },
    { text: '观察', badge: 'info' }
  ][index % 3];
  return {
    name: `配置项-${index + 1}`,
    value: `值-${index + 10}`,
    desc: '系统参数配置',
    owner: ['运维', '管理员', '数据中台'][index % 3],
    updated: `2024-07-${(index % 28 + 1).toString().padStart(2, '0')}`,
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
  update: '更新参数',
  backup: '备份配置',
  notify: '通知策略',
  progress: '更新进度',
  tip: '操作提示'
};

const modalTitle = computed(() => modalTitleMap[activeModal.value] || '提示');
</script>
