<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h2>系统管理与统计</h2>
        <p>权限配置、统计报表与决策支持，保障平台稳定运行。</p>
      </div>
      <div class="actions">
        <button @click="openModal('role')">新增角色</button>
        <button @click="openModal('report')">导出报表</button>
      </div>
    </header>

    <section class="card">
      <div class="table-head">
        <h3>用户与角色</h3>
        <span class="note">当前 {{ roles.length }} 位成员</span>
      </div>
      <div class="table">
        <div class="table-row table-header">
          <span>姓名</span>
          <span>角色</span>
          <span>部门</span>
          <span>权限范围</span>
          <span>最近登录</span>
          <span>状态</span>
        </div>
        <div v-for="item in roles" :key="item.name" class="table-row">
          <span>{{ item.name }}</span>
          <span>{{ item.role }}</span>
          <span>{{ item.team }}</span>
          <span>{{ item.scope }}</span>
          <span>{{ item.login }}</span>
          <span>{{ item.status }}</span>
        </div>
      </div>
    </section>

    <section class="grid">
      <div class="card">
        <h3>月度统计</h3>
        <div class="trend">
          <div v-for="item in monthly" :key="item.label" class="trend-row">
            <span>{{ item.label }}</span>
            <div class="trend-bar">
              <div class="trend-fill" :style="{ width: item.value + '%' }"></div>
            </div>
            <span class="value">{{ item.value }}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>操作快捷入口</h3>
        <div class="pill-group">
          <button class="ghost" @click="openModal('clean')">清理缓存</button>
          <button class="ghost" @click="openModal('backup')">立即备份</button>
          <button class="ghost" @click="openModal('notice')">发布公告</button>
        </div>
      </div>
    </section>

    <div v-if="toast" class="toast">{{ toast }}</div>

    <Modal v-if="modal.type" :title="modalTitle" @close="closeModal" @confirm="confirmModal">
      <template v-if="modal.type === 'role'">
        <p class="subtitle">为成员分配角色与权限。</p>
        <label>姓名<input v-model="form.name" placeholder="输入姓名" /></label>
        <label>角色<input v-model="form.role" placeholder="如：数据分析员" /></label>
      </template>
      <template v-else-if="modal.type === 'report'">
        <p class="subtitle">导出系统使用与业务统计报表。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '76%' }"></div>
        </div>
      </template>
      <template v-else-if="modal.type === 'clean'">
        <p class="subtitle">确认清理缓存并重建索引？</p>
      </template>
      <template v-else-if="modal.type === 'backup'">
        <p class="subtitle">备份正在执行，请勿关闭窗口。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: '42%' }"></div>
        </div>
      </template>
      <template v-else-if="modal.type === 'notice'">
        <p class="subtitle">填写公告内容，将通知所有成员。</p>
        <textarea v-model="form.notice" rows="3" placeholder="维护通知、版本更新..."></textarea>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../components/Modal.vue';

const roles = reactive([
  { name: '王瑜', role: '管理员', team: '平台运营', scope: '全局', login: '10:20', status: '在线' },
  { name: '贺兰', role: '行业审核', team: '风控', scope: '审核', login: '09:10', status: '在线' },
  { name: '周舟', role: '行业审核', team: '风控', scope: '审核', login: '昨天', status: '离线' },
  { name: '刘戈', role: '项目经理', team: '交付', scope: '项目', login: '08:55', status: '在线' },
  { name: '苏盈', role: '专家运营', team: '交付', scope: '专家库', login: '前天', status: '在线' },
  { name: '崔南', role: '品牌运营', team: '市场', scope: '营销', login: '今天', status: '在线' },
  { name: '吴青', role: '渠道拓展', team: '市场', scope: '渠道', login: '08:10', status: '在线' },
  { name: '王映', role: '项目经理', team: '交付', scope: '项目', login: '09:30', status: '在线' },
  { name: '沈然', role: '安全合规', team: '平台运营', scope: '安全', login: '周一', status: '离线' },
  { name: '高杨', role: '供应链顾问', team: '交付', scope: '项目', login: '07:40', status: '在线' },
  { name: '张苇', role: '品牌顾问', team: '市场', scope: '营销', login: '09:55', status: '在线' },
  { name: '黎笑', role: '投资顾问', team: '投研', scope: '项目', login: '昨天', status: '离线' },
  { name: '吕舟', role: '能源顾问', team: '投研', scope: '项目', login: '前天', status: '在线' },
  { name: '苗棠', role: '教育顾问', team: '交付', scope: '项目', login: '今天', status: '在线' },
  { name: '项晖', role: '地产顾问', team: '投研', scope: '项目', login: '09:00', status: '在线' },
  { name: '陶衡', role: '汽车顾问', team: '投研', scope: '项目', login: '08:25', status: '在线' },
  { name: '贺星', role: '半导体顾问', team: '投研', scope: '项目', login: '昨天', status: '离线' },
  { name: '隋野', role: '风控专家', team: '风控', scope: '安全', login: '周日', status: '离线' },
  { name: '赵轶', role: '运营支持', team: '平台运营', scope: '全局', login: '10:05', status: '在线' },
  { name: '李衡', role: '云原生专家', team: '交付', scope: '项目', login: '09:50', status: '在线' }
]);

