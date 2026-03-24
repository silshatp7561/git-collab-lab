# Locust Load Testing TODO

## Completed:
- [x] Analyzed project structure, locustfile.py, guide, URLs, views, settings.py
- [x] Confirmed plan with user
- [x] Updated TODO.md with Windows-compatible commands

## In Progress:
1. [x] python manage.py makemigrations && python manage.py migrate
2. [ ] python manage.py createsuperuser (use admin@example.com / admin_password if prompted/needed)
3. [x] python manage.py runserver (port 8000, keep running in background)
4. [ ] locust -f locustfile.py --host=http://localhost:8000 (web UI: 10-50 users)
5. [ ] locust -f locustfile.py --host=http://localhost:8000 --users=50 --spawn-rate=5 --run-time=5m --headless --csv=load_test_results
6. [ ] Analyze CSV results (load_test_results_stats.csv, load_test_results_failures.csv)
7. [x] Created Robot Framework tests/ suite for full E2E (register, login, admin, vote, results)
8. [ ] Run: .venv/Scripts/python.exe -m robot tests/voting_app_tests.robot
7. [ ] python manage.py runserver (stop with Ctrl+C), cleanup test data if needed
