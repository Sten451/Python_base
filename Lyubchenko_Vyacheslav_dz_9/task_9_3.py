"""
3. Реализовать базовый класс Worker (работник).
определить атрибуты: name, surname, position (должность), income (доход);
последний атрибут должен быть защищённым и ссылаться на словарь,
содержащий элементы: оклад и премия, например, {"wage": wage, "bonus": bonus};
создать класс Position (должность) на базе класса Worker;
в классе Position реализовать методы получения полного имени
сотрудника (get_full_name) и дохода с учётом премии (get_total_income);
проверить работу примера на реальных данных: создать экземпляры класса
Position, передать данные, проверить значения атрибутов, вызвать методы
экземпляров.
"""


class Worker:
    name = "Sten"
    surname = "Shoker"
    position = "lawyer"
    _income = {"wage": 500, "bonus": 400}


class Position(Worker):
    def __init__(self, name, surname, position, wage, bonus):
        self.name = name
        self.surname = surname
        self.position = position
        if str(wage).isdigit() and str(bonus).isdigit():
            self._income = {"wage": wage, "bonus": bonus}
        else:
            try:
                raise TypeError
            except TypeError:
                print("Доход должен быть int")
                exit()

    def get_full_name(self):
        print("Имя:", self.name, "Фамилия:", self.surname)

    def get_total_income(self):
        s = 0
        for i in self._income:
            s += self._income.get(i)
        print("Доход вместе с премией:", s)


f = Position("Misha", "Ivanov", "chief", 600, 100)
# Проверяем значения атрибутов
print(f.name)
print(f.surname)
print(f.position)
# Вызываем методы
f.get_full_name()
f.get_total_income()
