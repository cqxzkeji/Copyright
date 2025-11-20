<template>
  <div class="module-wrapper">
    <header>
      <h3>素材库与资产管理</h3>
      <p>集中管理图片、视频、字体等资产并实时追踪使用情况。</p>
    </header>

    <section class="filters">
      <label>
        标签筛选
        <select v-model="tag">
          <option value="全部">全部</option>
          <option value="夏季">夏季</option>
          <option value="运动">运动</option>
          <option value="新品">新品</option>
        </select>
      </label>
      <label>
        排序
        <select v-model="order">
          <option value="最新">最新</option>
          <option value="热度">热度</option>
        </select>
      </label>
      <button @click="emit('open-modal', '上传素材', '请在弹窗中拖拽文件上传。')">上传素材</button>
    </section>

    <section class="asset-grid">
      <article v-for="asset in filteredAssets" :key="asset.name" class="asset-card">
        <div class="thumb" :style="{ backgroundImage: asset.cover }"></div>
        <div>
          <h4>{{ asset.name }}</h4>
          <p>{{ asset.tag }} ｜ 已引用 {{ asset.usage }} 次</p>
        </div>
        <button @click="emit('open-modal', '素材详情', asset.name + ' 已展示详情。')">详情</button>
      </article>
    </section>

    <div class="actions">
      <button @click="emit('show-progress', '清理无效素材', '系统正在清理过期素材…')">清理无效素材</button>
      <button @click="syncToCampaign">推送到广告计划</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['open-modal', 'show-progress'])

const tag = ref('全部')
const order = ref('最新')

const assets = ref([
  { name: '夏季主视觉-01', tag: '夏季', usage: 18, cover: 'linear-gradient(120deg,#fde047,#fb7185)' },
  { name: '运动短视频', tag: '运动', usage: 22, cover: 'linear-gradient(120deg,#38bdf8,#6366f1)' },
  { name: '新品 KV', tag: '新品', usage: 9, cover: 'linear-gradient(120deg,#c084fc,#f472b6)' }
])

const filteredAssets = computed(() => {
  let list = assets.value
  if (tag.value !== '全部') {
    list = list.filter((asset) => asset.tag === tag.value)
  }
  if (order.value === '热度') {
    list = [...list].sort((a, b) => b.usage - a.usage)
  }
  return list
})

const syncToCampaign = () => {
  emit('open-modal', '推送成功', '所选素材已推送至当前广告计划。')
}
</script>

<style scoped>
.module-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

label {
  flex: 1 1 160px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
}

.asset-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.asset-card {
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px 16px;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
}

.asset-card h4 {
  margin-bottom: 4px;
}

.asset-card button {
  margin-left: auto;
  background: #10b981;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button:last-child {
  background: #f59e0b;
}
</style>
