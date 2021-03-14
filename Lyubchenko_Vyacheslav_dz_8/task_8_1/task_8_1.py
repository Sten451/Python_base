"""
1. Написать функцию email_parse(<email_address>), которая при помощи регулярного выражения
извлекает имя пользователя и почтовый домен из email адреса и возвращает их в виде словаря.
Если адрес не валиден, выбросить исключение ValueError. Пример:
>>> email_parse('someone@geekbrains.ru')
{'username': 'someone', 'domain': 'geekbrains.ru'}
>>> email_parse('someone@geekbrainsru')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  ...
    raise ValueError(msg)
ValueError: wrong email: someone@geekbrainsru
Уточнение
Текст до собаки (Local-part): латинские буквы, цифры и символы: ' . _ + -
Текст после собаки (Domain part): латинские буквы, цифры и символы . -
В Domain part обязательно должна быть хотя бы одна точка.
Примечание: подумайте о возможных ошибках в адресе и постарайтесь учесть
их в регулярном выражении; имеет ли смысл в данном случае использовать функцию re.compile()?
"""
import re


def email_parse(email_address, re_date_t):
    # Сначал никак не мог понять, шаблон не идентичен, а все нормально; заменил MATCH
    try:
        # Придется сначала проверить на валидность, а уже потом
        assert re_date_t.fullmatch(email_address)
        # ХЗ что такое ?P, но работает
        z = re.match(r"(?P<username>[a-zA-Z0-9\'\+\_\.]+)\@(?P<domain>[a-zA-Z0-9\.\_\-]+\.[a-zA-Z]{2,6})", email_address)
        z = z.groupdict()
        print(z)
    except AssertionError:
        print("Данный E-mail содержит ошибку в синтаксисе: ", email_address)


# Это мне напоминает слова из песни я его слепила из того что было, а потом, что было то и полюбила
# ХЗ вроде работает, но и без слешей символов тоже работает...
RE_DATE = re.compile(r"([a-zA-Z0-9\'\+\_\.]+)\@{1}([a-zA-Z0-9\.\_\-]+\.[a-zA-Z]{2,6})")
file = open('email.txt', 'r', encoding='utf-8')

for line in file:
    line = line.replace("\n", "")
    email_parse(line, RE_DATE)

file.close()








