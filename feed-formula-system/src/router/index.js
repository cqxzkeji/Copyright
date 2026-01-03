import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Ingredients from '../views/Ingredients.vue';
import Constraints from '../views/Constraints.vue';
import Optimize from '../views/Optimize.vue';
import Evaluate from '../views/Evaluate.vue';
import Publish from '../views/Publish.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/main',
    name: 'main',
    component: Main,
    children: [
      { path: '', redirect: '/main/ingredients' },
      { path: 'ingredients', name: 'ingredients', component: Ingredients },
      { path: 'constraints', name: 'constraints', component: Constraints },
      { path: 'optimize', name: 'optimize', component: Optimize },
      { path: 'evaluate', name: 'evaluate', component: Evaluate },
      { path: 'publish', name: 'publish', component: Publish }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
