function PopupCtrl($scope, ChromeStorage) {
  $scope.enabled = true;
  $scope.replacers = {};
  $scope.newReplacer = {
    match: '',
    replacement: ''
  };

  $scope.addReplacer = function() {
    $scope.replacers[$scope.newReplacer.match] = $scope.newReplacer.replacement;
    $scope.newReplacer = {
      match: '',
      replacement: ''
    }
    ChromeStorage.setValue('replacers', $scope.replacers);
  }

  $scope.removeReplacer = function(match) {
    delete $scope.replacers[match];
    ChromeStorage.setValue('replacers', $scope.replacers);
  }

  $scope.toggleEnabled = function() {
    $scope.enabled = !$scope.enabled;
    ChromeStorage.setValue('enabled', $scope.enabled);
  }

  ChromeStorage.getValue('replacers').then(function(replacers) {
    $scope.replacers = replacers || {};
  });
  ChromeStorage.getValue('enabled').then(function(enabled) {
    $scope.enabled = enabled;
  });
}

export default PopupCtrl;
