<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h3>系统管理与权限控制</h3>
        <p>用户、角色、流程与系统参数配置。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('user')">用户与角色配置</button>
        <button class="outline" @click="openModal('project')">项目资产管理</button>
        <button class="outline" @click="openModal('flow')">流程审批规则</button>
        <button class="ghost" @click="openModal('log')">日志审计</button>
        <button class="ghost" @click="openModal('system')">系统参数配置</button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h4>权限分布</h4>
        <div class="permission">
          <div class="circle">
            <div class="slice admin">管理员 25%</div>
            <div class="slice editor">设计师 45%</div>
            <div class="slice viewer">观察者 30%</div>
          </div>
          <ul>
            <li>管理员：全模块访问</li>
            <li>设计师：创意/生产/投放</li>
            <li>观察者：报表与日志</li>
          </ul>
        </div>
      </div>

      <div class="card">
        <h4>用户与权限列表</h4>
        <table>
          <thead>
            <tr>
              <th>账号</th>
              <th>角色</th>
              <th>所属项目</th>
              <th>状态</th>
              <th>最后登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.project }}</td>
              <td>{{ user.status }}</td>
              <td>{{ user.lastLogin }}</td>
              <td>
                <button class="link" @click="openModal('detail', user)">查看</button>
                <button class="link" @click="openModal('grant', user)">授权</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="closeModal">
      <template v-if="activeModal === 'user'">
        <label>
          新增用户
          <input v-model="form.user" placeholder="输入姓名或账号" />
        </label>
        <label>
          角色配置
          <select v-model="form.role">
            <option>管理员</option>
            <option>设计师</option>
            <option>投放经理</option>
            <option>观察者</option>
          </select>
        </label>
      </template>

      <template v-else-if="activeModal === 'project'">
        <p>项目资产管理</p>
        <label>
          项目名称
          <input v-model="form.project" placeholder="如：品牌升级计划" />
        </label>
        <label>
          资产类型
          <input v-model="form.asset" placeholder="素材 / 模板 / 规范" />
        </label>
      </template>

      <template v-else-if="activeModal === 'flow'">
        <p>审批流程配置</p>
        <div class="progress">
          <div class="progress-bar" style="width: 58%"></div>
        </div>
        <p>当前启用：初稿 → 复审 → 定稿</p>
      </template>

      <template v-else-if="activeModal === 'log'">
        <p>操作日志</p>
        <ul>
          <li v-for="item in logs" :key="item">{{ item }}</li>
        </ul>
      </template>

      <template v-else-if="activeModal === 'system'">
        <label>
          系统主题
          <select v-model="form.theme">
            <option>亮色</option>
            <option>高对比</option>
            <option>品牌色</option>
          </select>
        </label>
        <label>
          默认语言
          <select v-model="form.language">
            <option>中文</option>
            <option>English</option>
          </select>
        </label>
      </template>

      <template v-else-if="activeModal === 'detail'">
        <p>账号：{{ selectedUser.name }}</p>
        <p>角色：{{ selectedUser.role }} · 项目：{{ selectedUser.project }}</p>
        <p>状态：{{ selectedUser.status }} · 最近登录：{{ selectedUser.lastLogin }}</p>
      </template>

      <template v-else-if="activeModal === 'grant'">
        <p>为 {{ selectedUser.name }} 授权</p>
        <label>
          权限范围
          <textarea v-model="form.permission" rows="3" placeholder="填写权限说明"></textarea>
        </label>
      </template>

      <template #footer>
        <button class="ghost" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="closeModal">确认</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');
const selectedUser = ref({});
const form = ref({
  user: '',
  role: '管理员',
  project: '',
  asset: '',
  theme: '亮色',
  language: '中文',
  permission: ''
});

const logs = [
  '2024/05/21 09:10 管理员更新审批流',
  '2024/05/21 14:32 新增用户 王悦',
  '2024/05/22 11:20 项目资产归档',
  '2024/05/23 16:45 系统参数调整'
];

const users = Array.from({ length: 22 }, (_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  role: ['管理员', '设计师', '投放经理', '观察者'][index % 4],
  project: ['品牌升级', '新品发布', '节日促销', '会员运营'][index % 4],
  status: ['启用', '禁用', '审核中', '启用'][index % 4],
  lastLogin: `2024-05-${String((index % 28) + 1).padStart(2, '0')} 10:${String(index % 60).padStart(2, '0')}`
}));

const openModal = (type, user) => {
  activeModal.value = type;
  selectedUser.value = user || {};
};

const closeModal = () => {
  activeModal.value = '';
};

const modalTitle = computed(() => {
  const titles = {
    user: '用户与角色配置',
    project: '项目与资产管理',
    flow: '流程配置与审批规则',
    log: '日志审计与操作追踪',
    system: '系统参数配置',
    detail: '用户详情',
    grant: '权限授权'
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

.permission {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 20px;
  align-items: center;
}

.circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(#2563eb 0 25%, #60a5fa 25% 70%, #c7d2fe 70% 100%);
  display: grid;
  place-items: center;
  font-size: 12px;
  color: #1e293b;
  text-align: center;
}

.slice {
  background: rgba(255, 255, 255, 0.8);
  padding: 6px 10px;
  border-radius: 10px;
}

.permission ul {
  margin: 0;
  padding-left: 16px;
  color: #475569;
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
</style>
