import { pool } from "./pool.js";
import { UserRepository } from "../repositories/UserRepository.js";

async function seed() {

    console.log("Seeding database...");
    try {
        const repo = new UserRepository();
        await repo.create("alice@example.com", "Alice");
        await repo.create("bob@example.com", "Bob");
        console.log("Seed complete");
    } catch (err) {
        console.error("Seed failed:", err);
    } finally {
        await pool.end();
    }
}
seed();
