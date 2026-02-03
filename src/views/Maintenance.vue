<template>
  <section class="grid-2">
    <div class="card">
      <div class="section-title">维护计划概览</div>
      <div class="grid-2">
        <div>
          <p>本周计划</p>
          <strong>18 项</strong>
        </div>
        <div>
          <p>已完成</p>
          <strong>11 项</strong>
        </div>
        <div>
          <p>待执行</p>
          <strong>7 项</strong>
        </div>
        <div>
          <p>超期任务</p>
          <strong>1 项</strong>
        </div>
      </div>
      <div class="button-row">
        <button class="btn" @click="openModal('plan')">创建维护计划</button>
        <button class="btn secondary" @click="openModal('record')">登记保养记录</button>
        <button class="btn secondary" @click="openModal('progress')">任务进度汇总</button>
        <button class="btn secondary" @click="openModal('tips')">维护提醒</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title">计划完成率</div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: `${item.value}%` }"
        ></div>
      </div>
      <p style="margin-top: 12px; color: #607088">每周计划完成率保持在 70% 以上。</p>
    </div>
  </section>

  <section class="card" style="margin-top: 18px;">
    <div class="section-title">维护任务清单</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>任务编号</th>
          <th>维护设备</th>
          <th>计划日期</th>
          <th>负责人</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.device }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.owner }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>

  <BaseModal :show="modal.type === 'plan'" title="创建维护计划" @close="closeModal">
    <div class="form-grid">
      <div>
        <label>设备类型</label>
        <select v-model="planForm.device">
          <option>消防泵</option>
          <option>喷淋系统</option>
          <option>灭火器</option>
          <option>气体灭火系统</option>
        </select>
      </div>
      <div>
        <label>计划日期</label>
        <input v-model="planForm.date" type="date" />
      </div>
      <div>
        <label>负责人</label>
        <input v-model="planForm.owner" placeholder="填写负责人姓名" />
      </div>
      <div>
        <label>维护内容</label>
        <textarea v-model="planForm.detail" rows="3" placeholder="填写维护任务"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn secondary" @click="closeModal">取消</button>
      <button class="btn" @click="submitPlan">保存计划</button>
    </template>
  </BaseModal>

  <BaseModal :show="modal.type === 'record'" title="登记保养记录" @close="closeModal">
    <div class="form-grid">
      <div>
        <label>关联任务</label>
        <select v-model="recordForm.code">
          <option v-for="item in tableData.slice(0, 8)" :key="item.id">{{ item.code }}</option>
        </select>
      </div>
      <div>
        <label>维护结果</label>
        <select v-model="recordForm.result">
          <option>正常完成</option>
          <option>发现隐患</option>
          <option>需复检</option>
        </select>
      </div>
      <div>
        <label>维护记录</label>
        <textarea v-model="recordForm.note" rows="3" placeholder="填写维护情况"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn secondary" @click="closeModal">取消</button>
      <button class="btn" @click="submitRecord">确认登记</button>
    </template>
  </BaseModal>

  <BaseModal :show="modal.type === 'progress'" title="任务进度汇总" @close="closeModal">
    <p>正在生成维护任务进度汇总。</p>
    <div style="margin-top: 16px;">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <p style="margin-top: 8px;">完成度 {{ progress }}%</p>
    </div>
  </BaseModal>

  <BaseModal :show="modal.type === 'tips'" title="维护提醒" @close="closeModal">
    <ul style="line-height: 1.8; color: #51647a; padding-left: 18px;">
      <li>3 号楼消防泵需在今晚 20:00 前完成试运行。</li>
      <li>灭火器季度检查名单已更新，请按计划执行。</li>
      <li>气体灭火系统过滤器需要更换。</li>
    </ul>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, onUnmounted } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  code: `MT-${String(index + 1).padStart(3, '0')}`,
  device: ['消防泵', '喷淋系统', '灭火器', '气体灭火系统'][index % 4],
  date: `2024-05-${String((index % 28) + 1).padStart(2, '0')}`,
  owner: ['刘洋', '陈晨', '孙勇', '姚敏'][index % 4],
  status: index % 5 === 0 ? '待执行' : '已排期'
}));

const chartData = [
  { label: '周一', value: 60 },
  { label: '周二', value: 65 },
  { label: '周三', value: 70 },
  { label: '周四', value: 78 },
  { label: '周五', value: 82 }
];

const modal = reactive({ type: '' });
const progress = ref(0);
let timer;

const planForm = reactive({
  device: '消防泵',
  date: new Date().toISOString().slice(0, 10),
  owner: '',
  detail: ''
});

const recordForm = reactive({
  code: 'MT-001',
  result: '正常完成',
  note: ''
});

const openModal = (type) => {
  modal.type = type;
  if (type === 'progress') {
    progress.value = 8;
    timer = setInterval(() => {
      progress.value = Math.min(100, progress.value + 12);
      if (progress.value >= 100) {
        clearInterval(timer);
      }
    }, 420);
  }
};

const closeModal = () => {
  modal.type = '';
  if (timer) {
    clearInterval(timer);
  }
};

const submitPlan = () => {
  modal.type = 'tips';
};

const submitRecord = () => {
  modal.type = 'tips';
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
