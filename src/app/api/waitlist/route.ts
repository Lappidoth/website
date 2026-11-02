import { formHandler } from "@/lib/api";
import { joinWaitlist, waitlistSchema } from "@/lib/crm";

export const POST = formHandler(waitlistSchema, joinWaitlist, "You're on the list. We'll let you know first.");
