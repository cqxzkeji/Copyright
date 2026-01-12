<template>
  <div class="grid two">
    <div class="card">
      <div class="section-title">流程概览</div>
      <div class="grid two">
        <div>
          <div style="font-size: 26px; font-weight: 700;">128</div>
          <div style="color: #6b7a99; font-size: 12px;">本周创建日报</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 700;">92%</div>
          <div style="color: #6b7a99; font-size: 12px;">审批完成率</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 700;">3.4h</div>
          <div style="color: #6b7a99; font-size: 12px;">平均审批时长</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 700;">18</div>
          <div style="color: #6b7a99; font-size: 12px;">待归档日报</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">审批节奏</div>
      <div class="chart">
        <div v-for="item in flowChart" :key="item.label" class="chart-row">
          <span>{{ item.label }}</span>
          <div class="chart-bar">
            <span :style="{ width: item.value + '%' }"></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">流程操作</div>
    <div class="actions">
      <button class="btn" type="button" @click="openModal('create')">新建日报</button>
      <button class="btn secondary" type="button" @click="openModal('approve')">批量审批</button>
      <button class="btn outline" type="button" @click="openModal('archive')">归档任务</button>
      <button class="btn secondary" type="button" @click="openModal('progress')">流程进度</button>
      <button class="btn outline" type="button" @click="openModal('tip')">操作提示</button>
    </div>
  </div>

  <div class="card">
    <div class="section-title">日报流转清单</div>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>日报主题</th>
          <th>提交人</th>
          <th>部门</th>
          <th>状态</th>
          <th>更新时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reports" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.team }}</td>
          <td><span class="badge" :class="item.badge">{{ item.status }}</span></td>
          <td>{{ item.updated }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal v-if="activeModal" :title="modalTitle" @close="closeModal">
    <template v-if="activeModal === 'create'">
      <div class="form-grid">
        <div>
          <label>日报主题</label>
          <input v-model="form.title" placeholder="输入日报主题" />
        </div>
        <div>
          <label>负责人</label>
          <input v-model="form.owner" placeholder="输入负责人" />
        </div>
        <div>
          <label>汇报重点</label>
          <textarea v-model="form.summary" rows="3" placeholder="填写重点事项"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'approve'">
      <div class="form-grid">
        <div>
          <label>审批策略</label>
          <select v-model="form.approval">
            <option value="快速审批">快速审批</option>
            <option value="严格复核">严格复核</option>
            <option value="主管会签">主管会签</option>
          </select>
        </div>
        <div>
          <label>审批备注</label>
          <textarea v-model="form.remark" rows="3" placeholder="填写审批意见"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'archive'">
      <div class="form-grid">
        <div>
          <label>归档周期</label>
          <select v-model="form.archiveRange">
            <option value="本周">本周</option>
            <option value="本月">本月</option>
            <option value="本季度">本季度</option>
          </select>
        </div>
        <div>
          <label>归档说明</label>
          <textarea v-model="form.archiveNote" rows="3" placeholder="填写归档说明"></textarea>
        </div>
      </div>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>当前流程节点完成度概览：</p>
      <div style="display: grid; gap: 8px; margin-top: 10px;">
        <div>
          <div style="font-size: 12px; color: #6b7a99;">日报汇总</div>
          <div class="progress"><span style="width: 82%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">审批流转</div>
          <div class="progress"><span style="width: 64%"></span></div>
        </div>
        <div>
          <div style="font-size: 12px; color: #6b7a99;">归档入库</div>
          <div class="progress"><span style="width: 48%"></span></div>
        </div>
      </div>
    </template>
    <template v-else>
      <p>支持批量审批、归档提醒与进度跟踪，请在高峰期使用快速审批策略。</p>
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
  title: '',
  owner: '',
  summary: '',
  approval: '快速审批',
  remark: '',
  archiveRange: '本周',
  archiveNote: ''
});

const flowChart = [
  { label: '创建', value: 90 },
  { label: '提交', value: 82 },
  { label: '审批', value: 68 },
  { label: '归档', value: 52 },
  { label: '追踪', value: 74 }
];

const reports = Array.from({ length: 22 }, (_, index) => {
  const id = 3001 + index;
  const statuses = [
    { text: '待审批', badge: 'warning' },
    { text: '已完成', badge: 'success' },
    { text: '待归档', badge: 'info' }
  ];
  const status = statuses[index % statuses.length];
  return {
    id,
    title: `日报流程-${id}`,
    owner: ['李明', '王珊', '周凯', '刘洋'][index % 4],
    team: ['运营中心', '研发部', '数据中台'][index % 3],
    status: status.text,
    badge: status.badge,
    updated: `2024-07-${(index % 28 + 1).toString().padStart(2, '0')}`
  };
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const modalTitleMap = {
  create: '新建日报',
  approve: '批量审批',
  archive: '归档任务配置',
  progress: '流程进度',
  tip: '操作提示'
};

const modalTitle = computed(() => modalTitleMap[activeModal.value] || '提示');
</script>
