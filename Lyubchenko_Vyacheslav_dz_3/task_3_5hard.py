"""5. Реализовать функцию get_jokes(), возвращающую n шуток, сформированных из трех случайных слов,
взятых из трёх списков:
nouns = ["автомобиль", "лес", "огонь", "город", "дом"]
adverbs = ["сегодня", "вчера", "завтра", "позавчера", "ночью"]
adjectives = ["веселый", "яркий", "зеленый", "утопичный", "мягкий"]

Например:
get_jokes(2)
["лес завтра зеленый", "город вчера веселый"]
Документировать код функции.
Усложнение: * Сможете ли вы добавить еще один аргумент — флаг, разрешающий или запрещающий повторы
слов в шутках (когда каждое слово можно использовать только в одной шутке)?
Сможете ли вы сделать аргументы именованными?
"""
from random import choice


def get_jokes(amount, flag):
    """Создаём цикл из расчёта необходимо количества шуток, передаём значения рандомайзеру
    результат записываем в список, каждый раз добавляя элементы (при флаге проверяю на ранее выпавшие)
      и возращаем список"""
    result = []
    list1_t = []
    list2_t = []
    list3_t = []
    for i in range(1, amount + 1):
        list1 = choice(nouns)
        if not flag:
            while list1 in list1_t:
                list1 = choice(nouns)
        list1_t.append(list1)
# второй элемент списка
        list2 = choice(adverbs)
        if not flag:
            while list2 in list2_t:
                list2 = choice(adverbs)
        list2_t.append(list2)
# третий элемент списка
        list3 = choice(adjectives)
        if not flag:
            while list3 in list3_t:
                list3 = choice(adjectives)
        list3_t.append(list3)
        result.append(" ".join([list1, list2, list3]))
    return result


nouns = ["автомобиль", "лес", "огонь", "город", "дом"]
adverbs = ["сегодня", "вчера", "завтра", "позавчера", "ночью"]
adjectives = ["веселый", "яркий", "зеленый", "утопичный", "мягкий"]
minimum = min(len(nouns), len(adverbs), len(adjectives))
value = (input("Разрешить повтор слов в шутках. Y/N")).upper()
while value != "Y" and value != "N":
    value = (input("Ещё раз Y/N ?")).upper()
if value == "Y":
    value = True
else:
    value = False
    print("Максимальное количество шуток доступно", minimum)
n = input("Сколько шуток вывести?")
while not n.isdigit() or int(n) < 1 or (not value and int(n) > minimum):
    n = input("Вы ввели не число или число '0' или меньше или больше максимума")
"""Выполняем функцию, передавая ей введенное число"""
result2 = get_jokes(amount=int(n), flag=value)
print(result2)
