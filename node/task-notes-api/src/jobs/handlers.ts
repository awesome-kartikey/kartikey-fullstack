import { Job } from "bullmq";
import { logger } from "../logger";

export const reminderHandler = async (job: Job) => {
  logger.info(`Sending reminder for task: ${job.data.taskId}`);
  // Logic to send email/update status goes here
};
