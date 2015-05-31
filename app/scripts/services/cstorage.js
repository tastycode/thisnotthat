
class ChromeStorage {
  constructor($q) {
    this.$q = $q;
  }

  getValue(key) {
    let deferred = this.$q.defer();
    chrome.storage.sync.get(key, function(result) {
      deferred.resolve(result[key]);
    });
    return deferred.promise;
  }
  watchValue(key, callback) {
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      if (!changes[key]) return;
      let change = changes[key];
      callback(change.newValue, change.oldValue);
    });
  }
  setValue(key, value) {
    let deferred = this.$q.defer();
    let setObject = {}
    setObject[key] = value;
    chrome.storage.sync.set(setObject, function(storage) {
      console.log('callback from set', storage);
      deferred.resolve(value);
    });
    return deferred.promise;
  }
}
export default ChromeStorage;
