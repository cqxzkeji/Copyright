<template>
  <div class="card">
    <div class="section-header">
      <h3>系统设置</h3>
      <div class="btn-group">
        <button class="btn" type="button" @click="showForm = true">新增角色</button>
        <button class="btn secondary" type="button" @click="showProgress = true">配置备份</button>
        <button class="btn warn" type="button" @click="showTip = true">系统提示</button>
      </div>
    </div>
    <p class="section-desc">配置权限、通知与系统参数。</p>
  </div>

  <div class="card">
    <h3>权限角色列表</h3>
    <table class="table">
      <thead>
        <tr>
          <th>角色</th>
          <th>职责范围</th>
          <th>人数</th>
          <th>更新时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="role in roles" :key="role.name">
          <td>{{ role.name }}</td>
          <td>{{ role.scope }}</td>
          <td>{{ role.count }}</td>
          <td>{{ role.updated }}</td>
          <td><span class="tag">{{ role.status }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h3>系统参数</h3>
    <table class="table">
      <thead>
        <tr>
          <th>参数项</th>
          <th>当前值</th>
          <th>说明</th>
          <th>维护人</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in settings" :key="item.key">
          <td>{{ item.key }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.desc }}</td>
          <td>{{ item.owner }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseModal :show="showForm" title="新增角色" @close="showForm = false">
    <div class="form-grid">
      <div class="form-item">
        <label>角色名称</label>
        <input placeholder="输入角色名称" />
      </div>
      <div class="form-item">
        <label>权限模板</label>
        <select>
          <option>运营管理</option>
          <option>数据分析</option>
          <option>主播管理</option>
          <option>系统管理员</option>
        </select>
      </div>
      <div class="form-item">
        <label>默认人数</label>
        <input type="number" placeholder="请输入人数" />
      </div>
      <div class="form-item" style="grid-column: 1 / -1;">
        <label>权限描述</label>
        <textarea rows="3" placeholder="填写角色权限说明"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn ghost" type="button" @click="showForm = false">取消</button>
      <button class="btn" type="button" @click="showForm = false">保存角色</button>
    </template>
  </BaseModal>

  <BaseModal :show="showProgress" title="配置备份" @close="showProgress = false">
    <p>正在备份系统参数和权限配置。</p>
    <div class="progress-wrap">
      <div class="progress-bar" :style="{ width: '74%' }"></div>
    </div>
    <template #footer>
      <button class="btn" type="button" @click="showProgress = false">完成</button>
    </template>
  </BaseModal>

  <BaseModal :show="showTip" title="系统提示" @close="showTip = false">
    <p>建议每周末更新一次权限表与直播间配置，确保安全合规。</p>
    <template #footer>
      <button class="btn" type="button" @click="showTip = false">确认</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const showForm = ref(false)
const showProgress = ref(false)
const showTip = ref(false)

const roles = [
  { name: '系统管理员', scope: '全平台配置', count: 2, updated: '2024-06-10', status: '启用' },
  { name: '运营主管', scope: '直播排期/活动', count: 4, updated: '2024-06-12', status: '启用' },
  { name: '主播经理', scope: '主播档案/排班', count: 3, updated: '2024-06-11', status: '启用' },
  { name: '商品运营', scope: '商品上架/库存', count: 6, updated: '2024-06-09', status: '启用' },
  { name: '数据分析师', scope: '报表/指标', count: 5, updated: '2024-06-08', status: '启用' },
  { name: '客服组', scope: '订单/售后', count: 8, updated: '2024-06-07', status: '启用' },
  { name: '财务组', scope: '结算/对账', count: 3, updated: '2024-06-05', status: '启用' },
  { name: '供应链', scope: '仓储/物流', count: 4, updated: '2024-06-04', status: '启用' },
  { name: '合规专员', scope: '审核/风控', count: 2, updated: '2024-06-06', status: '启用' },
  { name: '访客查看', scope: '只读访问', count: 5, updated: '2024-06-03', status: '启用' }
]

const settings = [
  { key: '直播峰值预警', value: '启用', desc: '观众数超过阈值提醒', owner: '数据组' },
  { key: '库存同步频率', value: '每30分钟', desc: '自动同步频率', owner: '供应链' },
  { key: '订单自动确认', value: '24小时', desc: '未发货自动提醒', owner: '客服组' },
  { key: '主播评级周期', value: '每月', desc: '根据绩效评分', owner: '主播经理' },
  { key: '直播脚本审核', value: '开启', desc: '内容合规检查', owner: '合规专员' },
  { key: '风控关键词', value: '38条', desc: '违规词库数量', owner: '合规专员' },
  { key: '财务结算周期', value: '每周五', desc: '自动生成对账单', owner: '财务组' },
  { key: '短信通知', value: '已启用', desc: '运营提醒与异常通知', owner: '系统管理员' },
  { key: '数据备份', value: '每日02:00', desc: '系统自动备份', owner: '系统管理员' },
  { key: '多仓库支持', value: '华东/华南', desc: '仓储调度范围', owner: '供应链' }
]
</script>

<style scoped>
.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-desc {
  color: #6b7280;
  margin: 12px 0 0;
}
</style>
