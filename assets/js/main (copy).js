var token=localStorage.getItem('token');

$.ajax({ 
	type: 'GET',
    url: 'http://127.0.0.1:5000/protected', 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
  		console.log(response);
  		$('.loginname').text('Welcome, '+response.logged_in_as.toUpperCase());
    },
    error: function(response){
        console.log(response);
        alert('Session expired.Please login again');
        window.location.replace("login.html");
    }
});

$(document).ready(function(){

$('.usersearch').keyup(function(e){
    if (e.key==='Enter'){
        usersearch();
    }
});

    $('.productsearch').keyup(function(){
        var value = $(this).val().toLowerCase();
        $("tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
     
    });

    $('.ordersearch').keyup(function(){
        var value = $(this).val().toLowerCase();
        $("tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
     
    });

    $('.datepicker').on('change',function(){
        var datevalue=$('.datepicker').val();
        var data=$('.datepicker').data('name');
        if(datevalue){
        if (data=='dashboard'){
            console.log(datevalue);
        loaddashboard(datevalue);
        }
        else if(data=='transactions'){
            displaytransactions(datevalue);
        }
        else if(data=='orders'){
            displayorders(datevalue);
        }
    }
    });
    $('[data-toggle="tooltip"]').tooltip();

});

function usersearch(){
        var value = $('.usersearch').val().toLowerCase();
        $.ajax({ 
    type: 'GET',
    url: 'http://127.0.0.1:5000/users',
    data: 'user='+value, 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        var block='';
        if(response.status=='Blocked'){
        block='checked';
        }
        console.log(response);
        console.log(value);
        var msg='<tr class="'+response.username+'">'+
        'div>'+
        '<td>'+response.username+'</td>'+
        '<td>'+response.name+'</td>'+
        '<td>'+response.wallet+'</td>'+
        '<td><input type="text" name="email" class="userpass text-sm" value="'+response.email+'"></td>'+
        '<td>'+response.phone+'</td>'+
        '<td>'+response.group+'</td>'+
        '<th><input class="form-control userpass" name="status" value="Blocked" type="checkbox" '+block+'></th>'+
        '<td><input type="text" name="password" placeholder="New password" class="userpass text-sm"></td>'+
        '<th><button class="btn btn-success" onclick="displayuserupdate(\''+response.username+'\')"><span class="fa fa-check"></span></button><button class="btn btn-danger" onclick="displayuserdelete(\''+response.username+'\')"><span class="fa fa-trash"></span></button></th>'+
        '</div>'+
        '</tr>';
        $('tbody').html(msg);
        
    },
    error: function(response){
        console.log(response.responseText);
        $('tbody').html('User not found');
        
    }
});
     
    }

function createuser(){
    var data=$('.createuser').serializeArray();
    var arr={};
    jQuery.each(data, function() {
        arr[this.name] = this.value || '';
    });
    console.log(arr);
    // console.log(JSON.stringify(arr));
    $.ajax({ 
    type: 'POST',
    url: 'http://127.0.0.1:5000/users',
    data: JSON.stringify(arr), 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-success beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Success!</strong> User has been created successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error!</strong> Username already exists.</div>'+
    '</div>';
    $('.alertbar').append(msg);
        
    }
});
}

function addmoney(arr){
    $('#myModal').modal('hide');
    var data=$('.addmoney').serializeArray();
    var arr={};
    jQuery.each(data, function() {
         arr[this.name] = this.value || '';
     });
    console.log(arr);
    $('input').val('');

    $.ajax({ 
    type: 'PUT',
    url: 'http://127.0.0.1:5000/walletoptions',
    data: JSON.stringify(arr), 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-success beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Success!</strong> Amount has been added successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error!</strong> Cannot add money, please check username is correct.</div>'+
    '</div>';
    $('.alertbar').append(msg)
    }
});
}

