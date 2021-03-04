"""
1. Не используя библиотеки для парсинга, распарсить (получить определённые данные)
файл логов web-сервера nginx_logs.txt
(https://github.com/elastic/examples/raw/master/Common%20Data%20Formats/nginx_logs/nginx_logs) —
получить список кортежей вида: (<remote_addr>, <request_type>, <requested_resource>). Например:
[
...
('141.138.90.60', 'GET', '/downloads/product_2'),
('141.138.90.60', 'GET', '/downloads/product_2'),
('173.255.199.22', 'GET', '/downloads/product_2'),
...
]
Примечание:
- код должен работать даже с файлами, размер которых превышает объем ОЗУ компьютера.
- Вы не знате заранее насколько идентичен шаблон строк файла. Попробуйте оценить это.
"""


file = open('nginx_logs.txt', 'r', encoding='utf-8')
l = []
uniq = []
for line in file:
    line = line.split('"')
    # Проверка на уникальность, после разделения, если длина получившегося списка
    # не имеется в списке uniq, то туда добавляется новое значение, если по факту окажется
    # что в списке будет несколько значений, то разбитие по данному префиксу не правильно делит
    # весь файл.
    if len(line) not in uniq:
        uniq.append(len(line))
    count = 1
    for i in line[:2]:
        index_1 = i.find(" ")
        if count == 1:
            l.append(i[:index_1])
            count += 1
        else:
            l.append(i[:index_1])
            index_2 = i.find(" ", index_1 + 1)
            l.append(i[index_1 + 1:index_2])
    l1 = tuple(l)
    print(l1)
    l.clear()
if len(uniq) > 1:
    print("Некоторое строки имеют разные длину, замените в стр. 25 кода разделитель")
else:
    print("Все нормально")
file.close()