# Generated by Django 4.2.1 on 2023-07-02 01:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Donation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(verbose_name='Дата')),
                ('telegram_url', models.CharField(max_length=255, verbose_name='Ссылка на Telegram')),
                ('sum', models.FloatField(verbose_name='Сумма')),
            ],
            options={
                'verbose_name': 'Пожертвование',
                'verbose_name_plural': 'Пожертвования',
                'db_table': 'donation',
            },
        ),
    ]
