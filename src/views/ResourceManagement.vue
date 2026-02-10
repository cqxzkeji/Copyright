<template>
  <section>
    <h2>资源库管理</h2>
    <div class="card">
      <div class="toolbar">
        <input v-model="keyword" placeholder="搜索标签/文件名" style="max-width:220px" />
        <button class="primary" @click="showTip('已执行资源检索')">搜索</button>
        <button class="ghost" @click="openForm('新增资源标签')">新增标签</button>
        <button class="ghost" @click="showTip('已完成批量归档')">批量归档</button>
        <button class="danger" @click="openForm('批量删除确认')">批量删除</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>资源名</th><th>标签</th><th>分类</th><th>时间</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id">
              <td>{{ item.id }}</td><td>{{ item.name }}</td><td>{{ item.tag }}</td><td>{{ item.category }}</td><td>{{ item.time }}</td>
              <td>
                <button class="ghost" @click="showTip(`查看资源 ${item.name}`)">查看</button>
                <button class="ghost" @click="showTip(`下载资源 ${item.name}`)">下载</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ModalDialog :visible="showModal" :title="title" @close="showModal=false" @confirm="confirm">
      <div class="form-grid">
        <div class="full"><label>操作说明</label><input v-model="actionRemark" /></div>
      </div>
    </ModalDialog>
    <ModalDialog :visible="showMsg" title="操作结果" @close="showMsg=false" @confirm="showMsg=false"><p>{{ msg }}</p></ModalDialog>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'
const keyword = ref('')
const showModal = ref(false)
const showMsg = ref(false)
const title = ref('')
const msg = ref('')
const actionRemark = ref('')
const resources = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `asset_${String(i + 1).padStart(3, '0')}.png`,
  tag: ['banner', 'portrait', 'product', 'background'][i % 4],
  category: ['营销', '人物', '电商', '海报'][i % 4],
  time: `2026-02-${String((i % 28) + 1).padStart(2, '0')}`
}))
const filtered = computed(() => resources.filter((r) => `${r.name}${r.tag}${r.category}`.includes(keyword.value)))
const openForm = (t) => { title.value = t; showModal.value = true }
const confirm = () => { showModal.value = false; showTip(`${title.value} 已执行：${actionRemark.value || '无备注'}`) }
const showTip = (text) => { msg.value = text; showMsg.value = true }
</script>
