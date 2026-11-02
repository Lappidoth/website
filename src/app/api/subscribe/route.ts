import { formHandler } from "@/lib/api";
import { subscribe, subscribeSchema } from "@/lib/crm";

export const POST = formHandler(subscribeSchema, subscribe, "Welcome to the circle. Watch your inbox.");
