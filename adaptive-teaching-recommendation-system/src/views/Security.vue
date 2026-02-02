<template>
  <div class="grid grid-2">
    <div class="page-card">
      <div class="section-title">数据安全态势</div>
      <div class="grid grid-3">
        <div class="page-card">
          <div class="badge">合规覆盖</div>
          <h3>{{ metrics.compliance }}%</h3>
          <p>制度与策略同步</p>
        </div>
        <div class="page-card">
          <div class="badge">加密等级</div>
          <h3>{{ metrics.encryption }}</h3>
          <p>多通道加密传输</p>
        </div>
        <div class="page-card">
          <div class="badge">审计日志</div>
          <h3>{{ metrics.audit }}条</h3>
          <p>关键操作留痕</p>
        </div>
      </div>
      <div class="chart-card">
        <div class="section-title">访问风险分布</div>
        <svg viewBox="0 0 320 140" width="100%" height="140" aria-label="风险分布图">
          <circle cx="80" cy="70" r="50" fill="#dbeafe" />
          <circle cx="160" cy="70" r="50" fill="#93c5fd" />
          <circle cx="240" cy="70" r="50" fill="#60a5fa" />
          <text x="60" y="74" font-size="12">低风险</text>
          <text x="140" y="74" font-size="12" fill="#1e3a8a">中风险</text>
          <text x="222" y="74" font-size="12" fill="#1e40af">高风险</text>
        </svg>
        <div class="chart-legend">
          <span>异常访问: {{ metrics.anomaly }}次</span>
          <span>授权用户: {{ metrics.users }}人</span>
          <span>数据保留: {{ metrics.retention }}天</span>
        </div>
      </div>
    </div>
    <div class="page-card">
      <div class="section-title">安全管理操作</div>
      <div class="grid grid-2">
        <button class="primary-btn" @click="openPolicy">更新权限策略</button>
        <button class="secondary-btn" @click="openBackup">启动备份任务</button>
        <button class="ghost-btn" @click="openHint">安全提示信息</button>
        <button class="secondary-btn" @click="openProgress">备份进度</button>
      </div>
      <div class="section-title" style="margin-top: 20px;">审计日志</div>
      <table class="table">
        <thead>
          <tr>
            <th>序号</th>
            <th>时间</th>
            <th>操作人</th>
            <th>事件</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.user }}</td>
            <td>{{ row.event }}</td>
            <td>
              <button class="ghost-btn" @click="openRow(row)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog v-if="modal.open" :title="modal.title" @close="closeModal">
    <div v-if="modal.type === 'form'" class="modal-body">
      <div class="form-grid">
        <label>
          权限策略名称
          <input v-model="form.name" placeholder="请输入名称" />
        </label>
        <label>
          访问级别
          <select v-model="form.level">
            <option value="仅教师">仅教师</option>
            <option value="教研组">教研组</option>
            <option value="教务管理员">教务管理员</option>
          </select>
        </label>
        <label>
          数据保留周期
          <select v-model="form.retention">
            <option value="30天">30天</option>
            <option value="90天">90天</option>
            <option value="180天">180天</option>
          </select>
        </label>
        <label>
          说明
          <textarea v-model="form.note" rows="3" placeholder="请输入"></textarea>
        </label>
      </div>
    </div>
    <div v-else-if="modal.type === 'progress'" class="modal-body">
      <p>{{ modal.message }}</p>
      <div class="progress">
        <span :style="{ width: modal.progress + '%' }"></span>
      </div>
      <p class="tag">备份进度 {{ modal.progress }}%</p>
    </div>
    <div v-else class="modal-body">
      <p>{{ modal.message }}</p>
      <ul>
        <li v-for="item in modal.list" :key="item">{{ item }}</li>
      </ul>
    </div>
    <template #actions>
      <button class="secondary-btn" @click="closeModal">关闭</button>
      <button v-if="modal.type === 'form'" class="primary-btn" @click="submit">确认更新</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive } from "vue";
import ModalDialog from "../components/ModalDialog.vue";

const metrics = {
  compliance: 98,
  encryption: "AES-256",
  audit: 128,
  anomaly: 2,
  users: 36,
  retention: 90
};

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  time: `2024-05-${String(index + 1).padStart(2, "0")} 09:${String(index + 10).padStart(2, "0")}`,
  user: index % 2 === 0 ? "管理员" : "教研组",
  event: index % 3 === 0 ? "权限变更" : "数据导出"
}));

const modal = reactive({
  open: false,
  title: "",
  type: "info",
  message: "",
  list: [],
  progress: 0
});

const form = reactive({
  name: "教学数据权限策略",
  level: "教研组",
  retention: "90天",
  note: "保持课堂数据合规留存" 
});

const openPolicy = () => {
  modal.open = true;
  modal.title = "更新权限策略";
  modal.type = "form";
};

const openBackup = () => {
  modal.open = true;
  modal.title = "启动备份任务";
  modal.type = "info";
  modal.message = "系统将创建多地备份并生成校验记录。";
  modal.list = ["主存储备份", "异地容灾同步", "校验码生成"];
};

const openHint = () => {
  modal.open = true;
  modal.title = "安全提示";
  modal.type = "info";
  modal.message = "建议每周检查一次权限变更记录。";
  modal.list = ["下载最新审计报告", "复核外部访问", "更新密钥"];
};

const openProgress = () => {
  modal.open = true;
  modal.title = "备份任务进度";
  modal.type = "progress";
  modal.message = "正在同步课堂数据到安全仓库。";
  modal.progress = 64;
};

const openRow = (row) => {
  modal.open = true;
  modal.title = `审计详情 - ${row.event}`;
  modal.type = "info";
  modal.message = `${row.time} 由 ${row.user} 执行。`;
  modal.list = ["IP: 192.168.10.45", "操作已记录", "安全等级：高"];
};

const submit = () => {
  modal.open = false;
};

const closeModal = () => {
  modal.open = false;
};
</script>
