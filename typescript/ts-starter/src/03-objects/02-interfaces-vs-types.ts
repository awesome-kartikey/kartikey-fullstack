// 2) Interfaces vs Type Aliases¶
// Create an interface Car with make and model.
// Create a type alias Bike with make and gears.
// Compare how they are declared and used.
// Extend Car with an interface ElectricCar.
// Use intersection types with Bike.

interface Car {
  make: string;
  model: string;
}

type Bike = {
  make: string;
  gears: number;
};

const tesla: Car = {
  make: "tesla",
  model: "model s",
};

const bmw: Bike = {
  make: "bmw",
  gears: 5,
};

interface ElectricCar extends Car {
  batteryLife: number;
}

type ElectricBike = Bike & {
  batteryLife: number;
};