function addproduct(){

    var data=$('.addproduct').serializeArray();
    var arr={};
    jQuery.each(data, function() {
        arr[this.name] = this.value || '';
    });
    console.log(arr);
    $('.addproduct').val('');

    $.ajax({ 
    type: 'POST',
    url: 'http://127.0.0.1:5000/products',
    data: JSON.stringify(arr), 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-success beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Success!</strong> Product has been added successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    displayproducts();
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error!</strong> Product could not be added.</div>'+
    '</div>';
    $('.alertbar').append(msg)
    }
});

}

function displayproducts(){
    $.ajax({ 
    type: 'GET',
    url: 'http://127.0.0.1:5000/products', 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){
        $('tbody').html(''); 
        console.log(response);

        response.forEach(function(data){
        var main='';
        if(data.status=='Main'){
        main='checked';
        }
        var msg='<tr class='+data.id+'>'+
        '<th>'+data.product_name+'</th>'+
        '<th><input class="form-control '+data.id+'" type="text" value="'+data.available+'" name="quantity"></th>'+
        '<th><input class="form-control '+data.id+'" type="text" value="'+data.price+'" name="price"></th>'+
        '<th>'+data.category+'</th>'+
        '<th><input class="form-control '+data.id+'" name="status" value=Main type="checkbox" '+main+'></th>'+
        '<th><button class="btn btn-success" onclick="updateproduct(\''+data.id+'\')"><span class="fa fa-upload"></span></button><button class="btn btn-danger" onclick="displaydelete(\''+data.id+'\',\''+data.product_name+'\')"><span class="fa fa-trash"></span></button></th>';
        $('tbody').append(msg);
        });
    }
});
}

function updateproduct(id){
    var data=$('.'+id).serializeArray();
    var arr={};
    jQuery.each(data, function() {
        arr[this.name] = this.value || '';
    });
    arr['id']=id;
    console.log(arr);

    $.ajax({ 
    type: 'PUT',
    url: 'http://127.0.0.1:5000/products',
    data: JSON.stringify(arr), 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-success beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Success !</strong> Product has been modified successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error !</strong> Product cannot be modified. </div>'+
    '</div>';
    $('.alertbar').append(msg);
    }
});

}

function deductmoney(){
    $('#myModal').modal('hide');
    var data=$('.deductmoney').serializeArray();
    var arr={};
    jQuery.each(data, function() {
        arr[this.name] = this.value || '';
    });
    console.log(arr);
    $('input').val('');

    $.ajax({ 
    type: 'DELETE',
    url: 'http://127.0.0.1:5000/walletoptions',
    data: JSON.stringify(arr), 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-warning beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Warning!</strong> Amount has been deducted successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error!</strong> Cannot deduct money, please check username is correct.</div>'+
    '</div>';
    $('.alertbar').append(msg)
    }
});
}

function deleteproduct(id){
    $('#myModal').modal('hide');
    var arr={};
    arr['id']=id;
    $('.'+id).hide();
    $.ajax({ 
    type: 'DELETE',
    url: 'http://127.0.0.1:5000/products',
    data: JSON.stringify(arr), 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-warning beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>DELETE !</strong> Product has been deleted successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error !</strong> Product cannot be deleted.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    }
});
}

function displayorders(date){
    if(date){
        todaydate = date;
    }
    else{
    var today = new Date();
    var todaydate = today.getFullYear()+'-'+("0" + (today.getMonth() + 1)).slice(-2)+'-'+today.getDate();
}
    $('tbody').html('');
    $.ajax({ 
    type: 'GET',
    url: 'http://127.0.0.1:5000/orders', 
    data: 'date='+todaydate,
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        response.forEach(function(data){
            var refund='<th><button class="btn btn-primary '+data.transac_num+'" onclick="displayrefund(\''+data.transac_num+'\')"><span class="fa fa-reply"></span></button></th>';
        if (data.status=='Refund'){
            refund='';
        }
        var msg='<tr class='+data.transac_num+'>'+
        '<th>'+data.username+'</th>'+
        '<th>'+data.product+'</th>'+
        '<th>'+data.quantity+'</th>'+
        '<th>'+data.amount+'</th>'+
        '<th>'+data.transac_num+'</th>'+
        '<th>'+data.datetime+'</th>'+
        '<th>'+data.status+'</th>'+refund;
        $('tbody').append(msg);
    });
    },
    error: function(response){
        console.log(response);
    }
});
}

