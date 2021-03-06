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
        // Initialize the previous and next data-page attributes
        $('#previous').data('page');
        $('#next').data('page');
        if ($('#byActorName').val().length > 0) {
          $('#actorFilterSubmit').removeClass('disabled');
        }
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
        'keydown #byActorName': 'onActorChangeDown',
        'keyup #byActorName': 'onActorChangeUp',
        'click .btn-edit': 'onEditClick',
        'click #editSubmit': 'onEditSubmitClick',
        'click .btn-delete': 'onDeleteClick',
        'click #deleteSubmit': 'onDeleteSubmitClick',
        'click #previous': 'onPageClick',
        'click .pagination-link': 'onPageClick',
        'click #next': 'onPageClick'
      },
      
      onActorChangeDown: function(event) {
        if (event.keyCode == 13 && $('#byActorName').val().length == 0) {
          event.preventDefault();
        }
      },

      onActorChangeUp: function(event) {
        if ($('#byActorName').val().length > 0) {
          $('#actorFilterSubmit').removeClass('disabled');
        } else {
          $('#actorFilterSubmit').addClass('disabled');
        }
      },
      
      onEditClick: function(event) {
        $('.edit-success').addClass('hidden');
        $(event.currentTarget).closest('.video-row').children('td').each(function(index) {
          var content = $(this).html();
          if (index == 0) {
            $('#title').val(content);
          } else if (index == 1) {
            $('#description').val(content);
          } else if (index == 2) {
            $('#producers').val(content);
          } else if (index == 3) {
            $('#actors').val(content);
          }
        });
        $('#editId').val($(event.currentTarget).data('edit-id'));
        $('#editSubmit').removeClass('disabled');
      },

      onEditSubmitClick: function(event) {
        $('#editSubmit').addClass('disabled');
        var id = $('#editId').val();
        $.ajax({
          data: {
            id: id,
            title: $('#title').val(),
            description: $('#description').val(),
            producers: $('#producers').val(),
            actors: $('#actors').val()
          },
          type: 'PUT',
          url: '/edit'
        }).done(function() {
          $('[data-edit-id="'+id+'"]').closest('.video-row').children('td').each(function(index) {
            if (index == 0) {
              $(this).html($('#title').val());
            } else if (index == 1) {
              $(this).html($('#description').val());
            } else if (index == 2) {
              $(this).html($('#producers').val());
            } else if (index == 3) {
              $(this).html($('#actors').val());
            }
          });
          $('.edit-success').removeClass('hidden');
          $('#editSubmit').removeClass('disabled');
        });
      },

      onDeleteClick: function(event) {
        $('#sure').removeClass('hidden');
        $('.delete-success').addClass('hidden');
        $('#deleteId').val($(event.currentTarget).data('delete-id'));
        $('#deleteSubmit').removeClass('disabled');
      },

      onDeleteSubmitClick: function(event) {
        $('#deleteSubmit').addClass('disabled');
        var id = $('#deleteId').val();
        $.ajax({
          data: {id:id},
          type: 'DELETE',
          url: '/edit'
        }).done(function() {
          $('[data-delete-id="'+id+'"]').closest('.video-row').remove();
          $('#sure').addClass('hidden');
          $('.delete-success').removeClass('hidden');
        });
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
            actorName: $('#byActorName').val(),
            pageChange: true
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
                '<td>' +
                  '<button type="button" class="btn btn-default btn-edit" data-toggle="modal" data-target="#edit" data-edit-id="'+currentVideo.videoId+'">' +
                    '<span class="glyphicon glyphicon-pencil"></span> Edit' +
                  '</button>' +
                '</td>' +
                '<td>' +
                  '<button type="button" class="btn btn-default btn-delete" data-toggle="modal" data-target="#delete" data-delete-id="'+currentVideo.videoId+'">' +
                    '<span class="glyphicon glyphicon-remove"></span> Delete' +
                  '</button>' +
                '</td>' +
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
