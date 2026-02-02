<template>
  <div class="page">
    <div class="card">
      <div class="section-title">系统状态</div>
      <div class="status-grid">
        <div class="status-card">
          <div class="status-title">权限策略</div>
          <div class="status-value">已启用 8 组</div>
        </div>
        <div class="status-card">
          <div class="status-title">安全告警</div>
          <div class="status-value">0 项</div>
        </div>
        <div class="status-card">
          <div class="status-title">日志审计</div>
          <div class="status-value">24h 记录</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">安全等级概览</div>
      <div class="security-chart">
        <div v-for="level in securityLevels" :key="level.label" class="security-item">
          <div class="security-label">{{ level.label }}</div>
          <div class="security-bar">
            <div class="security-fill" :style="{ width: level.value + '%' }"></div>
          </div>
          <div class="security-value">{{ level.value }}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">权限与审计记录（20条）</div>
      <div class="action-row">
        <button class="btn primary" @click="openModal('role')">创建权限组</button>
        <button class="btn" @click="openModal('progress')">审计扫描</button>
        <button class="btn ghost" @click="openModal('tip')">安全提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>记录编号</th>
            <th>操作人</th>
            <th>事件</th>
            <th>等级</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.user }}</td>
            <td>{{ row.action }}</td>
            <td><span class="badge" :class="row.levelClass">{{ row.level }}</span></td>
            <td>{{ row.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal === 'role'" title="创建权限组" @close="closeModal">
      <div class="form-grid">
        <label class="form-field">
          权限组名称
          <input placeholder="如：数据分析组" />
        </label>
        <label class="form-field">
          角色等级
          <select>
            <option>管理员</option>
            <option>教研员</option>
            <option>观察员</option>
          </select>
        </label>
        <label class="form-field">
          数据范围
          <select>
            <option>全部数据</option>
            <option>指定班级</option>
            <option>脱敏模式</option>
          </select>
        </label>
        <label class="form-field">
          描述
          <textarea rows="2" placeholder="权限说明"></textarea>
        </label>
      </div>
      <template #actions>
        <button class="btn ghost" type="button" @click="closeModal">取消</button>
        <button class="btn primary" type="button" @click="closeModal">保存权限组</button>
      </template>
    </Modal>

    <Modal v-if="activeModal === 'progress'" title="审计扫描进度" @close="closeModal">
      <p>正在扫描最近 30 天的操作日志。</p>
      <div class="progress-bar">
        <div class="progress-value" style="width: 52%"></div>
      </div>
      <p>预计 90 秒完成并生成审计报告。</p>
    </Modal>

    <Modal v-if="activeModal === 'tip'" title="安全提示" @close="closeModal">
      <p>建议启用双因素认证，提升对敏感数据的访问安全性。</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');

const securityLevels = [
  { label: '权限配置', value: 88 },
  { label: '日志完整度', value: 92 },
  { label: '风险响应', value: 76 },
  { label: '备份合规', value: 84 }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const level = index % 3 === 0 ? '高' : index % 3 === 1 ? '中' : '低';
  const levelClass = level === '高' ? 'orange' : level === '中' ? 'blue' : 'green';
  return {
    id: `SEC-${String(index + 1).padStart(3, '0')}`,
    user: index % 2 === 0 ? '系统管理员' : '审计员',
    action: index % 2 === 0 ? '权限调整' : '日志导出',
    level,
    levelClass,
    time: `2024-04-${String(index + 1).padStart(2, '0')} 10:30`
  };
});

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.status-card {
  background: #f5f7ff;
  padding: 16px;
  border-radius: 12px;
}

.status-title {
  font-size: 13px;
  color: #5f6e8e;
}

.status-value {
  font-size: 20px;
  font-weight: 700;
  margin-top: 6px;
}

.security-chart {
  display: grid;
  gap: 12px;
}

.security-item {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.security-bar {
  height: 10px;
  background: #eef2f8;
  border-radius: 999px;
  overflow: hidden;
}

.security-fill {
  height: 100%;
  background: linear-gradient(90deg, #6c7cff, #98e0ff);
}

.security-value {
  text-align: right;
  font-weight: 600;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
