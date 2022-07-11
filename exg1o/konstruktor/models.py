from django.db import models
from django.db.models import Max, F

# Create your models here.
class TelegramBotModel(models.Model):
	id = models.BigIntegerField(primary_key=True)
	owner = models.CharField(max_length=256)
	name = models.CharField(max_length=256)
	token = models.CharField(max_length=256)
	online = models.BooleanField(default=False)

	class Meta:
		verbose_name = 'Telegram Bot'
		verbose_name_plural = 'Telegram Bots'

	def save(self, *args, **kwargs):
		if type(self.id) != int:
			max = TelegramBotModel.objects.aggregate(max=Max(F('id')))['max']
			self.id = max + 1 if max else 1
		super().save(*args, **kwargs)

	def __str__(self):
		return f'ID: {self.id} | Владелец: {self.owner} | Название бота: {self.name} | Запушен ли бот: {self.online}'

class TelegramBotLogModel(models.Model):
	id = models.BigIntegerField(primary_key=True)
	owner = models.CharField(max_length=256)
	bot_id = models.BigIntegerField()
	user_name = models.CharField(max_length=256)
	user_message = models.TextField()

	class Meta:
		verbose_name = 'Telegram Bot Log'
		verbose_name_plural = 'Telegram Bot Logs'

	def save(self, *args, **kwargs):
		if type(self.id) != int:
			max = TelegramBotLogModel.objects.aggregate(max=Max(F('id')))['max']
			self.id = max + 1 if max else 1
		super().save(*args, **kwargs)

	def __str__(self):
		return f'ID: {self.id} | Владелец: {self.owner} | ID бота: {self.id}'

class TelegramBotCommandModel(models.Model):
	id = models.BigIntegerField(primary_key=True)
	owner = models.CharField(max_length=256)
	bot_id = models.BigIntegerField()
	command = models.CharField(max_length=256)
	command_answer = models.TextField()

	class Meta:
		verbose_name = 'Telegram Bot Command'
		verbose_name_plural = 'Telegram Bot Commands'

	def save(self, *args, **kwargs):
		if type(self.id) != int:
			max = TelegramBotCommandModel.objects.aggregate(max=Max(F('id')))['max']
			self.id = max + 1 if max else 1
		super().save(*args, **kwargs)

	def __str__(self):
		return f'ID: {self.id} | Владелец: {self.owner} | ID бота: {self.bot_id} | Команда: {self.command}'