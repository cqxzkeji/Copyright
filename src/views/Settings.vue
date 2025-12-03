<template>
  <section>
    <div class="section-header">
      <div>
        <div class="section-title">系统设置</div>
        <div style="color: #6b7a99;">调整告警阈值、通知方式与班次模板</div>
      </div>
      <div class="section-actions">
        <button class="primary-btn" @click="openSave">保存设置</button>
        <button class="secondary-btn" @click="openReset">恢复默认</button>
        <button class="secondary-btn" @click="openProgress('同步参数到机台...')">同步至机台</button>
      </div>
    </div>

    <div class="card" style="margin: 16px 0;">
      <h3>阈值与通知</h3>
      <div class="form-grid">
        <div>
          <label class="label">温度阈值(℃)</label>
          <input v-model.number="settings.temp" type="number" />
        </div>
        <div>
          <label class="label">振动阈值(mm/s)</label>
          <input v-model.number="settings.vibration" type="number" />
        </div>
        <div>
          <label class="label">质检不良率阈值(%)</label>
          <input v-model.number="settings.defect" type="number" />
        </div>
        <div>
          <label class="label">通知方式</label>
          <select v-model="settings.notify">
            <option value="短信">短信</option>
            <option value="邮件">邮件</option>
            <option value="企业微信">企业微信</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>班次模板</h3>
      <table class="table">
        <thead>
          <tr>
            <th>班次</th>
            <th>开始</th>
            <th>结束</th>
            <th>打磨线</th>
            <th>抛光线</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="shift in shifts" :key="shift.name">
            <td>{{ shift.name }}</td>
            <td>{{ shift.start }}</td>
            <td>{{ shift.end }}</td>
            <td>{{ shift.grind }} 人</td>
            <td>{{ shift.polish }} 人</td>
            <td><button class="text-btn" @click="openEdit(shift)">编辑</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 保存提示 -->
    <div v-if="showToast" class="modal-overlay" @click.self="showToast = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">已保存</div>
          <button class="text-btn" @click="showToast = false">关闭</button>
        </div>
        <div class="modal-body">
          设置已保存，并将在 30 秒内推送到所有机台控制器。
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showToast = false">好的</button>
        </div>
      </div>
    </div>

    <!-- 重置确认 -->
    <div v-if="showReset" class="modal-overlay" @click.self="showReset = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">确认恢复默认</div>
          <button class="text-btn" @click="showReset = false">关闭</button>
        </div>
        <div class="modal-body">
          将把阈值与班次模板还原为系统默认，是否继续？
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showReset = false">取消</button>
          <button class="primary-btn" @click="resetSettings">确认</button>
        </div>
      </div>
    </div>

    <!-- 编辑班次 -->
    <div v-if="editing" class="modal-overlay" @click.self="editing = null">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">编辑 {{ editing.name }}</div>
          <button class="text-btn" @click="editing = null">关闭</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div>
              <label class="label">开始时间</label>
              <input v-model="editing.start" type="time" />
            </div>
            <div>
              <label class="label">结束时间</label>
              <input v-model="editing.end" type="time" />
            </div>
            <div>
              <label class="label">打磨线人数</label>
              <input v-model.number="editing.grind" type="number" />
            </div>
            <div>
              <label class="label">抛光线人数</label>
              <input v-model.number="editing.polish" type="number" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="editing = null">取消</button>
          <button class="primary-btn" @click="saveShift">保存</button>
        </div>
      </div>
    </div>

    <!-- 进度提示 -->
    <div v-if="progressMessage" class="modal-overlay" @click.self="progressMessage = ''">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">同步中</div>
          <button class="text-btn" @click="progressMessage = ''">关闭</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 10px;">{{ progressMessage }}</div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const settings = reactive({ temp: 65, vibration: 6, defect: 3, notify: '企业微信' });
const shifts = reactive([
  { name: '早班', start: '07:00', end: '15:00', grind: 6, polish: 4 },
  { name: '中班', start: '15:00', end: '23:00', grind: 5, polish: 4 },
  { name: '晚班', start: '23:00', end: '07:00', grind: 4, polish: 3 },
  { name: '周末班', start: '08:00', end: '18:00', grind: 3, polish: 2 }
]);

const showToast = ref(false);
const showReset = ref(false);
const editing = ref(null);
const progressMessage = ref('');
const progress = ref(10);

const openSave = () => {
  showToast.value = true;
};

const openReset = () => {
  showReset.value = true;
};

const resetSettings = () => {
  settings.temp = 65;
  settings.vibration = 6;
  settings.defect = 3;
  settings.notify = '企业微信';
  showReset.value = false;
  openProgress('已恢复默认并同步');
};

const openEdit = (shift) => {
  editing.value = { ...shift };
};

const saveShift = () => {
  if (!editing.value) return;
  const idx = shifts.findIndex((s) => s.name === editing.value.name);
  if (idx !== -1) shifts[idx] = { ...editing.value };
  editing.value = null;
  openProgress('班次模板已更新');
};

const openProgress = (msg) => {
  progressMessage.value = msg;
  progress.value = 10;
  const timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 18);
    if (progress.value >= 100) clearInterval(timer);
  }, 400);
};
</script>
