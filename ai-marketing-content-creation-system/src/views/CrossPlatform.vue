<template>
  <div class="module">
    <section class="panel">
      <div>
        <h3>跨平台广告适配与发布</h3>
        <p>根据平台规范自动生成尺寸、格式与 CTA，发布前完成一键校验。</p>
      </div>
      <div class="action-row">
        <button @click="planMedia">生成投放组合</button>
        <button @click="validateAssets">规范校验</button>
        <button @click="startPublish">立即发布</button>
      </div>
    </section>

    <section class="panel grid">
      <div class="table">
        <h4>渠道适配列表</h4>
        <table>
          <thead>
            <tr>
              <th>平台</th>
              <th>素材规格</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in placements" :key="item.platform">
              <td>{{ item.platform }}</td>
              <td>{{ item.size }}</td>
              <td>
                <span :class="['status', item.status]">{{ item.statusLabel }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="release">
        <h4>预算进度</h4>
        <div class="budget">
          <div class="budget-fill" :style="{ width: budget + '%' }"></div>
        </div>
        <p>本周预算执行 {{ budget }}%，剩余预算 {{ 100 - budget }}%。</p>
        <button class="secondary" @click="emit('open-modal', '预算提醒', '建议将剩余预算投放到信息流渠道。')">
          获取建议
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['open-modal']);
const budget = ref(68);
const placements = reactive([
  { platform: '抖音信息流', size: '1080x1920', status: 'ready', statusLabel: '可投放' },
  { platform: '快手开屏', size: '1242x2208', status: 'warning', statusLabel: '待修正' },
  { platform: '腾讯广告', size: '900x500', status: 'ready', statusLabel: '可投放' },
  { platform: '小红书图文', size: '960x1280', status: 'pending', statusLabel: '排队中' }
]);

const planMedia = () => emit('open-modal', '投放组合生成', '已生成视频+信息流组合方案，覆盖 4 个渠道。');
const validateAssets = () => emit('open-modal', '规范校验完成', '共检测 12 项素材参数，全部符合投放规范。');
const startPublish = () => emit('open-modal', '发布进行中', '系统正在分发素材并同步监测链接。');
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel {
  background: #f8fafc;
  border-radius: 20px;
  padding: 1.5rem;
}

.action-row {
  display: flex;
  gap: 0.75rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
  background: #cbd5f5;
  color: #0f172a;
  cursor: pointer;
}

button.secondary {
  background: #34d399;
  color: #065f46;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.table {
  flex: 2;
}

.release {
  flex: 1;
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

thead {
  color: #475569;
  font-size: 0.9rem;
}

td,
th {
  padding: 0.75rem;
  text-align: left;
}

tbody tr:nth-child(even) {
  background: white;
}

.status {
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.status.ready {
  background: #d1fae5;
  color: #047857;
}

.status.warning {
  background: #fee2e2;
  color: #b91c1c;
}

.status.pending {
  background: #e0e7ff;
  color: #4338ca;
}

.budget {
  background: #e2e8f0;
  border-radius: 999px;
  height: 12px;
  margin: 1rem 0;
}

.budget-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #f472b6, #fb7185);
}
</style>
