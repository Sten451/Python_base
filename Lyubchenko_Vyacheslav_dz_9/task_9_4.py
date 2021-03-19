"""
4. Реализуйте базовый класс Car.
у класса должны быть следующие атрибуты: speed, color, name, is_police(булево).
А также методы: go, stop, turn(direction), которые должны сообщать,
что машина поехала, остановилась, повернула (куда);
опишите несколько дочерних классов: TownCar, SportCar, WorkCar, PoliceCar;
добавьте в базовый класс метод show_speed, который должен показывать
текущую скорость автомобиля;
для классов TownCar и WorkCar переопределите метод show_speed.
При значении скорости свыше 60 (TownCar) и 40 (WorkCar)
должно выводиться сообщение о превышении скорости.
Создайте экземпляры классов, передайте значения атрибутов.
Выполните доступ к атрибутам, выведите результат.
Вызовите методы и покажите результат.
"""


class Car:
    def __init__(self, speed, color, name, is_police):
        if str(speed).isdigit() and isinstance(name, str) and isinstance(color, str) and isinstance(name, str) and isinstance(is_police, bool):
            self.speed = speed
            self.color = color
            self.name = name
            self.is_police = is_police
        else:
            try:
                raise ValueError
            except ValueError:
                print("Ошибка инициализации")
                exit()

    def go(self):
        if self.speed == 0:
            print("Машина поехала")
        self.speed += 5
        self.show_speed()

    def stop(self):
        if self.speed == 0:
            print("Машина остановилась")
        self.speed -= 5
        if self.speed <= 0:
            self.speed = 0
        self.show_speed()


    def turn(self, direction):
        if direction == "налево" or direction == "направо":
            print("Машина повернула", direction)
        else:
            try:
                raise ValueError
            except ValueError:
                print("Ошибка маневра")
                exit()

    def show_speed(self):
        print("Текущая скорость автомобиля:", self.speed)


class TownCar(Car):
    def __init__(self, speed, color, name, is_police):
        super().__init__(speed, color, name, is_police)
        self.is_police = False

    def show_speed(self):
        if self.speed > 60:
            print("Превышена скорость, значение должно быть ниже 60 км/ч")
        else:
            print("Текущая скорость автомобиля:", self.speed)


class SportCar(Car):
    def __init__(self, speed, color, name, is_police):
        super().__init__(speed, color, name, is_police)
        self.is_police = False


class WorkCar(Car):
    def __init__(self, speed, color, name, is_police):
        super().__init__(speed, color, name, is_police)
        self.is_police = False

    def show_speed(self):
        if self.speed > 40:
            print("Превышена скорость, знчение должно быть ниже 40 км/ч")
        else:
            print("Текущая скорость автомобиля:", self.speed)


class PoliceCar(Car):
    def __init__(self, speed, color, name, is_police):
        super().__init__(speed, color, name, is_police)
        # Не важно что передадим, параметры полиции будут такие
        self.is_police = True
        self.name = "Ford Mondeo"
        self.color = "Black"


w = WorkCar(120, "green", "GAZ", False)
s = SportCar(120, "blue", "ferrari", False)
t = TownCar(80, "red", "toyota", False)
p = PoliceCar(200, "black", "21099", False)
t.show_speed()
s.show_speed()
w.show_speed()
# Маневр
t.turn("налево")
# Машина полиции
print(p.name, p.color, p.is_police)

t.go()
print(t.speed)
t.go()
print(t.speed)
t.stop()
print(t.speed)