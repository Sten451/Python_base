"""
2. Создайте собственный класс-исключение, обрабатывающий ситуацию деления на ноль.
Проверьте его работу на данных, вводимых пользователем.
При вводе нуля в качестве делителя программа должна корректно обработать эту ситуацию
и не завершиться с ошибкой.
"""


class MyDivisionError(ArithmeticError):
    def __init__(self, arg1, arg2):
        self.arg1 = arg1
        self.arg2 = arg2
        print(self.arg1, self.arg2)


arg1 = input("Введите первое число: ")
while not arg1.isdigit():
    arg1 = input("Введите первое число: ")
arg2 = input("Введите второе число: ")
while not arg2.isdigit():
    arg2 = input("Введите второе число: ")
try:
    print(int(arg1) / int(arg2))
    raise MyDivisionError(arg1, arg2)
except:
    pass
