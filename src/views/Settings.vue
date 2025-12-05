<template>
  <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
    <div class="card">
      <div class="section-head">系统参数</div>
      <div class="form-row">
        <label>服务器地址</label>
        <input v-model="settings.host" class="input" />
        <label>模型缓存大小(MB)</label>
        <input v-model="settings.cache" class="input" />
        <label>并发限制</label>
        <input v-model="settings.concurrent" class="input" />
      </div>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="save">保存</button>
        <button class="btn secondary" @click="showReset = true">恢复默认</button>
      </div>
    </div>
    <div class="card">
      <div class="section-head">安全与通知</div>
      <div class="form-row">
        <label><input type="checkbox" v-model="settings.mfa" /> 启用多因素认证</label>
        <label><input type="checkbox" v-model="settings.alert" /> 异常时邮件提醒</label>
        <label><input type="checkbox" v-model="settings.audit" /> 开启操作审计</label>
      </div>
      <div class="actions" style="margin-top: 0.75rem;">
        <button class="btn" @click="showSchedule = true">配置调度</button>
        <button class="btn secondary" @click="showAbout = true">关于</button>
      </div>
    </div>
  </div>

  <ModalDialog v-model="showReset" title="恢复默认" confirm-text="确认" @confirm="reset">
    <p>将恢复系统默认配置，是否继续？</p>
  </ModalDialog>

  <ModalDialog v-model="showSchedule" title="调度策略" confirm-text="保存" @confirm="saveSchedule">
    <div class="form-row">
      <label>每日巡检时间</label>
      <input v-model="settings.cron" class="input" />
      <label>通知频道</label>
      <input v-model="settings.channel" class="input" />
    </div>
  </ModalDialog>

  <ModalDialog v-model="showAbout" title="关于平台" confirm-text="关闭" @confirm="showAbout = false">
    <p>轻量化图像识别平台，支持上传、预处理、特征提取与分析全链路。</p>
  </ModalDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const settings = reactive({ host: 'https://api.lab.local', cache: 4096, concurrent: 4, mfa: true, alert: true, audit: true, cron: '02:30', channel: 'ops@mail.com' });
const showReset = ref(false);
const showSchedule = ref(false);
const showAbout = ref(false);

const save = () => {
  showAbout.value = true;
};

const reset = () => {
  settings.host = 'https://api.lab.local';
  settings.cache = 2048;
  settings.concurrent = 2;
  settings.mfa = true;
  settings.alert = true;
  settings.audit = true;
  showReset.value = false;
};

const saveSchedule = () => {
  showSchedule.value = false;
};
</script>

<style scoped>
.section-head {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}
</style>
