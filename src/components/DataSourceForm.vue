<template>
  <form class="grid" style="gap: 12px;" @submit.prevent="submit">
    <div>
      <label>数据源名称</label>
      <input v-model="form.name" placeholder="例如：物联网网关01" required />
    </div>
    <div>
      <label>类型</label>
      <select v-model="form.type">
        <option value="传感器">传感器</option>
        <option value="API">API接口</option>
        <option value="数据库">数据库</option>
        <option value="日志">日志/埋点</option>
      </select>
    </div>
    <div class="grid two" style="gap: 12px;">
      <div>
        <label>采集频率（秒）</label>
        <input type="number" min="5" v-model.number="form.frequency" />
      </div>
      <div>
        <label>负责人</label>
        <input v-model="form.owner" placeholder="姓名或团队" />
      </div>
    </div>
    <div>
      <label>接入地址</label>
      <input v-model="form.endpoint" placeholder="https://api.example.com" />
    </div>
    <div>
      <label>描述</label>
      <textarea rows="2" v-model="form.desc" placeholder="数据源用途与格式说明"></textarea>
    </div>
    <div class="modal-actions">
      <button type="button" class="ghost" @click="$emit('cancel')">取消</button>
      <button type="submit">保存数据源</button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['save', 'cancel']);
const form = reactive({
  name: '',
  type: '传感器',
  frequency: 30,
  owner: '',
  endpoint: '',
  desc: ''
});

const submit = () => {
  emit('save', { ...form });
};
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 12px;
}
</style>
