<template>
  <div class="page-container">
    <div class="grid-2" style="margin-bottom: 16px;">
      <div class="card">
        <h3>消防标准更新监测</h3>
        <div class="chart">
          <div v-for="item in chartData" :key="item.label" class="chart-bar">
            <span>{{ item.label }}</span>
            <div class="bar" :style="{ '--value': item.value + '%' }"></div>
            <strong>{{ item.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>知识库使用热度</h3>
        <div class="grid-3">
          <div class="card">
            <h4>本周访问</h4>
            <p style="font-size: 28px; margin: 8px 0;">1,248</p>
            <span class="tag">平均停留 6 分钟</span>
          </div>
          <div class="card">
            <h4>新增文档</h4>
            <p style="font-size: 28px; margin: 8px 0;">9</p>
            <span class="tag">待审核 2</span>
          </div>
          <div class="card">
            <h4>案例收藏</h4>
            <p style="font-size: 28px; margin: 8px 0;">356</p>
            <span class="tag">高频案例</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="toolbar">
        <button class="btn primary" @click="openModal('standard')">新增标准</button>
        <button class="btn" @click="openModal('guide')">发布指南</button>
        <button class="btn success" @click="openModal('manual')">设备手册</button>
        <button class="btn warn" @click="openModal('case')">案例分析</button>
        <button class="btn" @click="openModal('tip')">提示信息</button>
        <button class="btn" @click="openModal('progress')">上传进度</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>编号</th>
            <th>文档名称</th>
            <th>类型</th>
            <th>发布部门</th>
            <th>更新时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.date }}</td>
            <td><span class="tag">{{ row.status }}</span></td>
            <td>
              <button class="btn" @click="openDetail(row)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal v-model="modals.standard" title="消防安全标准与规范">
    <div class="form-grid">
      <div>
        <label>标准名称</label>
        <input placeholder="请输入标准名称" />
      </div>
      <div>
        <label>版本</label>
        <input placeholder="2024版" />
      </div>
      <div>
        <label>发布单位</label>
        <input placeholder="应急管理部" />
      </div>
      <div>
        <label>适用范围</label>
        <input placeholder="工业园区" />
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.standard = false">取消</button>
      <button class="btn primary" @click="modals.standard = false">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.guide" title="火灾预防与应急处理指南">
    <div class="form-grid">
      <div>
        <label>指南标题</label>
        <input placeholder="如：夜班防火要点" />
      </div>
      <div>
        <label>适用场景</label>
        <input placeholder="仓库/生产线" />
      </div>
      <div>
        <label>关键步骤</label>
        <textarea rows="2" placeholder="填写应急处理步骤"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.guide = false">关闭</button>
      <button class="btn primary" @click="modals.guide = false">发布</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.manual" title="消防设备使用与维护手册">
    <div class="form-grid">
      <div>
        <label>设备名称</label>
        <input placeholder="如：消火栓" />
      </div>
      <div>
        <label>维护周期</label>
        <input placeholder="每季度" />
      </div>
      <div>
        <label>负责部门</label>
        <input placeholder="设备管理部" />
      </div>
      <div>
        <label>附件</label>
        <input placeholder="上传维护指引" />
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.manual = false">关闭</button>
      <button class="btn primary" @click="modals.manual = false">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.case" title="常见消防案例分析">
    <div class="form-grid">
      <div>
        <label>案例标题</label>
        <input placeholder="请输入案例标题" />
      </div>
      <div>
        <label>发生地点</label>
        <input placeholder="某工业园" />
      </div>
      <div>
        <label>案例摘要</label>
        <textarea rows="3" placeholder="案例简述与教训"></textarea>
      </div>
    </div>
    <template #footer>
      <button class="btn" @click="modals.case = false">取消</button>
      <button class="btn primary" @click="modals.case = false">保存</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.tip" title="知识库提示">
    <p>本周新增 2 份最新国家标准，建议组织专题学习。</p>
    <p>热门案例：高温车间粉尘爆燃事故复盘。</p>
    <template #footer>
      <button class="btn" @click="modals.tip = false">知道了</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.progress" title="资料上传进度">
    <p>正在上传设备维护手册。</p>
    <div class="progress">
      <span :style="{ width: progress + '%' }"></span>
    </div>
    <p>当前完成 {{ progress }}%</p>
    <template #footer>
      <button class="btn" @click="modals.progress = false">后台运行</button>
    </template>
  </BaseModal>

  <BaseModal v-model="modals.detail" :title="detailTitle">
    <p>{{ detailContent }}</p>
    <template #footer>
      <button class="btn" @click="modals.detail = false">关闭</button>
      <button class="btn primary" @click="modals.detail = false">确定</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const chartData = [
  { label: '国家标准', value: 70 },
  { label: '地方规范', value: 58 },
  { label: '企业制度', value: 85 },
  { label: '案例复盘', value: 76 }
];

const rows = Array.from({ length: 20 }, (_, index) => ({
  id: `KB-${100 + index}`,
  name: `消防资料库文档 ${index + 1}`,
  type: ['标准', '指南', '手册', '案例'][index % 4],
  owner: ['安全部', '培训部', '设备部'][index % 3],
  date: `2024-08-${(index % 28) + 1}`,
  status: ['已发布', '待审核', '已更新'][index % 3]
}));

const modals = reactive({
  standard: false,
  guide: false,
  manual: false,
  case: false,
  tip: false,
  progress: false,
  detail: false
});

const progress = ref(64);
const detailTitle = ref('文档详情');
const detailContent = ref('');

const openModal = (type) => {
  modals[type] = true;
};

const openDetail = (row) => {
  detailTitle.value = `文档 ${row.id} 详情`;
  detailContent.value = `《${row.name}》由 ${row.owner} 发布，类型为 ${row.type}，更新时间 ${row.date}。`;
  modals.detail = true;
};
</script>
