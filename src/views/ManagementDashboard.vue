<template>
  <div class="module">
    <header class="section-title"><span class="icon">🛠️</span>管理后台</header>

    <div class="responsive-grid">
      <div class="info-card" v-for="item in dashboard" :key="item.label">
        <strong>{{ item.label }}</strong>
        <p>{{ item.desc }}</p>
        <div class="progress-track"><div class="progress-bar" :style="{ width: item.progress + '%' }"></div></div>
        <small>{{ item.progress }}%</small>
      </div>
    </div>

    <div class="table-card">
      <header class="table-header">
        <h3>运行管理记录</h3>
        <div class="actions">
          <button class="primary-button" @click="openModal('module')">新增模块</button>
          <button class="secondary-button" @click="openModal('notice')">发布公告</button>
          <button class="secondary-button" @click="openModal('backup')">启动备份</button>
        </div>
      </header>
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>事件</th>
            <th>负责人</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in records" :key="row.time + row.event">
            <td>{{ row.time }}</td>
            <td>{{ row.event }}</td>
            <td>{{ row.owner }}</td>
            <td><span class="chip">{{ row.state }}</span></td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="activeModal === 'module'" title="新增模块" @close="closeModal" @confirm="addModule">
      <div class="form-grid">
        <label>模块名称<input v-model="form.module" placeholder="输入模块名" /></label>
        <label>上线时间<input v-model="form.time" placeholder="例如 05-15" /></label>
        <label>描述<textarea v-model="form.notes" rows="3"></textarea></label>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'notice'" title="发布公告" @close="closeModal" @confirm="publishNotice">
      <div class="form-grid">
        <label>公告主题<input v-model="form.module" placeholder="输入主题" /></label>
        <label>公告内容<textarea v-model="form.notes" rows="3"></textarea></label>
      </div>
    </BaseModal>

    <BaseModal v-if="activeModal === 'backup'" title="备份进度" @close="closeModal" :showFooter="false">
      <p>资源与数据正在自动备份，请勿关闭窗口。</p>
      <div class="progress-track"><div class="progress-bar" :style="{ width: backupProgress + '%' }"></div></div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const dashboard = [
  { label: '资源占用', desc: '服务器 CPU 峰值', progress: 48 },
  { label: '访问峰值', desc: '同时在线学员', progress: 62 },
  { label: '版本进度', desc: 'V2.0 开发完成度', progress: 70 },
  { label: '告警响应', desc: '本周已处理', progress: 90 }
];

const records = [
  { time: '05-01', event: '新增“夜景灯光”课程', owner: '苏澜', state: '上线', note: '模块已同步' },
  { time: '05-02', event: '服务器安全加固', owner: '刘波', state: '完成', note: '防火墙规则更新' },
  { time: '05-03', event: '学员数据校验', owner: '王欣', state: '完成', note: '导入 120 人' },
  { time: '05-04', event: '实训脚本优化', owner: '何静', state: '执行中', note: '加载速度优化' },
  { time: '05-05', event: '工具库盘点', owner: '沈博', state: '完成', note: '耗材补充' },
  { time: '05-06', event: '水景传感器巡检', owner: '丁雯', state: '完成', note: '传感器校准' },
  { time: '05-07', event: '账号策略更新', owner: '吴杰', state: '上线', note: '强密码策略' },
  { time: '05-08', event: '数据冷备', owner: '刘波', state: '执行中', note: '备份 60%' },
  { time: '05-09', event: '交互界面调整', owner: '苏澜', state: '完成', note: '移动端适配' },
  { time: '05-10', event: '运维日检', owner: '王欣', state: '完成', note: '无异常' }
];

const activeModal = ref('');
const backupProgress = ref(55);
const form = ref({ module: '', time: '', notes: '' });

const openModal = (type) => {
  activeModal.value = type;
  if (type === 'backup') {
    backupProgress.value = 55;
    const timer = setInterval(() => {
      backupProgress.value = Math.min(backupProgress.value + 15, 100);
      if (backupProgress.value === 100) {
        clearInterval(timer);
      }
    }, 400);
  }
};

const closeModal = () => {
  activeModal.value = '';
};

const addModule = () => {
  alert(`已登记模块：${form.value.module || '未命名'}，计划上线 ${form.value.time || '待定'}`);
  closeModal();
};

const publishNotice = () => {
  alert(`公告发布：${form.value.module || '未命名主题'}`);
  closeModal();
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.form-grid input,
.form-grid textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
</style>
