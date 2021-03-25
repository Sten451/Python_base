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

        print("Сумма двух комплексных чисел равна: ")
        return Complex(s3)

    def __mul__(self, other):
        return Complex(self.value * other.value)


z = Complex("15-4i")
x = Complex("9-8i")

s = z * x

"""
z = 1 + 2j
print(z)
x = complex(3, -2)
print(x)
"""