<template>
  <div class="layout-shell" style="grid-template-columns: 1fr; align-items: center; justify-items: center;">
    <div style="max-width: 420px; width: 94%; background: #fff; padding: 32px; border-radius: 16px; box-shadow: 0 15px 40px rgba(31, 42, 68, 0.12);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="badge">CSB</div>
          <div>
            <div style="font-weight: 800; font-size: 20px;">连接件生产调度</div>
            <div style="color: #6b7a99;">登陆以调度安全带连接件生产</div>
          </div>
        </div>
        <div style="width: 46px; height: 46px; border-radius: 12px; background: #f0f6ff; display: grid; place-items: center; color: #2f80ed; font-weight: 800;">24/7</div>
      </div>
      <form @submit.prevent="handleLogin" class="form-grid">
        <div>
          <label class="label" for="account">账号</label>
          <input id="account" v-model="form.account" placeholder="工号 / 邮箱" required />
        </div>
        <div>
          <label class="label" for="password">密码</label>
          <input id="password" v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center;">
          <label style="display: flex; align-items: center; gap: 8px; color: #4f5f7a;">
            <input type="checkbox" v-model="remember" style="width: auto;" />
            保持登陆
          </label>
          <button class="text-btn" type="button" @click="showHint = true">忘记密码?</button>
        </div>
        <div style="grid-column: 1 / -1; display: flex; gap: 12px;">
          <button type="submit" class="primary-btn" style="width: 100%;">登陆</button>
          <button type="button" class="secondary-btn" style="width: 100%;" @click="showGuide = true">查看流程</button>
        </div>
      </form>
    </div>
    <div v-if="showHint" class="modal-overlay" @click.self="showHint = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">重置密码</div>
          <button class="text-btn" @click="showHint = false">关闭</button>
        </div>
        <div class="modal-body">
          请联系值班管理员并提供工号 <strong>{{ form.account || '未填写' }}</strong>，
          系统会在 10 分钟内发送重置链接。
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showHint = false">知道了</button>
        </div>
      </div>
    </div>
    <div v-if="showGuide" class="modal-overlay" @click.self="showGuide = false">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">登陆后操作提示</div>
          <button class="text-btn" @click="showGuide = false">关闭</button>
        </div>
        <div class="modal-body">
          <ol style="padding-left: 18px; line-height: 1.6; color: #3a4b6a;">
            <li>在生产调度中下达班次和加急单；</li>
            <li>质量控制里记录抽检结果并追踪缺陷；</li>
            <li>机器监控查看机台温度、震动与产能；</li>
            <li>报告页面导出当班日报与客户版报告；</li>
            <li>系统设置调整安全阈值与通知频率。</li>
          </ol>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showGuide = false">完成</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showHint = ref(false);
const showGuide = ref(false);
const remember = ref(true);
const form = reactive({ account: '', password: '' });

const handleLogin = () => {
  if (!form.account || !form.password) return;
  router.push('/dashboard');
};
</script>
