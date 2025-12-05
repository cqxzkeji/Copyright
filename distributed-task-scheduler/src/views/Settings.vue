<template>
  <div class="card">
    <div class="flex-between">
      <h2>系统设置</h2>
      <button class="ghost" @click="openGlobal">保存全局配置</button>
    </div>
    <div class="grid" style="margin-top: 10px">
      <div class="card">
        <div class="flex-between">
          <div>鉴权</div>
          <span class="chip">OAuth</span>
        </div>
        <p class="hint">统一认证，支持单点登录。</p>
        <button class="ghost" @click="openAuth">调整</button>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>通知</div>
          <span class="chip">Webhook + 邮件</span>
        </div>
        <p class="hint">多渠道通知，可自定义收敛。</p>
        <button class="ghost" @click="openNotify">配置</button>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>备份</div>
          <span class="chip">每天 02:00</span>
        </div>
        <p class="hint">备份至对象存储，并校验完整性。</p>
        <button class="ghost" @click="openBackup">调整</button>
      </div>
    </div>
  </div>

  <div v-if="showGlobal" class="modal-backdrop" @click.self="showGlobal = false">
    <div class="modal">
      <header>保存全局配置</header>
      <div class="body">
        <p>确认将当前配置推送到所有节点并重载？</p>
        <div class="progress-bar" style="margin-top: 8px">
          <div :style="{ width: `${globalProgress}%` }"></div>
        </div>
      </div>
      <div class="footer">
        <button @click="showGlobal = false">取消</button>
        <button @click="pushGlobal">推送</button>
      </div>
    </div>
  </div>

  <div v-if="showAuth" class="modal-backdrop" @click.self="showAuth = false">
    <div class="modal">
      <header>鉴权配置</header>
      <div class="body">
        <div class="input-row">
          <label>供应商</label>
          <select>
            <option>Azure AD</option>
            <option>Okta</option>
            <option>LDAP</option>
          </select>
        </div>
        <div class="input-row">
          <label>回调地址</label>
          <input placeholder="https://example.com/callback" />
        </div>
      </div>
      <div class="footer">
        <button @click="showAuth = false">关闭</button>
        <button @click="showAuth = false">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showNotify" class="modal-backdrop" @click.self="showNotify = false">
    <div class="modal">
      <header>通知策略</header>
      <div class="body">
        <div class="input-row">
          <label>渠道</label>
          <select>
            <option>Webhook</option>
            <option>邮件</option>
            <option>短信</option>
          </select>
        </div>
        <div class="input-row">
          <label>收敛策略</label>
          <textarea rows="3" placeholder="例如：5 分钟内同类告警合并"></textarea>
        </div>
      </div>
      <div class="footer">
        <button @click="showNotify = false">取消</button>
        <button @click="showNotify = false">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showBackup" class="modal-backdrop" @click.self="showBackup = false">
    <div class="modal">
      <header>备份策略</header>
      <div class="body">
        <div class="input-row">
          <label>时间</label>
          <input type="time" value="02:00" />
        </div>
        <div class="input-row">
          <label>保留天数</label>
          <input type="number" min="1" value="14" />
        </div>
      </div>
      <div class="footer">
        <button @click="showBackup = false">取消</button>
        <button @click="showBackup = false">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showGlobal = ref(false);
const showAuth = ref(false);
const showNotify = ref(false);
const showBackup = ref(false);
const globalProgress = ref(20);

const openGlobal = () => {
  showGlobal.value = true;
  globalProgress.value = 20;
  setTimeout(() => (globalProgress.value = 92), 600);
};

const pushGlobal = () => {
  globalProgress.value = 100;
  setTimeout(() => (showGlobal.value = false), 500);
};

const openAuth = () => (showAuth.value = true);
const openNotify = () => (showNotify.value = true);
const openBackup = () => (showBackup.value = true);
</script>

<style scoped>
h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.hint {
  color: #6a7a8b;
  margin: 4px 0;
}
</style>
