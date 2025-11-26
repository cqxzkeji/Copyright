<template>
  <div class="module">
    <div class="card">
      <div class="header">
        <div>
          <h3>系统服务状态</h3>
          <p class="muted">监控采集、分析、存储与告警通道</p>
        </div>
        <div class="actions">
          <button class="btn" @click="openProgress('正在滚动重启服务…')">重启核心</button>
          <button class="btn secondary" @click="openForm('新增账户')">账户</button>
          <button class="btn ghost" @click="openAlert('已备份配置至 NAS。')">备份配置</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>服务</th>
            <th>状态</th>
            <th>节点</th>
            <th>延迟</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="svc in services" :key="svc.name">
            <td>{{ svc.name }}</td>
            <td><span class="badge" :class="svc.badge">{{ svc.status }}</span></td>
            <td>{{ svc.node }}</td>
            <td>{{ svc.latency }}</td>
            <td class="actions">
              <button class="btn secondary" @click="openAlert(`${svc.name} 已切换主备`)" >主备切换</button>
              <button class="btn ghost" @click="openProgress('正在发布配置…')">发布</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="header">
        <div>
          <h3>操作审计</h3>
          <p class="muted">最近 5 条配置变更与登录</p>
        </div>
        <button class="btn" @click="openForm('导出审计')">导出</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>动作</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.time">
            <td>{{ log.time }}</td>
            <td>{{ log.user }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.detail }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.visible" class="modal-backdrop">
      <div class="modal-panel">
        <h3>{{ modal.title }}</h3>
        <form v-if="modal.type === 'form'" @submit.prevent="submitForm">
          <div class="form-row">
            <label>名称</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-row">
            <label>备注</label>
            <textarea v-model="form.remark" rows="2"></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn" type="submit">提交</button>
            <button class="btn ghost" type="button" @click="closeModal">取消</button>
          </div>
        </form>
        <div v-else-if="modal.type === 'progress'">
          <p class="muted">{{ modal.message }}</p>
          <div class="progress-bar"><div class="fill" :style="{ width: modal.progress + '%' }"></div></div>
          <p class="muted">{{ modal.progress }}% 完成</p>
          <div class="modal-actions">
            <button class="btn ghost" @click="closeModal">关闭</button>
          </div>
        </div>
        <div v-else>
          <p class="muted">{{ modal.message }}</p>
          <div class="modal-actions">
            <button class="btn" @click="closeModal">知道了</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const services = reactive([
  { name: '采集网关', status: '运行', badge: 'success', node: 'edge-01', latency: '12 ms' },
  { name: '数据总线', status: '运行', badge: 'success', node: 'bus-02', latency: '18 ms' },
  { name: '分析引擎', status: '部分告警', badge: 'warning', node: 'ai-03', latency: '35 ms' },
  { name: '告警分发', status: '运行', badge: 'success', node: 'mq-01', latency: '9 ms' },
  { name: '运维控制', status: '维护', badge: 'danger', node: 'ops-01', latency: '—' },
]);

const logs = reactive([
  { time: '14:22:18', user: 'admin', action: '修改阈值', detail: 'B07 振动阈值 1.4g -> 1.2g' },
  { time: '14:18:02', user: 'ops', action: '发布配置', detail: '同步采集网关配置' },
  { time: '14:10:20', user: 'guest', action: '登录', detail: '登录成功，IP 10.2.2.16' },
  { time: '13:59:33', user: 'admin', action: '新增账户', detail: '新增检修人员账号' },
  { time: '13:45:08', user: 'ops', action: '重启服务', detail: '重启分析引擎节点 ai-03' },
]);

const modal = reactive({ visible: false, type: 'alert', title: '', message: '', progress: 0 });
const form = reactive({ name: '', remark: '' });
const timer = ref(null);

const openForm = (title) => {
  modal.visible = true;
  modal.type = 'form';
  modal.title = title;
};

const openProgress = (message) => {
  modal.visible = true;
  modal.type = 'progress';
  modal.title = '处理中';
  modal.message = message;
  modal.progress = 30;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (modal.progress >= 100) {
      clearInterval(timer.value);
    } else {
      modal.progress += 14;
    }
  }, 500);
};

const openAlert = (message) => {
  modal.visible = true;
  modal.type = 'alert';
  modal.title = '提示';
  modal.message = message;
};

const submitForm = () => {
  modal.type = 'alert';
  modal.title = '已保存';
  modal.message = '操作已写入审计日志。';
};

const closeModal = () => {
  modal.visible = false;
  clearInterval(timer.value);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
</style>
