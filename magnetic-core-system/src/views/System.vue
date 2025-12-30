<template>
  <div class="grid grid-2">
    <div class="card">
      <div class="flex-between" style="margin-bottom: 8px;">
        <div>
          <div class="muted small">系统管理</div>
          <h3 style="margin: 4px 0 0;">用户与设备</h3>
        </div>
        <div class="toolbar">
          <button class="btn" @click="openModal('user')">新增用户</button>
          <button class="btn secondary" @click="openModal('device')">新增设备</button>
          <button class="btn ghost" @click="openModal('backup')">导出/备份</button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>类型</th>
            <th>名称</th>
            <th>权限/型号</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in assets" :key="row.name">
            <td>{{ row.type }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.meta }}</td>
            <td><span :class="['badge', row.state === '在线' ? 'success' : 'warning']">{{ row.state }}</span></td>
            <td>{{ row.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="flex-between">
        <div>
          <div class="muted small">服务监控</div>
          <h3 style="margin: 4px 0 0;">存储与接口</h3>
        </div>
        <button class="btn" @click="openModal('service')">刷新服务</button>
      </div>
      <div class="grid" style="gap: 12px; margin-top: 10px;">
        <div class="card" v-for="svc in services" :key="svc.name" style="background:#ecfeff;">
          <div class="flex-between">
            <div>
              <div class="muted small">{{ svc.name }}</div>
              <div><strong>{{ svc.desc }}</strong></div>
            </div>
            <div class="badge success">{{ svc.status }}</div>
          </div>
          <div class="progress-bar" style="margin-top: 6px;">
            <div class="progress-bar-inner" :style="{ width: svc.usage + '%', background: svc.usage > 80 ? '#f97316' : '#0ea5e9' }"></div>
          </div>
          <div class="muted small">利用率 {{ svc.usage }}% · 最近备份 {{ svc.backup }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="modal" class="modal-backdrop">
    <div class="modal">
      <template v-if="modal === 'user'">
        <h3>新增用户</h3>
        <div class="grid grid-2" style="margin-top: 10px;">
          <div>
            <div class="label">姓名</div>
            <input class="input" v-model="form.name" />
          </div>
          <div>
            <div class="label">角色</div>
            <select class="select" v-model="form.role">
              <option>工艺工程师</option>
              <option>质量工程师</option>
              <option>设备管理员</option>
            </select>
          </div>
          <div>
            <div class="label">联系方式</div>
            <input class="input" v-model="form.contact" />
          </div>
          <div>
            <div class="label">备注</div>
            <input class="input" v-model="form.remark" />
          </div>
        </div>
        <div style="text-align:right; margin-top: 12px;">
          <button class="btn" @click="confirm">保存</button>
        </div>
      </template>
      <template v-else-if="modal === 'device'">
        <h3>新增设备</h3>
        <div class="grid grid-2" style="margin-top: 10px;">
          <div>
            <div class="label">设备名称</div>
            <input class="input" v-model="form.device" />
          </div>
          <div>
            <div class="label">设备编号</div>
            <input class="input" v-model="form.code" />
          </div>
          <div>
            <div class="label">工序</div>
            <select class="select" v-model="form.stage">
              <option>压铸</option>
              <option>烧结</option>
              <option>研磨</option>
            </select>
          </div>
          <div>
            <div class="label">状态</div>
            <select class="select" v-model="form.state">
              <option>在线</option>
              <option>维护</option>
            </select>
          </div>
        </div>
        <div style="text-align:right; margin-top: 12px;">
          <button class="btn secondary" @click="confirm">保存设备</button>
        </div>
      </template>
      <template v-else-if="modal === 'backup'">
        <h3>数据导出与备份</h3>
        <p class="muted">将导出工艺参数、检测记录、预警日志，生成 ZIP 包。</p>
        <div class="progress-bar" style="margin: 12px 0;">
          <div class="progress-bar-inner" :style="{ width: progress + '%', background: '#3b82f6' }"></div>
        </div>
        <div style="text-align:right;">
          <button class="btn" @click="confirm">开始导出</button>
        </div>
      </template>
      <template v-else>
        <h3>刷新服务</h3>
        <p class="muted">接口健康检查与存储空间刷新完成。</p>
        <div class="progress-bar" style="margin: 12px 0;">
          <div class="progress-bar-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <div style="text-align:right;">
          <button class="btn" @click="confirm">好的</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const modal = ref('')
const progress = ref(60)
const form = reactive({ name: '', role: '工艺工程师', contact: '', remark: '', device: '', code: '', stage: '压铸', state: '在线' })

const assets = [
  { type: '用户', name: '张楠', meta: '工艺工程师', state: '在线', note: '负责压铸工艺' },
  { type: '用户', name: '李琪', meta: '质量工程师', state: '在线', note: '关注磁性能' },
  { type: '用户', name: '周越', meta: '设备管理员', state: '在线', note: '维护采集设备' },
  { type: '设备', name: '压铸-01', meta: '压铸机 A7', state: '在线', note: '自动采集' },
  { type: '设备', name: '烧结-02', meta: '烧结炉 S2', state: '维护', note: '例行点检' },
  { type: '设备', name: '研磨-01', meta: '研磨线 M1', state: '在线', note: '压力稳定' },
  { type: '设备', name: '测试-01', meta: '检测台 T1', state: '在线', note: '批次抽检' }
]

const services = [
  { name: '数据库', desc: 'TimescaleDB 工艺数据', status: '健康', usage: 64, backup: '02:15' },
  { name: '文件存储', desc: '检测报告与导出包', status: '健康', usage: 78, backup: '02:30' },
  { name: '接口网关', desc: '设备对接与消息推送', status: '健康', usage: 52, backup: '02:10' }
]

const openModal = (type) => {
  modal.value = type
  progress.value = 50 + Math.round(Math.random() * 45)
}

const confirm = () => {
  progress.value = 100
  setTimeout(() => (modal.value = ''), 300)
}
</script>
