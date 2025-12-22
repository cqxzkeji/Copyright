<template>
  <section class="view">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2>主播与账号管理</h2>
          <p>管理主播档案、账号权限与排班。</p>
        </div>
        <div class="actions">
          <button class="primary" @click="openModal('add')">新增主播</button>
          <button class="ghost" @click="openModal('shift')">排班设置</button>
          <button class="outline" @click="openModal('progress')">培训进度</button>
        </div>
      </div>
      <div class="card-grid">
        <div class="anchor-card" v-for="anchor in anchors" :key="anchor.id">
          <div class="avatar">{{ anchor.name.slice(0, 1) }}</div>
          <div>
            <h3>{{ anchor.name }}</h3>
            <p>{{ anchor.skill }}</p>
          </div>
          <div class="tag-row">
            <span class="tag">{{ anchor.level }}</span>
            <span class="tag">{{ anchor.status }}</span>
          </div>
          <button class="ghost" @click="openModal('detail')">查看资料</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>主播账号列表</h2>
        <button class="primary" @click="openModal('role')">权限配置</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>主播</th>
              <th>账号角色</th>
              <th>活跃指数</th>
              <th>粉丝量</th>
              <th>本周场次</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.role }}</td>
              <td>{{ row.active }}</td>
              <td>{{ row.fans }}</td>
              <td>{{ row.sessions }}</td>
              <td><span class="tag">{{ row.status }}</span></td>
              <td><button class="ghost" @click="openModal('edit')">编辑</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <BaseModal v-if="activeModal" :title="modalTitle" :confirm-text="confirmText" @close="activeModal = ''" @confirm="confirm">
    <template v-if="activeModal === 'add'">
      <label>
        主播姓名
        <input v-model="form.name" placeholder="请输入姓名" />
      </label>
      <label>
        擅长品类
        <input v-model="form.skill" placeholder="如：蔬果、生鲜" />
      </label>
      <label>
        账号等级
        <select v-model="form.level">
          <option>金牌主播</option>
          <option>银牌主播</option>
          <option>新锐主播</option>
        </select>
      </label>
    </template>
    <template v-else-if="activeModal === 'shift'">
      <label>
        排班日期
        <input v-model="form.date" type="date" />
      </label>
      <label>
        主播选择
        <input v-model="form.name" placeholder="请输入主播" />
      </label>
    </template>
    <template v-else-if="activeModal === 'role'">
      <label>
        账号角色
        <select v-model="form.role">
          <option>主主播</option>
          <option>助理主播</option>
          <option>运营协同</option>
        </select>
      </label>
      <label>
        权限说明
        <textarea v-model="form.note" rows="3" placeholder="填写权限说明"></textarea>
      </label>
    </template>
    <template v-else-if="activeModal === 'edit'">
      <label>
        状态更新
        <select v-model="form.status">
          <option>在岗</option>
          <option>休假</option>
          <option>待培训</option>
        </select>
      </label>
      <label>
        活跃指数
        <input v-model="form.active" type="number" placeholder="请输入指数" />
      </label>
    </template>
    <template v-else-if="activeModal === 'detail'">
      <p>主播资料包含直播表现与培训进度。</p>
      <ul class="info-list">
        <li>本月直播：8 场</li>
        <li>平均转化率：6.8%</li>
        <li>培训完成度：92%</li>
      </ul>
    </template>
    <template v-else-if="activeModal === 'progress'">
      <p>培训进度</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>{{ progress }}% 已完成</p>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const anchors = [
  { id: 1, name: '李晓梅', skill: '蔬果溯源讲解', level: '金牌主播', status: '在岗' },
  { id: 2, name: '王倩', skill: '直播氛围营造', level: '银牌主播', status: '在岗' },
  { id: 3, name: '陈琳', skill: '烹饪教学', level: '新锐主播', status: '待培训' }
];

const tableRows = [
  { id: 'A-001', name: '李晓梅', role: '主主播', active: 92, fans: '8.2万', sessions: 6, status: '在岗' },
  { id: 'A-002', name: '王倩', role: '主主播', active: 88, fans: '7.4万', sessions: 5, status: '在岗' },
  { id: 'A-003', name: '陈琳', role: '助理主播', active: 76, fans: '5.8万', sessions: 4, status: '待培训' },
  { id: 'A-004', name: '赵磊', role: '主主播', active: 90, fans: '6.9万', sessions: 5, status: '在岗' },
  { id: 'A-005', name: '唐敏', role: '助理主播', active: 72, fans: '4.6万', sessions: 3, status: '休假' },
  { id: 'A-006', name: '周宁', role: '运营协同', active: 80, fans: '5.3万', sessions: 4, status: '在岗' },
  { id: 'A-007', name: '马晓', role: '主主播', active: 85, fans: '6.1万', sessions: 4, status: '在岗' },
  { id: 'A-008', name: '何佳', role: '助理主播', active: 70, fans: '4.2万', sessions: 3, status: '休假' },
  { id: 'A-009', name: '蒋婷', role: '主主播', active: 87, fans: '6.8万', sessions: 5, status: '在岗' },
  { id: 'A-010', name: '胡悦', role: '主主播', active: 89, fans: '7.1万', sessions: 6, status: '在岗' }
];

const activeModal = ref('');
const modalTitle = ref('');
const confirmText = ref('确认');
const progress = ref(82);

const form = reactive({
  name: '',
  skill: '',
  level: '金牌主播',
  date: '',
  role: '主主播',
  status: '在岗',
  active: 80,
  note: ''
});

const openModal = (type) => {
  activeModal.value = type;
  const titleMap = {
    add: '新增主播',
    shift: '排班设置',
    progress: '培训进度',
    role: '权限配置',
    edit: '编辑账号',
    detail: '主播资料'
  };
  modalTitle.value = titleMap[type];
  confirmText.value = type === 'detail' || type === 'progress' ? '' : '确认';
};

const confirm = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.panel-header p {
  color: #64748b;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.anchor-card {
  background: #f8fafc;
  padding: 14px;
  border-radius: 16px;
  display: grid;
  gap: 10px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #a5b4fc, #38bdf8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
}

.tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
}

tr + tr {
  border-top: 1px solid #e2e8f0;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.ghost {
  background: #e0f2fe;
  color: #0369a1;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.outline {
  background: transparent;
  border: 1px solid #cbd5f5;
  color: #1d4ed8;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22d3ee);
}

input,
select,
textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-list {
  padding-left: 18px;
  color: #475569;
}
</style>
