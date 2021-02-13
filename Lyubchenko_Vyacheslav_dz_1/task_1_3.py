# 3. Реализовать склонение слова «процент» для чисел до 20.
# Например, задаем число 5 — получаем «5 процентов», задаем число 2 — получаем «2 процента».
# Вывести все склонения для проверки.

number = input("Введите число от 1 до 20")
while not number.isdigit() or int(number) > 20 or int(number) < 1:
    number = input("Введённое значение не находится в диапазоне 1-20")
number = int(number)
if number == 1:
    print(number, "процент")
elif 1 < number < 5:
    print(number, "процента")
else:
    print(number, "процентов")
print("Проверка корректности значений:")
for i in range(1, 21):
    if i == 1:
        percent = "процент"
    elif 1 < i < 5:
        percent = "процента"
    else:
        percent = "процентов"
    print(i, percent)