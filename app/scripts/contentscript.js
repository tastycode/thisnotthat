'use strict';

import { default as R } from 'ramda';
import ChromeStorage from './services/cstorage';
import q from 'q'

(function(global) {
  var replacementInProgress = false;
  var replacers = {};
  var storage = new ChromeStorage(q);

  let capitalize = function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  let casifiedReplacers = function() {
    //generate capitalized variants of the search and replace values
    var newReplacers = {};
    for (var k in replacers) {
      var v = replacers[k];
      newReplacers[capitalize(k)] = capitalize(v);
    }
    return R.merge(newReplacers, replacers);
  };

  let textNodes = function() {
      var node, 
          nodes = [],
          walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      while (node = walker.nextNode()) nodes.push(node);
      return nodes;
  };

  function replaceWords() {
    console.log('replacing words', replacers);
    textNodes().forEach(function(textNode) {
      var replaceMap = casifiedReplacers();
      Object.keys(replaceMap).forEach(function(replaceRex) {
        var value = replaceMap[replaceRex];
        textNode.textContent = textNode.textContent.replace(new RegExp(replaceRex, "g"), value);
      });
    });
  }

  storage.getValue('replacers').then(function(storedReplacers) {
    console.log('got replacers', storedReplacers);
    replacers = storedReplacers;
    replaceWords();
  });

  storage.watchValue('replacers', function(newValue, oldValue) {
    replacers = newValue;
    replaceWords();
  });


  document.body.addEventListener('DOMSubtreeModified', function() {
    if (replacementInProgress) return;
    replacementInProgress = true;
    replaceWords();
    setTimeout(function() {
      replacementInProgress = false;
    }, 1000);
  });

  document.body.addEventListener('DOMContentLoaded', function() {
    replacementInProgress = true;
    replaceWords();
    replacementInProgress = false;
  });
}(window));

