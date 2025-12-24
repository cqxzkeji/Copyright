<template>
  <div>
    <div class="section-header">
      <div>
        <p class="status-pill">系统配置与平台支撑</p>
        <small>统一权限、服务开关、站点参数，保障模块化运行</small>
      </div>
      <div class="nav-links">
        <button class="btn" @click="openModal('config')">保存配置</button>
        <button class="btn secondary" @click="openModal('service')">重启服务</button>
        <button class="btn secondary" @click="openModal('notice')">推送公告</button>
      </div>
    </div>

    <div class="card-grid" style="margin-top: 12px;">
      <div class="card" v-for="item in settings" :key="item.label">
        <div class="section-header">
          <span>{{ item.label }}</span>
          <span class="status-pill">{{ item.value }}</span>
        </div>
        <p style="color: #4b5563;">{{ item.desc }}</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>开关项</th>
          <th>当前状态</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in toggles" :key="item.name">
          <td>{{ item.name }}</td>
          <td><span class="status-pill">{{ item.status }}</span></td>
          <td>{{ item.desc }}</td>
          <td><button class="btn secondary" @click="openModal('config', item)">修改</button></td>
        </tr>
      </tbody>
    </table>

    <ModalDialog v-if="modal.visible" :title="modal.title" @close="modal.visible = false">
      <template v-if="modal.type === 'config'">
        <form class="form-grid" @submit.prevent="saveConfig">
          <div>
            <label>配置项</label>
            <input v-model="configForm.name" />
          </div>
          <div>
            <label>状态</label>
            <select v-model="configForm.status">
              <option>启用</option>
              <option>停用</option>
            </select>
          </div>
          <div>
            <label>备注</label>
            <textarea rows="2" v-model="configForm.desc" />
          </div>
          <button class="btn" type="submit">保存</button>
        </form>
      </template>
      <template v-else-if="modal.type === 'service'">
        <p>平台支撑服务正在重启，请稍候。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: serviceProgress + '%' }"></div>
        </div>
      </template>
      <template v-else>
        <p>公告将推送至乡村商家运营后台与短信渠道。</p>
        <div class="form-grid">
          <div>
            <label>公告内容</label>
            <textarea rows="3" v-model="notice" />
          </div>
          <button class="btn" @click.prevent="modal.visible = false">确认推送</button>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const settings = [
  { label: '权限分组', value: '八大角色', desc: '县级管理员、乡镇合伙人、客服、财务等' },
  { label: '支付网关', value: '双活', desc: '微信/支付宝 双活容灾' },
  { label: '监控告警', value: '实时', desc: '钉钉群机器人推送' }
];

const toggles = reactive([
  { name: '订单风控', status: '启用', desc: '大额订单与黑名单校验' },
  { name: '短信网关', status: '启用', desc: '模板审核通过' },
  { name: '直播分销', status: '启用', desc: '达人绑定收益分账' },
  { name: '自营仓备货', status: '停用', desc: '等待补货' },
  { name: '社群团购', status: '启用', desc: '团长结算配置完成' },
  { name: '自动对账', status: '启用', desc: '每日 02:00 结算' },
  { name: '图像审核', status: '启用', desc: '敏感内容拦截' },
  { name: '优惠券核销', status: '启用', desc: '核销码自动校验' },
  { name: '产地仓预警', status: '启用', desc: '温湿度与库存预警' },
  { name: '客服工单', status: '启用', desc: 'SLA 告警推送' }
]);

const modal = reactive({ visible: false, type: 'config', title: '系统配置' });
const configForm = reactive({ name: '', status: '启用', desc: '' });
const serviceProgress = ref(35);
const notice = ref('');

const openModal = (type, item) => {
  modal.visible = true;
  modal.type = type;
  modal.title = type === 'config' ? '修改配置' : type === 'service' ? '服务重启' : '发布公告';
  if (item) {
    Object.assign(configForm, item);
  } else {
    Object.assign(configForm, { name: '订单风控', status: '启用', desc: '' });
  }
  if (type === 'service') {
    serviceProgress.value = 35;
    const timer = setInterval(() => {
      if (serviceProgress.value >= 100) {
        clearInterval(timer);
      } else {
        serviceProgress.value += 22;
      }
    }, 600);
  }
};

const saveConfig = () => {
  const target = toggles.find((t) => t.name === configForm.name);
  if (target) {
    Object.assign(target, configForm);
  } else {
    toggles.push({ ...configForm });
  }
  modal.visible = false;
};
</script>
