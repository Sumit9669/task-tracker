import { TaskStatus } from "@constants/common.constants";
import * as Joi from "joi";

// #region add Business
const taskTracker = Joi.object().keys({
  taskName: Joi.string().max(255).required(),
  taskDetail: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  status: Joi.number(),
});

export const TaskTrackerValidation = {
  taskTracker,
};
