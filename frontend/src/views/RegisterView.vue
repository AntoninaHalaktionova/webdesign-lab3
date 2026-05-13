<template>
  <div class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
          <div>
              <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">Створіть акаунт</h2>
          </div>
          <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
              <div v-if="error" class="bg-red-50 text-red-500 p-3 rounded text-sm">{{ error }}</div>
              <div class="rounded-md shadow-sm -space-y-px">
                  <div>
                      <label for="name" class="sr-only">Ім'я</label>
                      <input id="name" v-model="name" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Ваше ім'я">
                  </div>
                  <div>
                      <label for="email" class="sr-only">Електронна пошта</label>
                      <input id="email" v-model="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Електронна пошта">
                  </div>
                  <div>
                      <label for="password" class="sr-only">Пароль</label>
                      <input id="password" v-model="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Пароль">
                  </div>
                  <div>
                      <label for="gender" class="sr-only">Стать</label>
                      <select id="gender" v-model="gender" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white">
                          <option value="" disabled>Оберіть стать</option>
                          <option value="male">Чоловік</option>
                          <option value="female">Жінка</option>
                          <option value="other">Інше</option>
                          <option value="prefer-not">Не хочу вказувати</option>
                      </select>
                  </div>
                  <div>
                      <label for="dob" class="sr-only">Дата народження</label>
                      <input id="dob" v-model="dob" type="date" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                  </div>
              </div>

              <div>
                  <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                      {{ loading ? 'Завантаження...' : 'Зареєструватися' }}
                  </button>
              </div>
          </form>
      </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/api'

export default {
    setup() {
        const name = ref('')
        const email = ref('')
        const password = ref('')
        const gender = ref('')
        const dob = ref('')
        const loading = ref(false)
        const error = ref('')
        const router = useRouter()

        const handleRegister = async () => {
            loading.value = true
            error.value = ''
            try {
                await register(name.value, email.value, password.value, gender.value, dob.value)
                router.push('/')
            } catch (e) {
                error.value = e.message
            } finally {
                loading.value = false
            }
        }

        return { name, email, password, gender, dob, loading, error, handleRegister }
    }
}
</script>
