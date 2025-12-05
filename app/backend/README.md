# Backend (FastAPI) для SKPDI Dashboard

Эта папка содержит минимальный FastAPI-сервер, реализующий mock-эндпойнты, описанные в `docs/frontend-spec.md`.

Как запустить локально (в dev):


1) Установите зависимости (рекомендуется в venv):

```
python -m venv .venv
source .venv/bin/activate
pip install -r ../../requirements.txt
```

2) Перед запуском задайте переменную окружения `DB_DSN` (пример):

```
export DB_DSN="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
```

3) Запустить uvicorn:

```
uvicorn app.backend.main:app --reload --host 0.0.0.0 --port 8000
```

3) Доступные эндпойнты (пример):
- `GET /api/dashboard/monthly/summary?month=2025-05`
- `GET /api/dashboard/monthly/daily-revenue?month=2025-05`
- `GET /api/dashboard/monthly/by-smeta?month=2025-05`
- `GET /api/dashboard/monthly/smeta-details?month=2025-05&smeta_key=leto`
- `GET /api/dashboard/monthly/smeta-description-daily?month=2025-05&smeta_key=leto&description_id=abc123def456`
- `GET /api/dashboard/daily?date=2025-05-01`

### О description_id

Для избежания длинных URL с кириллицей в качестве параметра, API использует `description_id`:
- Это короткий 12-символьный хэш (SHA256), генерируемый из строки description
- `description_id` возвращается в ответах `/smeta-details` и `/smeta-details-with-types`
- Фронтенд использует `description_id` для запросов к `/smeta-description-daily`

Замена mock-данных на реальные запросы к Postgres:
- Используйте `DB_DSN` из переменных окружения (amvera.yml задаёт `DB_DSN`).
- Реализуйте SQL-агрегации согласно `docs/бизнес логика дашборда.md`.
