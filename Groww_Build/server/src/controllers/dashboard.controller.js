import { DashboardService } from '../services/dashboard/dashboard.service.js';
import { ChangeDetectionService } from '../services/changeDetection/changeDetection.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const { watchlistId } = req.query;
  const data = await DashboardService.getDashboardData(req.user.id, watchlistId);
  return sendSuccess(res, data, 200);
});

export const acknowledgeChanges = asyncHandler(async (req, res) => {
  const { symbol, all } = req.body;
  const result = await ChangeDetectionService.acknowledgeBaseline(req.user.id, symbol, all);
  return sendSuccess(res, result, 200);
});
