<template>
  <div class="page">
    <section class="panel">
      <div class="panel-header">
        <h3>数据存储与管理</h3>
        <div class="actions">
          <button @click="openModal('pool')">新增存储池</button>
          <button @click="openModal('tag')">元数据标签</button>
          <button @click="openModal('permission')">权限控制</button>
          <button class="ghost" @click="openModal('archive')">数据归档</button>
          <button class="ghost" @click="openProgress">容量进度</button>
          <button class="ghost" @click="openTip('权限策略已同步至目录服务。')">按钮提示</button>
        </div>
      </div>
      <div class="grid">
        <div class="card">
          <h4>存储资源占比</h4>
          <svg viewBox="0 0 320 140">
            <rect v-for="(bar, index) in storageBars" :key="bar.label" :x="index * 62 + 18" :y="140 - bar.value" width="40" :height="bar.value" fill="#34d399" rx="6" />
            <text v-for="(bar, index) in storageBars" :key="bar.label + 'text'" :x="index * 62 + 38" y="132" text-anchor="middle" font-size="10" fill="#6b7280">
              {{ bar.label }}
            </text>
          </svg>
        </div>
        <div class="card">
          <h4>元数据概览</h4>
          <div class="info-grid">
            <div>
              <span>已登记资产</span>
              <strong>3,420</strong>
            </div>
            <div>
              <span>标签覆盖率</span>
              <strong>96%</strong>
            </div>
            <div>
              <span>敏感字段</span>
              <strong>186</strong>
            </div>
            <div>
              <span>权限规则</span>
              <strong>52</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h3>存储资产目录</h3>
        <span class="sub">统一管理关系型与非关系型数据资产</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>资源编号</th>
              <th>存储类型</th>
              <th>容量</th>
              <th>责任人</th>
              <th>权限等级</th>
              <th>最近同步</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in storageRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.size }}</td>
              <td>{{ row.owner }}</td>
              <td>
                <span :class="['badge', row.levelClass]">{{ row.level }}</span>
              </td>
              <td>{{ row.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <BaseModal :show="modals.pool" title="新增存储池" @close="closeModal('pool')">
    <form class="modal-form" @submit.prevent="submitPool">
      <label>
        存储池名称
        <input v-model="forms.pool.name" type="text" required />
      </label>
      <label>
        类型
        <select v-model="forms.pool.type">
          <option value="对象存储">对象存储</option>
          <option value="关系型数据库">关系型数据库</option>
          <option value="时序数据库">时序数据库</option>
          <option value="数据湖">数据湖</option>
        </select>
      </label>
      <label>
        初始容量
        <input v-model="forms.pool.size" type="text" placeholder="如：5 TB" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('pool')">取消</button>
        <button type="submit">创建存储池</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.tag" title="元数据标签维护" @close="closeModal('tag')">
    <form class="modal-form" @submit.prevent="submitTag">
      <label>
        标签名称
        <input v-model="forms.tag.name" type="text" placeholder="如：销售敏感" required />
      </label>
      <label>
        适用范围
        <select v-model="forms.tag.scope">
          <option value="全部">全部</option>
          <option value="业务数据">业务数据</option>
          <option value="日志数据">日志数据</option>
          <option value="设备数据">设备数据</option>
        </select>
      </label>
      <label>
        描述
        <input v-model="forms.tag.desc" type="text" placeholder="标签说明" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('tag')">取消</button>
        <button type="submit">保存标签</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.permission" title="权限控制策略" @close="closeModal('permission')">
    <form class="modal-form" @submit.prevent="submitPermission">
      <label>
        角色
        <select v-model="forms.permission.role">
          <option value="数据管理员">数据管理员</option>
          <option value="业务分析师">业务分析师</option>
          <option value="外部访问">外部访问</option>
        </select>
      </label>
      <label>
        可访问范围
        <input v-model="forms.permission.range" type="text" placeholder="如：只读财务数据" />
      </label>
      <label>
        审批流程
        <select v-model="forms.permission.flow">
          <option value="自动审批">自动审批</option>
          <option value="主管审批">主管审批</option>
          <option value="安全审核">安全审核</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('permission')">取消</button>
        <button type="submit">应用策略</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.archive" title="数据归档任务" @close="closeModal('archive')">
    <form class="modal-form" @submit.prevent="submitArchive">
      <label>
        归档对象
        <input v-model="forms.archive.target" type="text" placeholder="如：历史订单" />
      </label>
      <label>
        归档周期
        <select v-model="forms.archive.period">
          <option value="每月">每月</option>
          <option value="每季度">每季度</option>
          <option value="每半年">每半年</option>
        </select>
      </label>
      <label>
        存储位置
        <input v-model="forms.archive.destination" type="text" placeholder="冷存储池" />
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary" @click="closeModal('archive')">取消</button>
        <button type="submit">创建归档</button>
      </div>
    </form>
  </BaseModal>

  <BaseModal :show="modals.progress" title="存储容量进度" @close="closeModal('progress')">
    <div class="progress-card">
      <p>当前总容量使用情况</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <strong>{{ progress }}%</strong>
    </div>
    <template #footer>
      <button type="button" class="secondary" @click="closeModal('progress')">关闭</button>
    </template>
  </BaseModal>

  <BaseModal :show="modals.tip" title="提示信息" @close="closeModal('tip')">
    <p>{{ tipMessage }}</p>
    <template #footer>
      <button type="button" class="secondary" @click="closeModal('tip')">知道了</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const modals = reactive({
  pool: false,
  tag: false,
  permission: false,
  archive: false,
  progress: false,
  tip: false
});

const forms = reactive({
  pool: { name: "", type: "对象存储", size: "" },
  tag: { name: "", scope: "全部", desc: "" },
  permission: { role: "数据管理员", range: "", flow: "主管审批" },
  archive: { target: "", period: "每季度", destination: "" }
});

const tipMessage = ref("");
const progress = ref(0);
let progressTimer;

const storageBars = [
  { label: "关系型", value: 90 },
  { label: "对象", value: 70 },
  { label: "时序", value: 60 },
  { label: "图谱", value: 50 },
  { label: "日志", value: 80 }
];

const storageRows = ref(
  Array.from({ length: 20 }, (_, index) => ({
    id: `ST-${index + 1}`.padStart(6, "0"),
    type: index % 2 === 0 ? "关系型数据库" : "对象存储",
    size: `${(index % 7) + 2} TB`,
    owner: `负责人-${index + 1}`,
    level: index % 3 === 0 ? "核心" : index % 2 === 0 ? "重要" : "普通",
    levelClass: index % 3 === 0 ? "core" : index % 2 === 0 ? "important" : "normal",
    time: `2024-09-${(index % 28) + 1}`.padStart(10, "0")
  }))
);

const openModal = (name) => {
  modals[name] = true;
};

const closeModal = (name) => {
  modals[name] = false;
};

const openTip = (message) => {
  tipMessage.value = message;
  modals.tip = true;
};

const submitPool = () => {
  storageRows.value.unshift({
    id: `ST-${storageRows.value.length + 1}`.padStart(6, "0"),
    type: forms.pool.type,
    size: forms.pool.size || "2 TB",
    owner: "新负责人",
    level: "重要",
    levelClass: "important",
    time: new Date().toISOString().slice(0, 10)
  });
  closeModal("pool");
  openTip("新的存储池已创建并登记到资产目录。");
};

const submitTag = () => {
  closeModal("tag");
  openTip("元数据标签已更新，覆盖范围已同步。");
};

const submitPermission = () => {
  closeModal("permission");
  openTip("权限控制策略已应用并触发审批流程。");
};

const submitArchive = () => {
  closeModal("archive");
  openTip("归档任务已创建并进入调度队列。");
};

const openProgress = () => {
  modals.progress = true;
  progress.value = 0;
  if (progressTimer) {
    clearInterval(progressTimer);
  }
  progressTimer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(progressTimer);
      return;
    }
    progress.value += 10;
  }, 240);
};

onBeforeUnmount(() => {
  if (progressTimer) {
    clearInterval(progressTimer);
  }
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  background: #10b981;
  color: #fff;
  cursor: pointer;
}

.ghost {
  background: #ecfdf3;
  color: #047857;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.info-grid span {
  font-size: 12px;
  color: #6b7280;
}

.info-grid strong {
  display: block;
  font-size: 18px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  white-space: nowrap;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.badge.core {
  background: #fee2e2;
  color: #b91c1c;
}

.badge.important {
  background: #fef3c7;
  color: #b45309;
}

.badge.normal {
  background: #ecfdf3;
  color: #047857;
}

.modal-form {
  display: grid;
  gap: 12px;
}

.modal-form label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.modal-form input,
.modal-form select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.progress-card {
  display: grid;
  gap: 12px;
}

.progress-bar {
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #34d399, #10b981);
}

.sub {
  font-size: 13px;
  color: #6b7280;
}
</style>
