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


if __name__ == '__main__':
   print('Модуль запущен самостоятельно')