<template>
  <div class="grid">
    <div class="section-title">
      <h2>施工进度监管</h2>
      <div class="actions">
        <button class="btn" @click="openModal('inspect')">现场巡检</button>
        <button class="btn secondary" @click="openModal('upload')">上传影像</button>
        <button class="btn secondary" @click="openModal('alert')">风险提示</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="card">
        <p class="tip">本周巡检</p>
        <h3 style="margin: 4px 0;">18 次</h3>
        <div class="progress-bar"><span :style="{ width: '76%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">整改闭环</p>
        <h3 style="margin: 4px 0;">32 / 35</h3>
        <div class="progress-bar"><span :style="{ width: '91%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">安全文明得分</p>
        <h3 style="margin: 4px 0;">92 分</h3>
        <div class="progress-bar"><span :style="{ width: '92%' }"></span></div>
      </div>
      <div class="card">
        <p class="tip">质量风险</p>
        <h3 style="margin: 4px 0;">1 重大 · 4 一般</h3>
        <div class="progress-bar"><span :style="{ width: '34%' }"></span></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">
        <h3>施工任务清单</h3>
        <p class="tip">覆盖所有在建项目节点，动态更新巡检状态</p>
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
              <th>项目</th>
              <th>节点</th>
              <th>责任人</th>
              <th>状态</th>
              <th>计划日期</th>
              <th>实际完成</th>
              <th>风险</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.name + task.node">
              <td>{{ task.name }}</td>
              <td>{{ task.node }}</td>
              <td>{{ task.owner }}</td>
              <td><span class="tag" :class="task.status === '完成' ? 'success' : 'info'">{{ task.status }}</span></td>
              <td>{{ task.plan }}</td>
              <td>{{ task.real || '-' }}</td>
              <td>{{ task.risk }}</td>
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
        <div v-if="modal === 'inspect'" class="grid" style="gap: 12px;">
          <div class="form-grid">
            <div>
              <label>项目</label>
              <select>
                <option v-for="task in tasks" :key="task.name">{{ task.name }}</option>
              </select>
            </div>
            <div>
              <label>巡检内容</label>
              <input placeholder="现场安全、材料堆放" />
            </div>
          </div>
          <label>巡检结果</label>
          <textarea rows="3" placeholder="填写巡检发现与整改建议"></textarea>
          <button class="btn">提交巡检记录</button>
        </div>
        <div v-else-if="modal === 'upload'" class="grid" style="gap: 12px;">
          <p class="tip">上传照片视频将同步到项目影像档案。</p>
          <div class="progress-bar"><span :style="{ width: '45%' }"></span></div>
          <button class="btn">选择文件</button>
          <button class="btn secondary">开始上传</button>
        </div>
        <div v-else class="grid" style="gap: 12px;">
          <label>风险等级</label>
          <select>
            <option>一般</option>
            <option>重大</option>
          </select>
          <textarea rows="3" placeholder="描述风险点与防范措施"></textarea>
          <button class="btn">推送风险提示</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';

const tasks = reactive([
  { name: '新华社区雨污分流', node: '管沟开挖', owner: '张涛', status: '进行中', plan: '04-12', real: '', risk: '周边交通扰民' },
  { name: '新华社区雨污分流', node: '主管铺设', owner: '张涛', status: '进行中', plan: '04-20', real: '', risk: '地下管线碰撞' },
  { name: '新华老楼加梯', node: '基础施工', owner: '刘洋', status: '完成', plan: '04-02', real: '04-06', risk: '无' },
  { name: '新华老楼加梯', node: '电梯安装', owner: '刘洋', status: '进行中', plan: '04-18', real: '', risk: '需封闭施工' },
  { name: '团结苑外立面', node: '脚手架搭设', owner: '王蕾', status: '完成', plan: '03-28', real: '03-30', risk: '无' },
  { name: '团结苑外立面', node: '保温施工', owner: '王蕾', status: '进行中', plan: '04-10', real: '', risk: '防护到位' },
  { name: '团结苑架空线', node: '线缆入地', owner: '周楠', status: '完成', plan: '04-05', real: '04-08', risk: '无' },
  { name: '文化公寓庭院', node: '绿化种植', owner: '张敏', status: '进行中', plan: '04-16', real: '', risk: '季节性限制' },
  { name: '文化公寓消防', node: '材料进场', owner: '张敏', status: '完成', plan: '04-01', real: '04-02', risk: '无' },
  { name: '迎宾里道路白改黑', node: '沥青摊铺', owner: '李强', status: '计划中', plan: '04-25', real: '', risk: '需封闭交通' },
  { name: '迎宾里管网置换', node: '旧管拆除', owner: '李强', status: '进行中', plan: '04-14', real: '', risk: '安全防护' },
  { name: '迎宾里管网置换', node: '新管安装', owner: '李强', status: '计划中', plan: '04-22', real: '', risk: '需夜间施工' },
  { name: '迎宾里口袋公园', node: '铺装施工', owner: '陈晨', status: '完成', plan: '03-30', real: '03-31', risk: '无' },
  { name: '桂花巷照明提升', node: '杆件预埋', owner: '陈晨', status: '进行中', plan: '04-09', real: '', risk: '地下管线复核' },
  { name: '东城屋面修缮', node: '防水铺设', owner: '周楠', status: '进行中', plan: '04-12', real: '', risk: '天气影响' },
  { name: '东城屋面修缮', node: '保温施工', owner: '周楠', status: '计划中', plan: '04-19', real: '', risk: '材料到货' },
  { name: '东城智能门禁', node: '设备安装', owner: '刘洋', status: '计划中', plan: '04-18', real: '', risk: '弱电配合' },
  { name: '和平里立面翻新', node: '样板确认', owner: '张涛', status: '进行中', plan: '04-15', real: '', risk: '色差确认' },
  { name: '和平里雨污分流', node: '探管', owner: '李强', status: '进行中', plan: '04-13', real: '', risk: '地下障碍' },
  { name: '和平里雨污分流', node: '道路恢复', owner: '李强', status: '计划中', plan: '04-24', real: '', risk: '居民出行' },
  { name: '桂花巷无障碍', node: '坡道施工', owner: '陈晨', status: '计划中', plan: '04-21', real: '', risk: '材料供应' }
]);

const chartData = computed(() => [
  { label: '进行中', value: 190 },
  { label: '完成', value: 140 },
  { label: '计划', value: 120 }
]);

const modal = ref('');

const openModal = (type) => {
  modal.value = type;
};

const closeModal = () => {
  modal.value = '';
};

const modalTitle = computed(() => {
  if (modal.value === 'inspect') return '现场巡检记录';
  if (modal.value === 'upload') return '上传施工影像';
  if (modal.value === 'alert') return '风险提示';
  return '';
});
</script>
