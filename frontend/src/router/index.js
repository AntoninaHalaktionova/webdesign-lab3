import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import AboutView from '../views/AboutView.vue'
import CreateSurveyView from '../views/CreateSurveyView.vue'
import TakeSurveyView from '../views/TakeSurveyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/create-survey',
      name: 'create-survey',
      component: CreateSurveyView
    },
    {
      path: '/survey/:id',
      name: 'take-survey',
      component: TakeSurveyView
    },
    {
      path: '/survey/:id/results',
      name: 'survey-results',
      component: () => import('../views/SurveyResultsView.vue')
    }
  ]
})

export default router
