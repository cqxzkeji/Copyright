<template>
  <section>
    <div class="section-title">集群资源接入与资产管理</div>
    <div class="card-grid">
      <div class="card">
        <h3>纳管节点</h3>
        <div class="metric">128</div>
        <div class="badge">新增 6 台</div>
      </div>
      <div class="card">
        <h3>机架利用率</h3>
        <div class="metric">82%</div>
        <div class="badge">空闲 7 架</div>
      </div>
      <div class="card">
        <h3>存储容量</h3>
        <div class="metric">4.8 PB</div>
        <div class="badge">剩余 1.2 PB</div>
      </div>
      <div class="card">
        <h3>交换机在线</h3>
        <div class="metric">34</div>
        <div class="badge">健康 100%</div>
      </div>
    </div>

    <div class="actions">
      <button class="action-button" @click="modals.add = true">新增资产</button>
      <button class="action-button secondary" @click="modals.import = true">批量导入</button>
      <button class="action-button secondary" @click="modals.tag = true">标签分组</button>
      <button class="action-button secondary" @click="modals.lifecycle = true">生命周期管理</button>
      <button class="action-button secondary" @click="modals.info = true">按钮提示</button>
    </div>

    <div class="chart">
      <div class="section-title">资源池容量分布</div>
      <div v-for="pool in pools" :key="pool.name" class="bar-row">
        <div class="bar-label">{{ pool.name }}</div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: pool.usage + '%' }"></div>
        </div>
        <div>{{ pool.usage }}%</div>
      </div>
    </div>

    <div class="table-wrap">
      <div class="section-title">资产明细列表</div>
      <table>
        <thead>
          <tr>
            <th>资产编号</th>
            <th>类型</th>
            <th>所在机架</th>
            <th>标签</th>
            <th>生命周期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asset in assets" :key="asset.id">
            <td>{{ asset.id }}</td>
            <td>{{ asset.type }}</td>
            <td>{{ asset.rack }}</td>
            <td>{{ asset.tag }}</td>
            <td>{{ asset.stage }}</td>
            <td>{{ asset.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <BaseModal :show="modals.add" title="新增资产" @close="modals.add = false">
    <div class="form-grid">
      <label>
        资产类型
        <select v-model="forms.add.type">
          <option>计算节点</option>
          <option>GPU 节点</option>
          <option>高速存储</option>
          <option>核心交换机</option>
        </select>
      </label>
      <label>
        资产编号
        <input v-model="forms.add.assetId" placeholder="例如: CN-129" />
      </label>
      <label>
        绑定机架
        <input v-model="forms.add.rack" placeholder="例如: R08" />
      </label>
      <label>
        备注
        <textarea v-model="forms.add.remark" rows="2" placeholder="硬件配置与备注"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.import" title="批量导入进度" @close="modals.import = false">
    <p>正在导入 48 条资产记录，数据校验中。</p>
    <div class="progress">
      <span :style="{ width: '72%' }"></span>
    </div>
    <p>已完成 72%，预计 2 分钟。</p>
  </BaseModal>

  <BaseModal :show="modals.tag" title="标签分组" @close="modals.tag = false">
    <div class="form-grid">
      <label>
        选择标签
        <select v-model="forms.tag.group">
          <option>GPU-高优先级</option>
          <option>CPU-长作业</option>
          <option>存储-高IO</option>
        </select>
      </label>
      <label>
        目标资源池
        <input v-model="forms.tag.pool" placeholder="资源池名称" />
      </label>
      <label>
        操作说明
        <textarea v-model="forms.tag.note" rows="2" placeholder="描述本次分组策略"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.lifecycle" title="生命周期调整" @close="modals.lifecycle = false">
    <div class="form-grid">
      <label>
        资产编号
        <input v-model="forms.lifecycle.assetId" placeholder="例如: SW-12" />
      </label>
      <label>
        阶段
        <select v-model="forms.lifecycle.stage">
          <option>在保</option>
          <option>待维保</option>
          <option>待下线</option>
          <option>退役</option>
        </select>
      </label>
      <label>
        变更原因
        <textarea v-model="forms.lifecycle.reason" rows="2" placeholder="例如: 设备老化"></textarea>
      </label>
    </div>
  </BaseModal>

  <BaseModal :show="modals.info" title="提示信息" @close="modals.info = false">
    <p>所有资产变更操作将自动记录审计日志，并同步到资产台账。</p>
  </BaseModal>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modals = reactive({
  add: false,
  import: false,
  tag: false,
  lifecycle: false,
  info: false
});

const forms = reactive({
  add: {
    type: '计算节点',
    assetId: '',
    rack: '',
    remark: ''
  },
  tag: {
    group: 'GPU-高优先级',
    pool: '核心科研池',
    note: ''
  },
  lifecycle: {
    assetId: '',
    stage: '在保',
    reason: ''
  }
});

const pools = [
  { name: '核心科研池', usage: 76 },
  { name: 'AI 训练池', usage: 64 },
  { name: '工业仿真池', usage: 58 },
  { name: '教育实验池', usage: 42 }
];

const assets = Array.from({ length: 24 }, (_, index) => {
  const id = index + 1;
  return {
    id: `CN-${String(id).padStart(3, '0')}`,
    type: id % 5 === 0 ? 'GPU 节点' : '计算节点',
    rack: `R${String((id % 12) + 1).padStart(2, '0')}`,
    tag: id % 3 === 0 ? '高优先级' : id % 2 === 0 ? '高IO' : '常规',
    stage: id % 4 === 0 ? '待维保' : '在保',
    status: id % 6 === 0 ? '巡检中' : '在线'
  };
});
</script>