const monthly = reactive([
  { label: '新增企业', value: 126 },
  { label: '已匹配资源', value: 93 },
  { label: '完成反馈', value: 76 },
  { label: '发布公告', value: 12 }
]);

const modal = reactive({ type: '' });
const form = reactive({ name: '', role: '', notice: '' });
const toast = ref('');

const modalTitle = computed(() => {
  switch (modal.type) {
    case 'role':
      return '新增角色';
    case 'report':
      return '导出报表';
    case 'clean':
      return '清理缓存';
    case 'backup':
      return '备份执行中';
    case 'notice':
      return '发布公告';
    default:
      return '提示';
  }
});

const openModal = (type) => {
  modal.type = type;
  if (type === 'role') {
    form.name = '';
    form.role = '';
  }
  if (type === 'notice') {
    form.notice = '';
  }
};

const closeModal = () => {
  modal.type = '';
};

const confirmModal = () => {
  if (modal.type === 'role' && form.name && form.role) {
    roles.unshift({ name: form.name, role: form.role, team: '待分配', scope: '自定义', login: '刚刚', status: '在线' });
    toast.value = `已新增角色：${form.name}（${form.role}）`;
  }
  if (modal.type === 'report') {
    toast.value = '系统报表已导出并发送至管理员邮箱。';
  }
  if (modal.type === 'clean') {
    toast.value = '缓存已清理并完成索引重建。';
  }
  if (modal.type === 'backup') {
    toast.value = '备份任务执行完毕，已同步到对象存储。';
  }
  if (modal.type === 'notice' && form.notice) {
    toast.value = `公告已发布：${form.notice.slice(0, 18)}...`;
    const noticeStat = monthly.find((item) => item.label === '发布公告');
    if (noticeStat) {
      noticeStat.value += 1;
    }
  }
  closeModal();
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e5edf7;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(120deg, #2aa8ff, #6dd6ff);
  color: #fff;
  font-weight: 700;
}

button.ghost {
  background: #fff;
  border: 1px solid #d7e6f4;
  color: #1e5084;
}

.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5edf7;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
}

.table {
  margin-top: 10px;
  border: 1px solid #e7eef7;
  border-radius: 12px;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding: 10px 12px;
  align-items: center;
}

.table-header {
  background: #f5f9ff;
  font-weight: 700;
}

.table-row:nth-child(even) {
  background: #fbfdff;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.trend-row {
  display: grid;
  grid-template-columns: 140px 1fr 70px;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.trend-bar {
  height: 12px;
  background: #f1f6fd;
  border-radius: 999px;
}

.trend-fill {
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(120deg, #27a5ff, #64d3ff);
}

.pill-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.subtitle {
  color: #355278;
  margin-bottom: 8px;
}

.progress {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #f1f4f8;
  overflow: hidden;
  margin: 10px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(120deg, #3bb2ff, #7fe0ff);
}

.note {
  color: #6a7c92;
}

label,
textarea {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #436083;
}

input,
textarea {
  border-radius: 10px;
  border: 1px solid #d8e5f3;
  padding: 10px;
  background: #f8fbff;
}

.toast {
  margin-top: 10px;
  background: #ebf8ff;
  border: 1px solid #c7e7ff;
  color: #0c567d;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 700;
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .table-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
</style>
