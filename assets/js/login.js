var token=localStorage.getItem('token');

$.ajax({ 
	type: 'GET',
    url: 'http://34118b73b70d.ngrok.io/protected', 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
  		console.log(response);
  		window.location.replace("index.html");
    },
    error: function(response){
        console.log(response);
    }
});


function submit(){
    console.log('kise');
var data=$('input').serializeArray();
var arr={};
jQuery.each(data, function() {
        arr[this.name] = this.value || '';
    });
console.log(arr);
$.ajax({ 
    type: 'POST',
    url: 'http://127.0.0.1:5000/login',  
    data: JSON.stringify(arr),
    headers:{
        'Content-Type': 'application/json'
    },
    success: function(response){ 
            console.log(response);
            localStorage.setItem('token',response.access_token);
            window.location.replace("index.html");
    },
    error: function(response){
        console.log(response)
      var msg='<div class="container">'+
                  '<div class="alert alert-danger alert-dismissible fade in">'+
                  '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+
                  '<strong>Errror!</strong> Please check your username and password.'+
                  '</div>'+
                  '</div>';
          $('body').prepend(msg);
        console.log('kk');
    } 
});

}