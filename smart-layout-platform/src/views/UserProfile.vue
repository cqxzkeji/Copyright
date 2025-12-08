<template>
  <div class="module">
    <div class="flex-between">
      <div>
        <p class="eyebrow">个人中心</p>
        <h3>账号与偏好设置</h3>
      </div>
      <div class="top-actions">
        <button class="secondary-btn" @click="showTips = true">操作提示</button>
        <button class="primary-btn" @click="showProfile = true">编辑资料</button>
        <button class="primary-btn" @click="showTheme = true">主题设置</button>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 1rem;">
      <div class="card">
        <p class="eyebrow">账号信息</p>
        <ul>
          <li>用户名：{{ profile.name }}</li>
          <li>角色：{{ profile.role }}</li>
          <li>团队：{{ profile.team }}</li>
        </ul>
      </div>
      <div class="card">
        <p class="eyebrow">通知偏好</p>
        <ul>
          <li>日报推送：{{ profile.daily ? '开启' : '关闭' }}</li>
          <li>导出提醒：{{ profile.exportReminder ? '开启' : '关闭' }}</li>
          <li>安全预警：{{ profile.alert ? '开启' : '关闭' }}</li>
        </ul>
      </div>
    </div>

    <BaseModal v-model="showProfile" title="编辑资料">
      <div class="form-grid">
        <div class="input-field">
          <label>用户名</label>
          <input v-model="profile.name" />
        </div>
        <div class="input-field">
          <label>角色</label>
          <input v-model="profile.role" />
        </div>
        <div class="input-field">
          <label>团队</label>
          <input v-model="profile.team" />
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showProfile = false">保存</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showTheme" title="主题设置">
      <div class="form-grid">
        <div class="input-field">
          <label>亮色模式</label>
          <select v-model="theme">
            <option>亮色</option>
            <option>自动</option>
          </select>
        </div>
        <div class="input-field">
          <label>品牌色</label>
          <input v-model="brandColor" type="color" />
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showTheme = false">应用</button>
      </div>
    </BaseModal>

    <BaseModal v-model="showTips" title="操作提示">
      <p>所有按钮均采用 modal 弹窗反馈，保持操作一致性。</p>
      <div class="modal-actions">
        <button class="primary-btn" type="button" @click="showTips = false">我知道了</button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const profile = reactive({ name: 'DesignOps', role: '运营策划', team: '传媒创新组', daily: true, exportReminder: true, alert: true });
const theme = ref('亮色');
const brandColor = ref('#4f46e5');
const showProfile = ref(false);
const showTheme = ref(false);
const showTips = ref(false);
</script>

<style scoped>
.top-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

ul {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
}
</style>
