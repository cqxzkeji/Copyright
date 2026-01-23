<template>
  <div class="page">
    <section class="section-card">
      <div class="section-header">
        <div>
          <h2>验收资料与问题整改管控</h2>
          <p>资料版本留痕、问题整改清单与复验闭环</p>
        </div>
        <div class="section-actions">
          <button class="btn ghost" type="button" @click="openModal('upload')">上传资料</button>
          <button class="btn secondary" type="button" @click="openModal('inspect')">发起复验</button>
          <button class="btn primary" type="button" @click="openModal('issue')">新增问题</button>
        </div>
      </div>
      <div class="panel-grid">
        <div class="panel">
          <h4>资料审核进度</h4>
          <div class="progress">
            <div class="progress-bar" style="width: 72%"></div>
          </div>
          <p>已审核 58 / 80 份资料</p>
        </div>
        <div class="panel">
          <h4>整改完成率</h4>
          <div class="progress">
            <div class="progress-bar" style="width: 63%"></div>
          </div>
          <p>整改完成 30 / 48 项</p>
        </div>
        <div class="panel">
          <h4>复验安排</h4>
          <p>今日安排复验 4 项，待确认 2 项。</p>
          <button class="btn ghost" type="button" @click="openModal('schedule')">查看安排</button>
        </div>
      </div>
      <img class="chart" src="../assets/overview.svg" alt="整改趋势图" />
    </section>

    <section class="section-card">
      <table class="table">
        <thead>
          <tr>
            <th>问题编号</th>
            <th>专业</th>
            <th>问题描述</th>
            <th>责任单位</th>
            <th>整改状态</th>
            <th>复验时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in issueRows" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.domain }}</td>
            <td>{{ item.desc }}</td>
            <td>{{ item.owner }}</td>
            <td><span class="tag">{{ item.status }}</span></td>
            <td>{{ item.review }}</td>
            <td>
              <button class="btn ghost" type="button" @click="openModal('detail', item)">详情</button>
              <button class="btn secondary" type="button" @click="openModal('close', item)">销项</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal :open="modal.open" :title="modal.title" :subtitle="modal.subtitle" @close="closeModal">
      <template v-if="modal.type === 'upload'">
        <div class="form-grid">
          <label class="field">
            <span>资料类型</span>
            <select class="select">
              <option>检测报告</option>
              <option>合格证</option>
              <option>图纸</option>
              <option>设备清单</option>
            </select>
          </label>
          <label class="field">
            <span>版本号</span>
            <input class="input" placeholder="如 V2.1" />
          </label>
        </div>
        <label class="field">
          <span>说明</span>
          <textarea class="textarea" rows="3" placeholder="填写资料说明"></textarea>
        </label>
      </template>
      <template v-else-if="modal.type === 'issue'">
        <label class="field">
          <span>问题描述</span>
          <textarea class="textarea" rows="4" placeholder="填写验收发现的问题"></textarea>
        </label>
        <div class="form-grid">
          <label class="field">
            <span>责任单位</span>
            <input class="input" placeholder="选择责任单位" />
          </label>
          <label class="field">
            <span>整改期限</span>
            <input class="input" type="date" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'inspect'">
        <p>复验申请已准备就绪，请选择验收组成员。</p>
        <div class="form-grid">
          <label class="field">
            <span>复验人员</span>
            <input class="input" placeholder="输入复验负责人" />
          </label>
          <label class="field">
            <span>复验时间</span>
            <input class="input" type="date" />
          </label>
        </div>
      </template>
      <template v-else-if="modal.type === 'schedule'">
        <p>今日复验安排如下：</p>
        <ul class="modal-list">
          <li>住宅 A1 楼梯间防火封堵复验</li>
          <li>商业 B1 空调系统调试复验</li>
          <li>公区 A2 水磨石观感复验</li>
          <li>机电 B2 配电房设备复验</li>
        </ul>
      </template>
      <template v-else-if="modal.type === 'detail'">
        <p><strong>问题编号：</strong>{{ modal.payload?.code }}</p>
        <p><strong>整改措施：</strong>{{ modal.payload?.action }}</p>
        <div class="progress">
          <div class="progress-bar" style="width: 58%"></div>
        </div>
      </template>
      <template v-else-if="modal.type === 'close'">
        <p>确认销项 {{ modal.payload?.code }}？</p>
        <label class="field">
          <span>复验结论</span>
          <select class="select">
            <option>通过</option>
            <option>需继续整改</option>
          </select>
        </label>
      </template>
      <template #footer>
        <button class="btn ghost" type="button" @click="closeModal">取消</button>
        <button class="btn primary" type="button" @click="closeModal">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import BaseModal from "../components/BaseModal.vue";

const issueRows = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  return {
    code: `ISSUE-${number.toString().padStart(3, "0")}`,
    domain: ["住宅", "公区", "商业", "机电", "消防"][index % 5],
    desc: "现场发现施工细部需整改",
    owner: ["施工总包", "机电分包", "装饰单位", "消防分包"][index % 4],
    status: ["整改中", "待复验", "已整改", "已销项"][index % 4],
    review: `2024-11-${(number % 28) + 1}`,
    action: "已制定整改方案并安排复验"
  };
});

const modal = reactive({
  open: false,
  type: "",
  title: "",
  subtitle: "",
  payload: null
});

const openModal = (type, payload = null) => {
  const titles = {
    upload: "资料上传",
    issue: "新增整改问题",
    inspect: "发起复验",
    schedule: "复验安排",
    detail: "问题详情",
    close: "问题销项确认"
  };
  const subtitles = {
    upload: "弹窗表单",
    issue: "弹窗表单",
    inspect: "弹窗表单",
    schedule: "提示信息弹窗",
    detail: "进度条弹窗显示",
    close: "提示信息弹窗"
  };
  modal.open = true;
  modal.type = type;
  modal.title = titles[type];
  modal.subtitle = subtitles[type];
  modal.payload = payload;
};

const closeModal = () => {
  modal.open = false;
};
</script>

<style scoped>
.page {
  display: grid;
  gap: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.section-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.panel {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 10px;
}

.chart {
  width: 100%;
  border-radius: 16px;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
}
</style>
