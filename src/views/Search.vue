<template>
  <div class="panel">
    <div class="toolbar">
      <el-input v-model="keyword" placeholder="关键词搜索" style="max-width: 220px" />
      <el-select v-model="category" clearable placeholder="分类筛选" style="width: 180px">
        <el-option v-for="item in categories" :key="item" :value="item" :label="item" />
      </el-select>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button type="success" @click="tipVisible=true">筛选提示</el-button>
    </div>

    <el-image src="https://picsum.photos/seed/searchBanner/1200/220" fit="cover" class="banner" />

    <el-table :data="result" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="tags" label="标签" min-width="180">
        <template #default="scope">{{ scope.row.tags.join(' / ') }}</template>
      </el-table-column>
      <el-table-column prop="views" label="播放量" width="120" sortable />
      <el-table-column label="操作" width="120">
        <template #default="scope"><el-button link @click="openDetail(scope.row)">查看详情</el-button></template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="detailVisible" title="视频详情" width="500px" modal>
      <el-descriptions :column="1" border v-if="active">
        <el-descriptions-item label="标题">{{ active.title }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ active.category }}</el-descriptions-item>
        <el-descriptions-item label="标签">{{ active.tags.join(', ') }}</el-descriptions-item>
        <el-descriptions-item label="播放量">{{ active.views }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="tipVisible" title="提示信息" width="360px" modal>
      <p>支持关键词、分类、热门度等多维度组合筛选。</p>
      <template #footer><el-button type="primary" @click="tipVisible=false">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { videoList, categories } from '../data/mock'

const keyword = ref('')
const category = ref('')
const result = ref(videoList)
const detailVisible = ref(false)
const tipVisible = ref(false)
const active = ref(null)

const search = () => {
  result.value = videoList.filter(v =>
    (!keyword.value || v.title.includes(keyword.value) || v.tags.some(tag => tag.includes(keyword.value))) &&
    (!category.value || v.category === category.value)
  )
}
const reset = () => { keyword.value = ''; category.value = ''; result.value = videoList }
const openDetail = (row) => { active.value = row; detailVisible.value = true }
</script>

<style scoped>
.panel { background: #fff; border-radius: 14px; padding: 16px; }
.toolbar { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.banner { width: 100%; height: 180px; border-radius: 10px; margin-bottom: 12px; }
</style>
