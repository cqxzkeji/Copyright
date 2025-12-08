<template>
  <div style="min-height: 100vh; display: grid; place-items: center; padding: 1.5rem;">
    <div class="card" style="width: min(900px, 100%); display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: center;">
      <div>
        <p class="badge">多模态·智能投放</p>
        <h1 style="margin: 0.4rem 0; color: #0f172a;">多模态广告创意生成与 ROI 分析系统</h1>
        <p class="helper-text">
          连接创意、数据、优化、ROI 与管理五大模块，登陆后即可在同一个工作台上完成创意生成、投放优化与收益追踪。
        </p>
        <ul class="helper-text" style="padding-left: 1.1rem; margin: 0.6rem 0 0; display: grid; gap: 0.35rem;">
          <li>智能创意生产与审核闭环</li>
          <li>数据采集、对比、异常预警</li>
          <li>自动化投放优化与推荐</li>
          <li>ROI 报告与结论化洞察</li>
        </ul>
      </div>
      <form class="card" style="background: linear-gradient(135deg, #f8fafc, #ecfeff);" @submit.prevent="submit">
        <h3 style="margin: 0 0 0.5rem;">账号登陆</h3>
        <p class="helper-text" style="margin-top: 0;">使用统一账户进入工作台，数据与权限自动继承。</p>
        <div class="form-grid" style="margin: 1rem 0;">
          <label>
            <span class="helper-text">邮箱</span>
            <input class="input" type="email" placeholder="team@company.com" v-model="form.email" required />
          </label>
          <label>
            <span class="helper-text">密码</span>
            <input class="input" type="password" placeholder="请输入密码" v-model="form.password" required />
          </label>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <label style="display: flex; align-items: center; gap: 0.4rem;">
            <input type="checkbox" v-model="form.remember" />
            <span class="helper-text">保持登陆</span>
          </label>
          <button type="button" class="secondary-btn" @click="showSupport = true">支持热线</button>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <button type="submit" class="primary-btn">进入主界面</button>
          <span class="helper-text">登陆即代表同意《广告投放服务协议》</span>
        </div>
      </form>
    </div>
    <ModalDialog v-if="showSupport" title="联系支持" subtitle="7x24 小时在线值守" @close="showSupport = false">
      <p class="helper-text">您可以通过以下方式寻求帮助，我们将协助您完成账户登陆与权限绑定。</p>
      <ul class="helper-text" style="padding-left: 1.1rem; display: grid; gap: 0.25rem;">
        <li>专线电话：400-800-8616</li>
        <li>企业微信：广告投放顾问（工作日 9:00-18:00）</li>
        <li>邮件：support@ad-suite.cn（平均响应时间 10 分钟）</li>
      </ul>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const showSupport = ref(false);
const form = reactive({ email: 'marketer@demo.com', password: '123456', remember: true });

const submit = () => {
  router.push('/app/ad-creative');
};
</script>
