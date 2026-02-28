// Define type Events = "click" | "hover" | "focus".
// Create type EventHandlerNames =on\${Capitalize}``.
// Check that it produces "onClick" | "onHover" | "onFocus".

type Events = "click" | "hover" | "focus";

type EventHandlerNames = `on${Capitalize<Events>}`;

/***********************************************************/
type AirplaneSeats = "window" | "aisle" | "middle";

type AirplaneSeat = `${AirplaneSeats}`;

const seat1: AirplaneSeat = "window";
const seat2: AirplaneSeat = "aisle";
const seat3: AirplaneSeat = "middle";
