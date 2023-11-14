#!/bin/bash
python -m venv ccccc
source ccccc/bin/activate
pip install -U pip
pip install -r requirements.txt
SECRET_KEY=$(python scripts/generate_django_secret_key.py)
TELEGRAM_BOT_USERNAME=TechnorideConstructorDev_bot
TELEGRAM_BOT_TOKEN=6838202161:AAGAY7HCSH4gikwZGf0czEZFulbQYzNZHjo
cd constructor_telegram_bots
cat << EOF > .env
SECRET_KEY='$SECRET_KEY'
DEBUG=True
DEBUG_ENVIRONMENT=True
TELEGRAM_BOT_USERNAME=$TELEGRAM_BOT_USERNAME
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
POSTGRESQL_DATABASE_NAME=bigdan
POSTGRESQL_DATABASE_USER=constructor_user
POSTGRESQL_DATABASE_PASSWORD=pass
EOF
python manage.py compilemessages
python manage.py migrate

