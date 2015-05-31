import angular from 'angular';

import ChromeStorage from './services/cstorage';
import PopupCtrl from './controllers/popup';

angular.module('tnt', [])
  .service('ChromeStorage', ChromeStorage)
  .controller('PopupCtrl', PopupCtrl);

