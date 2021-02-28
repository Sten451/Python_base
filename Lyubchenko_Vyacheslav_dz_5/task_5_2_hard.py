"""
2. Усложнение(**):
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
            s += i
            yield i, s


n = input("Введите число от 1 до ...")
while not n.isdigit() or int(n) < 2:
    n = input("Введите число от 1 до ...")
g = gen1()
for s in g:
    print(s)
print(next(g))

