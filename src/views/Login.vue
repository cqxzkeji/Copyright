<template>
  <div class="login-page">
    <div class="login-card">
      <h1>工业供应链韧性分析平台</h1>
      <p>请使用企业账号登录，进入主控制台。</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-field">
          <label>账号</label>
          <input v-model="form.user" type="text" placeholder="供应链运营账号" required />
        </div>
        <div class="form-field">
          <label>密码</label>
          <input v-model="form.pass" type="password" placeholder="请输入密码" required />
        </div>
        <div class="form-field">
          <label>数据域</label>
          <select v-model="form.scope">
            <option>总部运营中心</option>
            <option>华东生产基地</option>
            <option>国际物流协同</option>
          </select>
        </div>
        <button type="submit">进入平台</button>
      </form>
    </div>
    <div class="login-info">
      <div class="card">
        <h3>今日韧性概览</h3>
        <div class="grid grid-2">
          <div>
            <p>预警事件</p>
            <h2>6</h2>
          </div>
          <div>
            <p>运行节点</p>
            <h2>128</h2>
          </div>
          <div>
            <p>运输准点率</p>
            <h2>96.8%</h2>
          </div>
          <div>
            <p>库存覆盖天数</p>
            <h2>23天</h2>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>系统能力</h3>
        <ul>
          <li>全链路数据整合与建模</li>
          <li>关键节点韧性评级与对比</li>
          <li>实时风险识别与趋势预测</li>
          <li>应急决策与资源优化建议</li>
          <li>可视化监控与预警报告</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  user: "",
  pass: "",
  scope: "总部运营中心"
});

const handleLogin = () => {
  router.push("/main/data-model");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #f4f7fb 0%, #e1ecff 100%);
}

.login-card {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(15, 27, 61, 0.12);
}

.login-form {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.login-info {
  display: grid;
  gap: 16px;
}

.login-info ul {
  padding-left: 18px;
  margin: 0;
  display: grid;
  gap: 8px;
}
</style>
