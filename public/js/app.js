var editor = {};

function startTutorial(){
	introJs().setOptions({
		'skipLabel': 'Salta',
		'showStepNumbers': 'false',
		'scrollToElement': 'true',
		steps:[
			  {
			  	intro: "<img src='img/general.png' class='portrait'/>"+
			  	"<div class='tutorial'>"+
			  		"<h4>Greetings Recruit!<h4>"+
			  		"<p>Welcome to <strong>Fortess Bastiani</strong>.</p>" +
			  		"<p>Your job here is to fix and operate the antimissile system. I'll give you a quick introduction so you can get to work as soon as possible.</p>"+
			  		"<p>We don't have much time, the enemy will strike soon!</p>" +
		  		"</div>"
			  },
              {
                element: document.querySelector('#mc-container'),
                intro: "<img src='img/general.png' class='portrait'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This is the <b>Missile Command Interface.</b></p>"+
			  		"<p>Click on it to control the antimissile batteries and stop the attack.</p>" +
		  		"</div>",
                position: "right"
              },
              {
              	element: document.querySelector('#editor-container'),
              	intro: "<img src='img/general.png' class='portrait'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This is the <b>Editor</b>.</p>" +
			  		"<p>Here you can look at the system's code and fix its problems in order to stop the attacks.</p>"+
		  		"</div>",
              	position: "bottom"
              },
              {
              	element: document.querySelector('#ButtonExecCode'),
              	intro: "<img src='img/general.png' class='portrait'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This button allows you to <b>execute</b> the code once you modified it.</p>" +
		  		"</div>",
              	position: "left"
              },
              {
              	element: document.querySelector('#ButtonResetCode'),
				intro: "<img src='img/general.png' class='portrait'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This button allows you to <b>revert</b> back to the original code if your changes don't satistiy you.</p>" +
		  		"</div>",
				position: "left"
              },
              {
            	element: document.querySelector('#ButtonGetHelp'),
				intro: "<img src='img/general.png' class='portrait'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>In case you are stuck you can ask the old mechanic, i'm sure he can give you somee <b>help</b>.</p>" +
		  		"</div>",
				position: "left"
			  },
              {
            	element: document.querySelector('#chat-panel'),
				intro: "<img src='img/general.png' class='portrait'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This is the <b>message area</b> , here is where you will recieve your orders. Directly from me.</p>" +
		  		"</div>",
				position: "bottom"
			  },
              {
                element: document.querySelector('#levels'),
                intro: "<img src='img/general.png' class='portrait'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>Here you will find all the <b>levels</b> already completed.</p>" +
		  		"</div>",
                position: "right"
              },
              {
                element: document.querySelector('#user'),
                intro: "<img src='img/general.png' class='portrait'/>"+
			  	"<div class='tutorial'>"+
			  		"<p>This is the <b>account page</b>.</p>"+
			  		"<p>Here you will find all your personal informations and progress.</p>" +
		  		"</div>",
                position: "right"
              }
            ]
	}).start();
}

$(document).ready(function () {
	// attiva i popover
	$('[data-toggle="popover"]').popover();

	// attiva Intro.JS
	if (level === 1) {
		startTutorial();
	}

	// CodeMirror
    editor = new Editor();
    editor.loadCode(level);

	// Missile Command
    missileCommand();

	// // CodeMirror: addon Panel
	// editor.addPanel("bottom", "Panel per feedback ad editor");

	// CodeMirror: addon Autocomplete
	if (typeof Promise !== undefined) {
	  var comp = [
		["here", "hither"],
		["asynchronous", "nonsynchronous"],
		["completion", "achievement", "conclusion", "culmination", "expirations"],
		["hinting", "advive", "broach", "imply"],
		["function","action"],
		["provide", "add", "bring", "give"],
		["synonyms", "equivalents"],
		["words", "token"],
		["each", "every"],
	  ]

	  function synonyms(cm, option) {
		return new Promise(function(accept) {
		  setTimeout(function() {
			var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
			var start = cursor.ch, end = cursor.ch
			while (start && /\w/.test(line.charAt(start - 1))) --start
			while (end < line.length && /\w/.test(line.charAt(end))) ++end
			var word = line.slice(start, end).toLowerCase()
			for (var i = 0; i < comp.length; i++) if (comp[i].indexOf(word) != -1)
			  return accept({list: comp[i],
							 from: CodeMirror.Pos(cursor.line, start),
							 to: CodeMirror.Pos(cursor.line, end)})
			return accept(null)
		  }, 100)
		})
	  }
	}

	editor.execCode = editor.execCode.bind(editor);
	editor.resetCode = editor.resetCode.bind(editor);
    $("#ButtonExecCode").click(function() {
	    var panel = editor.addPanel("bottom", "Code updated.");
		window.setTimeout(editor.removePanels.bind(editor), 2000, panel.id);
		editor.execCode();
	});
    $("#ButtonResetCode").click(function () {
		var panel = editor.addPanel("bottom", "Code reloaded.");
		window.setTimeout(editor.removePanels.bind(editor), 2000, panel.id);
		editor.resetCode();
	});

	$("#level-selector").find('.btn').click( function() {
		$(".btn-primary").removeClass('btn-primary');
		$(this).addClass('btn-primary');

		var lvl = $(this).text();

		$('.level-description').children('h3').html("Level " + lvl.toString());
		//TODO sostituire con descrizione del livello
		$('.level-description').children('p').html("<span>Example text for level " + lvl + "</span>");
	});

	$("#load-level-btn").click(function(){
		editor.applySolution();
		var lvl = $(".btn-primary").text();
		level = parseInt(lvl);

		//parse json for chat text
		$.getJSON("lvl/levels-chat.json", function(data){
			$("#chat-text").html(data[level - 1]);
		});

		$("#chat-panel").html("Livello " + lvl);
		editor.loadCode(level);
		missileCommand(true);
	});
});

$('#user').click(function () {
	var levelWidth = (level - 1) / 9 * 100;
	$('.progress-bar').attr("aria-valuenow", levelWidth).width(levelWidth + "%").text(level - 1);
	$('[name="score"]').text(score + " pts");

	$.get('/getUserBadge', function(data) {
		$.each(data, function (index, el) {
			enableBadge(el.name);
		});
	});

	$.get('/getLeaderboard', function (data) {
		$('#leaderboard > tbody > tr').remove();
		$.each(data, function(index, el) {
			var i = index + 1;
			$('#leaderboard > tbody').append('<tr><th scope="row">' + i +'</th><td>' + el.username + '</td><td>' + el.score + '</td></tr>');
		});
	});
});

$('#levels').click(function () {
	var button = $('#level-selector > div > a');
	$.each(button, function (index, el) {
		if (index < level ) {
			$(el).removeClass('disabled');
		}
	})
});

function enableBadge (name) {
	$('[name="' + name + '"]').removeClass('disabled');
}
