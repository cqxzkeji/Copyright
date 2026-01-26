<template>
  <div class="page">
    <div class="card">
      <div class="section-title">数据存储与管理概览</div>
      <div class="grid grid-3">
        <div class="card">
          <div class="section-title">数据库设计</div>
          <p>核心库数量：{{ overview.databases }}</p>
          <p>表结构版本：{{ overview.schemaVersion }}</p>
        </div>
        <div class="card">
          <div class="section-title">数据管理模块</div>
          <p>活跃表：{{ overview.tables }}</p>
          <p>数据质量评分：{{ overview.quality }}</p>
        </div>
        <div class="card">
          <div class="section-title">备份与恢复</div>
          <p>最近备份：{{ overview.lastBackup }}</p>
          <p>可用快照：{{ overview.snapshots }}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">存储占用分布</div>
      <div class="chart">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: item.value + '%' }"
          :title="item.value + '%'"
        ></div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));">
        <div v-for="item in chartData" :key="item.label" class="chart-label">{{ item.label }}</div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">管理操作</div>
      <div class="actions">
        <button class="btn" type="button" @click="openModal('design')">调整数据库设计</button>
        <button class="btn btn-secondary" type="button" @click="openModal('clean')">执行数据清洗</button>
        <button class="btn" type="button" @click="openModal('backup')">立即备份</button>
        <button class="btn btn-secondary" type="button" @click="openModal('restore')">恢复快照</button>
        <button class="btn" type="button" @click="openModal('tip')">管理提示</button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">数据表清单（20条）</div>
      <table class="table">
        <thead>
          <tr>
            <th>表名</th>
            <th>类型</th>
            <th>记录量</th>
            <th>负责人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tables" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.rows }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="modal.open" :title="modal.title" @close="closeModal">
      <div v-if="modal.type === 'design'" class="form-grid">
        <label class="form-field">
          设计版本
          <input v-model="form.schema" type="text" placeholder="例如：v3.2" />
        </label>
        <label class="form-field">
          变更描述
          <textarea v-model="form.change" rows="3" placeholder="填写结构调整内容"></textarea>
        </label>
      </div>
      <div v-else-if="modal.type === 'clean'">
        <p>建议在低峰期执行清洗任务，预计耗时 8 分钟。</p>
        <div class="progress" style="margin-top: 12px;">
          <span :style="{ width: progress + '%' }"></span>
        </div>
      </div>
      <div v-else-if="modal.type === 'backup'" class="form-grid">
        <label class="form-field">
          备份策略
          <select v-model="form.backupPlan">
            <option>全量备份</option>
            <option>增量备份</option>
            <option>日志备份</option>
          </select>
        </label>
        <label class="form-field">
          目标位置
          <input v-model="form.destination" type="text" placeholder="例如：NAS-01" />
        </label>
      </div>
      <div v-else-if="modal.type === 'restore'" class="form-grid">
        <label class="form-field">
          快照选择
          <select v-model="form.snapshot">
            <option>2024-06-18_凌晨</option>
            <option>2024-06-17_夜间</option>
            <option>2024-06-16_凌晨</option>
          </select>
        </label>
        <label class="form-field">
          恢复说明
          <textarea v-model="form.restoreNote" rows="3" placeholder="填写恢复原因"></textarea>
        </label>
      </div>
      <div v-else>
        <p>提示：定期执行备份与清洗可以保持数据质量稳定。</p>
      </div>
      <template #actions>
        <button class="btn btn-secondary" type="button" @click="closeModal">取消</button>
        <button class="btn" type="button" @click="submitModal">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import BaseModal from "../components/BaseModal.vue";

const overview = reactive({
  databases: 4,
  schemaVersion: "v3.1",
  tables: 42,
  quality: "94%",
  lastBackup: "2024-06-18 02:00",
  snapshots: 6
});

const chartData = [
  { label: "结构化", value: 70 },
  { label: "非结构化", value: 45 },
  { label: "日志", value: 60 },
  { label: "图谱", value: 50 },
  { label: "归档", value: 35 }
];

const tables = Array.from({ length: 20 }, (_, index) => ({
  name: `tbl_dataset_${index + 1}`,
  type: index % 2 === 0 ? "核心" : "主题",
  rows: `${1200 + index * 135}`,
  owner: ["苏雅", "丁程", "李青"][index % 3],
  status: index % 4 === 0 ? "维护中" : "正常"
}));

const modal = reactive({
  open: false,
  type: "",
  title: ""
});

const progress = ref(52);

const form = reactive({
  schema: "",
  change: "",
  backupPlan: "全量备份",
  destination: "",
  snapshot: "2024-06-18_凌晨",
  restoreNote: ""
});

const openModal = (type) => {
  modal.open = true;
  modal.type = type;
  modal.title =
    type === "design"
      ? "数据库设计调整"
      : type === "clean"
      ? "数据清洗任务"
      : type === "backup"
      ? "立即备份"
      : type === "restore"
      ? "恢复快照"
      : "管理提示";
};

const closeModal = () => {
  modal.open = false;
};

const submitModal = () => {
  progress.value = Math.min(100, progress.value + 15);
  closeModal();
};
</script>
