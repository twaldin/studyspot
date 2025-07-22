"use client";

import { useState } from "react";
import { PromptComparison } from "../../lib/types/comparison.types";
import { TestResponse } from "../../lib/types/testing.types";

interface ComparisonResultsProps {
  comparison: PromptComparison;
}

export default function ComparisonResults(
  { comparison }: ComparisonResultsProps,
) {
  const { promptA, promptB, comparison: results, queries } = comparison;
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);

  const getWinnerColor = (winner: string) => {
    switch (winner) {
      case "A":
        return "text-blue-600 bg-blue-100";
      case "B":
        return "text-green-600 bg-green-100";
      case "tie":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-900 bg-gray-100";
    }
  };

  const formatDifference = (
    value: number,
    unit: string = "",
    isSpeed: boolean = false,
  ) => {
    const abs = Math.abs(value);
    const sign = value > 0 ? "+" : "";
    const color = isSpeed
      ? (value < 0 ? "text-green-600" : "text-red-600") // For speed, negative is better
      : (value > 0 ? "text-green-600" : "text-red-600");

    return (
      <span className={color}>
        {sign}
        {abs.toFixed(1)}
        {unit}
      </span>
    );
  };

  const getResponsesForQuery = (query: string) => {
    const responsesA = promptA.testRun.responses.filter((r) =>
      r.query === query
    );
    const responsesB = promptB.testRun.responses.filter((r) =>
      r.query === query
    );
    return { responsesA, responsesB };
  };

  const renderQualityDistribution = (responses: TestResponse[]) => {
    const responsesWithQuality = responses.filter((r) =>
      r.qualityScore !== undefined
    );

    if (responsesWithQuality.length === 0) {
      return (
        <div className="text-sm text-gray-500">No quality scores available</div>
      );
    }

    const distributions = [
      { range: "9-10", count: 0, color: "bg-green-500" },
      { range: "7-8", count: 0, color: "bg-blue-500" },
      { range: "5-6", count: 0, color: "bg-yellow-500" },
      { range: "3-4", count: 0, color: "bg-orange-500" },
      { range: "1-2", count: 0, color: "bg-red-500" },
    ];

    responsesWithQuality.forEach((response) => {
      const score = response.qualityScore || 0;
      if (score >= 9) distributions[0].count++;
      else if (score >= 7) distributions[1].count++;
      else if (score >= 5) distributions[2].count++;
      else if (score >= 3) distributions[3].count++;
      else if (score >= 1) distributions[4].count++;
    });

    return (
      <div className="space-y-2">
        {distributions.map(({ range, count, color }) => {
          const percentage = responsesWithQuality.length > 0
            ? (count / responsesWithQuality.length) * 100
            : 0;

          return (
            <div key={range} className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 w-8">{range}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  className={`${color} h-1.5 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
        <div className="text-xs text-gray-500 mt-2">
          Avg: {(responsesWithQuality.reduce((sum, r) =>
            sum + (r.qualityScore || 0), 0) / responsesWithQuality.length)
            .toFixed(1)}/10
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Winner Declaration */}
      <div
        className={`rounded-lg p-4 ${getWinnerColor(results.winner).replace("text-", "border-").replace(
          "-600",
          "-200",
        )
          }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`text-lg font-semibold ${getWinnerColor(results.winner).split(" ")[0]
                }`}
            >
              {results.winner === "A"
                ? `Winner: ${promptA.label}`
                : results.winner === "B"
                  ? `Winner: ${promptB.label}`
                  : results.winner === "tie"
                    ? "Result: Tie"
                    : "Result: Inconclusive"}
            </h3>
            <p className="text-sm text-gray-900 mt-1">
              {results.winnerReason}
            </p>
          </div>
          {results.winner !== "inconclusive" && (
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getWinnerColor(results.winner)
                }`}
            >
              {results.winner === "tie"
                ? "TIE"
                : `PROMPT ${results.winner.toUpperCase()}`}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Detailed Statistics
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {promptA.label}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {promptB.label}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Winner
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Success Rate */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Success Rate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {((promptA.testRun.responses.length -
                    promptA.testRun.summary.errorCount) /
                    promptA.testRun.responses.length * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {((promptB.testRun.responses.length -
                    promptB.testRun.summary.errorCount) /
                    promptB.testRun.responses.length * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDifference(
                    ((promptB.testRun.responses.length -
                      promptB.testRun.summary.errorCount) /
                      promptB.testRun.responses.length * 100) -
                    ((promptA.testRun.responses.length -
                      promptA.testRun.summary.errorCount) /
                      promptA.testRun.responses.length * 100),
                    "%",
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {promptA.testRun.summary.errorCount <
                    promptB.testRun.summary.errorCount
                    ? "A"
                    : promptB.testRun.summary.errorCount <
                      promptA.testRun.summary.errorCount
                      ? "B"
                      : "Tie"}
                </td>
              </tr>

              {/* Document Usage */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Document Usage
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {promptA.testRun.summary.documentUsagePercentage.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {promptB.testRun.summary.documentUsagePercentage.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDifference(
                    promptB.testRun.summary.documentUsagePercentage -
                    promptA.testRun.summary.documentUsagePercentage,
                    "%",
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {promptA.testRun.summary.documentUsagePercentage >
                    promptB.testRun.summary.documentUsagePercentage
                    ? "A"
                    : promptB.testRun.summary.documentUsagePercentage >
                      promptA.testRun.summary.documentUsagePercentage
                      ? "B"
                      : "Tie"}
                </td>
              </tr>

              {/* Average Response Time */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Avg Response Time
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.round(promptA.testRun.summary.averageResponseTime)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.round(promptB.testRun.summary.averageResponseTime)}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDifference(
                    promptB.testRun.summary.averageResponseTime -
                    promptA.testRun.summary.averageResponseTime,
                    "ms",
                    true,
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {promptA.testRun.summary.averageResponseTime <
                    promptB.testRun.summary.averageResponseTime
                    ? "A"
                    : promptB.testRun.summary.averageResponseTime <
                      promptA.testRun.summary.averageResponseTime
                      ? "B"
                      : "Tie"}
                </td>
              </tr>

              {/* Average Quality Score */}
              {promptA.testRun.summary.averageQuality !== undefined &&
                promptB.testRun.summary.averageQuality !== undefined && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Avg Quality Score
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {promptA.testRun.summary.averageQuality.toFixed(1)}/10
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {promptB.testRun.summary.averageQuality.toFixed(1)}/10
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDifference(
                        promptB.testRun.summary.averageQuality -
                        promptA.testRun.summary.averageQuality,
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {promptA.testRun.summary.averageQuality >
                        promptB.testRun.summary.averageQuality
                        ? "A"
                        : promptB.testRun.summary.averageQuality >
                          promptA.testRun.summary.averageQuality
                          ? "B"
                          : "Tie"}
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Score Distribution */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Quality Score Distribution
        </h4>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">
              {promptA.label}
            </h5>
            {renderQualityDistribution(promptA.testRun.responses)}
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">
              {promptB.label}
            </h5>
            {renderQualityDistribution(promptB.testRun.responses)}
          </div>
        </div>
      </div>

      {/* Individual Response Samples */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Individual Query Results
        </h4>
        <div className="space-y-2">
          {queries.map((q) => {
            const { responsesA, responsesB } = getResponsesForQuery(q.query);
            return (
              <div key={q.id}>
                <button
                  onClick={() =>
                    setExpandedQuery(expandedQuery === q.id ? null : q.id)}
                  className="w-full text-left p-2 bg-gray-50 text-gray-900 hover:bg-gray-100 rounded"
                >
                  {q.query}
                </button>
                {expandedQuery === q.id && (
                  <div className="grid grid-cols-2 gap-4 text-gray-900 p-4 border rounded-b-lg">
                    <div>
                      <h5 className="font-semibold mb-2">{promptA.label}</h5>
                      {responsesA.map((r, i) => (
                        <ResponseCard key={i} response={r} />
                      ))}
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">{promptB.label}</h5>
                      {responsesB.map((r, i) => (
                        <ResponseCard key={i} response={r} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ResponseCard({ response }: { response: TestResponse }) {
  return (
    <div className="border rounded p-3 mb-2 bg-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-blue-700">
            Quality: {response.qualityScore?.toFixed(1) || "N/A"}/10
          </span>
          <span
            className={`text-xs px-1 rounded ${response.usedExpectedDocument
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {response.usedExpectedDocument ? "Used Doc" : "No Doc"}
          </span>
        </div>
        <span className="text-xs text-gray-900">
          {response.responseTime}ms
        </span>
      </div>
      <div className="text-sm text-gray-900 line-clamp-4">
        {response.content.substring(0, 300)}...
      </div>
      {response.qualityDetails && (
        <div className="text-xs text-gray-500 mt-1">
          Relevance: {response.qualityDetails.criteria.relevance} Accuracy:{" "}
          {response.qualityDetails.criteria.accuracy} Completeness:{" "}
          {response.qualityDetails.criteria.completeness} Coherence:{" "}
          {response.qualityDetails.criteria.coherence} Source Usage:{" "}
          {response.qualityDetails.criteria.sourceUsage}
        </div>
      )}
    </div>
  );
}
