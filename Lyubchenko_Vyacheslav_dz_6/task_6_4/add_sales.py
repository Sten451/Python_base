# Скрипт записи
from sys import argv


def verify(argv_temp):
    if len(argv_temp) == 1:
        error = "Ошибка. Не передано значение для записи"
        return error
    elif len(argv_temp) > 2:
        error = "Ошибка. Передано много значений для записи"
        return error
    # Вот здесь будет проблема только целые числа будет пропускать.
    elif not argv_temp[1].isdigit() or int(argv_temp[1]) == 0:
        error = "Ошибка. Значение для записи не цифры или меньше нуля"
        return error
    else:
        return int(argv_temp[1])


resultat = verify(argv)
if isinstance(resultat, int):
    #resultat = round(resultat, 2)
    with open('bakery.csv', 'a', encoding='utf-8') as f:
        f.write(str(resultat) + "\n")
    print("Значение успешно записано в файл")
else:
    print(resultat)
