<template>
  <div class="grid" style="gap: 16px;">
    <div class="flex-between" style="gap: 12px; flex-wrap: wrap;">
      <div>
        <h2 style="margin: 0;">自适应决策与处置响应</h2>
        <p style="margin: 4px 0 0; color: #6b7280;">根据风险态势自动生成决策并联动处置</p>
      </div>
      <div class="button-row">
        <button class="btn primary" @click="showPlaybook = true">编排SOAR剧本</button>
        <button class="btn success" @click="showSimulate = true">模拟演练</button>
        <button class="btn warning" @click="showPolicy = true">策略校验</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">自动化覆盖率</div>
            <div style="font-size: 28px; font-weight: 800;">86%</div>
          </div>
          <span class="badge success">持续提升</span>
        </div>
        <div class="progress-bar" style="margin-top: 10px;">
          <div class="inner" style="width: 86%;"></div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">平均处置耗时</div>
            <div style="font-size: 28px; font-weight: 800;">6.3 分钟</div>
          </div>
          <span class="badge warning">目标 &lt; 8 分钟</span>
        </div>
        <div class="progress-bar" style="margin-top: 10px;">
          <div class="inner" style="width: 72%;"></div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between">
          <div>
            <div style="color: #6b7280;">策略命中率</div>
            <div style="font-size: 28px; font-weight: 800;">94%</div>
          </div>
          <span class="badge success">命中提升</span>
        </div>
        <div class="progress-bar" style="margin-top: 10px;">
          <div class="inner" style="width: 94%;"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 12px;">
        <h3 style="margin: 0;">处置决策队列</h3>
        <small style="color: #6b7280;">实时刷新</small>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>场景</th>
            <th>触发条件</th>
            <th>决策动作</th>
            <th>影响资产</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in decisions" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.scene }}</td>
            <td>{{ item.trigger }}</td>
            <td>{{ item.action }}</td>
            <td>{{ item.asset }}</td>
            <td><span class="badge" :class="item.status === '执行中' ? 'warning' : 'success'">{{ item.status }}</span></td>
            <td class="button-row">
              <button class="btn ghost" @click="openDecision(item)">详情</button>
              <button class="btn success" @click="approve(item)">审批</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog v-model="showPlaybook" title="SOAR剧本编排">
      <form class="grid" style="gap: 10px;">
        <label>触发器<select v-model="playbook.trigger"><option>恶意登录</option><option>横向移动</option><option>数据库异常</option></select></label>
        <label>动作<select multiple v-model="playbook.actions">
          <option>阻断IP</option>
          <option>禁用账号</option>
          <option>隔离主机</option>
          <option>推送工单</option>
        </select></label>
        <label>优先级<select v-model="playbook.priority"><option>高</option><option>中</option><option>低</option></select></label>
      </form>
      <template #footer>
        <button class="btn ghost" @click="showPlaybook = false">取消</button>
        <button class="btn primary" @click="savePlaybook">保存</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showSimulate" title="自动化演练">
      <p>演练范围：关键资产（数据库、域控、云控制台）</p>
      <div class="progress-bar" style="margin-bottom: 8px;">
        <div class="inner" :style="{ width: simulateProgress + '%' }"></div>
      </div>
      <ul>
        <li v-for="stage in simulateStages" :key="stage">{{ stage }}</li>
      </ul>
      <template #footer>
        <button class="btn ghost" @click="showSimulate = false">关闭</button>
        <button class="btn primary" @click="runSimulate">重新演练</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showPolicy" title="策略校验">
      <form class="grid" style="gap: 10px;">
        <label>校验范围<select v-model="policy.scope"><option>全局</option><option>终端</option><option>网络</option></select></label>
        <label>冲突处理<select v-model="policy.conflict"><option>保守优先</option><option>阻断优先</option></select></label>
        <label>模拟命中率<input type="range" min="0" max="100" v-model="policy.hitRate" /></label>
      </form>
      <template #footer>
        <button class="btn ghost" @click="showPolicy = false">取消</button>
        <button class="btn success" @click="validatePolicy">校验</button>
      </template>
    </ModalDialog>

    <ModalDialog v-model="showDecision" :title="activeDecision?.scene || '决策详情'">
      <p>触发条件：{{ activeDecision?.trigger }}</p>
      <p>决策动作：{{ activeDecision?.action }}</p>
      <p>生效资产：{{ activeDecision?.asset }}</p>
      <template #footer>
        <button class="btn ghost" @click="showDecision = false">关闭</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showPlaybook = ref(false);
const showSimulate = ref(false);
const showPolicy = ref(false);
const showDecision = ref(false);
const activeDecision = ref(null);
const simulateProgress = ref(50);

const playbook = reactive({ trigger: '恶意登录', actions: ['阻断IP', '推送工单'], priority: '高' });
const policy = reactive({ scope: '全局', conflict: '保守优先', hitRate: 70 });
const simulateStages = reactive(['准备环境', '下发指令', '监测回执', '验证结果']);

const decisions = reactive([
  { id: 'DQ-001', scene: '勒索加密阻断', trigger: 'EDR检测到加密行为', action: '隔离主机+阻断IP', asset: '终端-09', status: '执行中' },
  { id: 'DQ-002', scene: '数据库暴力破解', trigger: '失败登录超过20次', action: '锁定账号+验证码', asset: 'DB-02', status: '已完成' },
  { id: 'DQ-003', scene: '异常流量突增', trigger: '出口带宽突增', action: '限制带宽+黑名单', asset: 'FW-Edge', status: '执行中' },
  { id: 'DQ-004', scene: '敏感数据外传', trigger: 'DLP告警', action: '阻断传输+发送工单', asset: '邮箱-07', status: '已完成' },
  { id: 'DQ-005', scene: '威胁情报命中', trigger: 'IOC命中', action: '阻断IP+同步封禁', asset: 'WAF', status: '已完成' },
  { id: 'DQ-006', scene: '横向移动迹象', trigger: 'NDR告警', action: '隔离子网+阻断端口', asset: '交换机', status: '执行中' },
  { id: 'DQ-007', scene: '异常登录地', trigger: '地理位置异常', action: '二次验证+告警', asset: 'VPN-01', status: '已完成' },
  { id: 'DQ-008', scene: '容器逃逸', trigger: '容器安全告警', action: '重建容器+阻断进程', asset: 'K8S-NODE', status: '已完成' },
  { id: 'DQ-009', scene: '策略基线漂移', trigger: '配置审计偏离', action: '回滚配置+审批', asset: '服务器-03', status: '执行中' },
  { id: 'DQ-010', scene: '僵尸网络通信', trigger: '异常DNS请求', action: '阻断域名+隔离主机', asset: '终端-01', status: '已完成' }
]);

const savePlaybook = () => {
  showPlaybook.value = false;
};

const runSimulate = () => {
  simulateProgress.value = 0;
  const timer = setInterval(() => {
    if (simulateProgress.value >= 100) {
      clearInterval(timer);
    } else {
      simulateProgress.value += 20;
    }
  }, 300);
};

const validatePolicy = () => {
  showPolicy.value = false;
};

const openDecision = (item) => {
  activeDecision.value = item;
  showDecision.value = true;
};

const approve = (item) => {
  openDecision(item);
};
</script>
