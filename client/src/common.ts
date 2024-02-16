export const getScenarioName = function () {
  if (location && location.href && location.href.indexOf('admin') > -1) {
    return 'admin'
  }
  if (location.search) {
    return new URLSearchParams(location.search.slice(1)).get('scenarioName') || 'admin';
  }
  return 'admin';
}
