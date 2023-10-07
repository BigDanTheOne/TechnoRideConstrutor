from ..core import BaseTelegramBot

from aiogram.types import (
	Chat,
	Message,
	CallbackQuery,
	FSInputFile,
	BotCommand,
	ReplyKeyboardMarkup,
	InlineKeyboardMarkup,
)

from ...models import (
	TelegramBot as DjangoTelegramBot,
	TelegramBotCommand as DjangoTelegramBotCommand,
	TelegramBotCommandCommand as DjangoTelegramBotCommandCommand,
)
from .middlewares import (
	CreateDjangoTelegramBotUserMiddleware,
	CheckDjangoTelegramBotUserIsAllowedMiddleware,
	GenerateJinjaVariablesMiddleware,
	SearchDjangoTelegramBotCommandMiddleware,
	MakeDjangoTelegramBotCommandApiRequestMiddleware,
	InsertDjangoTelegramBotCommandDatabaseRecordToDatabaseMiddleware,
	GetDjangoTelegramBotCommandMessageTextMiddleware,
	GetDjangoTelegramBotCommandKeyboardMiddleware,
)

from typing import Optional, Union
import asyncio


class UserTelegramBot(BaseTelegramBot):
	def __init__(self, django_telegram_bot: DjangoTelegramBot) -> None:
		self.django_telegram_bot = django_telegram_bot

		super().__init__(self.django_telegram_bot.api_token)

	async def send_answer(
		self,
		event_chat: Chat,
		message_text: str,
		message_text_mode: Optional[str],
		keyboard: Union[ReplyKeyboardMarkup, InlineKeyboardMarkup, None],
		django_telegram_bot_command: DjangoTelegramBotCommand,
		**kwargs,
	) -> None:
		if django_telegram_bot_command.image:
			await self.bot.send_photo(
				chat_id=event_chat.id,
				photo=FSInputFile(django_telegram_bot_command.image.path),
				caption=message_text,
				parse_mode=message_text_mode,
				reply_markup=keyboard,
			)
		else:
			await self.bot.send_message(
				chat_id=event_chat.id,
				text=message_text,
				parse_mode=message_text_mode,
				reply_markup=keyboard,
			)

	async def message_handler(self, event: Message, **kwargs) -> None:
		await self.send_answer(**kwargs)

	async def callback_query_handler(self, event: CallbackQuery, **kwargs) -> None:
		await event.message.delete()
		await self.send_answer(**kwargs)

	async def setup(self) -> None:
		bot_commands = []

		async for django_telegram_bot_command in self.django_telegram_bot.commands.all():
			django_telegram_bot_command_command: DjangoTelegramBotCommandCommand = await django_telegram_bot_command.aget_command()

			if django_telegram_bot_command_command and django_telegram_bot_command_command.is_show_in_menu:
				bot_commands.append(BotCommand(
					command=django_telegram_bot_command_command.text.replace('/', ''),
					description=django_telegram_bot_command_command.description,
				))

		await self.bot.set_my_commands(bot_commands)

		args = (self.django_telegram_bot,)

		self.dispatcher.update.outer_middleware.register(CreateDjangoTelegramBotUserMiddleware(*args))
		self.dispatcher.update.outer_middleware.register(CheckDjangoTelegramBotUserIsAllowedMiddleware(*args))
		self.dispatcher.update.outer_middleware.register(GenerateJinjaVariablesMiddleware(*args))
		self.dispatcher.update.outer_middleware.register(SearchDjangoTelegramBotCommandMiddleware(*args))
		self.dispatcher.update.outer_middleware.register(MakeDjangoTelegramBotCommandApiRequestMiddleware(*args))
		self.dispatcher.update.outer_middleware.register(InsertDjangoTelegramBotCommandDatabaseRecordToDatabaseMiddleware(*args))
		self.dispatcher.update.outer_middleware.register(GetDjangoTelegramBotCommandMessageTextMiddleware(*args))
		self.dispatcher.update.outer_middleware.register(GetDjangoTelegramBotCommandKeyboardMiddleware(*args))

		self.dispatcher.message.register(self.message_handler)
		self.dispatcher.callback_query.register(self.callback_query_handler)

	async def start(self) -> None:
		self.loop.create_task(self.stop())

		await self.setup()
		await self.dispatcher.start_polling(self.bot, handle_signals=False)

		self.django_telegram_bot.is_stopped = True
		await self.django_telegram_bot.asave()

	async def stop(self) -> None:
		while not self.django_telegram_bot.is_running:
			await self.django_telegram_bot.arefresh_from_db()
			await asyncio.sleep(10)

		self.dispatcher.stop_polling()
