import { testDb, setupTestDb, clearTestDb, UserFactory } from "./helpers/factory";

setupTestDb();

const user = UserFactory.create();
console.assert(user.id !== undefined, "User should have an ID");
console.assert(user.email.includes("@"), "User should have a valid email");
console.log("Factory creates user:", user);

try {
    UserFactory.create({ email: "duplicate@test.com" });
    UserFactory.create({ email: "duplicate@test.com" }); // should throw
    console.error("Should have thrown on duplicate email");
} catch (err) {
    console.log("Unique constraint works correctly");
}

clearTestDb();
const count = testDb.prepare("SELECT COUNT(*) as count FROM users").get() as any;
console.assert(count.count === 0, "Table should be empty after clear");
console.log("clearTestDb works:", count.count, "records remaining");
