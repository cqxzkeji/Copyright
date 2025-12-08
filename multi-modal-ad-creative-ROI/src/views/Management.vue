<template>
  <div class="card" style="margin-bottom: 1rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">管理后台</h3>
        <p class="helper-text" style="margin: 0.25rem 0 0;">角色、权限与审批链配置，按钮均触发模态</p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="primary-btn" @click="showAddUser = true">新增用户</button>
        <button class="secondary-btn" @click="showRole = true">创建角色</button>
        <button class="secondary-btn" @click="showFlow = true">审批流程</button>
        <button class="secondary-btn" @click="showSync = true">权限同步</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
      <div>
        <h3 style="margin: 0;">成员列表</h3>
        <p class="helper-text" style="margin: 0.25rem 0 0;">包含 10+ 条成员数据，每行操作均弹窗</p>
      </div>
      <button class="secondary-btn" @click="showAudit = true">操作审计</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>姓名</th>
          <th>邮箱</th>
          <th>角色</th>
          <th>状态</th>
          <th>最后登陆</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in members" :key="member.email">
          <td>{{ member.name }}</td>
          <td>{{ member.email }}</td>
          <td>{{ member.role }}</td>
          <td><span class="tag">{{ member.status }}</span></td>
          <td>{{ member.lastLogin }}</td>
          <td class="table-actions">
            <button class="secondary-btn" @click="openMember(member)">详情</button>
            <button class="secondary-btn" @click="openHint(member)">提示</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-if="showAddUser" title="新增用户" subtitle="表单弹窗" @close="showAddUser = false">
    <div class="form-grid">
      <label>
        <span class="helper-text">姓名</span>
        <input class="input" v-model="userForm.name" />
      </label>
      <label>
        <span class="helper-text">邮箱</span>
        <input class="input" v-model="userForm.email" />
      </label>
      <label>
        <span class="helper-text">角色</span>
        <select class="input" v-model="userForm.role">
          <option>管理员</option>
          <option>投放经理</option>
          <option>数据分析</option>
          <option>财务</option>
        </select>
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showAddUser = false">取消</button>
      <button class="primary-btn" @click="saveUser">创建</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showRole" title="创建角色" subtitle="表单弹窗" @close="showRole = false">
    <div class="form-grid">
      <label>
        <span class="helper-text">角色名称</span>
        <input class="input" v-model="roleForm.name" />
      </label>
      <label>
        <span class="helper-text">数据权限</span>
        <select class="input" v-model="roleForm.scope">
          <option>全局</option>
          <option>按业务线</option>
          <option>按项目</option>
        </select>
      </label>
      <label>
        <span class="helper-text">审批级别</span>
        <select class="input" v-model="roleForm.level">
          <option>单人</option>
          <option>双人</option>
          <option>多级</option>
        </select>
      </label>
    </div>
    <template #footer>
      <button class="secondary-btn" @click="showRole = false">取消</button>
      <button class="primary-btn" @click="showRole = false">保存</button>
    </template>
  </ModalDialog>

  <ModalDialog v-if="showFlow" title="审批流程" subtitle="提示信息弹窗" @close="showFlow = false">
    <p class="helper-text">创意生成、预算调整、报告导出均需经过审批链。</p>
    <ul class="helper-text" style="padding-left: 1.1rem; display: grid; gap: 0.25rem;">
      <li>步骤 1：发起人提交申请</li>
      <li>步骤 2：部门负责人审核</li>
      <li>步骤 3：安全与合规复核</li>
      <li>步骤 4：自动同步至平台并留痕</li>
    </ul>
  </ModalDialog>

  <ModalDialog v-if="showSync" title="权限同步" subtitle="进度条弹窗" @close="showSync = false">
    <p class="helper-text">正在同步到广告平台与数据仓库，预计 15 秒完成。</p>
    <div class="progress-shell" style="margin-top: 0.5rem;">
      <div class="progress-inner" :style="{ width: syncProgress + '%' }"></div>
    </div>
  </ModalDialog>

  <ModalDialog v-if="showAudit" title="操作审计" subtitle="提示信息弹窗" @close="showAudit = false">
    <p class="helper-text">最近 5 次敏感操作如下：</p>
    <ul class="helper-text" style="padding-left: 1.1rem; display: grid; gap: 0.25rem;">
      <li>09:15 张三 调整 B 计划预算 +20%</li>
      <li>09:02 李四 导出 ROI 报告</li>
      <li>08:41 王五 批量暂停 3 个计划</li>
      <li>08:05 赵六 更新搜索落地页</li>
      <li>07:52 孙七 开启智能出价</li>
    </ul>
  </ModalDialog>

  <ModalDialog v-if="showMember" :title="activeMember?.name" subtitle="成员详情" @close="showMember = false">
    <p class="helper-text">角色：{{ activeMember?.role }} · 状态：{{ activeMember?.status }}</p>
    <p class="helper-text">邮箱：{{ activeMember?.email }}</p>
    <p class="helper-text">最近登陆：{{ activeMember?.lastLogin }}</p>
  </ModalDialog>

  <ModalDialog v-if="showHint" title="操作提示" subtitle="按钮提示信息弹窗" @close="showHint = false">
    <p class="helper-text">{{ hintText }}</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showAddUser = ref(false);
const showRole = ref(false);
const showFlow = ref(false);
const showSync = ref(false);
const showAudit = ref(false);
const showMember = ref(false);
const showHint = ref(false);
const syncProgress = ref(62);
const hintText = ref('');
const activeMember = ref(null);

const userForm = reactive({ name: '新同事', email: 'new@company.com', role: '投放经理' });
const roleForm = reactive({ name: '区域负责人', scope: '按业务线', level: '双人' });

const members = reactive([
  { name: '张三', email: 'zhangsan@company.com', role: '投放经理', status: '在岗', lastLogin: '今天 09:15' },
  { name: '李四', email: 'lisi@company.com', role: '数据分析', status: '在岗', lastLogin: '今天 08:40' },
  { name: '王五', email: 'wangwu@company.com', role: '管理员', status: '在岗', lastLogin: '今天 09:05' },
  { name: '赵六', email: 'zhaoliu@company.com', role: '投放经理', status: '休假', lastLogin: '昨天 17:20' },
  { name: '孙七', email: 'sunqi@company.com', role: '财务', status: '在岗', lastLogin: '今天 08:58' },
  { name: '周八', email: 'zhouba@company.com', role: '数据分析', status: '在岗', lastLogin: '今天 08:31' },
  { name: '吴九', email: 'wujiu@company.com', role: '投放经理', status: '在岗', lastLogin: '今天 09:02' },
  { name: '郑十', email: 'zhengshi@company.com', role: '管理员', status: '在岗', lastLogin: '今天 07:55' },
  { name: '钱一', email: 'qianyi@company.com', role: '投放经理', status: '在岗', lastLogin: '今天 09:10' },
  { name: '顾二', email: 'guer@company.com', role: '数据分析', status: '在岗', lastLogin: '今天 08:45' },
  { name: '秦三', email: 'qinsan@company.com', role: '投放经理', status: '在岗', lastLogin: '今天 08:20' },
]);

const saveUser = () => {
  members.push({ ...userForm, status: '在岗', lastLogin: '刚刚' });
  showAddUser.value = false;
};

const openMember = (member) => {
  activeMember.value = member;
  showMember.value = true;
};

const openHint = (member) => {
  hintText.value = `${member.name} 的权限与 ROI 模块已同步，可直接查看报告。`;
  showHint.value = true;
};
</script>
