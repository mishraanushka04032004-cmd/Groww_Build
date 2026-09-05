import { ChangeDetectionService } from '../services/changeDetection/changeDetection.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getChangeHistory = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const history = await ChangeDetectionService.getChangeHistory(
    req.params.symbol,
    limit ? parseInt(limit, 10) : 20
  );
  return sendSuccess(res, history, 200);
});
