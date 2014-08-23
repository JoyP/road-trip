/* jshint unused:false, camelcase:false */
/* global geocode */

(function(){
  'use strict';

  $(document).ready(function(){
    $('button[type=submit]').click(addTrip);
  });

  function addTrip(e){
    var origin        = $('#origin').val(),
        destination   = $('#destination').val();


    geocode(origin, function(name, lat, lng){
      $('#origin').val(name);
      $('#beginLat').val(lat);
      $('#beginLng').val(lng);
      console.log(name);
      console.log(lat);

      geocode(destination, function(name, lat, lng){
        $('#destination').val(name);
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
