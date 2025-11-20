<template>
  <div class="module-wrapper">
    <header>
      <h3>系统配置与后台</h3>
      <p>控制模型版本、通知策略与 API 授权，保障系统稳定运行。</p>
    </header>

    <section class="settings-grid">
      <label>
        模型版本
        <select v-model="model">
          <option value="标准版">标准版</option>
          <option value="旗舰版">旗舰版</option>
          <option value="实验版">实验版</option>
        </select>
      </label>
      <label>
        消息推送
        <select v-model="notify">
          <option value="全部">全部</option>
          <option value="仅关键事件">仅关键事件</option>
          <option value="关闭">关闭</option>
        </select>
      </label>
      <label>
        API Token
        <input v-model="token" placeholder="粘贴或刷新 Token" />
      </label>
    </section>

    <section class="switches">
      <label>
        <input type="checkbox" v-model="audit" />
        启用操作审计
      </label>
      <label>
        <input type="checkbox" v-model="autoBackup" />
        云端自动备份
      </label>
    </section>

    <div class="actions">
      <button @click="saveSettings">保存配置</button>
      <button @click="emit('show-progress', '系统巡检', '正在执行安全巡检…')">系统巡检</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['open-modal', 'show-progress'])

const model = ref('旗舰版')
const notify = ref('仅关键事件')
const token = ref('sk-prod-934xx')
const audit = ref(true)
const autoBackup = ref(true)

const saveSettings = () => {
  emit('open-modal', '配置已保存', `已切换至 ${model.value}，消息推送：${notify.value}。`)
}
</script>

<style scoped>
.module-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

label {
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

select,
input {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 14px;
}

.switches {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.switches label {
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
}

.actions button:last-child {
  background: #f97316;
}
</style>
