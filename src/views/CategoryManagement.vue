<template>
  <div class="module">
    <header class="module-header">
      <div>
        <h3>档案分类与标签管理</h3>
        <p>多维度分类结构，支持快速标签索引。</p>
      </div>
      <div class="toolbar">
        <button class="primary" type="button" @click="openModal('create')">新增分类</button>
        <button class="secondary" type="button" @click="openModal('tag')">标签分配</button>
        <button class="ghost" type="button" @click="openModal('batch')">批量调整</button>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <h4>标签热度</h4>
        <div class="chip-grid">
          <span v-for="chip in tags" :key="chip.name" class="chip">
            {{ chip.name }} <strong>{{ chip.count }}</strong>
          </span>
        </div>
      </div>
      <div class="card">
        <h4>分类分布图</h4>
        <div class="donut">
          <div class="center">分类 6</div>
        </div>
        <button class="secondary" type="button" @click="openModal('map')">查看分类地图</button>
      </div>
    </section>

    <section class="table-section">
      <div class="table-header">
        <h4>分类列表</h4>
        <button class="ghost" type="button" @click="openModal('filter')">多维筛选</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>分类编号</th>
            <th>分类名称</th>
            <th>标签数量</th>
            <th>归档量</th>
            <th>更新频率</th>
            <th>负责人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.tags }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.update }}</td>
            <td>{{ item.owner }}</td>
            <td>
              <button class="link" type="button" @click="openDetail(item)">配置</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="activeModal === 'create'" title="新增分类" @close="closeModal">
      <form class="form">
        <label>分类名称<input v-model="form.name" placeholder="如：教学评估" /></label>
        <label>归档范围<textarea v-model="form.scope" rows="3" placeholder="填写包含的档案范围"></textarea></label>
        <label>负责部门<input v-model="form.department" placeholder="如：教务处" /></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('createResult')">保存分类</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'createResult'" title="分类已创建" @close="closeModal">
      <p>分类“{{ form.name || '未命名' }}”已创建，并加入目录树。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'tag'" title="标签分配" @close="closeModal">
      <form class="form">
        <label>选择分类
          <select v-model="form.target">
            <option v-for="item in categories" :key="item.id">{{ item.name }}</option>
          </select>
        </label>
        <label>新增标签<input v-model="form.tag" placeholder="如：实习实践" /></label>
        <label>标签说明<textarea v-model="form.note" rows="3" placeholder="说明标签用途"></textarea></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="openModal('tagResult')">提交分配</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'tagResult'" title="标签已更新" @close="closeModal">
      <p>标签“{{ form.tag || '未填写' }}”已加入 {{ form.target || '目标分类' }}。</p>
    </BaseModal>

    <BaseModal :open="activeModal === 'batch'" title="批量调整" @close="closeModal">
      <p>已选择 12 条分类规则，将统一更新标签策略。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: batchProgress + '%' }"></div>
      </div>
      <p class="hint">进度 {{ batchProgress }}%</p>
      <template #footer>
        <button class="secondary" type="button" @click="increaseBatch">继续执行</button>
        <button class="primary" type="button" @click="closeModal">完成</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'map'" title="分类地图" @close="closeModal">
      <ul class="map">
        <li>教学管理
          <ul>
            <li>课程建设</li>
            <li>教学改革</li>
          </ul>
        </li>
        <li>质量评估
          <ul>
            <li>教学督导</li>
            <li>学生反馈</li>
          </ul>
        </li>
        <li>实践教学
          <ul>
            <li>实习实践</li>
            <li>创新创业</li>
          </ul>
        </li>
      </ul>
    </BaseModal>

    <BaseModal :open="activeModal === 'filter'" title="多维筛选" @close="closeModal">
      <form class="form">
        <label>标签数量
          <select v-model="filter.tags">
            <option>全部</option>
            <option>0-5</option>
            <option>6-10</option>
            <option>10+</option>
          </select>
        </label>
        <label>更新时间<input v-model="filter.update" placeholder="如：本月" /></label>
      </form>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">取消</button>
        <button class="primary" type="button" @click="closeModal">应用筛选</button>
      </template>
    </BaseModal>

    <BaseModal :open="activeModal === 'detail'" title="分类配置" @close="closeModal">
      <p>分类：{{ selected?.name }}</p>
      <p>标签数：{{ selected?.tags }}</p>
      <p>归档量：{{ selected?.count }}</p>
      <template #footer>
        <button class="secondary" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="openModal('tag')">编辑标签</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const activeModal = ref('');
const batchProgress = ref(52);
const selected = ref(null);

const form = reactive({
  name: '',
  scope: '',
  department: '',
  target: '',
  tag: '',
  note: ''
});

const filter = reactive({
  tags: '全部',
  update: ''
});

const tags = [
  { name: '教学评估', count: 128 },
  { name: '实习实践', count: 96 },
  { name: '课程建设', count: 72 },
  { name: '教研活动', count: 54 },
  { name: '教学改革', count: 48 },
  { name: '学生反馈', count: 39 }
];

const categories = Array.from({ length: 22 }, (_, index) => ({
  id: `CT-${202400 + index}`,
  name: `分类目录 ${index + 1}`,
  tags: 3 + (index % 8),
  count: 30 + index * 2,
  update: ['每周', '每月', '季度'][index % 3],
  owner: ['李然', '郭洁', '沈宁'][index % 3]
}));

const openModal = (type) => {
  activeModal.value = type;
};

const closeModal = () => {
  activeModal.value = '';
};

const increaseBatch = () => {
  batchProgress.value = Math.min(100, batchProgress.value + 10);
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

.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.chip {
  background: #e0f2fe;
  color: #0f172a;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.donut {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(#38bdf8 0 40%, #22c55e 40% 65%, #f59e0b 65% 85%, #6366f1 85% 100%);
  display: grid;
  place-items: center;
  margin: 12px 0 8px;
}

.center {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
  font-size: 12px;
  color: #334155;
  box-shadow: inset 0 0 0 1px #e2e8f0;
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
  background: linear-gradient(90deg, #38bdf8, #2563eb);
}

.hint {
  font-size: 12px;
  color: #64748b;
}

.map {
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #475569;
}

.map ul {
  padding-left: 18px;
}
</style>
