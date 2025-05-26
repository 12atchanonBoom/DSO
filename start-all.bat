@echo off
title Vispectra Project Starter

start cmd /k "cd python && uvicorn api.fastapi_app:app --reload"
start cmd /k "cd backend && npm run dev"
start cmd /k "cd vispectra && ng serve"
