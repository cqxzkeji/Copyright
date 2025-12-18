<template>
  <div class="card">
    <h3>用户与商户管理</h3>
    <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
      <button @click="showAdd = true">新增账户</button>
      <button class="secondary" @click="showAuditProgress = true">批量审核进度</button>
      <button class="ghost" @click="showReminder = true">发送验证提醒</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>名称</th>
          <th>角色</th>
          <th>状态</th>
          <th>上次活跃</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.name">
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td><span class="badge">{{ user.status }}</span></td>
          <td>{{ user.active }}</td>
          <td style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="ghost" @click="openDetail(user)">资料</button>
            <button class="secondary" @click="openPermission(user)">调整权限</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalDialog v-model="showAdd" title="新增用户/商户">
    <div class="form-grid">
      <div>
        <label>名称</label>
        <input v-model="form.name" placeholder="填写用户或商户名" />
      </div>
      <div>
        <label>角色</label>
        <select v-model="form.role">
          <option>买家</option>
          <option>供应商</option>
          <option>运营</option>
          <option>客服</option>
        </select>
      </div>
      <div>
        <label>手机号</label>
        <input v-model="form.phone" placeholder="11位手机号" />
      </div>
      <div>
        <label>店铺</label>
        <input v-model="form.store" placeholder="可选，关联店铺名称" />
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showAdd = false">取消</button>
      <button @click="saveUser">保存并激活</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showAuditProgress" title="审核批次进度">
    <p style="margin-top: 0;">当前批次：商户入驻校验，预计 3 分钟完成。</p>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: auditProgress + '%' }"></div>
    </div>
    <template #footer>
      <button class="ghost" @click="showAuditProgress = false">关闭</button>
      <button class="secondary" @click="boostProgress">提速校验</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showReminder" title="发送验证提醒">
    <p style="margin-top: 0;">将向未实名用户推送短信/站内信，确保合规。</p>
    <template #footer>
      <button class="ghost" @click="showReminder = false">稍后再说</button>
      <button @click="sendReminder">立即发送</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showDetail" :title="currentUser?.name + ' 的资料'">
    <p style="margin-top: 0; color: var(--muted);">角色：{{ currentUser?.role }} ｜ 状态：{{ currentUser?.status }}</p>
    <div class="form-grid">
      <div>
        <label>信用分</label>
        <input :value="currentUser?.credit + ' / 100'" readonly />
      </div>
      <div>
        <label>成交额</label>
        <input :value="currentUser?.gmv" readonly />
      </div>
      <div>
        <label>标签</label>
        <input :value="currentUser?.tags.join('、')" readonly />
      </div>
      <div>
        <label>入驻时间</label>
        <input :value="currentUser?.joined" readonly />
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showDetail = false">知道了</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showPermission" :title="'调整 ' + currentUser?.name + ' 权限'">
    <div class="form-grid">
      <div>
        <label>赋能操作</label>
        <select v-model="permissionForm.permission">
          <option value="运营台">运营台</option>
          <option value="财务结算">财务结算</option>
          <option value="售后仲裁">售后仲裁</option>
        </select>
      </div>
      <div>
        <label>有效期</label>
        <input v-model="permissionForm.days" type="number" min="1" />
      </div>
    </div>
    <template #footer>
      <button class="ghost" @click="showPermission = false">取消</button>
      <button class="secondary" @click="applyPermission">保存</button>
    </template>
  </ModalDialog>

  <ModalDialog v-model="showInfo" title="操作提示">
    <p style="margin: 0; color: var(--muted);">{{ infoMessage }}</p>
    <template #footer>
      <button class="ghost" @click="showInfo = false">知道了</button>
    </template>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const users = ref([
  { name: '京东果园', role: '供应商', status: '正常', active: '2分钟前', credit: 96, gmv: '¥1,200,000', tags: ['农残检测', '冷链'], joined: '2022-04-01' },
  { name: '田园优选', role: '供应商', status: '待审核', active: '12分钟前', credit: 82, gmv: '¥580,000', tags: ['有机'], joined: '2022-07-15' },
  { name: '果果商贸', role: '买家', status: '正常', active: '5分钟前', credit: 71, gmv: '¥230,000', tags: ['严选'], joined: '2023-01-05' },
  { name: '南方集市', role: '供应商', status: '冻结', active: '1天前', credit: 64, gmv: '¥420,000', tags: ['预售'], joined: '2021-12-11' },
  { name: '晨曦菜篮', role: '买家', status: '正常', active: '8分钟前', credit: 78, gmv: '¥110,000', tags: ['团购'], joined: '2023-06-21' },
  { name: '北仓批发', role: '供应商', status: '正常', active: '15分钟前', credit: 88, gmv: '¥760,000', tags: ['批发'], joined: '2021-09-10' },
  { name: '山里人家', role: '供应商', status: '正常', active: '1分钟前', credit: 92, gmv: '¥980,000', tags: ['山货', '原产地'], joined: '2022-11-30' },
  { name: '西域良品', role: '供应商', status: '待审核', active: '27分钟前', credit: 69, gmv: '¥330,000', tags: ['干果'], joined: '2024-01-10' },
  { name: '春笋鲜生', role: '买家', status: '正常', active: '9分钟前', credit: 74, gmv: '¥90,000', tags: ['生鲜'], joined: '2023-04-03' },
  { name: '渔舟集采', role: '供应商', status: '正常', active: '16分钟前', credit: 85, gmv: '¥670,000', tags: ['水产', '冷链'], joined: '2022-08-19' }
]);

const showAdd = ref(false);
const showAuditProgress = ref(false);
const showReminder = ref(false);
const showDetail = ref(false);
const showPermission = ref(false);
const auditProgress = ref(58);
const currentUser = ref(null);
const showInfo = ref(false);
const infoMessage = ref('');

const form = reactive({
  name: '',
  role: '供应商',
  phone: '',
  store: ''
});

const permissionForm = reactive({
  permission: '运营台',
  days: 7
});

const boostProgress = () => {
  auditProgress.value = Math.min(100, auditProgress.value + 10);
};

const sendReminder = () => {
  infoMessage.value = '已触发站内信/短信提醒';
  showReminder.value = false;
  showInfo.value = true;
};

const openDetail = (user) => {
  currentUser.value = user;
  showDetail.value = true;
};

const openPermission = (user) => {
  currentUser.value = user;
  showPermission.value = true;
};

const saveUser = () => {
  users.value.unshift({
    name: form.name || '新用户',
    role: form.role,
    status: '待审核',
    active: '刚刚',
    credit: 60,
    gmv: '¥0',
    tags: ['新建'],
    joined: new Date().toISOString().slice(0, 10)
  });
  showAdd.value = false;
  infoMessage.value = '新用户创建成功并进入待审核列表';
  showInfo.value = true;
};

const applyPermission = () => {
  infoMessage.value = `${currentUser.value?.name} 已开通 ${permissionForm.permission}，有效期 ${permissionForm.days} 天`;
  showPermission.value = false;
  showInfo.value = true;
};
</script>
