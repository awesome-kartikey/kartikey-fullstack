// Define type HasId = { id: string } and type HasTimestamps = { createdAt: Date; updatedAt: Date }.
// Create type Entity = HasId & HasTimestamps.
// Declare a variable of type Entity and assign values.
// Try omitting one field—observe the error.

type HasId2 = { id: string };
type HasTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type Entity = HasId2 & HasTimestamps;

let blog: Entity = {
  id: "456",
  createdAt: new Date(),
  updatedAt: new Date(),
};
