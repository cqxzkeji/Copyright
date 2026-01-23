import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Task from '../views/Task.vue'
import Standard from '../views/Standard.vue'
import Inspect from '../views/Inspect.vue'
import Issue from '../views/Issue.vue'
import Report from '../views/Report.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    { path: '/task', name: 'Task', component: Task },
    { path: '/standard', name: 'Standard', component: Standard },
    { path: '/inspect', name: 'Inspect', component: Inspect },
    { path: '/issue', name: 'Issue', component: Issue },
    { path: '/report', name: 'Report', component: Report }
  ]
})

export default router
