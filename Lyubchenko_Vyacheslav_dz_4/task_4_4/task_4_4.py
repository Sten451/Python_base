"""
4. Написать свой модуль utils и перенести в него функцию currency_rates() из предыдущего задания.
Создать скрипт, в котором импортировать этот модуль и выполнить несколько вызовов функции
currency_rates(). Убедиться, что ничего лишнего не происходит."""


import utils

# USD
resultat = utils.currency_rates("USD")
# Функция возвращает кортеж из курса и объекта date, далее переводим в список и обращаемся по индексу
resultat = list(resultat)
print("Дата:", resultat[1])
if resultat[0] is not None:
    print("Курс", "USD", resultat[0])
else:
    print("Тикер не найден")

# PLN
resultat = utils.currency_rates("PLN")
# Функция возвращает кортеж из курса и объекта date, далее переводим в список и обращаемся по индексу
resultat = list(resultat)
print("Дата:", resultat[1])
if resultat[0] is not None:
    print("Курс", "PLN", resultat[0])
else:
    print("Тикер не найден")