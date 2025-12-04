<template>
  <div class="card">
    <h2>系统设置</h2>
    <p class="muted">自定义主题与告警通道</p>
    <table class="table">
      <thead>
        <tr>
          <th>配置项</th>
          <th>当前值</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in settings" :key="item.key">
          <td>{{ item.key }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.desc }}</td>
        </tr>
      </tbody>
    </table>
    <div class="btn-row">
      <button class="btn" @click="showTheme = true">保存主题</button>
      <button class="btn secondary" @click="applySecurity">应用安全策略</button>
      <button class="btn danger" @click="showHelp = true">查看帮助</button>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h2>通知渠道覆盖</h2>
      <div v-for="channel in notify" :key="channel.name" class="chart-row">
        <span>{{ channel.name }}</span>
        <div class="chart-bar" :style="{ width: channel.cover + '%' }"></div>
        <strong>{{ channel.cover }}%</strong>
      </div>
    </div>
    <div class="card">
      <h2>权限合规检查</h2>
      <div v-for="check in compliance" :key="check.name" class="chart-row">
        <span>{{ check.name }}</span>
        <div class="chart-bar" :style="{ width: check.rate + '%' }"></div>
        <strong>{{ check.rate }}%</strong>
      </div>
    </div>
  </div>

  <ModalDialog title="主题设置" v-model="showTheme">
    <form class="login-form" @submit.prevent="submitTheme">
      <label>主色</label>
      <input v-model="theme.primary" placeholder="#2d4ef5" />
      <label>卡片圆角</label>
      <input v-model="theme.radius" placeholder="16px" />
      <div class="modal-footer">
        <button type="button" class="btn secondary" @click="showTheme = false">取消</button>
        <button type="submit" class="btn">保存</button>
      </div>
    </form>
  </ModalDialog>

  <ModalDialog title="安全策略" v-model="securing">
    <p>正在检测 token 加密、接口鉴权及双因子登录。</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: securityProgress + '%' }"></div>
    </div>
    <div class="modal-footer">
      <button class="btn" :disabled="securityProgress < 100" @click="securing = false">完成</button>
    </div>
  </ModalDialog>

  <ModalDialog title="帮助提示" v-model="showHelp">
    <p>如需更多自定义，请在“系统设置与自定义”中上传 JSON 配置并实时预览。</p>
    <div class="modal-footer">
      <button class="btn" @click="showHelp = false">明白</button>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const settings = [
  { key: '主题模式', value: '亮色', desc: '当前为亮色模式' },
  { key: '默认仪表盘', value: '投放总览', desc: '登录后优先展示的模块' },
  { key: '告警通道', value: '企业微信', desc: '推送告警的默认渠道' },
  { key: '数据刷新频率', value: '5 分钟', desc: '实时刷新间隔' },
  { key: '埋点校验', value: '开启', desc: '自动校验埋点字段' },
  { key: '实验平台', value: '已对接', desc: 'A/B 实验同步状态' },
  { key: '安全策略', value: '标准', desc: '合规策略模板' },
  { key: '跨域白名单', value: '5 个域名', desc: '允许访问的业务域' },
  { key: '数据留存', value: '180 天', desc: '数据保留周期' },
  { key: '成员权限', value: '分级', desc: '按角色拆分权限' },
  { key: '实时推送', value: '开启', desc: '开启实时推送事件' }
];

const notify = [
  { name: '企业微信', cover: 92 },
  { name: '邮件', cover: 88 },
  { name: '短信', cover: 74 },
  { name: 'Slack', cover: 56 }
];

const compliance = [
  { name: '权限校验', rate: 96 },
  { name: '数据脱敏', rate: 90 },
  { name: '水印追踪', rate: 78 },
  { name: '审计日志', rate: 84 }
];

const showTheme = ref(false);
const securing = ref(false);
const showHelp = ref(false);
const securityProgress = ref(0);
const theme = ref({ primary: '#2d4ef5', radius: '16px' });
let securityTimer;

const submitTheme = () => {
  showTheme.value = false;
};

const applySecurity = () => {
  securing.value = true;
  securityProgress.value = 0;
  clearInterval(securityTimer);
  securityTimer = setInterval(() => {
    if (securityProgress.value >= 100) {
      clearInterval(securityTimer);
      return;
    }
    securityProgress.value += 20;
  }, 380);
};
</script>
