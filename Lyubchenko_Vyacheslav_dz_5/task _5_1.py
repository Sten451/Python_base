"""
1. Написать генератор нечётных чисел от 1 до n (включительно), без использования ключевого слова
yield, полностью истощить генератор. Например:
gen1 = iterator_without_yield(11)
next(gen1)
1
next(gen1)
3
next(gen1)
5
next(gen1)
7
next(gen1)
9
next(gen1)
11
next(gen1)
Traceback (most recent call last):
  File "<input>", line 1, in <module>
StopIteration
Усложнение(*):
Без использования ключевого слова yield: генератор нечётных чисел от 1 до n (включительно), для чисел, квадрат которых
меньше 200.
"""
n = input("Введите число от 1 до ...")
while not n.isdigit() or int(n) < 2:
    n = input("Введите число от 1 до ...")

# Выражение for val in коллекця, условие
b = (i for i in range(1, int(n) + 1, 2))
for s in b:
    print(s)
print(next(b))
