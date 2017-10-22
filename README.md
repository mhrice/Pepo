## Inspiration
We wanted to build a web application that would be fun and interactive to use. We felt that a dynamic visualizer that maps nearby connections would be quite compelling.

## What it does
Pepo is at heart a data visualizer software; it beautifully shows you the people in your surrounding area based on their social metric and also displays their Facebook connections in real time.  

## How We built it
Pepo was primarily built on the React framework and the React-Vis library in particular for data visualization. We also utilized other nifty JS frameworks for geohashing and used Firebase for our DB backend. The process of building Pepo itself was quite simple, we came up with the idea on the spur of the moment, spent an hour or so brainstorming the data structures, libraries, and other algorithms involved, then started coding.

## Challenges We ran into
We ran into a lot of challenges. Specifically, we had this one bug where some edges of the graph were not being rendered correctly that was particularly frustrating, to say the least. More generally, there were also a lot of other issues concerning dependencies and various libraries conflicting, deployment issues with geolocation and https, difficulties with race conditions and React states, and more. We also had trouble implmenting the twilio chat as it was our first time implementing a node.js backend. 

## Accomplishments that We're proud of
Implementing a twilio programmable chat app, creating a cool facebook visualization

## What We learned
We learned a lot about React and Node JS and became much more experienced with the framework. In general, we were able to sharpen a variety of skills including, but not limited to: problem solving, database structure design, pair programming, and agile web development. We also learned how to set up the twilio api to create a chat program. 
## What's next for Pepo
Dynamic location updates
Dynamically render real time connection changes
Streamline location based chat
Integrate different social medias and normalize social metric to display
Mobile version
