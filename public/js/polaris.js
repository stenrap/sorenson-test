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
    POLARIS.VideoList = Backbone.View.extend({
      
      initialize: function() {
        this.render();
      },
      
      render: function() {
        $('#byActorName').prop('disabled', false);
        var currentInput = $('input[name="current"]');
        if (currentInput) {
          var currentPage = currentInput.val();
          var previous = $('#previous').parent();
          if (currentPage == 1) {
            previous.addClass('disabled');
          } else {
            previous.removeClass('disabled');
          }
          $('.pagination-link').each(function() {
            var page = $(this).parent();
            if ($(this).data('page') == currentPage) {
              page.addClass('active');
            } else {
              page.removeClass('active');
            }
          });
          // TODO: Disable or enable #next (perhaps by adding a hidden input whose value is the total number of pages)
        }
      },
      
      events: {
        'click #previous': 'onPageClick',
        'click .pagination-link': 'onPageClick',
        'click #next': 'onPageClick'
      },
      
      onPageClick: function(event) {
        event.preventDefault();
        var parent = $(event.target).parent();
        if (parent.hasClass('disabled') || parent.hasClass('active')) {
          return;
        }
        $('#byActorName').prop('disabled', true);
        var previous = $('#previous').parent();
        var next = $('#next').parent();
        previous.addClass('disabled');
        next.addClass('disabled');
        $('.pagination-link').each(function() {
          var page = $(this).parent();
          page.addClass('disabled');
        });
        // WYLO .... Get the page number, make a POST to /list, then call render() in $.ajax().done()
      }
      
    });
    
    new POLARIS.VideoList({
      el: '.actor-form'
    });
  }
  
});
