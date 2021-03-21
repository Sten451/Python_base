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
    speed = 180
    color = "white"
    name = "VAZ"
    is_police = False

    def go(self):
        print("Машина поехала")
        # Увеличиваем скорость на 5 км при каждом вызове метода
        self.speed += 5
        self.show_speed()

    def stop(self):
        print("Машина остановилась")
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
    def show_speed(self):
        if self.speed > 60:
            print("Превышена скорость, значение должно быть ниже 60 км/ч")
        else:
            print("Текущая скорость автомобиля:", self.speed)


class SportCar(Car):
    speed = 350


class WorkCar(Car):
    def show_speed(self):
        if self.speed > 40:
            print("Превышена скорость, знчение должно быть ниже 40 км/ч")
        else:
            print("Текущая скорость автомобиля:", self.speed)


class PoliceCar(Car):
    is_police = True
    name = "Ford Mondeo"
    color = "Black"


w = WorkCar()
s = SportCar()
t = TownCar()
p = PoliceCar()
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
