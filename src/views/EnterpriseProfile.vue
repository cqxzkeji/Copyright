<template>
  <section class="page">
    <div class="toolbar">
      <button class="primary" @click="openTagModal">创建标签规则</button>
      <button class="secondary" @click="openProfileModal">生成企业画像</button>
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
        <h3>风险标签覆盖率</h3>
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
              <th>画像评级</th>
              <th>风险标签</th>
              <th>更新日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.level }}</td>
              <td>{{ row.tag }}</td>
              <td>{{ row.time }}</td>
              <td>
                <button class="secondary" @click="openRowModal(row)">查看画像</button>
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
              标签名称
              <input class="input" v-model="form.tag" />
            </label>
            <label>
              触发规则
              <select v-model="form.rule">
                <option>涉诉次数大于 3 次</option>
                <option>中标金额超 5000 万</option>
                <option>舆情负面占比超过 30%</option>
              </select>
            </label>
            <label>
              标签等级
              <select v-model="form.level">
                <option>高风险</option>
                <option>中风险</option>
                <option>低风险</option>
              </select>
            </label>
          </template>
          <template v-else-if="activeModal.type === 'progress'">
            <p>{{ activeModal.message }}</p>
            <div class="progress">
              <span :style="{ width: '78%' }"></span>
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
  { label: '已画像企业', value: '6,240' },
  { label: '高风险标签', value: '412' },
  { label: '自定义标签', value: '86' },
  { label: '画像更新任务', value: '38' }
];

const chartData = [
  { name: '信用风险', value: 72 },
  { name: '涉诉风险', value: 65 },
  { name: '经营异常', value: 58 },
  { name: '舆情风险', value: 46 }
];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `华企${index + 1}投资集团`,
  level: ['AAA', 'AA', 'A', 'BBB'][index % 4],
  tag: ['信用优良', '涉诉预警', '舆情关注', '经营异常'][index % 4],
  time: `2024-09-${(index % 30) + 1}`
}));

const activeModal = ref(null);
const form = reactive({
  tag: '涉诉高频',
  rule: '涉诉次数大于 3 次',
  level: '高风险'
});

const openTagModal = () => {
  activeModal.value = { title: '创建标签规则', type: 'form' };
};

const openProfileModal = () => {
  activeModal.value = {
    title: '生成企业画像',
    type: 'progress',
    message: '系统正在汇聚多源数据并生成企业画像。'
  };
};

const openTipModal = () => {
  activeModal.value = {
    title: '标签提示',
    type: 'info',
    message: '自定义标签可组合多条件策略，建议结合舆情与司法信息。'
  };
};

const openRowModal = (row) => {
  activeModal.value = {
    title: '企业画像详情',
    type: 'info',
    message: `${row.name} 当前评级 ${row.level}，核心标签为 ${row.tag}。`
  };
};

const closeModal = () => {
  activeModal.value = null;
};

const confirmModal = () => {
  activeModal.value = {
    title: '操作成功',
    type: 'info',
    message: '标签策略已更新并同步至企业画像库。'
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
