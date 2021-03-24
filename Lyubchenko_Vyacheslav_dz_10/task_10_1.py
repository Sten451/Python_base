"""
1. Реализовать класс Matrix (матрица). Обеспечить перегрузку конструктора класса
(метод __init__()), который должен принимать данные (список списков) для формирования матрицы.
Подсказка: матрица — система некоторых математических величин,
расположенных в виде прямоугольной схемы.
Примеры матриц: 3 на 2, 3 на 3, 2 на 4.
| 31 22 |
| 37 43 |
| 51 86 |

| 3 5 32 |
| 2 4 6 |
| -1 64 -8 |

| 3 5 8 3 |
| 8 3 7 1 |
"""


class Matrix:

    def __init__(self, matr):
        self.matr = matr
        self.verify()
        self.my_print()

    # Такое ощущение что наверное надо __STR__, но лучше как обычно надежно и понятно
    def my_print(self):
        for row in self.matr:
            print(*row)

    def error(self):
        print("Ошибка инициализации матрицы")
        exit()

    def verify(self):
        # Проверяем двумя циклами: во внутреннем на int(float),
        # во внешнем длину длину во множество, если его длина = 1, значит все списки внутренние
        # одинаковы по длине, а еще весь список на List
        if isinstance(self.matr, list):
            s = set()
            for row in self.matr:
                for value in row:
                    if not isinstance(value, int) and not isinstance(value, float):
                        self.error()
                s.add(len(row))
            if len(s) == 1:
                return self.matr
            else:
                self.error()
        else:
            self.error()


m = Matrix([[1, 2, 56, 34], [3, 4, 3, -8], [5, 5, 3, 67]])
