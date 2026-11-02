import { formHandler } from "@/lib/api";
import { contactSchema, submitContact } from "@/lib/crm";

export const POST = formHandler(contactSchema, submitContact, "Thank you — we'll be in touch shortly.");
