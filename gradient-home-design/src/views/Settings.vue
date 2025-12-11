<template>
  <div class="grid" style="gap: 18px">
    <div class="card">
      <header class="section">
        <div>
          <p class="section-title">系统设置</p>
          <p class="hint">管理界面亮色主题、保存路径与通知策略。</p>
        </div>
        <button class="btn btn-primary" @click="openSaveModal">保存设置</button>
      </header>
      <div class="responsive-row">
        <div class="card">
          <p class="section-title">界面</p>
          <label>主题<select v-model="settings.theme" class="input"><option>亮色</option><option>高对比</option></select></label>
          <label>字体<select v-model="settings.font" class="input"><option>Inter</option><option>思源黑体</option></select></label>
        </div>
        <div class="card">
          <p class="section-title">文件</p>
          <label>导出路径<input v-model="settings.path" class="input" /></label>
          <label>自动备份<select v-model="settings.backup" class="input"><option>开启</option><option>关闭</option></select></label>
        </div>
        <div class="card">
          <p class="section-title">通知</p>
          <label><input type="checkbox" v-model="settings.email" /> 邮件通知</label>
          <label><input type="checkbox" v-model="settings.desktop" /> 桌面提醒</label>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="section-title">最近操作记录（10 条）</p>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>内容</th>
            <th>操作人</th>
            <th>结果</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.time + log.user">
            <td>{{ log.time }}</td>
            <td>{{ log.content }}</td>
            <td>{{ log.user }}</td>
            <td><span class="badge">{{ log.result }}</span></td>
            <td><button class="btn btn-secondary" @click="showLog(log)">查看</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showSave" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>保存设置</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>确认保存当前系统设置，并同步到所有模块。</p>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">确定</button>
      </footer>
    </div>
  </div>

  <div v-if="showLogModal" class="modal-backdrop" @click.self="closeModals">
    <div class="modal">
      <header>
        <span>操作详情</span>
        <button class="btn btn-secondary" @click="closeModals">关闭</button>
      </header>
      <div class="body">
        <p>{{ activeLog.time }} · {{ activeLog.user }}</p>
        <p>{{ activeLog.content }}</p>
      </div>
      <footer>
        <button class="btn btn-primary" @click="closeModals">好的</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const settings = reactive({ theme: '亮色', font: 'Inter', path: '/design/reports', backup: '开启', email: true, desktop: true });
const logs = reactive([
  { time: '09:30', content: '更新渐变库', user: '设计师A', result: '成功' },
  { time: '09:40', content: '导出PDF', user: '设计师B', result: '成功' },
  { time: '10:05', content: '修改布局方案', user: '设计师A', result: '成功' },
  { time: '10:16', content: '调整材质映射', user: '设计师C', result: '成功' },
  { time: '10:25', content: '刷新报告', user: '设计师B', result: '成功' },
  { time: '10:33', content: '同步云端', user: '设计师D', result: '成功' },
  { time: '10:40', content: '更新设置', user: '设计师A', result: '成功' },
  { time: '10:52', content: '导出封面图', user: '设计师E', result: '成功' },
  { time: '11:05', content: '调整配色', user: '设计师C', result: '成功' },
  { time: '11:20', content: '创建新客户', user: '设计师B', result: '成功' }
]);

const showSave = ref(false);
const showLogModal = ref(false);
const activeLog = reactive({});

const openSaveModal = () => { showSave.value = true; };
const showLog = (log) => { Object.assign(activeLog, log); showLogModal.value = true; };
const closeModals = () => { showSave.value = false; showLogModal.value = false; };
</script>

<style scoped>
.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.responsive-row .card {
  box-shadow: none;
  border: 1px dashed #cbd5e1;
}
</style>
