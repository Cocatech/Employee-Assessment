/**
 * API Exports
 * Export all API adapters for easy access
 */

export {
  employeeAdapter,
  questionAdapter,
  assessmentAdapter,
  responseAdapter,
  isUsingMockAPI,
} from './data-adapter';

export {
  mockEmployeeClient,
  mockAssessmentClient,
  mockQuestionClient,
  mockResponseClient,
} from './mock-client';
