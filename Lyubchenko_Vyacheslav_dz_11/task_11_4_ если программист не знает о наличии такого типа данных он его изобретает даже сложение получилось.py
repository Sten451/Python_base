"""4. Реализовать проект «Операции с комплексными числами». Создайте класс
«Комплексное число». Реализуйте перегрузку методов сложения и умножения
комплексных чисел. Проверьте работу проекта. Для этого создаёте экземпляры класса
(комплексные числа), выполните сложение и умножение созданных экземпляров.
Проверьте корректность полученного результата.
"""


class Complex:
    def __init__(self, a):
        if (isinstance(a, str) and "+" in a and "i" in a) or (isinstance(a, str) and "-" in a and "i" in a):
            self.a = a
            print("Создано комплексное число:", self.a)
        else:
            print("Ошибка инициализации...")
            exit()

    def __add__(self, other):
        if "+" in self.a:
            # Надо понять где член с I, будем смотреть по индексам исходя из того что
            # отрицательных чисел нет, т.к. "+"
            index_i = self.a.find("i")
            index_i2 = self.a.find("+")
            if index_i < index_i2:
                digit_i = self.a[:index_i]
                digit_two = self.a[index_i2 + 1:]
            else:
                digit_i = self.a[index_i2 + 1:index_i]
                digit_two = self.a[:index_i2]
        # Значит там есть "-"
        else:
            index_i = self.a.find("i")
            index_i2 = self.a.find("-")
            if index_i < index_i2:
                digit_i = self.a[:index_i]
                digit_two = self.a[index_i2:]
            else:
                digit_i = self.a[index_i2:index_i]
                digit_two = self.a[:index_i2]
        # Other то же самое
        if "+" in other.a:
            # Надо понять где член с I, будем смотреть по индексам исходя из того что
            # отрицательных чисел нет, т.к. "+"
            index_i = other.a.find("i")
            index_i2 = other.a.find("+")
            if index_i < index_i2:
                digit_i2 = other.a[:index_i]
                digit_two2 = other.a[index_i2 + 1:]
            else:
                digit_i2 = other.a[index_i2 + 1:index_i]
                digit_two2 = other.a[:index_i2]
        # Значит там есть "-"
        else:
            index_i = other.a.find("i")
            index_i2 = other.a.find("-")
            if index_i < index_i2:
                digit_i2 = other.a[:index_i]
                digit_two2 = other.a[index_i2:]
            else:
                digit_i2 = other.a[index_i2:index_i]
                digit_two2 = other.a[:index_i2]

        s1 = int(digit_two) + int(digit_two2)
        s2 = int(digit_i) + int(digit_i2)
        s3 = str(s1) + str(s2) + "i"
        print("Сумма двух комплексных чисел равна: ")
        return Complex(s3)


z = Complex("15-4i")
x = Complex("9-8i")

s = z + x