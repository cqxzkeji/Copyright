<template>
  <div>
    <div class="section-header">
      <div>
        <p class="eyebrow">功能五 · 数据统计与分析</p>
        <h2>统计用户访问、互动行为与学习进度，为非遗传播效果评估提供支撑。</h2>
      </div>
      <div class="actions">
        <button class="primary" @click="openInfo('导出报告', '正在生成 PDF 报告，包含访问趋势与互动明细。')">导出报告</button>
        <button class="accent" @click="openProgress('同步 BI 仪表盘', 62)">同步仪表盘</button>
        <button class="ghost" @click="openForm('自定义指标')">自定义指标</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="section-header">
          <h3>月度访问与互动趋势</h3>
          <span class="badge">近 12 个月</span>
        </div>
        <div class="chart">
          <div
            v-for="item in trendData"
            :key="item.month"
            class="bar"
            :style="{ height: `${item.visits / 1200 * 220}px` }"
            :title="`${item.month}：${item.visits} 访问 / ${item.interactions} 互动`"
          >
            <span class="bar-value">{{ item.visits }}</span>
            <span class="bar-label">{{ item.month }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="section-header">
          <h3>互动热点项目 Top 8</h3>
          <span class="badge">点击率/完成率</span>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>项目</th>
              <th>点击率</th>
              <th>完成率</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in hotSpots" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.ctr }}%</td>
              <td>{{ item.finish }}%</td>
              <td>
                <button class="primary" @click="openInfo('优化建议', item.recommend)">建议</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="section-header">
        <h3>学习进度明细（{{ learningProgress.length }} 条）</h3>
        <button class="ghost" @click="openProgress('生成进度报表', 48)">生成报表</button>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>学员</th>
              <th>项目</th>
              <th>学习时长</th>
              <th>完成节点</th>
              <th>满意度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in learningProgress" :key="item.id">
              <td>{{ item.user }}</td>
              <td>{{ item.project }}</td>
              <td>{{ item.time }} 分钟</td>
              <td>{{ item.steps }}/{{ item.totalSteps }}</td>
              <td>{{ item.satisfaction }}%</td>
              <td>
                <button class="ghost" @click="openInfo('学习反馈', item.feedback)">反馈</button>
                <button class="primary" @click="openProgress('同步学习档案', 35)">同步</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal :show="modal.type === 'form'" :title="modal.title" width="520px" @close="closeModal">
      <div class="input-group">
        <input v-model="form.name" placeholder="指标名称，如：场景停留时长" />
        <input v-model="form.dimension" placeholder="维度，如：地区/设备/来源" />
        <textarea v-model="form.desc" rows="3" placeholder="计算逻辑与预期用途"></textarea>
      </div>
      <template #footer>
        <button class="ghost" @click="closeModal">取消</button>
        <button class="primary" @click="submitForm">保存</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'progress'" :title="modal.title" width="460px" @close="closeModal">
      <p>正在汇总埋点与日志，请保持页面打开…</p>
      <progress :value="modal.progress" max="100"></progress>
      <p class="progress-text">{{ modal.progress }}% 完成</p>
      <template #footer>
        <button class="primary" @click="closeModal">完成</button>
      </template>
    </BaseModal>

    <BaseModal :show="modal.type === 'info'" :title="modal.title" width="460px" @close="closeModal">
      <p>{{ modal.message }}</p>
      <template #footer>
        <button class="primary" @click="closeModal">好的</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const trendData = reactive([
  { month: '1月', visits: 820, interactions: 310 },
  { month: '2月', visits: 960, interactions: 402 },
  { month: '3月', visits: 1120, interactions: 506 },
  { month: '4月', visits: 980, interactions: 450 },
  { month: '5月', visits: 1230, interactions: 520 },
  { month: '6月', visits: 1180, interactions: 498 },
  { month: '7月', visits: 1320, interactions: 540 },
  { month: '8月', visits: 1250, interactions: 518 },
  { month: '9月', visits: 1360, interactions: 566 },
  { month: '10月', visits: 1280, interactions: 522 },
  { month: '11月', visits: 1420, interactions: 601 },
  { month: '12月', visits: 1390, interactions: 589 }
]);

const hotSpots = reactive([
  { name: '苗绣针法工坊', ctr: 42, finish: 76, recommend: '增加针脚慢动作与手柄震动提示。' },
  { name: '鼓楼夜话漫游', ctr: 38, finish: 68, recommend: '在鼓楼顶部加入航拍视角切换。' },
  { name: '木版年画上色', ctr: 46, finish: 81, recommend: '提供用户作品榜单，鼓励分享。' },
  { name: '龙舟鼓点协同', ctr: 35, finish: 72, recommend: '新增团队配速对比，增加竞赛感。' },
  { name: '藏戏面具工坊', ctr: 33, finish: 65, recommend: '补充面具背面纹理细节与语音讲解。' },
  { name: '黎锦纹样学习', ctr: 29, finish: 70, recommend: '上线图案自由拼贴，生成个性化织锦。' },
  { name: '茶道礼仪演示', ctr: 31, finish: 67, recommend: '提供手势校准教程，降低上手门槛。' },
  { name: '木鼓舞体验', ctr: 28, finish: 62, recommend: '加入节奏小游戏，提升留存。' }
]);

const learningProgress = reactive([
  { id: 1, user: '李然', project: '苗绣针法', time: 32, steps: 6, totalSteps: 8, satisfaction: 92, feedback: '希望增加针脚放大镜功能。' },
  { id: 2, user: '王越', project: '鼓楼夜话', time: 24, steps: 5, totalSteps: 7, satisfaction: 88, feedback: '夜景音效很真实，想要离线包。' },
  { id: 3, user: '张悦', project: '木版年画', time: 28, steps: 7, totalSteps: 9, satisfaction: 90, feedback: '建议增加多色调板快速选择。' },
  { id: 4, user: '陈晨', project: '龙舟鼓点', time: 30, steps: 6, totalSteps: 8, satisfaction: 85, feedback: '可以提供节奏评分榜单。' },
  { id: 5, user: '赵琪', project: '藏戏面具', time: 21, steps: 5, totalSteps: 7, satisfaction: 84, feedback: '希望能查看面具背部纹饰。' },
  { id: 6, user: '刘璐', project: '黎锦纹样', time: 26, steps: 6, totalSteps: 8, satisfaction: 89, feedback: '想导出自己设计的纹样。' },
  { id: 7, user: '黄冉', project: '茶道礼仪', time: 18, steps: 4, totalSteps: 6, satisfaction: 83, feedback: '语音讲解可以再慢一点。' },
  { id: 8, user: '吴婷', project: '木鼓舞体验', time: 22, steps: 5, totalSteps: 7, satisfaction: 87, feedback: '加入多人模式排练更好。' },
  { id: 9, user: '周帆', project: '侗寨鼓楼', time: 27, steps: 6, totalSteps: 8, satisfaction: 86, feedback: '导航点可以显示方言地名。' },
  { id: 10, user: '唐亮', project: '茶道礼仪', time: 20, steps: 4, totalSteps: 6, satisfaction: 82, feedback: '希望能录制自己的操作。' },
  { id: 11, user: '余静', project: '苗绣针法', time: 31, steps: 7, totalSteps: 8, satisfaction: 91, feedback: '针法细节需要慢放按钮。' },
  { id: 12, user: '郑雪', project: '木版年画', time: 25, steps: 6, totalSteps: 9, satisfaction: 88, feedback: '提供素材包下载会更方便。' },
  { id: 13, user: '罗明', project: '鼓楼夜话', time: 23, steps: 5, totalSteps: 7, satisfaction: 85, feedback: '想和朋友一起观看。' },
  { id: 14, user: '范晨', project: '龙舟鼓点', time: 29, steps: 6, totalSteps: 8, satisfaction: 86, feedback: '鼓点需要可视化节奏指导。' },
  { id: 15, user: '陈墨', project: '木鼓舞体验', time: 19, steps: 4, totalSteps: 7, satisfaction: 80, feedback: '希望加入服饰互动。' },
  { id: 16, user: '雷佳', project: '黎锦纹样', time: 27, steps: 6, totalSteps: 8, satisfaction: 89, feedback: '增加图案打印接口。' },
  { id: 17, user: '姚泽', project: '藏戏面具', time: 22, steps: 5, totalSteps: 7, satisfaction: 83, feedback: '语音可以切换藏语。' },
  { id: 18, user: '李晴', project: '苗绣针法', time: 33, steps: 7, totalSteps: 8, satisfaction: 93, feedback: '章节导航很清晰，期待更多针法。' },
  { id: 19, user: '唐娟', project: '龙舟鼓点', time: 24, steps: 5, totalSteps: 8, satisfaction: 84, feedback: '建议添加动作慢放。' },
  { id: 20, user: '卢瑶', project: '鼓楼夜话', time: 26, steps: 5, totalSteps: 7, satisfaction: 88, feedback: '夜景光影很棒，想自定义灯光。' }
]);

const modal = reactive({ type: '', title: '', message: '', progress: 0 });
const form = reactive({ name: '', dimension: '', desc: '' });

const openForm = (title) => {
  modal.type = 'form';
  modal.title = title;
};

const openProgress = (title, start) => {
  modal.type = 'progress';
  modal.title = title;
  modal.progress = start;
  const timer = setInterval(() => {
    modal.progress = Math.min(100, modal.progress + 10);
    if (modal.progress >= 100) clearInterval(timer);
  }, 360);
};

const openInfo = (title, message) => {
  modal.type = 'info';
  modal.title = title;
  modal.message = message;
};

const submitForm = () => {
  closeModal();
  openInfo('指标已保存', `已记录 ${form.name || '新指标'}，将在仪表盘中生成。`);
};

const closeModal = () => {
  modal.type = '';
  modal.title = '';
  modal.message = '';
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  align-items: end;
  gap: 10px;
  height: 260px;
  padding: 10px 0;
}

.bar {
  background: linear-gradient(180deg, rgba(79, 157, 255, 0.9), rgba(123, 216, 255, 0.8));
  border-radius: 12px 12px 6px 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 60px;
  box-shadow: 0 10px 24px rgba(79, 157, 255, 0.18);
  color: #0f1c3f;
}

.bar-value {
  font-weight: 800;
  padding: 6px;
}

.bar-label {
  text-align: center;
  padding: 6px;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
}

.ghost {
  background: #f1f5ff;
  color: #1f2a44;
  border: 1px solid var(--border);
}

.accent {
  background: linear-gradient(120deg, #ffb347, #ffd966);
  color: #5c3100;
}
</style>
