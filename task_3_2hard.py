""" 1. Написать функцию num_translate(), переводящую числительные от 0 до 10 c английского на русский
язык.
Например: >>> num_translate("one") "один" >>> num_translate("eight")
"восемь"
Если перевод сделать невозможно, вернуть None.
Подумайте: как и где лучше хранить информацию, необходимую для перевода:
какой тип данных выбрать, в теле функции или снаружи?
2. * (вместо задачи 1) Доработать предыдущую функцию num_translate_adv(): реализовать корректную работу
с числительными, начинающимися с заглавной буквы. Например: >>> num_translate_adv("One")
"Один" >>> num_translate_adv("two") "два" """


def num_translate_adv(word_translate):

    word_translate_temp = word_translate
    word_translate_temp = word_translate_temp.lower()
    word_translate_value = language.get(word_translate_temp)
    if word_translate_value is None:
        print("Перевод данного слова не найден")
    else:
        if word_translate[0].isupper():
            word_translate_value = word_translate_value.capitalize()
        print(word_translate_value)


language = {
    "zero": "ноль",
    "one": "один",
    "two": "два",
    "three": "три",
    "four": "четыре",
    "five": "пять",
    "six": "шесть",
    "seven": "семь",
    "eight": "восемь",
    "nine": "девять",
    "ten": "десять"
}

word = input("Введите слово для перевода от 0-10 на английском языке")
while not word.isalpha():
    word = input("Ввести надо именно слово без цифр")

num_translate_adv(word)
