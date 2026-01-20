<template>
  <section class="page">
    <div class="toolbar">
      <button class="primary" @click="openTaskModal">新建采集任务</button>
      <button class="secondary" @click="openImportModal">批量导入线索</button>
      <button class="secondary" @click="openTipModal">操作提示</button>
    </div>

    <div class="grid grid-4">
      <div class="card" v-for="stat in stats" :key="stat.label">
        <strong>{{ stat.value }}</strong>
        <p>{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid" style="margin-top: 16px; grid-template-columns: minmax(260px, 1fr) 2fr;">
      <div class="card">
        <h3>采集渠道占比</h3>
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
              <th>企业名称</th>
              <th>来源</th>
              <th>采集时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.source }}</td>
              <td>{{ row.time }}</td>
              <td><span class="badge">{{ row.status }}</span></td>
              <td>
                <button class="secondary" @click="openRowModal(row)">查看详情</button>
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
              任务名称
              <input class="input" v-model="form.task" />
            </label>
            <label>
              采集渠道
              <select v-model="form.channel">
                <option>工商</option>
                <option>司法</option>
                <option>招投标</option>
                <option>舆情</option>
              </select>
            </label>
            <label>
              优先级
              <select v-model="form.priority">
                <option>高</option>
                <option>中</option>
                <option>低</option>
              </select>
            </label>
          </template>
          <template v-else-if="activeModal.type === 'progress'">
            <p>{{ activeModal.message }}</p>
            <div class="progress">
              <span :style="{ width: '65%' }"></span>
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
  { label: '今日新增企业', value: '128' },
  { label: '自动采集任务', value: '36' },
  { label: '人工补录队列', value: '14' },
  { label: '异常待处理', value: '5' }
];

const chartData = [
  { name: '工商信息', value: 78 },
  { name: '司法风险', value: 52 },
  { name: '招投标', value: 64 },
  { name: '舆情监测', value: 45 }
];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `企业${index + 1}号科技有限公司`,
  source: ['工商', '司法', '招投标', '舆情'][index % 4],
  time: `2024-10-${(index % 30) + 1} 09:${(index % 50) + 10}`,
  status: index % 3 === 0 ? '已入库' : index % 3 === 1 ? '待校验' : '处理中'
}));

const activeModal = ref(null);
const form = reactive({
  task: '重点企业补充采集',
  channel: '工商',
  priority: '高'
});

const openTaskModal = () => {
  activeModal.value = { title: '新建采集任务', type: 'form' };
};

const openImportModal = () => {
  activeModal.value = {
    title: '批量导入线索',
    type: 'progress',
    message: '正在校验上传文件并生成采集计划。'
  };
};

const openTipModal = () => {
  activeModal.value = {
    title: '采集提示',
    type: 'info',
    message: '建议优先配置工商与司法同步源，提升企业信息完整度。'
  };
};

const openRowModal = (row) => {
  activeModal.value = {
    title: '采集详情',
    type: 'info',
    message: `${row.name} 已从 ${row.source} 渠道完成采集，状态为 ${row.status}。`
  };
};

const closeModal = () => {
  activeModal.value = null;
};

const confirmModal = () => {
  activeModal.value = {
    title: '操作成功',
    type: 'info',
    message: '任务已提交，系统将自动推进下一步流程。'
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
