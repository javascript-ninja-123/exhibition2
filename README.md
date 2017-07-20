I am using firebase realtime database to store blob, and timestamp.
Since I am using on() functionality, it is updated everytime a new story is added to the realtime database. It means that if an exsisting story is playing and if someone pushes a new stoy, a new story will be played before an exsisting story ends. I read the firebase realtime database documentation, but there is no way to wait and push data.However, I found something similar functionality called transaction(), but there are too less info and it does not say how to use it.

Second issue is get 404 blob not found and DOMException: The play() request was interrupted.
First time, I open output3.html, on javascript console, it says that either blob 404 is not found or DomException.
I figured out that play is asynchronous, and I have to use promise for that.
 so I used a promise the way people guided me, but it is not working. 
https://developers.google.com/web/updates/2017/06/play-request-was-interrupted

Thrid issue, I cannot add loop,setInterval, or another .on inside of either on or once Firebase functions. Therefore, I could not figure out a functionality that check wheather or not a new story is added, if not go and retrieve a second recent stroy and play.
 