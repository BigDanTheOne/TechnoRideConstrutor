# Generated by Django 4.2.1 on 2023-07-01 22:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('telegram_bot', '0009_alter_telegrambotcommand_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='telegrambot',
            old_name='_date_added',
            new_name='date_added',
        ),
        migrations.RenameField(
            model_name='telegrambotuser',
            old_name='_date_activated',
            new_name='date_activated',
        ),
    ]
