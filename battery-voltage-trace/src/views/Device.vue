<template>
  <div class="card">
    <div class="flex-between" style="margin-bottom: 12px;">
      <div>
        <h3 class="section-title">设备与防摔管理</h3>
        <p style="color:var(--muted);">蓄电池建档、防摔等级、跌落记录与维护信息管理。</p>
      </div>
      <div class="toolbar">
        <button class="btn btn-primary" @click="showCreate = true">新建设备</button>
        <button class="btn btn-ghost" @click="showDrop = true">记录跌落</button>
        <button class="btn btn-ghost" @click="showMaintain = true">维护计划</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>防摔等级</th>
          <th>电压(V)</th>
          <th>健康度</th>
          <th>维护窗口</th>
          <th>跌落次数</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in devices" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.grade }}</td>
          <td>{{ item.voltage }}</td>
          <td><span class="badge" :class="item.healthTag">{{ item.health }}</span></td>
          <td>{{ item.maintain }}</td>
          <td>{{ item.drops }}</td>
          <td>
            <div class="table-actions">
              <span class="tag"><span class="status-dot" :style="{background:item.statusColor}"></span>{{ item.status }}</span>
              <button class="btn btn-ghost" @click="openInfo(item)">详情</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showCreate" title="新建设备档案">
    <div class="form-row">
      <div>
        <label>设备编号</label>
        <input class="input" v-model="newDevice.id" placeholder="BV-001" />
      </div>
      <div>
        <label>防摔等级</label>
        <select class="select" v-model="newDevice.grade">
          <option>A 轻量防摔</option>
          <option>B 强化缓冲</option>
          <option>C 工业重载</option>
        </select>
      </div>
      <div>
        <label>额定电压(V)</label>
        <input class="input" v-model="newDevice.voltage" type="number" />
      </div>
    </div>
    <div>
      <label>备注</label>
      <textarea class="input" rows="3" v-model="newDevice.remark" placeholder="填写适配场景与保护件"></textarea>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showDrop" title="记录跌落事件">
    <div class="form-row">
      <div>
        <label>设备编号</label>
        <select v-model="dropForm.id" class="select">
          <option v-for="item in devices" :key="item.id">{{ item.id }}</option>
        </select>
      </div>
      <div>
        <label>跌落高度(cm)</label>
        <input class="input" type="number" v-model="dropForm.height" />
      </div>
      <div>
        <label>现场备注</label>
        <input class="input" v-model="dropForm.note" />
      </div>
    </div>
    <div class="chip-row">
      <div class="tag">传感器自动触发</div>
      <div class="tag">影响评估: {{ dropRisk }}</div>
    </div>
  </ModalDialog>

  <ModalDialog v-model="showMaintain" title="维护计划" :withFooter="false">
    <p>选择维护日期后，系统会推送闭环任务。</p>
    <div class="form-row">
      <div>
        <label>维护人</label>
        <input class="input" v-model="maintainForm.owner" />
      </div>
      <div>
        <label>计划日期</label>
        <input class="input" type="date" v-model="maintainForm.date" />
      </div>
    </div>
    <div class="progress-track" style="margin-top: 10px;">
      <div class="progress-bar" :style="{width: maintainProgress + '%'}"></div>
    </div>
    <p style="color:var(--muted); margin-top:6px;">系统将自动对接维修单，剩余 {{ 100 - maintainProgress }}%</p>
  </ModalDialog>

  <ModalDialog v-model="infoModal" title="设备详情" :withFooter="false">
    <p>设备编号：{{ current?.id }}</p>
    <p>最近跌落记录：{{ current?.drops }} 次</p>
    <p>防摔等级：{{ current?.grade }}</p>
    <p>当前健康度：{{ current?.health }}</p>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const devices = reactive([
  { id: 'BV-001', grade: 'A', voltage: 54.2, health: '良好', healthTag: 'good', maintain: '每月', drops: 1, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-002', grade: 'B', voltage: 52.8, health: '需关注', healthTag: 'warn', maintain: '每季', drops: 2, status: '预警', statusColor: '#f59e0b' },
  { id: 'BV-003', grade: 'A', voltage: 55.1, health: '良好', healthTag: 'good', maintain: '每月', drops: 0, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-004', grade: 'C', voltage: 51.3, health: '退化', healthTag: 'danger', maintain: '每周', drops: 4, status: '离线', statusColor: '#c0392b' },
  { id: 'BV-005', grade: 'B', voltage: 53.6, health: '良好', healthTag: 'good', maintain: '每季', drops: 1, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-006', grade: 'A', voltage: 54.9, health: '良好', healthTag: 'good', maintain: '每月', drops: 0, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-007', grade: 'C', voltage: 50.7, health: '需关注', healthTag: 'warn', maintain: '每周', drops: 3, status: '预警', statusColor: '#f59e0b' },
  { id: 'BV-008', grade: 'B', voltage: 53.1, health: '良好', healthTag: 'good', maintain: '每季', drops: 1, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-009', grade: 'A', voltage: 55.0, health: '良好', healthTag: 'good', maintain: '每月', drops: 0, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-010', grade: 'B', voltage: 53.8, health: '良好', healthTag: 'good', maintain: '每季', drops: 2, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-011', grade: 'A', voltage: 54.5, health: '良好', healthTag: 'good', maintain: '每月', drops: 0, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-012', grade: 'C', voltage: 50.9, health: '退化', healthTag: 'danger', maintain: '每周', drops: 5, status: '离线', statusColor: '#c0392b' },
  { id: 'BV-013', grade: 'B', voltage: 53.3, health: '需关注', healthTag: 'warn', maintain: '每季', drops: 2, status: '预警', statusColor: '#f59e0b' },
  { id: 'BV-014', grade: 'A', voltage: 54.7, health: '良好', healthTag: 'good', maintain: '每月', drops: 1, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-015', grade: 'B', voltage: 53.0, health: '良好', healthTag: 'good', maintain: '每季', drops: 1, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-016', grade: 'C', voltage: 50.5, health: '退化', healthTag: 'danger', maintain: '每周', drops: 6, status: '预警', statusColor: '#f59e0b' },
  { id: 'BV-017', grade: 'A', voltage: 55.4, health: '良好', healthTag: 'good', maintain: '每月', drops: 0, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-018', grade: 'B', voltage: 52.9, health: '需关注', healthTag: 'warn', maintain: '每季', drops: 2, status: '预警', statusColor: '#f59e0b' },
  { id: 'BV-019', grade: 'A', voltage: 54.3, health: '良好', healthTag: 'good', maintain: '每月', drops: 1, status: '在线', statusColor: '#23c19a' },
  { id: 'BV-020', grade: 'C', voltage: 50.2, health: '退化', healthTag: 'danger', maintain: '每周', drops: 4, status: '离线', statusColor: '#c0392b' }
]);

const showCreate = ref(false);
const showDrop = ref(false);
const showMaintain = ref(false);
const infoModal = ref(false);
const current = ref(null);
const newDevice = reactive({ id: '', grade: 'A 轻量防摔', voltage: 54.0, remark: '' });
const dropForm = reactive({ id: 'BV-001', height: 0, note: '' });
const maintainForm = reactive({ owner: '李工程师', date: '' });
const maintainProgress = ref(65);

const dropRisk = computed(() => {
  if (dropForm.height > 80) return '高风险，需立即检测';
  if (dropForm.height > 40) return '中风险，建议巡检';
  return '轻微，记录即可';
});

const openInfo = (item) => {
  current.value = item;
  infoModal.value = true;
};
</script>
