<template>
  <div class="panel">
    <div class="toolbar">
      <button @click="openInfo('点赞趋势报告已生成。')">查看点赞趋势</button>
      <button @click="openInfo('分享海报已生成并进入下载队列。')">生成分享海报</button>
      <button @click="openInfo('评论过滤规则已更新。')">更新过滤词库</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>评论ID</th><th>用户</th><th>内容</th><th>点赞</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="item in comments" :key="item.id">
            <td>{{ item.id }}</td><td>{{ item.user }}</td><td>{{ item.text }}</td><td>{{ item.likes }}</td><td>{{ item.status }}</td>
            <td>
              <button class="small" @click="openInfo(`已回复用户 ${item.user}。`)" >回复</button>
              <button class="small" @click="openInfo(`已${item.status==='待审核'?'通过':'屏蔽'}评论 ${item.id}。`)">审核</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalDialog :visible="visible" title="互动提示" @close="visible=false"><p>{{ message }}</p></ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const comments = Array.from({ length: 20 }, (_, i) => ({
  id: `C${1000 + i}`,
  user: `user_${i + 1}`,
  text: `这个视频第 ${i + 1} 条评论，内容健康积极。`,
  likes: 10 + i * 3,
  status: i % 3 === 0 ? '待审核' : '已展示'
}))

const visible = ref(false)
const message = ref('')
const openInfo = (text) => {
  message.value = text
  visible.value = true
}
</script>

<style scoped>
.panel{display:grid;gap:14px}.toolbar{display:flex;gap:10px;flex-wrap:wrap}button{border:1px solid #c8d5f0;background:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}.small{padding:5px 9px;margin-right:6px}.table-wrap{overflow:auto;background:#fff;border:1px solid #dbe6ff;border-radius:12px}table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:10px;border-bottom:1px solid #ebeff8;text-align:left}
</style>
