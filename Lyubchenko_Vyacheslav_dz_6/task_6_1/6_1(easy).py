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
# Самый простой способ решения, неясно только насколько не идентичен шаблон.
# Можно и через find решать.
for line in file:
    line = line.split(" ")
    l.extend([line[0], line[5][1:], line[6]])
    l1 = tuple(l)
    print(l1)
    l.clear()

file.close()