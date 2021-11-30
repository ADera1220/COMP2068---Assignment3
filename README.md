<h1>COMP 2068 | Assignment 3</h1>
<h2>PlayCalendar</h2>

<h3>About</h3>
<p>This project allows individual users to track their video games, be they upcoming or released, and their play time. Allowing YouTube videos to be embedded, play hours to be tracked and updated. I attempted a number of additional features, but I found myself either relying too heavily on outside code, or simply confused about how to implement these features specifically with Handlebars/express.</p>

<h4>Additional Features</h4>
<h5>Google Authentication</h5>
<p>Google Authentication turned out to be rather difficult, and still doesn't work as intended. While it creates a valid user record in the database, it does not store a username, and I did not plan adequate time to try and resolve this issue. Users CAN use Google Authentication in this build, and the site will function perfectly, however, there is no username for these users. When implementing, the Google OAuth API would not work unless I altered the way in which the passport module reads/writes, I have linked below the Thread with the code that fixed my issue.</p>

<h5>Youtube Videos</h5>
<p>This feature turned out very well, except for the sizing of iframes, which I have not worked with before this project, i believe. The thread below details the main chunk of the process, but when a user copies a link from youtube, be it an embed or watch link, the built in function to the edit-POST method taked the url, uses RegEx to isolate YouTube's video Id string, and stores THAT in the document. When the record is called into the index view, the iframe appends that ID onto a standard youtube embed link, showing the video. The process I used is detailed in the StackOverflow link below</p>

<h4>References</h4>
<p>At 
    <a href='https://stackoverflow.com/questions/21607808/convert-a-youtube-video-url-to-embed-code/21607897'>This link</a>
    You will find a stack overflow thread that covers converting a youtube link into an embed link. I used this code to help with the implementation of the trailers in the index view of games
</p>

<p>
    At
    <a href='https://stackoverflow.com/questions/33682152/user-findorcreate-is-not-a-function-passport-facebook'>
    This link
    </a>
    you will find a StackOverflow thread that helped me fix an issue with Google authentication. I recommended an npm package call mongoose-findOrCreate, which added a special plugin for mongoose to be added in the schema. This was necessary to get Google Auth working as intended
</p>