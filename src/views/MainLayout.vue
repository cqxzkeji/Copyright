<template>
  <div class="layout">
    <aside class="sidebar">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#1677ff,#52c41a);"></div>
        <div>
          <div style="font-weight:700;">车路协同仿真</div>
          <div style="color:var(--muted);font-size:12px;">多场景融合实验</div>
        </div>
      </div>
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        class="nav-link"
        :class="{ active: $route.path.includes(item.to) }"
        :to="item.to"
      >
        <span>{{ item.label }}</span>
      </RouterLink>
    </aside>
    <main class="content">
      <div class="topbar">
        <div>
          <h2 style="margin:0;">车路协同多场景平台</h2>
          <p class="kpi-label">登陆后加载功能模块到内容窗口</p>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <button class="button ghost" @click="showProfileModal = true">个人中心</button>
          <button class="button" @click="handleLogout">退出</button>
        </div>
      </div>
      <router-view />
    </main>
  </div>
  <div v-if="showProfileModal" class="modal-mask">
    <div class="modal">
      <header>
        <h3>个人中心</h3>
        <button class="button ghost" @click="showProfileModal = false">关闭</button>
      </header>
      <p>这里可以更新登录用户的邮箱、角色与偏好，操作会实时作用于模块界面的推荐。</p>
      <input v-model="profile.email" placeholder="通知邮箱" />
      <select v-model="profile.role">
        <option>测试工程师</option>
        <option>联调工程师</option>
        <option>仿真管理员</option>
      </select>
      <textarea v-model="profile.note" rows="3" placeholder="偏好与备注"></textarea>
      <footer>
        <button class="button ghost" @click="showProfileModal = false">取消</button>
        <button class="button secondary" @click="saveProfile">保存</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  data() {
    return {
      showProfileModal: false,
      profile: {
        email: 'pilot@lab.com',
        role: '测试工程师',
        note: ''
      },
      navItems: [
        { label: '感知数据采集与传输', to: '/collection' },
        { label: '多源感知数据融合与分析', to: '/fusion' },
        { label: '仿真与试验平台构建', to: '/simulation' },
        { label: '协同控制与决策支持', to: '/decision' },
        { label: '系统监控与数据分析', to: '/monitoring' }
      ]
    };
  },
  methods: {
    handleLogout() {
      this.$router.push('/login');
    },
    saveProfile() {
      alert(`资料已更新：${this.profile.email} / ${this.profile.role}`);
      this.showProfileModal = false;
    }
  }
};
</script>
