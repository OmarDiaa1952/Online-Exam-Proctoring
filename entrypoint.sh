#!/bin/sh

# command to run server in production
gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --timeout 120