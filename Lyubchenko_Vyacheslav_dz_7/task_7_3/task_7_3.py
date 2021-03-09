"""
3. Создать структуру файлов и папок, как написано в задании 2 (при помощи скрипта или «руками»
в проводнике).
Написать скрипт, который собирает все шаблоны в одну папку templates, например:
"""
import os
import shutil

def found_name(line_temp):
    name_index = line_temp.find("-")
    name_temp = line_temp[name_index + 2:]
    return name_temp, name_index


with open('data.yml', 'r', encoding='utf-8') as file_1:
    for line in file_1:
        line = line.replace("\n", "")
        # Запускаем функцию по поиску имени элемента структуры и индекса "-"
        name = found_name(line)

        # Если индекс 1 то это корневая директория, дальше вложенность + 3 символа
        if name[1] == 1:
            dir_1 = name[0]
            if not os.path.exists(name[0]):
                os.mkdir(name[0])
        else:
            if name[1] == 4:
                dir_2 = name[0]
                dir_path = os.path.join(dir_1, dir_2)
                if not os.path.exists(dir_path):
                    os.makedirs(dir_path)
            # Это папка, надеюсь никто не решит создать папку с точкой в названии
            if name[1] == 7:
                if "." not in name[0]:
                    dir_3 = name[0]
                    dir_path = os.path.join(dir_1, dir_2, dir_3)
                    if not os.path.exists(dir_path):
                        os.makedirs(dir_path)
                else:
                    if not os.path.exists(name[0]):
                        file_1 = open(os.path.join(dir_1, dir_2, name[0]), 'w', encoding='utf-8')
                        file_1.close()

            if name[1] == 10:
                if "." not in name[0]:
                    dir_4 = name[0]
                    dir_path = os.path.join(dir_1, dir_2, dir_3, dir_4)
                    if not os.path.exists(dir_path):
                        os.makedirs(dir_path)
                else:
                    if not os.path.exists(name[0]):
                        file_1 = open(os.path.join(dir_1, dir_2, dir_3, name[0]), 'w', encoding='utf-8')
                        file_1.close()

            if name[1] == 13:
                if "." not in name[0]:
                    dir_4 = name[0]
                    dir_path = os.path.join(dir_1, dir_2, dir_3, dir_4)
                    if not os.path.exists(dir_path):
                        os.makedirs(dir_path)
                else:
                    if not os.path.exists(name[0]):
                        file_1 = open(os.path.join(dir_1, dir_2, dir_3, dir_4, name[0]), 'w', encoding='utf-8')
                        file_1.close()

# Теперь собираем все в Templates, ее указал явно.
main_dir = os.getcwd()
folder_from = os.path.join(main_dir, dir_1)
# Наверняка можно как то проще, но copytree не работает, ему надо что бы такие папки не существовали,
# поэтому пройдемся по всему каталогу, найдем вхождение, вторым условием найдем файлы.
for root, dirs, files in os.walk(folder_from):
    if "templates" in root and dirs:
        dir_path = os.path.join(dir_1, 'templates', dirs[0])
        dirs_last = dirs[0]
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
    if "templates" in root and files:
        for f in files:
            # Странно что надо указывать полный путь, просто f выдает ошибку при повторном создании
            if not os.path.exists(os.path.join(folder_from, "templates", dirs_last, f)):
                shutil.copy(os.path.join(root, f), os.path.join(folder_from, "templates", dirs_last))
