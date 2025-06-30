include .env

start-local-db:
	docker compose up -d

stop-local-db:
	docker compose down