function deleteorders(tranc){
    var arr={};
    arr['transac_num']=tranc;
    $.ajax({ 
    type: 'DELETE',
    url: 'http://127.0.0.1:5000/orders', 
    data: JSON.stringify(arr),
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-warning beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>DELETE !</strong> Order has been Deleted successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    $('.'+tranc).hide();
        
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error !</strong> Order cannot be deleted.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    }
});
}

function refundmoneyorder(tranc){
    $('#myModal').modal('hide');
    var arr={};
    arr['transac_num']=tranc;
    $.ajax({ 
    type: 'PUT',
    url: 'http://127.0.0.1:5000/orders', 
    data: JSON.stringify(arr),
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-success beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Success !</strong> Order has been cancelled and refunded successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    setTimeout(function(){
            location.reload();
          }, 3000);
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error !</strong> Refund cannot be processed.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    }
});
}

function loaddashboard(date){
    if(date){
        console.log(date);
    displaychart(date);
    }
    else{
    var today = new Date();
    var todaydate = today.getFullYear()+'-'+("0" + (today.getMonth() + 1)).slice(-2)+'-'+today.getDate();
    console.log(todaydate);
    displaychart(todaydate);

    }
    
}

function displaychart(date){

    $.ajax({ 
    type: 'GET',
    url: 'http://127.0.0.1:5000/sales', 
    data: 'date='+date,
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(data){ 
        console.log(data);
        $('.revenue').text('₹ '+data.amount);
        $('.orders').text(data.orders);
        $('.addedtoday').text('₹ '+data.addedamount);
    },
    error: function(response){
        console.log(response);
    }
});


$.ajax({ 
    type: 'GET',
    url: 'http://127.0.0.1:5000/orders',
    data: 'date='+date, 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var value={};
        var categ={};
        var quan=0;
        response.forEach(function(data){
            if(value[data.product]){
                quan=value[data.product]
                value[data.product]=quan+data.quantity;
            }
            else{
                value[data.product]=data.quantity;
            }
        });

        response.forEach(function(data){
            if(categ[data.category]){
                quan=value[data.product]
                categ[data.category]=quan+data.quantity;
            }
            else{
                categ[data.category]=data.quantity;
            }
        });

        console.log(value);
        $('.orderchart').html('<div class="chart-area"><canvas id="myChart"  height="170"></div>')
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
        position: 'left',
        labels: Object.keys(value),
        datasets: [{
            data: Object.values(value),
             backgroundColor: ['#ff6666','#79ff4d','#1a8cff','#ffff4d','#4dffff','#bf80ff'],
            pointBackgroundColor: 'rgba(255,88,130,1)',
            borderColor: [
                '#ff6666',
                '#79ff4d',
                '#1a8cff',
                '#ffff4d',
                '#4dffff',
                '#bf80ff'
            ],
            borderWidth: 1
            }]
        },
        options: {
        }
        });

//for category chart
        $('.ordercategchart').html('<div class="chart-area"><canvas id="myChart2"  height="170"></div>')
        var ctx = document.getElementById('myChart2').getContext('2d');
        var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
        position: 'left',
        labels: Object.keys(categ),
        datasets: [{
            data: Object.values(categ),
             backgroundColor: ['#ff6666','#79ff4d','#1a8cff','#ffff4d','#4dffff','#bf80ff'],
            pointBackgroundColor: 'rgba(255,88,130,1)',
            borderColor: [
                '#ff6666',
                '#79ff4d',
                '#1a8cff',
                '#ffff4d',
                '#4dffff',
                '#bf80ff'
                ],
                borderWidth: 1
            }]
        },
        options: {
        }
    });


    },
    error: function(response){
        console.log(response);
    }
});


