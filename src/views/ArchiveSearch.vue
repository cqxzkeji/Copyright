<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h3>档案查询与检索</h3>
        <p>支持关键词、分类、标签等多条件快速检索。</p>
      </div>
      <div class="toolbar">
        <button class="primary" type="button" @click="openModal('advanced')">高级检索</button>
        <button class="secondary" type="button" @click="openModal('save')">保存查询</button>
        <button class="ghost" type="button" @click="openModal('subscribe')">订阅结果</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <h4>检索面板</h4>
        <form class="search" @submit.prevent="openModal('result')">
          <input v-model="search.keyword" placeholder="输入关键字" />
          <select v-model="search.category">
            <option>全部分类</option>
            <option>教学评估</option>
            <option>课程建设</option>
            <option>实习实践</option>
          </select>
          <select v-model="search.tag">
            <option>全部标签</option>
            <option>优秀课程</option>
            <option>督导记录</option>
            <option>学生反馈</option>
          </select>
          <button class="primary" type="submit">快速检索</button>
        </form>
      </div>
      <div class="card">
        <h4>检索趋势</h4>
        <div class="trend">
          <div v-for="item in trend" :key="item.label" class="pill">
            <span>{{ item.label }}</span>
            <strong>{{ item.count }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="table-section">
      <div class="table-header">
        <h4>检索结果</h4>
        <button class="ghost" type="button" @click="openModal('export')">导出结果</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>档案编号</th>
            <th>档案名称</th>
            <th>分类</th>
            <th>标签</th>
            <th>更新时间</th>
            <th>匹配度</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in results" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.tag }}</td>
            <td>{{ item.updated }}</td>
            <td>{{ item.score }}%</td>
            <td>
              <button class="link" type="button" @click="openDetail(item)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="activeModal === 'advanced'" title="高级检索" @close="closeModal">
      <form class="form">
        <label>关键词<input v-model="advanced.keyword" placeholder="如：教学质量" /></label>
        <label>时间范围<input v-model="advanced.range" placeholder="如：2024-01 至 2024-06" /></label>
        <label>是否包含附件<select v-model="advanced.attachment">
          <option>全部</option>
          <option>包含</option>
          <option>不包含</option>
        </select></label>
        <label>关键词权重<select v-model="advanced.weight">
          <option>普通</option>
          <option>高</option>
          <option>最高</option>
        </select></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('result')">开始检索</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'result'" title="检索完成" @close="closeModal">
      <p>已为“{{ search.keyword || advanced.keyword || '全部档案' }}”找到 24 条匹配记录。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'save'" title="保存查询" @close="closeModal">
      <form class="form">
        <label>查询名称<input v-model="saveQuery.name" placeholder="如：督导记录检索" /></label>
        <label>通知频率<select v-model="saveQuery.notify">
          <option>每周</option>
          <option>每月</option>
          <option>仅一次</option>
        </select></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('saveResult')">保存</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'saveResult'" title="查询已保存" @close="closeModal">
      <p>查询“{{ saveQuery.name || '未命名' }}”已保存，并将在 {{ saveQuery.notify }} 发送提醒。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'subscribe'" title="订阅检索结果" @close="closeModal">
      <p>订阅后，系统将自动推送新档案。</p>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('subscribeResult')">确认订阅</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'subscribeResult'" title="订阅成功" @close="closeModal">
      <p>已为当前检索条件开启订阅通知。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'export'" title="导出检索结果" @close="closeModal">
      <p>系统正在生成 Excel 和 PDF 报表。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: exportProgress + '%' }"></div>
      </div>
      <p class="hint">进度 {{ exportProgress }}%</p>
      <template #footer>
        <button class="secondary" type="button" @click="increaseExport">刷新进度</button>
        <button class="primary" type="button" @click="closeModal">完成</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'detail'" title="档案详情" @close="closeModal">
      <p>档案名称：{{ selected?.name }}</p>
      <p>分类：{{ selected?.category }}</p>
      <p>标签：{{ selected?.tag }}</p>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="openModal('request')">申请权限</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'request'" title="权限申请" @close="closeModal">
      <form class="form">
        <label>申请原因<textarea v-model="request.reason" rows="3" placeholder="请输入访问原因"></textarea></label>
        <label>有效期限<select v-model="request.duration">
          <option>7天</option>
          <option>30天</option>
          <option>90天</option>
        </select></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('requestResult')">提交申请</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'requestResult'" title="申请已提交" @close="closeModal">
      <p>申请已提交审批，预计 2 小时内反馈。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const exportProgress = ref(63);
const selected = ref(null);

const search = reactive({
  keyword: '',
  category: '全部分类',
  tag: '全部标签'
});

const advanced = reactive({
  keyword: '',
  range: '',
  attachment: '全部',
  weight: '普通'
});

const saveQuery = reactive({
  name: '',
  notify: '每周'
});

const request = reactive({
  reason: '',
  duration: '7天'
});

const trend = [
  { label: '今日检索', count: 186 },
  { label: '热门标签', count: 42 },
  { label: '收藏查询', count: 28 }
];

const results = Array.from({ length: 24 }, (_, index) => ({
  id: `AR-${2024100 + index}`,
  name: `教学档案记录 ${index + 1}`,
  category: ['教学评估', '课程建设', '实践教学'][index % 3],
  tag: ['优秀课程', '督导记录', '学生反馈'][index % 3],
  updated: `2024-06-${(index % 28) + 1}`,
  score: 78 + (index % 20)
}));

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const increaseExport = () => {
  exportProgress.value = Math.min(100, exportProgress.value + 9);
};

const openDetail = (item) => {
  selected.value = item;
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

.search {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.search input,
.search select {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
  background: #fff;
}

.trend {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.pill {
  display: flex;
  justify-content: space-between;
  background: #e0f2fe;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
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

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.hint {
  font-size: 12px;
  color: #64748b;
}
</style>
