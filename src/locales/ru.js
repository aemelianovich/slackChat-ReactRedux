export default {
  translation: {
    navBar: {
      title: 'Hexlet Chat',
      exit: 'Выйти',
    },
    channels: {
      title: 'Каналы',
      prefix: '#',
    },
    login: {
      enter: 'Войти',
      username: 'Ваш ник',
      password: 'Пароль',
      noUsername: 'Нет аккаунта?',
      registration: 'Регистрация',
    },
    signUp: {
      requiredField: 'Обязательное поле',
      usernameLength: 'От 3 до 20 символов!',
      passwordLength: 'Не менее 6 символов!',
      identicalPassword: 'Пароли должны совпадать',
      title: 'Регистрация',
      username: 'Имя Пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      register: 'Зарегистрироваться',
    },
    messages: {
      newMessage: 'Введите сообщение...',
      messageCount: (count) => {
        // eslint-disable-next-line functional/no-let
        let msg = null;

        const lastDigit = (cnt) => {
          const lastTwo = cnt % 100;
          if (lastTwo >= 11 && lastTwo <= 14) {
            return 0;
          }

          return (cnt % 10);
        };

        switch (lastDigit(count)) {
          case 0:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
            msg = 'сообщений';
            break;
          case 1:
            msg = 'сообщение';
            break;
          case 2:
          case 3:
          case 4:
            msg = 'сообщения';
            break;
          default:
            throw new Error(`Can't define message for the ${lastDigit}`);
        }

        return `${count} ${msg}`;
      },
    },
    errors: {
      password: 'Неверное имя пользователя или пароль',
      generic: 'Свяжитесь с администратором',
      existingUser: 'Такой пользователь уже существует',
      sendError: 'Ошибка при отправке сообщения. Попробуйте снова или свяжитесь с администратором.',
    },
    noMatch: {
      title: '404 Error Code',
    },
  },
};
