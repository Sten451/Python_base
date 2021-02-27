"""5. * (вместо 4) Доработать скрипт из предыдущего задания: теперь он должен работать и из консоли. Например:
> python task_4_5.py USD 75.18, 2020-09-05
"""
from sys import argv
import utils

resultat = utils.currency_rates(argv[1].upper())
resultat = list(resultat)
print("Дата:", resultat[1])
if resultat[0] is not None:
    print("Курс", argv[1].upper(), resultat[0])
else:
    print("Тикер не найден")
    print(argv[1])

