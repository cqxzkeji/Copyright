<template>
  <div class="grid grid-2">
    <div class="card">
      <h2>界面与体验设置</h2>
      <label>
        界面语言
        <select class="select">
          <option>中文</option>
          <option>English</option>
          <option>Français</option>
        </select>
      </label>
      <label>
        主题亮度
        <select class="select">
          <option>亮色</option>
          <option>柔和亮色</option>
        </select>
      </label>
      <label>
        通知偏好
        <select class="select">
          <option>实时通知</option>
          <option>摘要通知</option>
        </select>
      </label>
      <div class="action-row">
        <button class="button" @click="openSave">保存设置</button>
        <button class="button secondary" @click="openReset">重置配置</button>
      </div>
    </div>
    <div class="card">
      <h2>语言包与账号管理</h2>
      <label>
        语言包版本
        <select class="select">
          <option>2024-Q1</option>
          <option>2023-Q4</option>
        </select>
      </label>
      <label>
        账号权限
        <select class="select">
          <option>系统管理员</option>
          <option>翻译专员</option>
          <option>审计只读</option>
        </select>
      </label>
      <div class="action-row">
        <button class="button" @click="openLanguagePack">语言包管理</button>
      </div>
    </div>
  </div>

  <BaseModal v-if="showSave" title="保存设置" @close="showSave = false">
    <p>配置将同步到所有语音翻译节点。</p>
    <div class="modal-actions">
      <span class="button" @click="showSave = false">确认保存</span>
      <span class="button ghost" @click="showSave = false">取消</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showReset" title="重置配置" @close="showReset = false">
    <p>恢复为默认亮色布局与通知设置。</p>
    <div class="modal-actions">
      <span class="button" @click="showReset = false">确定重置</span>
      <span class="button ghost" @click="showReset = false">关闭</span>
    </div>
  </BaseModal>

  <BaseModal v-if="showLanguagePack" title="语言包管理" @close="showLanguagePack = false">
    <label>
      新增语言包
      <input class="input" placeholder="输入语言包地址" />
    </label>
    <div class="modal-actions">
      <span class="button" @click="showLanguagePack = false">开始安装</span>
      <span class="button ghost" @click="showLanguagePack = false">取消</span>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const showSave = ref(false);
const showReset = ref(false);
const showLanguagePack = ref(false);

const openSave = () => {
  showSave.value = true;
};
const openReset = () => {
  showReset.value = true;
};
const openLanguagePack = () => {
  showLanguagePack.value = true;
};
</script>

<style scoped>
.action-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}
</style>
