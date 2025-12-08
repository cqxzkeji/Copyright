<template>
  <div style="min-height: 100vh; padding: 1.25rem;">
    <div
      class="card"
      style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; position: sticky; top: 0; z-index: 10;"
    >
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="width: 46px; height: 46px; border-radius: 12px; background: linear-gradient(135deg, #38bdf8, #6366f1); display: grid; place-items: center; color: #fff; font-weight: 700;">
          ROI
        </div>
        <div>
          <h2 style="margin: 0;">智能广告工作台</h2>
          <p class="helper-text" style="margin: 0.15rem 0 0;">登陆成功 · 模块信息已加载完毕</p>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button class="secondary-btn" @click="showNotice = true">发布公告</button>
        <button class="primary-btn" @click="showProfile = true">个人中心</button>
      </div>
    </div>
    <div class="layout" style="display: grid; grid-template-columns: 260px 1fr; gap: 1rem;">
      <aside class="card sidebar" style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <router-link v-for="item in menu" :key="item.to" :to="item.to" class="nav-item" :class="{ active: $route.path === item.to }">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(135deg, #38bdf8, #6366f1);"></span>
              <span style="font-weight: 600;">{{ item.label }}</span>
            </div>
            <p class="helper-text" style="margin: 0.2rem 0 0;">{{ item.desc }}</p>
          </router-link>
        </div>
      </aside>
      <main>
        <router-view />
      </main>
    </div>
    <ModalDialog v-if="showProfile" title="个人中心" subtitle="查看账户信息与通知" @close="showProfile = false">
      <div class="form-grid">
        <div>
          <p class="helper-text" style="margin: 0;">当前账号</p>
          <h3 style="margin: 0.15rem 0 0;">marketer@demo.com</h3>
          <p class="helper-text">角色：投放经理 · 归属团队：增长中台</p>
        </div>
        <div>
          <p class="helper-text" style="margin: 0;">数据安全</p>
          <p class="badge">双因素认证已开启</p>
          <p class="helper-text">上次登陆：今天 09:15 · IP 10.8.21.31</p>
        </div>
      </div>
      <template #footer>
        <button class="secondary-btn" @click="showProfile = false">关闭</button>
      </template>
    </ModalDialog>
    <ModalDialog v-if="showNotice" title="公告发布" subtitle="提示信息弹窗" @close="showNotice = false">
      <p class="helper-text">填写公告内容并发布，全体模块用户将在 10 秒内收到推送。</p>
      <textarea class="text-area" rows="4" placeholder="输入公告内容，例如新增素材规范、版本迭代说明"></textarea>
      <template #footer>
        <button class="secondary-btn" @click="showNotice = false">取消</button>
        <button class="primary-btn" @click="publishNotice">确认发布</button>
      </template>
    </ModalDialog>
    <ModalDialog v-if="showPublished" title="发布成功" subtitle="公告已同步" @close="showPublished = false">
      <p class="helper-text">公告已同步至五大模块的顶部通知条，且会推送至成员邮箱。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';
const showProfile = ref(false);
const showNotice = ref(false);
const showPublished = ref(false);

const menu = [
  { label: '广告创意生成', to: '/app/ad-creative', desc: '生成文案、素材、审核进度' },
  { label: '数据采集与分析', to: '/app/data-analysis', desc: '监控采集指标、对比转化' },
  { label: '广告优化与推荐', to: '/app/ad-optimization', desc: '自动优化、预算调整' },
  { label: 'ROI 分析与报告', to: '/app/roi-analysis', desc: '毛利核算、报告导出' },
  { label: '管理后台与权限', to: '/app/management', desc: '角色、权限、审批链' },
];

const publishNotice = () => {
  showNotice.value = false;
  showPublished.value = true;
};
</script>

<style scoped>
.nav-item {
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  transition: border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
}

.nav-item.active,
.nav-item:hover {
  border-color: #38bdf8;
  box-shadow: 0 10px 30px rgba(56, 189, 248, 0.18);
  transform: translateY(-1px);
}
</style>
