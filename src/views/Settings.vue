<template>
  <div class="light-card module-card">
    <div class="card-header">
      <div>
        <h3>系统设置</h3>
        <p>管理通知策略、阈值与安全策略，所有操作提供确认弹窗。</p>
      </div>
      <div class="flex-row">
        <button class="secondary-btn" @click="openPolicy">安全策略</button>
        <button class="primary-btn" @click="saveAll">保存配置</button>
      </div>
    </div>

    <table class="table" aria-label="settings table">
      <thead>
        <tr>
          <th>配置项</th>
          <th>当前值</th>
          <th>说明</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in settings" :key="item.key">
          <td>{{ item.name }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.desc }}</td>
          <td>
            <button class="secondary-btn" @click="edit(item)">调整</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="notice">保存配置会出现提示弹窗，调整按钮打开配置表单，策略按钮显示详情。</div>
  </div>

  <div v-if="editing" class="modal-backdrop" @click.self="editing = null">
    <div class="modal">
      <h3>调整配置 - {{ editing?.name }}</h3>
      <div class="form-row">
        <label>值 <input v-model="editValue" /></label>
      </div>
      <footer>
        <button class="secondary-btn" @click="editing = null">取消</button>
        <button class="primary-btn" @click="apply">应用</button>
      </footer>
    </div>
  </div>

  <div v-if="policy" class="modal-backdrop" @click.self="policy = false">
    <div class="modal">
      <h3>安全策略</h3>
      <p>包含多级告警、双因子登陆、设备加密传输等策略。</p>
      <footer>
        <button class="primary-btn" @click="policy = false">关闭</button>
      </footer>
    </div>
  </div>

  <div v-if="saved" class="modal-backdrop" @click.self="saved = false">
    <div class="modal">
      <h3>配置已保存</h3>
      <p>新的阈值与策略已生效。</p>
      <footer>
        <button class="primary-btn" @click="saved = false">知道了</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const settings = reactive([
  { key: 'sms', name: '短信通知', value: '开启', desc: '高风险时发送短信' },
  { key: 'email', name: '邮件通知', value: '开启', desc: '同步邮件备份' },
  { key: 'threshold', name: '烟雾阈值', value: '0.75', desc: '超过则触发预警' },
  { key: 'temp', name: '温度阈值', value: '65℃', desc: '超过则预警' },
  { key: 'backup', name: '日志备份', value: '每日 02:00', desc: '定时备份到对象存储' }
]);

const editing = ref(null);
const editValue = ref('');
const policy = ref(false);
const saved = ref(false);

const edit = (item) => {
  editing.value = item;
  editValue.value = item.value;
};

const apply = () => {
  if (editing.value) {
    editing.value.value = editValue.value;
  }
  editing.value = null;
};

const openPolicy = () => {
  policy.value = true;
};

const saveAll = () => {
  saved.value = true;
  const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  settings.push({
    key: `log-${settings.length + 1}`,
    name: '最近保存',
    value: now,
    desc: '记录最近一次保存时间'
  });
};
</script>

<style scoped>
.module-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
