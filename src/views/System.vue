<template>
  <section class="page">
    <div class="toolbar">
      <button class="primary" @click="openUserModal">新增用户权限</button>
      <button class="secondary" @click="openExportModal">数据导出服务</button>
      <button class="secondary" @click="openTipModal">查看提示</button>
    </div>

    <div class="grid grid-4">
      <div class="card" v-for="stat in stats" :key="stat.label">
        <strong>{{ stat.value }}</strong>
        <p>{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid" style="margin-top: 16px; grid-template-columns: minmax(260px, 1fr) 2fr;">
      <div class="card">
        <h3>服务调用状态</h3>
        <div class="chart">
          <div class="chart-row" v-for="item in chartData" :key="item.name">
            <span>{{ item.name }}</span>
            <div class="chart-bar">
              <span :style="{ width: item.value + '%' }"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>服务名称</th>
              <th>调用次数</th>
              <th>权限等级</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.count }}</td>
              <td>{{ row.level }}</td>
              <td>{{ row.time }}</td>
              <td>
                <button class="secondary" @click="openRowModal(row)">查看审计</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeModal" class="modal-mask">
      <div class="modal">
        <div class="modal-header">
          <strong>{{ activeModal.title }}</strong>
          <button class="secondary" @click="closeModal">关闭</button>
        </div>
        <div class="modal-body">
          <template v-if="activeModal.type === 'form'">
            <label>
              用户名称
              <input class="input" v-model="form.user" />
            </label>
            <label>
              角色权限
              <select v-model="form.role">
                <option>管理员</option>
                <option>数据专员</option>
                <option>审计员</option>
              </select>
            </label>
            <label>
              服务范围
              <select v-model="form.scope">
                <option>全量数据</option>
                <option>风险监测</option>
                <option>企业画像</option>
              </select>
            </label>
          </template>
          <template v-else-if="activeModal.type === 'progress'">
            <p>{{ activeModal.message }}</p>
            <div class="progress">
              <span :style="{ width: '70%' }"></span>
            </div>
          </template>
          <template v-else>
            <p>{{ activeModal.message }}</p>
          </template>
        </div>
        <div class="modal-footer">
          <button class="secondary" @click="closeModal">取消</button>
          <button class="primary" @click="confirmModal">确认</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';

const stats = [
  { label: '活跃用户', value: '86' },
  { label: '导出任务', value: '21' },
  { label: '审计日志', value: '1,280' },
  { label: '接口调用量', value: '9,860' }
];

const chartData = [
  { name: '导出服务', value: 66 },
  { name: '权限管理', value: 73 },
  { name: '操作审计', value: 58 },
  { name: '数据同步', value: 81 }
];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: ['导出服务', '权限管理', '审计日志', '数据接口'][index % 4],
  count: `${1200 + index * 36}`,
  level: ['高级', '中级', '基础'][index % 3],
  time: `2024-10-${(index % 30) + 1} 14:${(index % 50) + 10}`
}));

const activeModal = ref(null);
const form = reactive({
  user: '李明',
  role: '管理员',
  scope: '全量数据'
});

const openUserModal = () => {
  activeModal.value = { title: '新增用户权限', type: 'form' };
};

const openExportModal = () => {
  activeModal.value = {
    title: '数据导出服务',
    type: 'progress',
    message: '正在准备导出文件并校验权限。'
  };
};

const openTipModal = () => {
  activeModal.value = {
    title: '系统提示',
    type: 'info',
    message: '导出服务支持按标签筛选企业数据，建议设置权限范围。'
  };
};

const openRowModal = (row) => {
  activeModal.value = {
    title: '操作审计详情',
    type: 'info',
    message: `${row.name} 服务累计调用 ${row.count} 次，权限等级为 ${row.level}。`
  };
};

const closeModal = () => {
  activeModal.value = null;
};

const confirmModal = () => {
  activeModal.value = {
    title: '操作成功',
    type: 'info',
    message: '权限配置已更新，操作日志已生成。'
  };
};
</script>

<style scoped>
.card h3 {
  margin-top: 0;
}

.card p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}
</style>
