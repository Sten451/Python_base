# Скрипт вывода информации

from sys import argv
from os import path

def verify(argv_temp):

    if len(argv_temp) == 1:
        return "Show"
    elif len(argv_temp) == 2:
        if not argv_temp[1].isdigit() or int(argv_temp[1]) == 0:
            print("Вы передали некорректное значение")
        else:
            return "Show_1", argv_temp[1]
    elif len(argv_temp) == 3:
        if not argv_temp[1].isdigit() or not argv_temp[2].isdigit() or int(argv_temp[1]) == 0 or int(argv_temp[1]) >= int(argv_temp[2]):
            print("Вы передали некорректные значения")
        else:
            return "Show_2", argv_temp[1], argv_temp[2]
    return "error"

resultat = verify(argv)
if resultat == "error":
    print("проверьте передаваемые данные")

if resultat == "Show":
    if path.exists("bakery.csv"):
        file_1 = open('bakery.csv', 'r', encoding='utf-8')
        print(file_1.read())
        file_1.close()
    else:
        print("Файл не существует, записей пока нет.")
# передача одного значения
if resultat[0] == "Show_1":
    if path.exists("bakery.csv"):
        print("Вывожу записи с номера", resultat[1])
        file_1 = open("bakery.csv", 'r')
        for i, line in enumerate(file_1):
            line = line.replace("\n", "")
            if i >= int(resultat[1]) - 1:
                print(line)
        file_1.close()
    else:
        print("Файл не существует, записей пока нет.")
# передача двух значений
if resultat[0] == "Show_2":
    if path.exists("bakery.csv"):
        print("Вывожу записи с номера", resultat[1], "по номер", resultat[2])
        file_1 = open("bakery.csv", 'r')
        for i, line in enumerate(file_1):
            line = line.replace("\n", "")
            if int(resultat[1]) - 1 <= i <= int(resultat[2]) - 1:
                print(line)
        file_1.close()
    else:
        print("Файл не существует, записей пока нет.")