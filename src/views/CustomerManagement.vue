<template>
  <div class="grid" style="gap:16px;">
    <div class="section-header">
      <div>
        <h3 class="section-title">客户管理</h3>
        <p style="margin:0;color:var(--muted);">聚焦大型装备制造、能源企业的多客户并行跟进</p>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="primary" @click="openCreate">新增客户</button>
        <button class="ghost" @click="openReminder">批量提醒拜访</button>
      </div>
    </div>

    <div class="responsive-three">
      <div class="card" v-for="stat in stats" :key="stat.label" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="color:var(--muted); font-size:13px;">{{ stat.label }}</div>
          <div style="font-size:24px; font-weight:800;">{{ stat.value }}</div>
        </div>
        <div class="tag info">{{ stat.trend }}</div>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h4 class="section-title">客户列表</h4>
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <input v-model="filterKey" placeholder="输入客户或行业关键词" style="width:220px;" />
          <button class="ghost" @click="resetFilter">重置筛选</button>
        </div>
      </div>
      <div style="overflow-x:auto;">
        <table class="table">
          <thead>
            <tr>
              <th>客户名称</th>
              <th>行业</th>
              <th>需求等级</th>
              <th>最新动作</th>
              <th>跟进人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in filteredCustomers" :key="customer.name">
              <td>{{ customer.name }}</td>
              <td>{{ customer.industry }}</td>
              <td><span class="tag" :class="customer.tagClass">{{ customer.priority }}</span></td>
              <td>{{ customer.activity }}</td>
              <td>{{ customer.owner }}</td>
              <td style="display:flex; gap:8px; flex-wrap:wrap;">
                <button class="ghost" @click="viewDetail(customer)">详情</button>
                <button class="primary" @click="openPlan(customer)">制定拜访计划</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog :open="showCreate" title="新增客户" @close="showCreate = false">
      <div class="form-row">
        <div>
          <label>客户名称</label>
          <input v-model="form.name" placeholder="如：华电重工集团" />
        </div>
        <div>
          <label>行业</label>
          <input v-model="form.industry" placeholder="如：能源装备" />
        </div>
        <div>
          <label>需求等级</label>
          <select v-model="form.priority">
            <option>A级</option>
            <option>B级</option>
            <option>C级</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div>
          <label>跟进人</label>
          <input v-model="form.owner" placeholder="销售负责人" />
        </div>
        <div>
          <label>下一步动作</label>
          <input v-model="form.activity" placeholder="安排样件送检" />
        </div>
      </div>
      <button class="primary" @click="submitCreate">提交客户</button>
    </ModalDialog>

    <ModalDialog :open="showReminder" title="批量提醒" @close="showReminder = false">
      <p style="margin:0 0 10px;">将向所有A级客户发送拜访提醒及最新材料清单。</p>
      <div class="progress"><div class="bar" :style="{ width: reminderProgress + '%' }"></div></div>
      <p style="color:var(--muted);">{{ reminderStatus }}</p>
    </ModalDialog>

    <ModalDialog :open="!!currentCustomer" :title="currentCustomer?.name || ''" @close="currentCustomer = null">
      <p style="margin:0 0 8px;">行业：{{ currentCustomer?.industry }} · 需求等级：{{ currentCustomer?.priority }}</p>
      <p style="margin:0 0 12px;">最新动作：{{ currentCustomer?.activity }}</p>
      <div class="form-row">
        <div>
          <label>下一次沟通时间</label>
          <input v-model="planForm.nextTime" placeholder="如：周五 15:00" />
        </div>
        <div>
          <label>沟通目标</label>
          <input v-model="planForm.goal" placeholder="确认二期试单" />
        </div>
      </div>
      <button class="primary" @click="savePlan">保存计划</button>
    </ModalDialog>

    <ModalDialog :open="infoOpen" title="提示" @close="infoOpen = false">
      <p style="margin:0;">{{ infoText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const stats = [
  { label: '本周新线索', value: 18, trend: '+6.3%' },
  { label: 'A级客户', value: 12, trend: '+2' },
  { label: '在谈项目', value: 27, trend: '+4' }
];

const customers = ref([
  { name: '华电重工', industry: '能源装备', priority: 'A级', tagClass: 'success', activity: '样品理化检验中', owner: '王若凡' },
  { name: '南方机车集团', industry: '轨交制造', priority: 'A级', tagClass: 'success', activity: '确认批量供货计划', owner: '叶琦' },
  { name: '北冶特材', industry: '材料加工', priority: 'B级', tagClass: 'info', activity: '完成技术澄清', owner: '陈晨' },
  { name: '星河船舶', industry: '船舶重工', priority: 'A级', tagClass: 'success', activity: '交付第三批坯料', owner: '宋飞' },
  { name: '科陆能源', industry: '储能', priority: 'B级', tagClass: 'info', activity: '安排焊接评估', owner: '林棠' },
  { name: '启明风电', industry: '风电', priority: 'C级', tagClass: 'warning', activity: '待提交认证资料', owner: '吴宏' },
  { name: '锦程矿山设备', industry: '矿业装备', priority: 'A级', tagClass: 'success', activity: '试制井下刀圈', owner: '庄泽' },
  { name: '中车四方', industry: '轨交', priority: 'B级', tagClass: 'info', activity: '确认调质硬度', owner: '傅文' },
  { name: '华润燃机', industry: '燃机', priority: 'A级', tagClass: 'success', activity: '燃机叶片毛坯交付', owner: '杜洋' },
  { name: '中远海运', industry: '航运', priority: 'B级', tagClass: 'info', activity: '报价船轴材', owner: '贺川' },
  { name: '北极星特钢', industry: '特钢分销', priority: 'C级', tagClass: 'warning', activity: '等待首单确认', owner: '蒋璐' }
]);

const filterKey = ref('');
const showCreate = ref(false);
const showReminder = ref(false);
const reminderProgress = ref(0);
const reminderStatus = ref('尚未开始');
const currentCustomer = ref(null);
const planForm = reactive({ nextTime: '', goal: '' });
const form = reactive({ name: '', industry: '', priority: 'A级', owner: '', activity: '' });
const infoOpen = ref(false);
const infoText = ref('');

const filteredCustomers = computed(() => {
  if (!filterKey.value) return customers.value;
  return customers.value.filter((c) => c.name.includes(filterKey.value) || c.industry.includes(filterKey.value));
});

const resetFilter = () => {
  filterKey.value = '';
  infoText.value = '已重置客户筛选条件';
  infoOpen.value = true;
};

const openCreate = () => {
  showCreate.value = true;
};

const submitCreate = () => {
  if (!form.name) return;
  customers.value.unshift({
    name: form.name,
    industry: form.industry || '未分类',
    priority: form.priority,
    tagClass: form.priority === 'A级' ? 'success' : form.priority === 'B级' ? 'info' : 'warning',
    activity: form.activity || '待安排',
    owner: form.owner || '未分配'
  });
  Object.assign(form, { name: '', industry: '', priority: 'A级', owner: '', activity: '' });
  showCreate.value = false;
};

const openReminder = () => {
  reminderProgress.value = 0;
  reminderStatus.value = '正在推送拜访提醒…';
  showReminder.value = true;
  const timer = setInterval(() => {
    reminderProgress.value += 20;
    if (reminderProgress.value >= 100) {
      reminderStatus.value = '推送完成，已同步至钉钉';
      clearInterval(timer);
    }
  }, 350);
};

const viewDetail = (customer) => {
  currentCustomer.value = customer;
  planForm.nextTime = '';
  planForm.goal = '';
};

const openPlan = (customer) => {
  viewDetail(customer);
};

const savePlan = () => {
  reminderStatus.value = `已为 ${currentCustomer.value.name} 创建计划：${planForm.goal || '拜访'}`;
  showReminder.value = true;
  currentCustomer.value = null;
  reminderProgress.value = 100;
};
</script>
