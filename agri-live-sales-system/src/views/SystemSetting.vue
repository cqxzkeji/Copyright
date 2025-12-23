<template>
  <MainLayout>
    <section class="card">
      <div class="button-group" style="justify-content: space-between; align-items: center;">
        <div>
          <h3>系统配置与权限</h3>
          <p>管理账号、角色与通知策略</p>
        </div>
        <div class="button-group">
          <button class="button" @click="openModal('user')">新增账号</button>
          <button class="button secondary" @click="openModal('role')">权限调整</button>
          <button class="button ghost" @click="openModal('sync')">同步配置</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>账号</th>
            <th>角色</th>
            <th>最近登录</th>
            <th>状态</th>
            <th>通知策略</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item.account">
            <td>{{ item.account }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.login }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.notify }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="grid-2">
      <div class="card">
        <h3>系统运行健康度</h3>
        <p>近 24 小时资源使用情况</p>
        <div class="chart">
          <div v-for="row in health" :key="row.name" class="chart-row">
            <span style="width: 80px;">{{ row.name }}</span>
            <div class="chart-bar"><span :style="{ width: row.value + '%' }"></span></div>
            <strong>{{ row.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>消息队列进度</h3>
        <p>配置同步与日志归档</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <span style="width: 82%;"></span>
        </div>
      </div>
    </section>
  </MainLayout>

  <ModalDialog
    v-if="activeModal === 'user'"
    title="新增账号"
    confirm-text="创建账号"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <div class="form-grid">
      <div>
        <label>账号名称</label>
        <input placeholder="请输入账号" />
      </div>
      <div>
        <label>分配角色</label>
        <select>
          <option>直播管理员</option>
          <option>库存管理员</option>
          <option>财务审核</option>
        </select>
      </div>
      <div>
        <label>通知方式</label>
        <select>
          <option>短信 + 邮件</option>
          <option>企业微信</option>
        </select>
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'role'"
    title="权限调整"
    confirm-text="保存调整"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>选择角色权限模板，快速同步权限。</p>
    <div class="form-grid">
      <div>
        <label>角色模板</label>
        <select>
          <option>运营全量权限</option>
          <option>直播场控权限</option>
          <option>仓储只读权限</option>
        </select>
      </div>
      <div>
        <label>授权范围</label>
        <input placeholder="例如：直播管理、库存管理" />
      </div>
    </div>
  </ModalDialog>

  <ModalDialog
    v-if="activeModal === 'sync'"
    title="同步系统配置"
    confirm-text="立即同步"
    @close="activeModal = ''"
    @confirm="activeModal = ''"
  >
    <p>系统正在同步基础配置，完成后自动通知管理员。</p>
    <div class="progress-bar" style="margin-top: 12px;">
      <span style="width: 55%;"></span>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ModalDialog from '../components/ModalDialog.vue'

const activeModal = ref('')

const users = [
  { account: 'liuyan@agri.com', role: '运营负责人', login: '今天 09:20', status: '启用', notify: '短信 + 邮件' },
  { account: 'chenhao@agri.com', role: '直播管理员', login: '今天 08:45', status: '启用', notify: '企业微信' },
  { account: 'wangqi@agri.com', role: '库存主管', login: '昨天 19:10', status: '启用', notify: '短信 + 邮件' },
  { account: 'zhoumin@agri.com', role: '营销分析师', login: '昨天 18:05', status: '启用', notify: '企业微信' },
  { account: 'tangjie@agri.com', role: '运营专员', login: '昨天 17:30', status: '启用', notify: '短信 + 邮件' },
  { account: 'liuchang@agri.com', role: '直播场控', login: '昨天 16:50', status: '启用', notify: '短信 + 邮件' },
  { account: 'guoyuan@agri.com', role: '供应链协同', login: '昨天 14:20', status: '启用', notify: '企业微信' },
  { account: 'zhaofeng@agri.com', role: '客服主管', login: '昨天 13:05', status: '启用', notify: '短信 + 邮件' },
  { account: 'wuhou@agri.com', role: '结算专员', login: '昨天 11:40', status: '启用', notify: '短信 + 邮件' },
  { account: 'hanchen@agri.com', role: '审计管理员', login: '昨天 10:15', status: '启用', notify: '企业微信' }
]

const health = [
  { name: 'CPU', value: 68 },
  { name: '内存', value: 74 },
  { name: '存储', value: 52 },
  { name: '带宽', value: 61 }
]

const openModal = (type) => {
  activeModal.value = type
}
</script>
