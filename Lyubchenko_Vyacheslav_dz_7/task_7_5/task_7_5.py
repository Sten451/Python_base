"""
4. Написать скрипт, который выводит статистику для заданной папки в виде словаря, в котором ключи — верхняя граница
размера файла (пусть будет кратна 10), а значения — общее количество файлов (в том числе и в подпапках),
размер которых не превышает этой границы, но больше предыдущей (начинаем с 0), например:
    {
      100: 15,
      1000: 3,
      10000: 7,
      100000: 2
    }
Тут 15 файлов размером не более 100 байт; 3 файла больше 100 и не больше 1000 байт...
Подсказка: размер файла можно получить из атрибута .st_size объекта os.stat.

5. * (вместо 4) Написать скрипт, который выводит статистику для заданной папки в виде словаря, в котором ключи те же,
а значения — списки вида [<files_quantity>, [<files_extensions_list>]], например:
  {
      100: [15, ['txt']],
      1000: [3, ['py', 'txt']],
      10000: [7, ['html', 'css']],
      100000: [2, ['png', 'jpg']]
    }
Сохраните результаты в файл <folder_name>_summary.json в той же папке, где запустили скрипт.
"""
import os
import json

TARGET = "test2"
dict = {}
main_dir = os.getcwd()
folder_from = os.path.join(main_dir, TARGET)

for root, dirs, files in os.walk(folder_from):
    for f in files:
        # Размер
        size = os.stat(os.path.join(root, f)).st_size
        # Расширение
        ext = f.rsplit('.', maxsplit=1)[-1].lower()
        # Чтобы не делать кучу проверок верхних границ, т.к. их может быть
        # теоретически сколько угодно, ключ будем задавать используя возведение
        # в степень 10 на количество знаков, за исключением нижнего значения.
        if size < 10:
            key = 10
        else:
            size = len(str(size))
            key = 10 ** size
        # Первые ключи
        if key not in dict:
            dict[key] = [1, [ext]]
        # Последующие: получаем список, первый элемент +1, второй элемент, т.к.
        # он тоже список, проверяем если нет, то добавляем.
        else:
            value = dict.get(key)
            value[0] += 1
            if ext not in value[1]:
                value[1].append(ext)
            dict[key] = value
# Выводим словарь
print(dict)
# Сортируем для наглядности
for k in sorted(dict.keys()):
    print(k, ':', dict[k])

# Дампим в JSON
nums_as_str = json.dumps(dict)
with open(os.path.join(main_dir, TARGET + "_summary.json"), 'w', encoding='utf-8') as f:
    f.write(nums_as_str)

