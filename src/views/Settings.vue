<template>
  <div class="card">
    <div class="flex-between">
      <div>
        <h2>系统设置</h2>
        <p class="muted">管理权限、告警阈值、通知方式等系统配置。</p>
      </div>
      <button class="button" @click="openSave">保存配置</button>
    </div>
    <div class="form-grid" style="margin-top: 12px;">
      <label>平台主题
        <select v-model="form.theme">
          <option>亮色</option>
          <option>暗色</option>
        </select>
      </label>
      <label>告警推送通道
        <select v-model="form.channel">
          <option>短信</option>
          <option>邮箱</option>
          <option>企业微信</option>
        </select>
      </label>
      <label>心率上限 (bpm)
        <input type="number" v-model.number="form.hrLimit" />
      </label>
      <label>体温上限 (℃)
        <input type="number" v-model.number="form.tempLimit" />
      </label>
      <label>数据自动备份
        <select v-model="form.backup">
          <option>每日02:00</option>
          <option>每周一03:00</option>
          <option>关闭</option>
        </select>
      </label>
      <label>角色权限</label>
      <div class="card" style="padding: 12px;">
        <div class="flex-between" v-for="role in roles" :key="role.name" style="margin-bottom: 8px;">
          <div>{{ role.name }}</div>
          <button class="button secondary" @click="openRole(role)">配置权限</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="modal-backdrop">
    <div class="modal">
      <h3>保存设置</h3>
      <p class="muted">即将应用新的系统配置，确认继续？</p>
      <div class="progress"><span :style="{ width: progress + '%' }"></span></div>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="button secondary" @click="closeModal">取消</button>
        <button class="button" @click="applySave">确认</button>
      </div>
    </div>
  </div>

  <div v-if="showRole" class="modal-backdrop">
    <div class="modal">
      <h3>配置 {{ currentRole?.name }}</h3>
      <div class="form-grid">
        <label v-for="perm in permissions" :key="perm">
          <input type="checkbox" v-model="currentRole.perms" :value="perm" /> {{ perm }}
        </label>
      </div>
      <div class="flex-between" style="margin-top: 12px;">
        <button class="button secondary" @click="showRole = false">关闭</button>
        <button class="button" @click="saveRole">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const form = reactive({
  theme: '亮色',
  channel: '企业微信',
  hrLimit: 96,
  tempLimit: 39.5,
  backup: '每日02:00'
});

const roles = ref([
  { name: '场长', perms: ['查看报表', '配置系统', '审批采购'] },
  { name: '兽医', perms: ['查看报表', '健康处理'] },
  { name: '饲喂主管', perms: ['饲料调整', '查看报表'] },
  { name: '环保专员', perms: ['环保指标', '查看报表'] }
]);

const permissions = ['查看报表', '配置系统', '审批采购', '健康处理', '饲料调整', '环保指标'];
const showModal = ref(false);
const showRole = ref(false);
const progress = ref(0);
const currentRole = ref(null);
let timer;

const openSave = () => {
  progress.value = 40;
  showModal.value = true;
};

const applySave = () => {
  progress.value = 100;
  clearTimeout(timer);
  timer = setTimeout(() => {
    showModal.value = false;
    progress.value = 0;
  }, 600);
};

const closeModal = () => {
  showModal.value = false;
};

const openRole = (role) => {
  currentRole.value = { ...role };
  showRole.value = true;
};

const saveRole = () => {
  const idx = roles.value.findIndex((r) => r.name === currentRole.value.name);
  if (idx !== -1) roles.value[idx] = { ...currentRole.value };
  showRole.value = false;
};
</script>
