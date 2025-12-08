<template>
  <div class="grid" style="gap:16px">
    <div class="flex-between card" style="flex-wrap:wrap">
      <div>
        <div style="font-weight:700">后台管理</div>
        <p style="margin:4px 0;color:var(--muted)">账号、权限与系统运行状态统一管理。</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="button" @click="openAccount">新增账号</button>
        <button class="button secondary" @click="openProgress">更新系统</button>
        <button class="button secondary" @click="openHint('审计日志已导出')">导出日志</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:2fr 1fr;gap:16px">
      <div class="card">
        <div class="flex-between">
          <strong>账号列表</strong>
          <button class="button secondary" @click="openHint('已刷新账号列表')">刷新</button>
        </div>
        <table class="table" style="margin-top:10px">
          <thead>
            <tr>
              <th>姓名</th>
              <th>角色</th>
              <th>状态</th>
              <th>最近登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.name">
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td><span class="badge" :class="user.active ? 'success' : 'warning'">{{ user.active ? '启用' : '停用' }}</span></td>
              <td>{{ user.last }}</td>
              <td style="display:flex;gap:8px">
                <button class="button secondary" @click="openAccount(user)">编辑</button>
                <button class="button secondary" @click="openHint(`已重置 ${user.name}`)">重置</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="flex-between">
          <strong>运行状态</strong>
          <button class="button secondary" @click="openHint('状态已同步')">同步</button>
        </div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr));margin-top:12px">
          <div class="card" style="box-shadow:none;border:1px dashed var(--border)">
            <div class="flex-between"><span>CPU</span><span class="badge info">48%</span></div>
            <div class="progress"><div class="progress-bar" style="width:48%"></div></div>
          </div>
          <div class="card" style="box-shadow:none;border:1px dashed var(--border)">
            <div class="flex-between"><span>内存</span><span class="badge info">62%</span></div>
            <div class="progress"><div class="progress-bar" style="width:62%"></div></div>
          </div>
          <div class="card" style="box-shadow:none;border:1px dashed var(--border)">
            <div class="flex-between"><span>带宽</span><span class="badge info">73%</span></div>
            <div class="progress"><div class="progress-bar" style="width:73%"></div></div>
          </div>
          <div class="card" style="box-shadow:none;border:1px dashed var(--border)">
            <div class="flex-between"><span>安全巡检</span><span class="badge success">通过</span></div>
            <p style="margin:6px 0;color:var(--muted)">最近2小时无告警</p>
          </div>
        </div>
      </div>
    </div>

    <ModalDialog :show="modal.account" title="账号设置" @close="modal.account=false">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label>姓名</label>
          <input v-model="form.name" class="input" />
        </div>
        <div>
          <label>角色</label>
          <select v-model="form.role" class="select">
            <option>管理员</option>
            <option>教师</option>
            <option>助教</option>
          </select>
        </div>
        <div>
          <label>状态</label>
          <select v-model="form.active" class="select">
            <option :value="true">启用</option>
            <option :value="false">停用</option>
          </select>
        </div>
        <div>
          <label>最近登录</label>
          <input v-model="form.last" class="input" />
        </div>
      </div>
      <template #actions>
        <button class="button secondary" @click="modal.account=false">取消</button>
        <button class="button" @click="saveAccount">保存</button>
      </template>
    </ModalDialog>

    <ModalDialog :show="modal.progress" title="系统更新" @close="modal.progress=false">
      <p>后台服务升级中，请勿关闭窗口。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: upgradeProgress + '%' }"></div>
      </div>
    </ModalDialog>

    <ModalDialog :show="modal.hint" title="提示" @close="modal.hint=false">
      <p style="margin:0">{{ hintText }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const users = ref([
  { name: '李霞', role: '管理员', active: true, last: '6-10 08:20' },
  { name: '王云', role: '教师', active: true, last: '6-10 09:10' },
  { name: '陈林', role: '助教', active: false, last: '6-09 20:10' },
  { name: '赵明', role: '教师', active: true, last: '6-10 10:12' },
  { name: '许然', role: '助教', active: true, last: '6-09 18:05' },
  { name: '刘晨', role: '管理员', active: true, last: '6-08 22:15' },
  { name: '周洁', role: '教师', active: false, last: '6-07 16:02' },
  { name: '蒋立', role: '教师', active: true, last: '6-10 07:55' },
  { name: '宋亮', role: '助教', active: true, last: '6-10 09:35' },
  { name: '杨越', role: '管理员', active: true, last: '6-10 06:48' }
]);

const modal = reactive({ account: false, progress: false, hint: false });
const form = reactive({ name: '', role: '教师', active: true, last: '6-10 10:00' });
const hintText = ref('');
const upgradeProgress = ref(15);

const openAccount = (user) => {
  if (user) Object.assign(form, user);
  else Object.assign(form, { name: '新账号', role: '教师', active: true, last: '6-10 10:00' });
  modal.account = true;
};

const saveAccount = () => {
  const index = users.value.findIndex((u) => u.name === form.name);
  if (index >= 0) users.value[index] = { ...form };
  else users.value.push({ ...form });
  modal.account = false;
  openHint('账号已保存');
};

const openProgress = () => {
  modal.progress = true;
  upgradeProgress.value = 15;
  const timer = setInterval(() => {
    upgradeProgress.value += 21;
    if (upgradeProgress.value >= 100) {
      upgradeProgress.value = 100;
      clearInterval(timer);
      setTimeout(() => (modal.progress = false), 600);
    }
  }, 320);
};

const openHint = (text) => {
  hintText.value = text;
  modal.hint = true;
};
</script>
