<template>
  <div class="grid">
    <div class="section-title">
      <h2>改造项目管理</h2>
      <div class="actions">
        <button class="btn" @click="openModal('create')">立项</button>
        <button class="btn secondary" @click="openModal('plan')">调整计划</button>
        <button class="btn secondary" @click="openModal('announce')">发布里程碑</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="card" v-for="card in summary" :key="card.label">
        <p class="tip">{{ card.label }}</p>
        <h3 style="margin: 4px 0;">{{ card.value }}</h3>
        <div class="progress-bar"><span :style="{ width: card.percent + '%' }"></span></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">
        <h3>项目进度分布</h3>
        <p class="tip">基于甘特计划生成的里程碑完成情况</p>
      </div>
      <div class="chart-bar" style="background:#f8fbff;border:1px dashed #dbe6ff;">
        <div v-for="item in chartData" :key="item.label" class="bar" :style="{ height: item.value + 'px' }">
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>项目编号</th>
              <th>项目名称</th>
              <th>街道</th>
              <th>阶段</th>
              <th>总投资(万)</th>
              <th>完成度</th>
              <th>工期(月)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in projects" :key="item.code">
              <td>{{ item.code }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.street }}</td>
              <td>{{ item.stage }}</td>
              <td>{{ item.budget }}</td>
              <td>
                <div class="progress-bar" style="height: 8px;">
                  <span :style="{ width: item.progress + '%' }"></span>
                </div>
              </td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="section-title">
          <h3>{{ modalTitle }}</h3>
          <button class="btn secondary" @click="closeModal">关闭</button>
        </div>
        <div v-if="modal === 'create'" class="grid" style="gap: 12px;">
          <div class="form-grid">
            <div>
              <label>项目名称</label>
              <input placeholder="请输入项目名称" />
            </div>
            <div>
              <label>责任街道</label>
              <select>
                <option>新华街道</option>
                <option>文化路街道</option>
                <option>迎宾路街道</option>
                <option>和平街道</option>
              </select>
            </div>
            <div>
              <label>投资(万元)</label>
              <input type="number" placeholder="800" />
            </div>
            <div>
              <label>计划工期(月)</label>
              <input type="number" placeholder="6" />
            </div>
          </div>
          <textarea rows="3" placeholder="简述改造目标与范围"></textarea>
          <button class="btn">提交立项</button>
        </div>
        <div v-else-if="modal === 'plan'" class="grid" style="gap: 12px;">
          <div class="form-grid">
            <div>
              <label>选择项目</label>
              <select>
                <option v-for="p in projects" :key="p.code">{{ p.name }}</option>
              </select>
            </div>
            <div>
              <label>里程碑</label>
              <input placeholder="示例：立面改造完成" />
            </div>
          </div>
          <div>
            <label>时间轴调整</label>
            <div class="progress-bar"><span :style="{ width: '54%' }"></span></div>
          </div>
          <button class="btn">保存调整</button>
        </div>
        <div v-else class="grid" style="gap: 12px;">
          <p class="tip">选择要对外发布的节点，系统会通知施工与居民端。</p>
          <label>节点</label>
          <select>
            <option>示范楼封样</option>
            <option>雨污分流开工</option>
            <option>老旧管网置换</option>
          </select>
          <button class="btn">发布公告</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const projects = reactive([
  { code: 'P001', name: '新华社区雨污分流', street: '新华街道', stage: '施工', budget: 920, progress: 58, duration: 6 },
  { code: 'P002', name: '新华老楼加装电梯', street: '新华街道', stage: '方案', budget: 680, progress: 36, duration: 5 },
  { code: 'P003', name: '团结苑外立面改造', street: '文化路街道', stage: '施工', budget: 540, progress: 66, duration: 4 },
  { code: 'P004', name: '团结苑架空线规整', street: '文化路街道', stage: '完工', budget: 210, progress: 100, duration: 2 },
  { code: 'P005', name: '文化公寓庭院绿化', street: '文化路街道', stage: '施工', budget: 180, progress: 44, duration: 3 },
  { code: 'P006', name: '文化公寓消防改造', street: '文化路街道', stage: '设计', budget: 300, progress: 24, duration: 3 },
  { code: 'P007', name: '迎宾里道路白改黑', street: '迎宾路街道', stage: '施工', budget: 760, progress: 70, duration: 5 },
  { code: 'P008', name: '迎宾里管网置换', street: '迎宾路街道', stage: '设计', budget: 520, progress: 18, duration: 4 },
  { code: 'P009', name: '迎宾里口袋公园', street: '迎宾路街道', stage: '完工', budget: 160, progress: 100, duration: 2 },
  { code: 'P010', name: '桂花巷照明提升', street: '迎宾路街道', stage: '施工', budget: 120, progress: 48, duration: 2 },
  { code: 'P011', name: '东城公寓屋面修缮', street: '东城街道', stage: '施工', budget: 260, progress: 62, duration: 3 },
  { code: 'P012', name: '东城公寓智能门禁', street: '东城街道', stage: '采购', budget: 160, progress: 30, duration: 2 },
  { code: 'P013', name: '东城公寓充电桩建设', street: '东城街道', stage: '设计', budget: 240, progress: 28, duration: 3 },
  { code: 'P014', name: '和平里立面翻新', street: '和平街道', stage: '方案', budget: 400, progress: 12, duration: 4 },
  { code: 'P015', name: '和平里雨污分流', street: '和平街道', stage: '施工', budget: 530, progress: 54, duration: 5 },
  { code: 'P016', name: '和平里加装电梯', street: '和平街道', stage: '设计', budget: 620, progress: 20, duration: 6 },
  { code: 'P017', name: '迎宾里排水提升', street: '迎宾路街道', stage: '方案', budget: 310, progress: 16, duration: 4 },
  { code: 'P018', name: '团结苑海绵化改造', street: '文化路街道', stage: '施工', budget: 450, progress: 52, duration: 5 },
  { code: 'P019', name: '新华社区安防提标', street: '新华街道', stage: '采购', budget: 280, progress: 22, duration: 3 },
  { code: 'P020', name: '桂花巷无障碍改造', street: '迎宾路街道', stage: '方案', budget: 150, progress: 10, duration: 3 },
  { code: 'P021', name: '东城公寓雨棚加固', street: '东城街道', stage: '完工', budget: 90, progress: 100, duration: 1 }
]);

const summary = reactive([
  { label: '在建项目', value: '12 个', percent: 72 },
  { label: '年度投资执行', value: '4.2 亿元', percent: 64 },
  { label: '节点按期率', value: '87%', percent: 87 },
  { label: '民生覆盖率', value: '92%', percent: 92 }
]);

const chartData = computed(() => [
  { label: '设计', value: 120 },
  { label: '施工', value: 180 },
  { label: '完工', value: 150 },
  { label: '交付', value: 110 }
]);

const modal = ref('');

const openModal = (type) => {
  modal.value = type;
};

const closeModal = () => {
  modal.value = '';
};

const modalTitle = computed(() => {
  if (modal.value === 'create') return '新建改造项目';
  if (modal.value === 'plan') return '调整计划与里程碑';
  if (modal.value === 'announce') return '发布节点公告';
  return '';
});
</script>
