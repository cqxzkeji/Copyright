<template>
  <main style="display:grid;place-items:center;min-height:80vh;padding:24px">
    <div class="card" style="width:min(520px,100%);display:grid;gap:18px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-weight:800;font-size:22px">登陆实训平台</div>
          <p style="margin:4px 0;color:var(--muted)">登陆后跳转主界面，载入五大功能模块</p>
        </div>
        <div class="badge success">欢迎回来</div>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label>账号</label>
          <input v-model="form.username" class="input" placeholder="输入账号" />
        </div>
        <div>
          <label>口令</label>
          <input v-model="form.password" type="password" class="input" placeholder="输入口令" />
        </div>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label>身份</label>
          <select v-model="form.role" class="select">
            <option>教师</option>
            <option>学员</option>
            <option>管理员</option>
          </select>
        </div>
        <div>
          <label>工作区</label>
          <select v-model="form.workspace" class="select">
            <option>村落规划</option>
            <option>课程运维</option>
            <option>体验测试</option>
          </select>
        </div>
      </div>
      <button class="button" style="width:100%" @click="onLogin">登陆并进入主界面</button>
      <ModalDialog :show="showHelper" title="提示信息" @close="showHelper=false">
        <p>登陆后主界面将自动加载左侧导航与内容窗口。</p>
      </ModalDialog>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const showHelper = ref(false);
const form = reactive({
  username: 'planner',
  password: '123456',
  role: '教师',
  workspace: '村落规划'
});

const onLogin = () => {
  showHelper.value = true;
  setTimeout(() => {
    showHelper.value = false;
    router.push('/app');
  }, 900);
};
</script>
