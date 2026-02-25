<template>
  <div class="panel">
    <div class="filters">
      <input v-model="keyword" placeholder="关键词搜索" />
      <select v-model="tag"><option value="">全部标签</option><option>#生活</option><option>#科技</option><option>#娱乐</option></select>
      <select v-model="sort"><option>热门度</option><option>发布时间</option><option>点赞量</option></select>
      <button @click="openInfo('筛选条件已应用。')">搜索</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>标题</th><th>标签</th><th>类型</th><th>热度</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td>{{ item.id }}</td><td>{{ item.title }}</td><td>{{ item.tag }}</td><td>{{ item.type }}</td><td>{{ item.hot }}</td>
            <td><button class="small" @click="openInfo(`已加入收藏：${item.title}`)">收藏</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog :visible="visible" title="搜索提示" @close="visible=false"><p>{{ message }}</p></ModalDialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const keyword = ref('')
const tag = ref('')
const sort = ref('热门度')
const visible = ref(false)
const message = ref('')

const allVideos = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `精选内容 ${i + 1}`,
  tag: ['#生活', '#科技', '#娱乐'][i % 3],
  type: ['短剧', 'Vlog', '知识'][i % 3],
  hot: 1000 - i * 21
}))

const filtered = computed(() =>
  allVideos
    .filter((item) => item.title.includes(keyword.value || '') && (!tag.value || item.tag === tag.value))
    .sort((a, b) => (sort.value === '热门度' ? b.hot - a.hot : a.id - b.id))
)

const openInfo = (text) => {
  message.value = text
  visible.value = true
}
</script>

<style scoped>
.panel{display:grid;gap:14px}.filters{display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:10px}.filters input,.filters select{border:1px solid #c8d5f0;border-radius:10px;padding:8px}button{border:1px solid #c8d5f0;background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}.small{padding:5px 9px}.table-wrap{overflow:auto;background:#fff;border:1px solid #dbe6ff;border-radius:12px}table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:10px;border-bottom:1px solid #ebeff8;text-align:left}@media(max-width:780px){.filters{grid-template-columns:1fr 1fr}}
</style>
