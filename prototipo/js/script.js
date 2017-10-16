$(document).ready(function() {
	$('[data-toggle=offcanvas]').click(function() {
		$('.row-offcanvas').toggleClass('active');
	});
	
	var msg ="";
	var msgbox1 = "<div class='col-md-12 user-msg text-right text-light' ><div class='p-4 pl-5 ml-auto bg-primary rounded d-inline-block' ><span>";
	var msgbox2 = "</span></div></div>";
	var counter = 0;
	$(".bot-msg").eq(counter).show(400);
	$("#send").click(function(){
		msg = $("#input").val();
		$("#input").val("");
		$(".bot-msg").eq(counter).after(msgbox1 + msg + msgbox2);
		counter++;
		$(".bot-msg").eq(counter).show("slow");//removeClass("d-none");
		//$("#msg-container").animate({ scrollTop: $(document).height()-$(window).height() });
		var objDiv = document.getElementById("msg-container");
		objDiv.scrollTop = objDiv.scrollHeight;
	});
  
});
