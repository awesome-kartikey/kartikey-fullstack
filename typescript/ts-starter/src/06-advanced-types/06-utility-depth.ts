// Use Required<T> to force all fields.
// Use Readonly<T> to freeze fields.
// Use Extract<Union, Subset> and Exclude<Union, Subset>.
// Test with type Result = Exclude<"a" | "b" | "c", "a">.

interface UPIPayment{
    paymentId?: string;
    amount?: number;
    receiver?: string;
}

type RequiredUPIPayment = Required<UPIPayment>;

type ReadonlyUPIPayment = Readonly<UPIPayment>;

type billViewer = "bank" | "sender" | "receiver" | "government";

type AllowedViewer = Extract<billViewer, "bank" | "sender">; 
type NotAllowedViewer = Exclude<billViewer, "bank" | "government">;