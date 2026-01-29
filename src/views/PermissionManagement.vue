<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h3>档案权限控制与审计</h3>
        <p>支持查看、编辑、删除等操作权限设置，审计日志实时追踪。</p>
      </div>
      <div class="toolbar">
        <button class="primary" type="button" @click="openModal('role')">新增角色</button>
        <button class="secondary" type="button" @click="openModal('permission')">配置权限</button>
        <button class="ghost" type="button" @click="openModal('export')">导出审计</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <h4>访问概览</h4>
        <div class="metric">
          <div>
            <strong>今日访问</strong>
            <span>1,284 次</span>
          </div>
          <div>
            <strong>异常提醒</strong>
            <span>3 条</span>
          </div>
        </div>
        <button class="secondary" type="button" @click="openModal('alert')">查看异常</button>
      </div>
      <div class="card">
        <h4>审计趋势</h4>
        <div class="trend">
          <div v-for="point in trend" :key="point.label" class="point" :style="{ height: point.value + '%' }">
            <span>{{ point.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="table-section">
      <div class="table-header">
        <h4>审计日志</h4>
        <button class="ghost" type="button" @click="openModal('filter')">筛选日志</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>日志编号</th>
            <th>用户</th>
            <th>操作</th>
            <th>档案</th>
            <th>时间</th>
            <th>结果</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>{{ log.id }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.archive }}</td>
            <td>{{ log.time }}</td>
            <td>
              <span class="status" :class="log.statusClass">{{ log.status }}</span>
            </td>
            <td>
              <button class="link" type="button" @click="openDetail(log)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="activeModal === 'role'" title="新增角色" @close="closeModal">
      <form class="form">
        <label>角色名称<input v-model="form.role" placeholder="如：院系审核员" /></label>
        <label>访问范围<textarea v-model="form.scope" rows="3" placeholder="描述权限范围"></textarea></label>
        <label>审批级别<select v-model="form.level">
          <option>一级</option>
          <option>二级</option>
          <option>三级</option>
        </select></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('roleResult')">保存角色</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'roleResult'" title="角色已保存" @close="closeModal">
      <p>角色“{{ form.role || '未命名' }}”已加入权限矩阵。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'permission'" title="配置权限" @close="closeModal">
      <form class="form">
        <label>选择角色<select v-model="form.targetRole">
          <option>教学管理员</option>
          <option>档案管理员</option>
          <option>院系审核员</option>
        </select></label>
        <label>可用操作
          <div class="checkboxes">
            <label><input type="checkbox" v-model="form.ops" value="查看" />查看</label>
            <label><input type="checkbox" v-model="form.ops" value="编辑" />编辑</label>
            <label><input type="checkbox" v-model="form.ops" value="删除" />删除</label>
            <label><input type="checkbox" v-model="form.ops" value="导出" />导出</label>
          </div>
        </label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('permissionResult')">保存配置</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'permissionResult'" title="权限已更新" @close="closeModal">
      <p>已更新 {{ form.targetRole || '目标角色' }} 的权限：{{ form.ops.join('、') || '未选择' }}。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'export'" title="导出审计日志" @close="closeModal">
      <p>系统正在生成近 30 天的审计报表。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: exportProgress + '%' }"></div>
      </div>
      <p class="hint">{{ exportProgress }}%</p>
      <template #footer>
        <button class="secondary" type="button" @click="increaseExport">继续导出</button>
        <button class="primary" type="button" @click="closeModal">完成</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'alert'" title="异常访问提醒" @close="closeModal">
      <ul class="summary">
        <li>凌晨 02:18 来自校外 IP 的访问已拦截。</li>
        <li>导出申请“教学评估”超过权限范围。</li>
        <li>连续 5 次失败登录已触发锁定。</li>
      </ul>
    </BaseModal>

    <BaseModal :open="activeModal === 'filter'" title="筛选日志" @close="closeModal">
      <form class="form">
        <label>操作类型<select v-model="filter.action">
          <option>全部</option>
          <option>查看</option>
          <option>编辑</option>
          <option>导出</option>
        </select></label>
        <label>时间范围<input v-model="filter.range" placeholder="如：近7天" /></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">应用筛选</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'detail'" title="审计详情" @close="closeModal">
      <p>用户：{{ selected?.user }}</p>
      <p>操作：{{ selected?.action }}</p>
      <p>档案：{{ selected?.archive }}</p>
      <p>结果：{{ selected?.status }}</p>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="openModal('alert')">查看提醒</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const exportProgress = ref(45);
const selected = ref(null);

const form = reactive({
  role: '',
  scope: '',
  level: '一级',
  targetRole: '教学管理员',
  ops: []
});

const filter = reactive({
  action: '全部',
  range: ''
});

const trend = [
  { label: '周一', value: 40 },
  { label: '周二', value: 65 },
  { label: '周三', value: 55 },
  { label: '周四', value: 72 },
  { label: '周五', value: 60 },
  { label: '周六', value: 35 },
  { label: '周日', value: 48 }
];

const logs = Array.from({ length: 21 }, (_, index) => {
  const status = index % 3 === 0 ? '拦截' : '通过';
  return {
    id: `AU-${2024050 + index}`,
    user: ['王晨', '赵娜', '周宇'][index % 3],
    action: ['查看', '编辑', '导出'][index % 3],
    archive: `教学档案 ${index + 1}`,
    time: `2024-05-${(index % 28) + 1} 10:${index % 6}0`,
    status,
    statusClass: status === '通过' ? 'success' : 'danger'
  };
});

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const increaseExport = () => {
  exportProgress.value = Math.min(100, exportProgress.value + 15);
};

const openDetail = (log) => {
  selected.value = log;
  activeModal.value = 'detail';
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.module-header h3 {
  margin: 0;
  font-size: 18px;
}

.module-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary,
.secondary,
.ghost {
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e2e8f0;
  color: #1e293b;
}

.ghost {
  background: #f1f5f9;
  color: #1e293b;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.metric {
  display: flex;
  gap: 24px;
  margin: 12px 0 16px;
}

.metric strong {
  display: block;
  color: #0f172a;
}

.metric span {
  color: #64748b;
  font-size: 14px;
}

.trend {
  height: 140px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  gap: 6px;
  margin-top: 16px;
}

.point {
  background: linear-gradient(180deg, #60a5fa, #2563eb);
  border-radius: 8px 8px 0 0;
  position: relative;
}

.point span {
  position: absolute;
  bottom: -22px;
  font-size: 11px;
  color: #64748b;
}

.table-section {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  overflow-x: auto;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.status {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status.success {
  background: #dcfce7;
  color: #166534;
}

.status.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.link {
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
}

.form {
  display: grid;
  gap: 12px;
}

.form label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.form input,
.form select,
.form textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
  background: #f8fafc;
}

.checkboxes {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #f59e0b);
}

.hint {
  font-size: 12px;
  color: #64748b;
}

.summary {
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #475569;
}
</style>
