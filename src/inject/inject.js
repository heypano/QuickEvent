chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			console.log("Hello. This message was sent from scripts/inject.js");
			// ----------------------------------------------------------

			googleCalendarAuthStuff();

			$('body').mouseup(function() {
				var text = getSelectedText();
				console.log(text);
			});

			function getSelectedText(){
				var textSelection;
				if (window.getSelection) {
					textSelection = window.getSelection().toString();
				} else if (document.selection) {
					textSelection = document.selection.createRange().text;
				}
				return textSelection;
			}

		}
	}, 10);
});


function googleCalendarAuthStuff(){
	var CLIENT_ID = '731954720557-eqem1gq4vo4vjsgegigt1mpubj8kkfl4.apps.googleusercontent.com';
	var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

	checkAuth();

	/**
	 * Check if current user has authorized this application.
	 */
	function checkAuth() {
		gapi.auth.authorize(
			{
				'client_id': CLIENT_ID,
				'scope': SCOPES.join(' '),
				'immediate': true
			}, handleAuthResult);
	}

	/**
	 * Handle response from authorization server.
	 *
	 * @param {Object} authResult Authorization result.
	 */
	function handleAuthResult(authResult) {
		loadCalendarApi();
		/*var authorizeDiv = document.getElementById('authorize-div');
		if (authResult && !authResult.error) {
			// Hide auth UI, then load client library.
			// Hide auth UI, then load client library.
			authorizeDiv.style.display = 'none';

		} else {
			// Show auth UI, allowing the user to initiate authorization by
			// clicking authorize button.
			authorizeDiv.style.display = 'inline';
		}*/
	}

	/**
	 * Initiate auth flow in response to user clicking authorize button.
	 *
	 * @param {Event} event Button click event.
	 */
	function handleAuthClick(event) {
		gapi.auth.authorize(
			{client_id: CLIENT_ID, scope: SCOPES, immediate: false},
			handleAuthResult);
		return false;
	}

	/**
	 * Load Google Calendar client library. List upcoming events
	 * once client library is loaded.
	 */
	function loadCalendarApi() {
		gapi.client.load('calendar', 'v3', listUpcomingEvents);
	}

	/**
	 * Print the summary and start datetime/date of the next ten events in
	 * the authorized user's calendar. If no events are found an
	 * appropriate message is printed.
	 */
	function listUpcomingEvents() {
		var request = gapi.client.calendar.events.list({
			'calendarId': 'primary',
			'timeMin': (new Date()).toISOString(),
			'showDeleted': false,
			'singleEvents': true,
			'maxResults': 10,
			'orderBy': 'startTime'
		});

		request.execute(function(resp) {
			var events = resp.items;
			appendPre('Upcoming events:');

			if (events.length > 0) {
				for (i = 0; i < events.length; i++) {
					var event = events[i];
					var when = event.start.dateTime;
					if (!when) {
						when = event.start.date;
					}
					appendPre(event.summary + ' (' + when + ')')
				}
			} else {
				appendPre('No upcoming events found.');
			}

		});
	}

	/**
	 * Append a pre element to the body containing the given message
	 * as its text node.
	 *
	 * @param {string} message Text to be placed in pre element.
	 */
	function appendPre(message) {
		console.log("message");
		/*
		var pre = document.getElementById('output');
		var textContent = document.createTextNode(message + '\n');
		pre.appendChild(textContent);
		*/
	}

}
