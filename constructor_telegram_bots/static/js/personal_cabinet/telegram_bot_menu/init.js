var setIntervalId;

{
	let commandsCountTableLine = document.querySelector('.commands-count');

	var intervalUpdateTelegramBotUsersIsRunning = false;

	function getTelegramBotCommands() {
		let request = new XMLHttpRequest();
		request.open('POST', getTelegramBotCommandsUrl, true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.onreadystatechange = checkRequestResponse(function() {
			if (request.status == 200) {
				let telegramBotCommands = JSON.parse(request.responseText);
				let telegramBotCommandsKeys = Object.keys(telegramBotCommands);

				commandsCountTableLine.innerHTML = telegramBotCommands['commands_count'];

				let telegramBotCommandsDiv = document.querySelector('.telegram-bot-commands');
				telegramBotCommandsDiv.innerHTML = '';

				if (telegramBotCommandsKeys.length > 1) {
					for (let i = 0; i < telegramBotCommandsKeys.length - 1; i++) {
						let wrapper = document.createElement('div');
						wrapper.setAttribute('class', 'list-group-item pb-1');
						wrapper.innerHTML = [
							'<div class="row justify-content-between">',
							'	<div class="col-auto">',
							`		<p class="my-2">${telegramBotCommands[telegramBotCommandsKeys[i]]}</p>`,
							'	</div>',
							'	<div class="col-auto">',
							`		<button class="btn edit-telegram-bot-command-button rounded-0 p-0" id="${telegramBotCommandsKeys[i]}" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Редактировать команду">`,
							'			<i class="bi bi-pencil-square text-secondary" style="font-size: 1.5rem;"></i>',
							'		</button>',
							`		<button class="btn delete-telegram-bot-command-button rounded-0 p-0" id="${telegramBotCommandsKeys[i]}" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Удалить команду">`,
							'			<i class="bi bi-trash text-danger" style="font-size: 1.5rem;"></i>',
							'		</button>',
							'	</div>',
							'</div>',
						].join('');
						telegramBotCommandsDiv.append(wrapper);

						document.querySelector(`.delete-telegram-bot-command-button[id="${telegramBotCommandsKeys[i]}"]`).addEventListener('click', () => askConfirmModal(
							'Удаление команды Telegram бота',
							'Вы точно хотите удалить команду Telegram бота?',
							function() {
								let request = new XMLHttpRequest();
								request.open('POST', `/telegram-bot/${telegramBotId}/command/${telegramBotCommandsKeys[i]}/delete/`, true);
								request.setRequestHeader('Content-Type', 'application/json');
								request.onreadystatechange = checkRequestResponse(function() {
									if (request.status == 200) {
										getTelegramBotCommands();

										myAlert(mainAlertPlaceholder, request.responseText, 'success');
									}
								});
								request.send();
							}
						));
						document.querySelector(`.edit-telegram-bot-command-button[id="${telegramBotCommandsKeys[i]}"]`).addEventListener('click', editTelegramBotCommandButton);
					}
				} else {
					let wrapper = document.createElement('div');
					wrapper.setAttribute('class', 'list-group-item pb-1');
					wrapper.innerHTML = `<p class="text-center my-2">Вы ещё не добавили команды Telegram боту.</p>`;
					telegramBotCommandsDiv.append(wrapper);
				}
			}
			
			getTelegramBotUsers();
			if (telegramBotIsRunning && intervalUpdateTelegramBotUsersIsRunning == false) {
				intervalUpdateTelegramBotUsersIsRunning = true;

				setIntervalId = setInterval(getTelegramBotUsers, 2000);
			}
		});
		request.send();
	}
}

{
	let usersCountTableLine = document.querySelector('.users-count');

	function getTelegramBotUsers() {
		if (document.hidden == false) {
			let request = new XMLHttpRequest();
			request.open('POST', getTelegramBotUsersUrl, true);
			request.setRequestHeader('Content-Type', 'application/json');
			request.onreadystatechange = checkRequestResponse(function() {
				if (request.status == 200) {
					let telegramBotUsers = JSON.parse(request.responseText);
					let telegramBotUsersKeys = Object.keys(telegramBotUsers);

					usersCountTableLine.innerHTML = telegramBotUsers['users_count'];

					let telegramBotUsersDiv = document.querySelector('.telegram-bot-users');
					telegramBotUsersDiv.innerHTML = '';

					if (telegramBotUsersKeys.length > 1) {
						for (let i = 0; i < telegramBotUsersKeys.length - 1; i++) {
							let wrapper = document.createElement('tr');
							wrapper.setAttribute('class', 'text-center');
							wrapper.innerHTML = [
								`<th class="align-middle" scope="row">${i + 1}</th>`,
								`<td class="align-middle">@${telegramBotUsers[telegramBotUsersKeys[i]]['username']}</td>`,
								`<td class="align-middle">${telegramBotUsers[telegramBotUsersKeys[i]]['date_activated']}</td>`,
								'<td class="align-middle">',
								`	<button class="btn ${(telegramBotUsers[telegramBotUsersKeys[i]]['is_allowed']) ? 'add' : 'delete'}-telegram-bot-allowed-user-button telegram-bot-allowed-user-button rounded-0 p-0 ${(telegramBotIsPrivateCheckBox.checked) ? '' : 'd-none'}" id="${telegramBotUsersKeys[i]}" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Дать пользователю доступ к Telegram боту">`,
								`		<i class="bi bi-star${(telegramBotUsers[telegramBotUsersKeys[i]]['is_allowed']) ? '-fill' : ''} text-warning" style="font-size: 1.5rem;"></i>`,
								'	</button>',
								`	<button class="btn delete-telegram-bot-user-button rounded-0 p-0" id="${telegramBotUsersKeys[i]}" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Удалить пользователя">`,
								'		<i class="bi bi-trash text-danger" style="font-size: 1.5rem;"></i>',
								'	</button>',
								'</td>',
							].join('');
							telegramBotUsersDiv.append(wrapper);

							document.querySelector(`.delete-telegram-bot-user-button[id="${telegramBotUsersKeys[i]}"]`).addEventListener('click', () => askConfirmModal(
								'Удаление пользователя Telegram бота',
								'Вы точно хотите удалить пользователя Telegram бота?',
								function() {
									let request = new XMLHttpRequest();
									request.open('POST', `/telegram-bot/${telegramBotId}/user/${telegramBotUsersKeys[i]}/delete/`, true);
									request.setRequestHeader('Content-Type', 'application/json');
									request.onreadystatechange = checkRequestResponse(function() {
										if (request.status == 200) {
											getTelegramBotUsers();

											myAlert(mainAlertPlaceholder, request.responseText, 'success');
										} else {
											myAlert(mainAlertPlaceholder, request.responseText, 'danger');
										}
									});
									request.send();
								}
							));

							if (telegramBotUsers[telegramBotUsersKeys[i]]['is_allowed']) {
								document.querySelector(`.add-telegram-bot-allowed-user-button[id="${telegramBotUsersKeys[i]}"]`).addEventListener('click', function() {
									let request = new XMLHttpRequest();
									request.open('POST', `/telegram-bot/${telegramBotId}/user/${telegramBotUsersKeys[i]}/delete-allowed-user/`, true);
									request.setRequestHeader('Content-Type', 'application/json');
									request.onreadystatechange = checkRequestResponse(function() {
										if (request.status == 200) {
											getTelegramBotUsers();

											myAlert(mainAlertPlaceholder, request.responseText, 'success');
										} else {
											myAlert(mainAlertPlaceholder, request.responseText, 'danger');
										}
									});
									request.send();
								});
							} else {
								document.querySelector(`.delete-telegram-bot-allowed-user-button[id="${telegramBotUsersKeys[i]}"]`).addEventListener('click', function() {
									let request = new XMLHttpRequest();
									request.open('POST', `/telegram-bot/${telegramBotId}/user/${telegramBotUsersKeys[i]}/add-allowed-user/`, true);
									request.setRequestHeader('Content-Type', 'application/json');
									request.onreadystatechange = checkRequestResponse(function() {
										if (request.status == 200) {
											getTelegramBotUsers();

											myAlert(mainAlertPlaceholder, request.responseText, 'success');
										} else {
											myAlert(mainAlertPlaceholder, request.responseText, 'danger');
										}
									});
									request.send();
								});
							}
						}
					} else {
						let wrapper = document.createElement('tr');
						wrapper.innerHTML = '<p class="text-center p-0 ps-1">Вашего Telegram бота ещё никто не активировал.</p>';
						telegramBotUsersDiv.append(wrapper);
					}
				}
			});
			request.send();
		}
	}
}

getTelegramBotCommands();