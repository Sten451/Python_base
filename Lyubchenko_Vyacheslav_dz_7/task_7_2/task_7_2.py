"""
2. * (вместо 1) Написать скрипт, создающий из config.yaml стартер для проекта со следующей структурой:
"""
import os

def found_name(line_temp):
    name_index = line_temp.find("-")
    name_temp = line_temp[name_index + 2:]
    return name_temp, name_index


with open('data.yml', 'r', encoding='utf-8') as file_1:
    for line in file_1:
        line = line.replace("\n", "")
        # Запускаем функцию по поиску имени элемента структуры и индекса "-"
        name = found_name(line)

        # Если индекс 1 то это корневая директория
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