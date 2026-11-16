import {
  validateDiagnoseRequest,
  validateServiceCopyRequest,
} from "./ai.validation.js";
import { analyzeHomeIssue, generateServiceListingCopy } from "./ai.service.js";

export const diagnoseHomeIssue = async (req, res, next) => {
  try {
    const { problem } = validateDiagnoseRequest(req.body);
    const result = await analyzeHomeIssue(problem);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const generateServiceCopy = async (req, res, next) => {
  try {
    const validatedInput = validateServiceCopyRequest(req.body);
    const result = await generateServiceListingCopy(validatedInput);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
