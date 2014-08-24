/* jshint unused:false, camelcase:false */
/* global geocode */

(function(){
  'use strict';

  $(document).ready(function(){
    $('button[type=submit]').click(addTrip);
  });

  function addTrip(e){
    var origin        = $('#originName').val(),
        destination   = $('#destinationName').val();


    geocode(origin, function(name, lat, lng){
      $('#originName').val(name);
      $('#beginLat').val(lat);
      $('#beginLng').val(lng);
      console.log(name);
      console.log(lat);

      geocode(destination, function(name, lat, lng){
        $('#destinationName').val(name);
        $('#endLat').val(lat);
        $('#endLng').val(lng);
        console.log(name);
        console.log(lat);

        $('form').submit();
      });
    });
    e.preventDefault();
  }
})();
