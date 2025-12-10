import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/MainLayout.vue';
import FeedFormula from '../views/FeedFormula.vue';
import NutrientAnalysis from '../views/NutrientAnalysis.vue';
import IngredientLibrary from '../views/IngredientLibrary.vue';
import FeedQualityControl from '../views/FeedQualityControl.vue';
import Reports from '../views/Reports.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/feed-formula' },
      { path: '/feed-formula', name: 'FeedFormula', component: FeedFormula },
      { path: '/nutrient-analysis', name: 'NutrientAnalysis', component: NutrientAnalysis },
      { path: '/ingredient-library', name: 'IngredientLibrary', component: IngredientLibrary },
      { path: '/feed-quality-control', name: 'FeedQualityControl', component: FeedQualityControl },
      { path: '/reports', name: 'Reports', component: Reports }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const isAuthenticated = () => localStorage.getItem('lfos-auth') === 'true';

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated()) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isAuthenticated()) {
    next({ name: 'FeedFormula' });
  } else {
    next();
  }
});

export default router;
