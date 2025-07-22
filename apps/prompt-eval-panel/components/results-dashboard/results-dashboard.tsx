'use client';

interface ResultsDashboardProps {
  results: {
    testRun: any;
    summary: any;
    successRate: number;
    averageResponseTime: number;
    documentUsagePercentage: number;
    responses: any[];
  };
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const { summary, successRate, averageResponseTime, documentUsagePercentage, responses } = results;

  // Calculate average quality score
  const responsesWithQuality = responses.filter(r => r.qualityScore !== undefined);
  const averageQuality = responsesWithQuality.length > 0
    ? responsesWithQuality.reduce((sum, r) => sum + (r.qualityScore || 0), 0) / responsesWithQuality.length
    : null;

  const metrics = [
    {
      label: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      description: 'Responses without errors',
      color: successRate >= 90 ? 'text-green-600' : successRate >= 70 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      label: 'Document Usage',
      value: `${documentUsagePercentage.toFixed(1)}%`,
      description: 'Used expected document',
      color: documentUsagePercentage >= 80 ? 'text-green-600' : documentUsagePercentage >= 50 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      label: 'Avg Response Time',
      value: `${Math.round(averageResponseTime)}ms`,
      description: 'Average time per response',
      color: averageResponseTime <= 3000 ? 'text-green-600' : averageResponseTime <= 5000 ? 'text-yellow-600' : 'text-red-600'
    },
    ...(averageQuality !== null ? [{
      label: 'Avg Quality Score',
      value: `${averageQuality.toFixed(1)}/10`,
      description: 'AI-evaluated quality',
      color: averageQuality >= 8 ? 'text-green-600' : averageQuality >= 6 ? 'text-yellow-600' : 'text-red-600'
    }] : []),
    {
      label: 'Total Responses',
      value: `${responses.length}`,
      description: 'Completed iterations',
      color: 'text-blue-600'
    }
  ];

  const documentStats = responses.reduce((acc, response) => {
    if (response.linkedDocumentIds) {
      response.linkedDocumentIds.forEach((docId: string) => {
        acc[docId] = (acc[docId] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedDocuments = Object.entries(documentStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10); // Top 10 most referenced documents

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
            <div className="text-sm text-gray-600">{metric.label}</div>
            <div className="text-xs text-gray-500">{metric.description}</div>
          </div>
        ))}
      </div>

      {/* Document Usage Chart */}
      {sortedDocuments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Most Referenced Documents
          </h3>
          <div className="space-y-2">
            {sortedDocuments.map(([docId, count]) => {
              const percentage = (count / responses.length) * 100;
              const isExpected = docId === results.testRun.expectedDocumentId;
              
              return (
                <div key={docId} className="flex items-center space-x-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-mono ${
                        isExpected ? 'text-green-700 font-bold' : 'text-gray-600'
                      }`}>
                        {docId.substring(0, 8)}...
                      </span>
                      {isExpected && (
                        <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                          TARGET
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full ${
                          isExpected ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Summary */}
      {summary.errorCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="text-sm text-red-800">
            <strong>{summary.errorCount}</strong> error(s) occurred during testing
          </div>
        </div>
      )}

      {/* Quality Score Distribution */}
      {responsesWithQuality.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Quality Score Distribution
          </h3>
          <div className="space-y-1">
            {['9-10', '7-8', '5-6', '3-4', '1-2'].map((range) => {
              let count = 0;
              responsesWithQuality.forEach(response => {
                const score = response.qualityScore || 0;
                if (range === '9-10' && score >= 9) count++;
                else if (range === '7-8' && score >= 7 && score < 9) count++;
                else if (range === '5-6' && score >= 5 && score < 7) count++;
                else if (range === '3-4' && score >= 3 && score < 5) count++;
                else if (range === '1-2' && score >= 1 && score < 3) count++;
              });
              
              const percentage = responsesWithQuality.length > 0 ? (count / responsesWithQuality.length) * 100 : 0;
              const color = range === '9-10' ? 'bg-green-500' : 
                           range === '7-8' ? 'bg-blue-500' : 
                           range === '5-6' ? 'bg-yellow-500' : 
                           range === '3-4' ? 'bg-orange-500' : 'bg-red-500';
              
              return (
                <div key={range} className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 w-12">{range}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`${color} h-1.5 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Response Length Distribution */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Response Length Distribution
        </h3>
        <div className="space-y-1">
          {['0-100', '100-500', '500-1000', '1000+'].map((range) => {
            let count = 0;
            responses.forEach(response => {
              const length = response.content?.length || 0;
              if (range === '0-100' && length <= 100) count++;
              else if (range === '100-500' && length > 100 && length <= 500) count++;
              else if (range === '500-1000' && length > 500 && length <= 1000) count++;
              else if (range === '1000+' && length > 1000) count++;
            });
            
            const percentage = responses.length > 0 ? (count / responses.length) * 100 : 0;
            
            return (
              <div key={range} className="flex items-center space-x-2">
                <span className="text-xs text-gray-600 w-16">{range} chars</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-purple-500 h-1.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}