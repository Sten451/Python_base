"""
2. Написать функцию currency_rates(), принимающую в качестве аргумента код валюты (USD, EUR, ...)
и возвращающую курс этой валюты по отношению к рублю. Использовать библиотеку requests.
В качестве API можно использовать http://www.cbr.ru/scripts/XML_daily.asp.
Рекомендация: выполнить предварительно запрос к API в обычном браузере, посмотреть содержимое
ответа. Можно ли, используя только методы класса str, решить поставленную задачу?
Функция должна возвращать результат числового типа, например float.
Подумайте: есть ли смысл для работы с денежными величинами использовать вместо float тип Decimal?
Сильно ли усложняется код функции при этом?
Если в качестве аргумента передали код валюты, которого нет в ответе, вернуть None.
Можно ли сделать работу функции не зависящей от того, в каком регистре был передан аргумент?
В качестве примера выведите курсы доллара и евро.

3. * (вместо 2) Доработать функцию currency_rates(): теперь она должна возвращать кроме курса дату,
которая передаётся в ответе сервера. Дата должна быть в виде объекта date.
Подумайте, как извлечь дату из ответа, какой тип данных лучше использовать в ответе функции?
"""
import requests
from decimal import *
from datetime import datetime, date


def currency_rates(currency_temp):
    response = requests.get('http://www.cbr.ru/scripts/XML_daily.asp')
    while response.status_code != 200:
        # Надеюсь не забанят
        response = requests.get('http://www.cbr.ru/scripts/XML_daily.asp', timeout=0.001)
    print("Сайт доступен, данные получены")
    answer = response.text

    # Находим дату
    date_begin = answer.find("Date")
    date_end = answer.find('"', date_begin + 7)
    date_value = answer[date_begin + 6: date_end]
    date_value = date_value.split(".")
    date_value = date_value[::-1]
    year, month, day = date_value
    date_curs = date(int(year), int(month), int(day))
    # Находим тикер
    currency_index = answer.find(currency_temp)
    if currency_index == -1:
        return None, date_curs
    else:
        currency_value_begin = answer.find("<Value>", currency_index)
        currency_value_end = answer.find("</Value>", currency_index)
        currency_value = answer[currency_value_begin + 7: currency_value_end]
        return currency_value, date_curs

currency = input("Введите тикер валюты")
# Переводим в верхний регистр т.к. на сайте все тикеры в заглавном формате
resultat = currency_rates(currency.upper())
# Функция возвращает кортеж из курса и объекта date, далее переводим в список и обращаемся по индексу
resultat = list(resultat)
print("Дата:", resultat[1])
if resultat[0] is not None:
    # не понятно надо ли это в данном случае, мы ведь ничего не вычисляем
    #getcontext().prec = 6
    resultat[0] = resultat[0].replace(',', '.')
    resultat[0] = float(resultat[0])
    resultat[0] = Decimal(resultat[0]).quantize(Decimal('.01'), rounding=ROUND_DOWN)
    print("Курс", currency, resultat[0])
else:
    print("Тикер не найден")

