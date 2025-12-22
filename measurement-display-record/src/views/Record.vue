<template>
  <div class="grid two">
    <div class="card">
      <div class="section-title">数据保存策略</div>
      <div class="grid three">
        <div class="kpi">
          <span>今日保存</span>
          <strong>126 条</strong>
        </div>
        <div class="kpi">
          <span>队列待写入</span>
          <strong>14 条</strong>
        </div>
        <div class="kpi">
          <span>云同步成功率</span>
          <strong>98%</strong>
        </div>
      </div>
      <div style="margin-top: 16px; display:flex; gap: 12px; flex-wrap: wrap;">
        <button class="primary-btn" @click="openForm">手动保存</button>
        <button class="secondary-btn" @click="openProgress">上传进度</button>
        <button class="secondary-btn" @click="openTip">保存提示</button>
      </div>
      <div class="tag-list" style="margin-top: 16px;">
        <span class="tag">本地双备份</span>
        <span class="tag">加密存储</span>
        <span class="tag">自动归档</span>
      </div>
    </div>

    <div class="card">
      <div class="section-title">保存记录</div>
      <table class="table">
        <thead>
          <tr>
            <th>记录编号</th>
            <th>保存方式</th>
            <th>数据量</th>
            <th>校验</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.mode }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.checksum }}</td>
            <td><span class="badge" :class="item.statusClass">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <teleport to="body">
    <div v-if="formVisible" class="modal-backdrop">
      <div class="modal">
        <h3>手动保存</h3>
        <div class="form-field">
          <label>保存批次</label>
          <input v-model="form.batch" placeholder="例如 2024-09-A" />
        </div>
        <div class="form-field">
          <label>数据说明</label>
          <input v-model="form.note" placeholder="填写本次保存说明" />
        </div>
        <div class="form-field">
          <label>目标位置</label>
          <select v-model="form.target">
            <option value="本地磁盘">本地磁盘</option>
            <option value="私有云">私有云</option>
            <option value="移动介质">移动介质</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="formVisible = false">取消</button>
          <button class="primary-btn" @click="saveRecord">确认保存</button>
        </div>
      </div>
    </div>

    <div v-if="progressVisible" class="modal-backdrop">
      <div class="modal">
        <h3>上传进度</h3>
        <p>正在同步保存至云端。</p>
        <div class="progress-bar">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="progressVisible = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="tipVisible" class="modal-backdrop">
      <div class="modal">
        <h3>保存提示</h3>
        <p>系统将保留最近 90 天数据，可在历史模块中快速检索。</p>
        <div class="modal-actions">
          <button class="primary-btn" @click="tipVisible = false">知道了</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, ref } from 'vue';

const records = ref([
  { id: 'RC-1001', mode: '自动', size: '12.4MB', checksum: 'OK', status: '完成', statusClass: 'success' },
  { id: 'RC-1002', mode: '自动', size: '9.8MB', checksum: 'OK', status: '完成', statusClass: 'success' },
  { id: 'RC-1003', mode: '手动', size: '8.1MB', checksum: 'OK', status: '完成', statusClass: 'success' },
  { id: 'RC-1004', mode: '自动', size: '10.3MB', checksum: 'OK', status: '完成', statusClass: 'success' },
  { id: 'RC-1005', mode: '自动', size: '11.7MB', checksum: 'OK', status: '完成', statusClass: 'success' },
  { id: 'RC-1006', mode: '手动', size: '6.4MB', checksum: 'OK', status: '完成', statusClass: 'success' },
  { id: 'RC-1007', mode: '自动', size: '13.9MB', checksum: 'OK', status: '完成', statusClass: 'success' },
  { id: 'RC-1008', mode: '自动', size: '9.1MB', checksum: 'OK', status: '完成', statusClass: 'success' },
  { id: 'RC-1009', mode: '手动', size: '7.5MB', checksum: 'OK', status: '完成', statusClass: 'success' },
  { id: 'RC-1010', mode: '自动', size: '10.9MB', checksum: 'OK', status: '完成', statusClass: 'success' }
]);

const formVisible = ref(false);
const progressVisible = ref(false);
const tipVisible = ref(false);
const progress = ref(70);

const form = reactive({
  batch: '2024-09-A',
  note: '夜间自动保存',
  target: '私有云'
});

const openForm = () => {
  formVisible.value = true;
};

const openProgress = () => {
  progressVisible.value = true;
  progress.value = 70;
};

const openTip = () => {
  tipVisible.value = true;
};

const saveRecord = () => {
  records.value.unshift({
    id: `RC-${1000 + records.value.length + 1}`,
    mode: '手动',
    size: '5.8MB',
    checksum: 'OK',
    status: '完成',
    statusClass: 'success'
  });
  formVisible.value = false;
};
</script>
