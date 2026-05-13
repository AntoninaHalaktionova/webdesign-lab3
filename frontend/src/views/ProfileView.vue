<template>
  <div class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
          <div>
              <h2 class="mt-2 text-3xl font-extrabold text-gray-900">Ваш профіль</h2>
              <p class="mt-2 text-sm text-gray-600">Керуйте своїми особистими даними.</p>
          </div>
          
          <div v-if="loading" class="text-gray-500">Завантаження...</div>
          <div v-else>
              <form class="space-y-6" @submit.prevent="handleUpdate">
                  <div v-if="error" class="bg-red-50 text-red-500 p-3 rounded text-sm">{{ error }}</div>
                  <div v-if="successMsg" class="bg-green-50 text-green-600 p-3 rounded text-sm">{{ successMsg }}</div>
                  
                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                          <label for="name" class="block text-sm font-medium text-gray-700">Ім'я</label>
                          <input type="text" id="name" v-model="profile.name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                      </div>
                      <div>
                          <label for="email" class="block text-sm font-medium text-gray-700">Електронна пошта</label>
                          <input type="email" id="email" v-model="profile.email" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                      </div>
                      <div>
                          <label for="gender" class="block text-sm font-medium text-gray-700">Стать</label>
                          <select id="gender" v-model="profile.gender" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border bg-white">
                              <option value="male">Чоловік</option>
                              <option value="female">Жінка</option>
                              <option value="other">Інше</option>
                              <option value="prefer-not">Не хочу вказувати</option>
                          </select>
                      </div>
                      <div>
                          <label for="dob" class="block text-sm font-medium text-gray-700">Дата народження</label>
                          <input type="date" id="dob" v-model="profile.dob" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                      </div>
                      <div class="sm:col-span-2">
                          <label for="password" class="block text-sm font-medium text-gray-700">Новий пароль (залиште порожнім, щоб не змінювати)</label>
                          <input type="password" id="password" v-model="profile.password" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                      </div>
                  </div>
                  <div class="flex justify-end">
                      <button type="submit" :disabled="saving" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                          {{ saving ? 'Збереження...' : 'Зберегти зміни' }}
                      </button>
                  </div>
              </form>

              <div class="mt-12 border-t border-gray-200 pt-8">
                  <h3 class="text-xl font-bold text-gray-900 mb-4">Мої опитування</h3>
                  <div v-if="loadingSurveys" class="text-sm text-gray-500">Завантаження опитувань...</div>
                  <div v-else-if="userSurveys.length === 0" class="text-sm text-gray-500">
                      Ви ще не створили жодного опитування.
                  </div>
                  <ul v-else class="divide-y divide-gray-200 border border-gray-200 rounded-md bg-white">
                      <li v-for="survey in userSurveys" :key="survey.id" class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div>
                              <p class="font-medium text-gray-900">{{ survey.title }}</p>
                              <p class="text-sm text-gray-500 truncate max-w-md">{{ survey.description }}</p>
                          </div>
                          <router-link :to="`/survey/${survey.id}/results`" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-md">Результати</router-link>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProfile, updateProfile, getSurveysByUser, getUser } from '../services/api'

export default {
    setup() {
        const profile = ref({ name: '', email: '', password: '', gender: '', dob: '' })
        const userSurveys = ref([])
        const loading = ref(true)
        const loadingSurveys = ref(true)
        const saving = ref(false)
        const error = ref('')
        const successMsg = ref('')
        const router = useRouter()

        onMounted(async () => {
            try {
                const data = await getProfile()
                profile.value.name = data.name
                profile.value.email = data.email
                profile.value.gender = data.gender || ''
                profile.value.dob = data.dob || ''
            } catch (e) {
                error.value = 'Не вдалося завантажити профіль. Будь ласка, увійдіть знову.'
                setTimeout(() => router.push('/login'), 2000)
            } finally {
                loading.value = false
            }

            try {
                const user = getUser()
                if (user) {
                    userSurveys.value = await getSurveysByUser(user.id)
                }
            } catch (e) {
                console.error("Failed to load user surveys", e)
            } finally {
                loadingSurveys.value = false
            }
        })

        const handleUpdate = async () => {
            saving.value = true
            error.value = ''
            successMsg.value = ''
            try {
                await updateProfile({
                    name: profile.value.name,
                    email: profile.value.email,
                    password: profile.value.password,
                    gender: profile.value.gender,
                    dob: profile.value.dob
                })
                successMsg.value = 'Профіль успішно оновлено.'
            } catch (e) {
                error.value = e.message
            } finally {
                saving.value = false
            }
        }

        return { profile, userSurveys, loading, loadingSurveys, saving, error, successMsg, handleUpdate }
    }
}
</script>
