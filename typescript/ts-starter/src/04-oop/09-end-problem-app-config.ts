// 2. Schema with zod (or hand-rolled): coerce numbers, trim strings, supply defaults.
// 3. Singleton: private constructor; getInstance() does dotenv.config() once, validates, stores raw + derived values.
// 4. Derived Values: compute once; store in private fields; expose via getters.
// 5. Usage Discipline: Replace all process.env.X usage elsewhere with AppConfig.getInstance().get…().
