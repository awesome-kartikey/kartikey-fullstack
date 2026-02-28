import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

type State = { users: { id: string; name: string }[] };

const db = new LowSync<State>(new JSONFileSync(".data/db.json"), { users: [] });

db.read();
db.data.users.push({ id: "1", name: "Ada" });
db.write();

console.log(db.data);
