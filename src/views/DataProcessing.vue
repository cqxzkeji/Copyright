<template>
  <section class="page">
    <div class="toolbar">
      <button class="primary" @click="openRuleModal">新建清洗规则</button>
      <button class="secondary" @click="openMergeModal">合并重复记录</button>
      <button class="secondary" @click="openTipModal">提示说明</button>
    </div>

    <div class="grid grid-4">
      <div class="card" v-for="stat in stats" :key="stat.label">
        <strong>{{ stat.value }}</strong>
        <p>{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid" style="margin-top: 16px; grid-template-columns: minmax(260px, 1fr) 2fr;">
      <div class="card">
        <h3>清洗规则命中率</h3>
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
              <th>规则名称</th>
              <th>处理字段</th>
              <th>执行批次</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.field }}</td>
              <td>{{ row.batch }}</td>
              <td><span class="badge">{{ row.status }}</span></td>
              <td>
                <button class="secondary" @click="openRowModal(row)">查看结果</button>
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
              规则名称
              <input class="input" v-model="form.rule" />
            </label>
            <label>
              数据字段
              <select v-model="form.field">
                <option>企业名称</option>
                <option>统一社会信用代码</option>
                <option>法人代表</option>
                <option>注册地址</option>
              </select>
            </label>
            <label>
              标准化方式
              <select v-model="form.method">
                <option>格式化文本</option>
                <option>去重合并</option>
                <option>缺失补全</option>
              </select>
            </label>
          </template>
          <template v-else-if="activeModal.type === 'progress'">
            <p>{{ activeModal.message }}</p>
            <div class="progress">
              <span :style="{ width: '52%' }"></span>
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
  { label: '待清洗记录', value: '2,640' },
  { label: '去重合并成功', value: '1,320' },
  { label: '字段校验通过', value: '98.6%' },
  { label: '异常修复建议', value: '86' }
];

const chartData = [
  { name: '名称标准化', value: 82 },
  { name: '地址规范化', value: 68 },
  { name: '证照校验', value: 74 },
  { name: '重复合并', value: 59 }
];

const tableData = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `规则-${index + 1}`,
  field: ['企业名称', '统一社会信用代码', '法人代表', '注册地址'][index % 4],
  batch: `批次 ${index + 1}`,
  status: index % 2 === 0 ? '已完成' : '执行中'
}));

const activeModal = ref(null);
const form = reactive({
  rule: '名称去重合并',
  field: '企业名称',
  method: '去重合并'
});

const openRuleModal = () => {
  activeModal.value = { title: '新建清洗规则', type: 'form' };
};

const openMergeModal = () => {
  activeModal.value = {
    title: '合并重复记录',
    type: 'progress',
    message: '系统正在扫描重复记录并生成合并清单。'
  };
};

const openTipModal = () => {
  activeModal.value = {
    title: '清洗提示',
    type: 'info',
    message: '建议先完成字段校验，再执行批量合并以提升准确率。'
  };
};

const openRowModal = (row) => {
  activeModal.value = {
    title: '规则执行结果',
    type: 'info',
    message: `${row.name} 作用于 ${row.field}，当前状态为 ${row.status}。`
  };
};

const closeModal = () => {
  activeModal.value = null;
};

const confirmModal = () => {
  activeModal.value = {
    title: '操作成功',
    type: 'info',
    message: '清洗规则已保存并进入执行队列。'
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
