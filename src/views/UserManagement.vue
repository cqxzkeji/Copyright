<template>
  <div class="module-wrapper">
    <header>
      <h3>用户与权限管理</h3>
      <p>创建团队账号、分配角色以及实时查看权限矩阵。</p>
    </header>

    <section class="form-row">
      <label>
        用户名
        <input v-model="form.name" placeholder="新成员用户名" />
      </label>
      <label>
        角色
        <select v-model="form.role">
          <option value="设计师">设计师</option>
          <option value="投放运营">投放运营</option>
          <option value="管理员">管理员</option>
        </select>
      </label>
      <button @click="addUser">快速添加</button>
    </section>

    <section class="user-table">
      <div class="user-row user-head">
        <span>用户</span>
        <span>角色</span>
        <span>状态</span>
      </div>
      <div class="user-row" v-for="user in users" :key="user.name">
        <span>{{ user.name }}</span>
        <span>{{ user.role }}</span>
        <span :class="['badge', user.status]">{{ user.status }}</span>
      </div>
    </section>

    <div class="actions">
      <button @click="emit('open-modal', '权限矩阵', '系统自动检测：暂无权限冲突。')">查看权限矩阵</button>
      <button @click="emit('show-progress', '批量授权', '正在批量授权新团队成员…')">批量授权</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['open-modal', 'show-progress'])

const users = ref([
  { name: '林晨', role: '设计师', status: '正常' },
  { name: '周可', role: '管理员', status: '正常' },
  { name: '张越', role: '投放运营', status: '冻结' }
])

const form = reactive({ name: '', role: '设计师' })

const addUser = () => {
  if (!form.name.trim()) {
    emit('open-modal', '提示', '请输入用户名。')
    return
  }
  users.value.unshift({ name: form.name, role: form.role, status: '正常' })
  emit('open-modal', '添加成功', `${form.name} 已加入团队并获得 ${form.role} 权限。`)
  form.name = ''
  form.role = '设计师'
}
</script>

<style scoped>
.module-wrapper {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

label {
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input,
select {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 14px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
}

.user-table {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
}

.user-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 10px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.user-row:last-child {
  border-bottom: none;
}

.user-head {
  background: #f9fafb;
  font-weight: 600;
}

.badge {
  padding: 4px 8px;
  border-radius: 8px;
  text-align: center;
}

.badge.正常 {
  background: #dcfce7;
  color: #15803d;
}

.badge.冻结 {
  background: #fee2e2;
  color: #b91c1c;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button:nth-child(2) {
  background: #f97316;
}
</style>
