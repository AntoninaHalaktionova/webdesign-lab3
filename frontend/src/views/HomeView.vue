<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col items-center justify-center">
    <div class="text-center max-w-3xl mb-12">
        <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
            Ласкаво просимо до <span class="text-indigo-600">SurveyApp</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl mb-8">
            Ваша надійна платформа для створення, керування та аналізу опитувань.
        </p>
    </div>

    <div v-if="loading" class="text-gray-500">Завантаження опитувань...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="survey in surveys" :key="survey.id" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ survey.title }}</h3>
            <p class="text-gray-500 text-sm mb-4">{{ survey.description }}</p>
            <router-link :to="`/survey/${survey.id}`" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Пройти опитування &rarr;</router-link>
        </div>
        <div v-if="surveys.length === 0" class="col-span-full text-center text-gray-500">
            Наразі немає доступних опитувань.
        </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getSurveys } from '../services/api'

export default {
    setup() {
        const surveys = ref([])
        const loading = ref(true)
        const error = ref('')

        onMounted(async () => {
            try {
                surveys.value = await getSurveys()
            } catch (e) {
                error.value = 'Не вдалося завантажити опитування'
            } finally {
                loading.value = false
            }
        })

        return { surveys, loading, error }
    }
}
</script>
