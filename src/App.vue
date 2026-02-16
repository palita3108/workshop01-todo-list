<script setup>
import { storeToRefs } from 'pinia'
import { RouterLink , useRoute, useRouter} from 'vue-router'
import { useTodoStore } from './stores/todolist'

const route = useRoute()
const router = useRouter()
const todoStore = useTodoStore()
const { idParam, mode } = storeToRefs(todoStore)

const goHome = () => {
  mode.value = 'viewAll'
  idParam.value = -1
}

</script>

<template>


<div class="navbar bg-base-100 shadow-sm">

  <div class="navbar-end ">
      <RouterLink :to="{ name: 'todo-home'}">
      <a class="font-extrabold text-2xl" @click="goHome()">To Do List</a>
      </RouterLink>
  </div>
</div>

  <div class="max-w-7xl	mx-auto	my-0 p-4">
      <RouterView ></RouterView>
  </div>





</template>

