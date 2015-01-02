'use strict';
var POLARIS = POLARIS || {};
Backbone.View.prototype.eventAggregator = Backbone.View.prototype.eventAggregator || _.extend({}, Backbone.Events);

$(function() {
  
  $('[data-input-focus="tooltip"]').popover({
    container: 'body',
    content: 'Provide a comma-separated list:<br>John Hughes, James Cameron',
    html: 'true',
    placement: 'top',
    trigger: 'focus'
  });
  
  if ($('.actor-form')) {
    // WYLO .... Create _and instantiate_ a Backbone view for the list form
  }
  
});