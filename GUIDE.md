## Як запустити

### 1. Встановлення залежностей

Виконайте команду в обох папках:

```bash
# У папці backend
cd backend
npm install

# У папці frontend
cd ../frontend
npm install
```

### 2. Запуск бекенду

Бекенд використовує SQLite, тому база даних буде створена автоматично при першому запуску.

```bash
cd backend
npm run dev
```
Сервер запуститься на `http://localhost:3000`.
### 3. Запуск фронтенду

```bash
cd frontend
npm run dev
```
Фронтенд буде доступний за адресою, вказаною у консолі (зазвичай `http://localhost:5173`).
