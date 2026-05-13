<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
              <div class="flex-shrink-0 flex items-center">
                  <router-link to="/" class="text-xl font-bold text-indigo-600">SurveyApp</router-link>
              </div>
              <div class="flex items-center md:hidden">
                  <button @click="mobileMenuOpen = !mobileMenuOpen" type="button" class="text-gray-500 hover:text-gray-600 focus:outline-none">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                  </button>
              </div>
              <nav class="hidden md:flex space-x-8 items-center">
                  <router-link to="/" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="text-indigo-600 bg-indigo-50">Головна</router-link>
                  <router-link to="/about" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="text-indigo-600 bg-indigo-50">Про нас</router-link>
                  
                  <template v-if="isLoggedIn">
                      <router-link to="/create-survey" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="text-indigo-600 bg-indigo-50">Створити опитування</router-link>
                      <router-link to="/profile" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="text-indigo-600 bg-indigo-50">Профіль</router-link>
                      <button @click="logout" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Вийти</button>
                  </template>
                  <template v-else>
                      <router-link to="/login" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="text-indigo-600 bg-indigo-50">Увійти</router-link>
                      <router-link to="/register" class="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 shadow-sm">Реєстрація</router-link>
                  </template>
              </nav>
          </div>
      </div>
      <div v-show="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <router-link to="/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors" active-class="text-indigo-600 bg-indigo-50">Головна</router-link>
              <router-link to="/about" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors" active-class="text-indigo-600 bg-indigo-50">Про нас</router-link>
              
              <template v-if="isLoggedIn">
                  <router-link to="/create-survey" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors" active-class="text-indigo-600 bg-indigo-50">Створити опитування</router-link>
                  <router-link to="/profile" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors" active-class="text-indigo-600 bg-indigo-50">Профіль</router-link>
                  <button @click="logout" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors">Вийти</button>
              </template>
              <template v-else>
                  <router-link to="/login" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors" active-class="text-indigo-600 bg-indigo-50">Увійти</router-link>
                  <router-link to="/register" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors" active-class="text-indigo-600 bg-indigo-50">Реєстрація</router-link>
              </template>
          </div>
      </div>
  </header>

  <main class="flex-grow w-full flex flex-col">
      <router-view></router-view>
  </main>

  <footer class="bg-white border-t border-gray-200 py-8 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center">
          <div class="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; 2026 SurveyApp
          </div>
      </div>
  </footer>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logout as apiLogout } from './services/api'

export default {
  setup() {
    const mobileMenuOpen = ref(false)
    const router = useRouter()

    const user = ref(getUser())

    window.addEventListener('storage', () => {
        user.value = getUser()
    });

    const isLoggedIn = computed(() => !!user.value)

    const logout = () => {
      apiLogout()
      user.value = null
      router.push('/')
      window.dispatchEvent(new Event('storage'))
    }

    router.afterEach(() => {
        user.value = getUser()
    })

    return {
      mobileMenuOpen,
      isLoggedIn,
      logout
    }
  }
}
</script>
