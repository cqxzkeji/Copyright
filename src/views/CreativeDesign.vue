<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h3>广告创意与设计管理</h3>
        <p>管理创意方案、在线设计与多版本评审流转。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('create')">新建创意方案</button>
        <button class="outline" @click="openModal('template')">导入模板</button>
        <button class="outline" @click="openModal('review')">启动评审流转</button>
        <button class="ghost" @click="openModal('tag')">创意标签管理</button>
        <button class="ghost" @click="openModal('history')">版本历史回溯</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h4>创意概览</h4>
        <div class="stats">
          <div>
            <span>本周新增</span>
            <strong>18</strong>
          </div>
          <div>
            <span>评审中</span>
            <strong>6</strong>
          </div>
          <div>
            <span>可复用模板</span>
            <strong>42</strong>
          </div>
        </div>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="bar">
            <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h4>设计任务列表</h4>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>创意主题</th>
              <th>类型</th>
              <th>当前版本</th>
              <th>状态</th>
              <th>负责人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.title }}</td>
              <td>{{ task.type }}</td>
              <td>{{ task.version }}</td>
              <td>{{ task.status }}</td>
              <td>{{ task.owner }}</td>
              <td>
                <button class="link" @click="openModal('detail', task)">查看</button>
                <button class="link" @click="openModal('edit', task)">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'create'">
        <label>
          创意名称
          <input v-model="form.title" placeholder="请输入创意名称" />
        </label>
        <label>
          设计类型
          <select v-model="form.type">
            <option>平面</option>
            <option>视频</option>
            <option>H5</option>
            <option>多尺寸物料</option>
          </select>
        </label>
        <label>
          目标渠道
          <input v-model="form.channel" placeholder="如：抖音 / 电梯屏" />
        </label>
      </template>

      <template v-else-if="activeModal === 'template'">
        <p>请选择要复用的模板并设置适配规格。</p>
        <label>
          模板库
          <select v-model="form.template">
            <option>新品发布模板</option>
            <option>节日促销模板</option>
            <option>品牌升级模板</option>
          </select>
        </label>
        <label>
          输出规格
          <input v-model="form.size" placeholder="如：1080x1920" />
        </label>
      </template>

      <template v-else-if="activeModal === 'review'">
        <p>评审流转进度</p>
        <div class="progress">
          <div class="progress-bar" style="width: 45%"></div>
        </div>
        <p>已完成：初稿提交 → 复审中</p>
      </template>

      <template v-else-if="activeModal === 'tag'">
        <p>为创意方案设置标签分类。</p>
        <div class="tag-group">
          <span v-for="tag in tags" :key="tag">{{ tag }}</span>
        </div>
      </template>

      <template v-else-if="activeModal === 'history'">
        <p>最近版本记录</p>
        <ul>
          <li v-for="record in history" :key="record">{{ record }}</li>
        </ul>
      </template>

      <template v-else-if="activeModal === 'detail'">
        <p><strong>{{ selectedTask.title }}</strong> 的方案详情</p>
        <p>类型：{{ selectedTask.type }} | 负责人：{{ selectedTask.owner }}</p>
        <p>当前版本：{{ selectedTask.version }}，状态：{{ selectedTask.status }}</p>
      </template>

      <template v-else-if="activeModal === 'edit'">
        <label>
          更新版本
          <input v-model="form.version" placeholder="如：V2.1" />
        </label>
        <label>
          更新说明
          <textarea v-model="form.note" rows="3" placeholder="填写变更说明"></textarea>
        </label>
      </template>

      <template #footer>
        <button class="ghost" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');
const selectedTask = ref({});
const form = ref({
  title: '',
  type: '平面',
  channel: '',
  template: '新品发布模板',
  size: '',
  version: '',
  note: ''
});

const chartData = [
  { label: '平面', value: 70 },
  { label: '视频', value: 55 },
  { label: 'H5', value: 45 },
  { label: '多尺寸', value: 60 }
];

const tags = ['新品', '促销', '品牌升级', '会员权益', '直播预告'];
const history = [
  'V3.0 - 2024/05/21 - 视觉升级',
  'V2.3 - 2024/05/18 - 文案调整',
  'V2.1 - 2024/05/15 - 结构优化',
  'V2.0 - 2024/05/10 - 复审通过'
];

const tasks = Array.from({ length: 22 }, (_, index) => {
  const id = `CD-${String(index + 1).padStart(3, '0')}`;
  return {
    id,
    title: `新品创意方案 ${index + 1}`,
    type: ['平面', '视频', 'H5', '多尺寸物料'][index % 4],
    version: `V${1 + Math.floor(index / 3)}.${index % 3}`,
    status: ['初稿', '复审', '定稿', '调整中'][index % 4],
    owner: ['林晓', '周成', '韩雪', '王悦'][index % 4]
  };
});

const openModal = (type, task) => {
  activeModal.value = type;
  selectedTask.value = task || {};
};

const closeModal = () => {
  activeModal.value = '';
};

const modalTitle = computed(() => {
  const titles = {
    create: '新建创意方案',
    template: '模板化设计导入',
    review: '评审流转进度',
    tag: '创意标签管理',
    history: '版本历史回溯',
    detail: '方案详情',
    edit: '编辑方案'
  };
  return titles[activeModal.value] || '操作';
});
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.page-header h3 {
  margin: 0 0 6px;
}

.page-header p {
  margin: 0;
  color: #64748b;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.outline {
  background: #fff;
  border: 1px solid #cbd5f5;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.ghost {
  background: #f8fafc;
  border: 1px dashed #cbd5f5;
  color: #475569;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.grid {
  display: grid;
  gap: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stats div {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 6px;
}

.stats strong {
  font-size: 20px;
}

.chart {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  align-items: end;
}

.bar {
  display: grid;
  gap: 6px;
  text-align: center;
  font-size: 12px;
  color: #64748b;
}

.bar-fill {
  height: 100px;
  background: linear-gradient(180deg, #60a5fa, #2563eb);
  border-radius: 10px 10px 6px 6px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.link {
  background: transparent;
  border: none;
  color: #2563eb;
  cursor: pointer;
  margin-right: 8px;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-group span {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}
</style>