$.ajax({ 
    type: 'GET',
    url: 'http://127.0.0.1:5000/weeksales', 
    data: 'date='+date,
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(data){ 
    var list= Object.values(data);
    console.log(list);
    var saleamt=0;
    list.forEach(function(val){
    if(val[0]){
    saleamt=saleamt+ val[0];
    }
    });
    $('.weekly').text('₹ '+saleamt);
        //console.log(data);
        var ctx = document.getElementById('myChart3').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        position: 'left',
        labels: Object.keys(data),
        datasets: [{
            label: 'Weekly Performance (in ₹)',
            data: Object.values(data),
            backgroundColor: 'rgba(204, 245, 255,.2)',
            borderColor: '#0066ff',
            pointBackgroundColor: '#0033cc',
            borderWidth: 2.5,
            pointRadius:4
        }]
    },
    options: {
        scales: {
        xAxes: [{
            gridLines: {
                display:false
            }
        }]
        }
        }
    });

    },
    error: function(response){
        console.log(response);
    }
});


$.ajax({ 
    type: 'GET',
    url: 'http://127.0.0.1:5000/monthsales', 
    data: 'date='+date,
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(data){ 
        console.log(data);
        var ctx = document.getElementById('myChart4').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        position: 'left',
        labels: Object.keys(data),
        datasets: [{
            label: 'Monthly Performance (in ₹)',
            data: Object.values(data),
            backgroundColor: 'rgba(230, 255, 230,.5)',
            borderColor: '#33ff33',
            pointBackgroundColor: '#33ff33',
            borderWidth: 2.5,
            pointRadius:4
        }]
    },
    options: {
        scales: {
        xAxes: [{
            gridLines: {
                display:false
            }
        }]
        }
        }
    });

    },
    error: function(response){
        console.log(response);
    }
});

}

function logout(){
    localStorage.removeItem('token');
    window.location.replace("login.html");
}

function report(){
   
    $.ajax({ 
    type: 'GET',
    url: 'http://127.0.0.1:5000/report',
    headers:{
        'Authorization':'Bearer '+token
    },
    success: function(response){ 
        //console.log(response);
        //window.location = response;
        var blob = new Blob([response],
                { type: "text/plain;charset=utf-8" });
        saveAs(blob, "static.txt");
    },
    error: function(response){
        console.log(response);
    }
    });
   
}

function updateuser(username){
    $('#myModal').modal('hide');
    var data=$('.userpass').serializeArray();
    var arr={};
    jQuery.each(data, function() {
        arr[this.name] = this.value || '';
    });
    arr['username']=username;
    console.log(arr);
    $.ajax({ 
    type: 'PUT',
    url: 'http://127.0.0.1:5000/users',
    data: JSON.stringify(arr), 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-success beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Edit !</strong> User details has been changed successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error !</strong> Userdetails cannot be changed.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    }
});

}

function deleteuser(username){
    $('#myModal').modal('hide');
    var arr={};
    arr['username']=username;
    $.ajax({ 
    type: 'DELETE',
    url: 'http://127.0.0.1:5000/users',
    data: JSON.stringify(arr), 
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        var msg='<div role="alert" class="alert alert-warning beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Delete !</strong> User has been deleted successfully.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    $('.'+username).hide();
    },
    error: function(response){
        console.log(response);
        var msg='<div role="alert" class="alert alert-danger beautiful">'+
    '<div><button type="button" class="close" data-dismiss="alert"><span>×</span></button>'+
        '<strong>Error !</strong> User cannot be deleted, please check username is correct.</div>'+
    '</div>';
    $('.alertbar').append(msg);
    }
});
}

