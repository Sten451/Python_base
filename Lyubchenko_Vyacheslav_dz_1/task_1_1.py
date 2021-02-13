# 1. Реализовать вывод информации о промежутке времени в зависимости от его продолжительности duration в секундах.
# Формат вывода результата:
# до минуты: <s> сек;
# до часа: <m> мин <s> сек;
# до суток: <h> час <m> мин <s> сек;
# в остальных случаях: <d> дн <h> час <m> мин <s> сек.

duration = (input("Введите значение в секундах"))
while not duration.isdigit():
    duration = input("Вы ввели не число или число с отрицательным значением. Попробуйте еще раз")

duration = int(duration)
second = duration - ((duration // 60) * 60)
minute = (duration - ((duration // 3600) * 3600)) // 60
hour = (duration - (duration // 86400) * 86400) // 3600
day = duration // 86400

if int(duration) < 60:
    print(second, "сек")
elif duration < 3600:
    print(minute, "мин", second, "сек")
elif duration < 86400:
    print(hour, "час", minute, "мин", second, "сек")
else:
    print(day, "дн", hour, "час", minute, "мин", second, "сек")