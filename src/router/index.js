import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EditeView from '@/views/EditeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todo-home',
      component: HomeView
    }
    ,
    {
      path: '/todo/:id',
      name: 'todo-item',
      component: HomeView
    },
    {
      path: '/todo/edit/:id',
      name: 'todo-edit',
      component: EditeView
    }
  ]
})

export default router
