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
        // Initialize the previous and next data- attributes
        $('#previous').data('page');
        $('#next').data('page');
      },
      
      render: function() {
        $('#byActorName').prop('disabled', false);
        var currentInput = $('input[name="current"]');
        var currentPage = 0;
        if (currentInput) {
          currentPage = currentInput.val();
          var previous = $('#previous').parent();
          if (currentPage == 1) {
            previous.addClass('disabled');
          } else {
            previous.removeClass('disabled');
          }
          $('.pagination-link').each(function() {
            var page = $(this).parent();
            page.removeClass('disabled');
            if ($(this).data('page') == currentPage) {
              page.addClass('active');
            } else {
              page.removeClass('active');
            }
          });
          var pagesInput = $('input[name="pages"]');
          if (pagesInput) {
            var totalPages = Number(pagesInput.val());
            var next = $('#next').parent();
            if (currentPage == 0 || Number($('#next').data('page')) > totalPages) {
              next.addClass('disabled');
            } else {
              next.removeClass('disabled');
            }
          }
        }
      },
      
      events: {
        'click #previous': 'onPageClick',
        'click .pagination-link': 'onPageClick',
        'click #next': 'onPageClick'
      },
      
      onPageClick: function(event) {
        event.preventDefault();
        var parent = $(event.currentTarget).parent();
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
        var view = this;
        $.ajax({
          data: {
            pageNumber: $(event.currentTarget).data('page'),
            current: $('input[name="current"]').val(),
            actorName: $('#byActorName').val()
          },
          dataType: 'json',
          type: 'POST'
        }).done(function(model) {
          console.log("The model returned by the POST to /list is: "+model);
          $('.video-row').remove();
          var videoList = $('#videoList');
          model.videos.forEach(function(currentVideo) {
            videoList.append(
              '<tr class="video-row">' +
                '<td>'+currentVideo.title+'</td>' +
                '<td>'+currentVideo.description+'</td>' +
                '<td>'+currentVideo.producers+'</td>' +
                '<td>'+currentVideo.actors+'</td>' +
                '<td>...</td>' +
                '<td>...</td>' +
              '</tr>'
            );
          });
          $('#previous').data('page', model.previous);
          $('input[name="current"]').val(model.current);
          $('#next').data('page', model.next);
          $('input[name="pages"]').val(model.videos[0].pages);
          view.render();
        });
      }
      
    });
    
    new POLARIS.VideoList({
      el: '.actor-form'
    });
  }
  
});