function displaytransactions(date){
    if(date){
        todaydate=date;
    }
    else{
    var today = new Date();
    var todaydate = today.getFullYear()+'-'+("0" + (today.getMonth() + 1)).slice(-2)+'-'+today.getDate();
}
    $('tbody').html('');
    $.ajax({ 
    type: 'GET',
    url: 'http://127.0.0.1:5000/transactions', 
    data: 'date='+todaydate,
    headers:{
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
    },
    success: function(response){ 
        console.log(response);
        response.forEach(function(data){
        var msg='<tr>'+
        '<th>'+data.transac_num+'</th>'+
        '<th>'+data.user+'</th>'+
        '<th>'+data.admin+'</th>'+
        '<th>'+data.time+'</th>'+
        '<th>'+data.amount+'</th>'+
        '<th>'+data.type+'</th>';
        //'<th><button class="btn btn-primary" onclick="refundmoneyorder(\''+data.transac_num+'\')"><span class="fa fa-reply"></span></button><button class="btn btn-danger" onclick="deleteorders(\''+data.transac_num+'\')"><span class="fa fa-trash"></span></button></th>';
        $('tbody').append(msg);
    });
    },
    error: function(response){
        console.log(response);
    }
});
}

function displaypopup(name,action,col){
    if(name=='add'){
     var data=$('.addmoney').serializeArray();
}
else{
    var data=$('.deductmoney').serializeArray();
}
var arr={};
    jQuery.each(data, function() {
        arr[this.name] = this.value || '';
    });
    console.log('kise');
    var model='<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h4 class="modal-title">Alert</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+
        '<div class="modal-body">'+
          '<h3 align="center">Are you sure want to '+name+' money to : '+arr.username+' </h3>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button style="margin-right:65%" class="btn btn-'+col+'" onclick="'+action+'()">Confirm</button>'+
          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
      '</div>'+
      '</div>';
      $('#myModal').html(model);
      $('#myModal').modal('show');
}

$('#myModal').modal({
    show:'false'
}); 

function displaydelete(id,name){
    var model='<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h4 class="modal-title">Delete</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+
        '<div class="modal-body">'+
          '<h3 class="text-danger" align="center">Are you sure want to delete '+name+'?</h3>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button style="margin-right:65%"  class="btn btn-danger" onclick="deleteproduct('+id+')">Confirm</button>'+
          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
      '</div>'+
      '</div>';
      $('#myModal').html(model);
      $('#myModal').modal('show');
}

function displayrefund(trnum){
    var model='<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h4 class="modal-title">Delete</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+
        '<div class="modal-body">'+
          '<h3 align="center">Are you sure want to refund money for order num: <h4 class="text-info">'+trnum+'</h4></h3>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button style="margin-right:65%" class="btn btn-success" onclick="refundmoneyorder(\''+trnum+'\')">Confirm</button>'+
          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
      '</div>'+
      '</div>';
      $('#myModal').html(model);
      $('#myModal').modal('show');
}

function displayuserdelete(deluser){
    var model='<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h4 class="modal-title">Delete</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+
        '<div class="modal-body">'+
          '<h3 align="center">Are you sure want to delete user: <h4 class="text-info" align="center">'+deluser+' </h4></h3>'+
          
        '</div>'+
        '<div class="modal-footer">'+
        '<button style="margin-right:65%" class="btn btn-danger" onclick="deleteuser(\''+deluser+'\')">Confirm</button>'+
          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
      '</div>'+
      '</div>';
      $('#myModal').html(model);
      $('#myModal').modal('show');
}

function displayuserupdate(upuser){
    var model='<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h4 class="modal-title">Update</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+
        '<div class="modal-body">'+
          '<h3 align="center">Update details of user: <h4 class="text-info" align="center">'+upuser+' </h4></h3>'+
          
        '</div>'+
        '<div class="modal-footer">'+
        '<button style="margin-right:65%" class="btn btn-danger" onclick="updateuser(\''+upuser+'\')">Confirm</button>'+
          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
      '</div>'+
      '</div>';
      $('#myModal').html(model);
      $('#myModal').modal('show');
}