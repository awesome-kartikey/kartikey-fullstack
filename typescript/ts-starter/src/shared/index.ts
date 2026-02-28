// src/index.ts
import {capitalize} from "@shared/strings";
import { add } from "@shared/math";
import { uuid } from "./uuid";

const result = add(5, 10);

console.log(`The result is: ${result}`);

console.log(`The uuid is: ${uuid()}`);

export * from "./math";
export * from "./strings"
