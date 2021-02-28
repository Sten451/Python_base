"""
2. Написать генератор нечётных чисел от 1 до n (включительно), используя ключевое слово yield.
Полностью истощить генератор. Например:
gen1 = iterator_with_yield(11)
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
С ключевым словом yield - как в задании 1: генератор нечётных чисел от 1 до n (включительно), для чисел, квадрат которых меньше 200.

Усложнение(**):
С ключевым словом yield: Вычислять и возвращать само число и накопительную сумму этого и предыдущих чисел. Например:

gen1 = iterator_with_yield(14)
next(gen1)
(1, 1)
next(gen1)
(3, 4)
next(gen1)
(5, 9)
next(gen1)
(7, 16)
next(gen1)
(9, 25)
next(gen1)
(11, 36)
next(gen1)
(13, 49)
next(gen1)
Traceback (most recent call last):
  File "<input>", line 1, in <module>
StopIteration
"""


def gen1():
    # Выражение for val in коллекця, условие
    # Попробуем генератор списка, элементов не много
    s = 0
    for i in range(1, int(n) + 1, 2):
        if i ** 2 < 200:
            yield i


n = input("Введите число от 1 до ...")
while not n.isdigit() or int(n) < 2:
    n = input("Введите число от 1 до ...")
g = gen1()
for s in g:
    print(s)
print(next(g))

