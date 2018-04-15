# tippe.ru Report (Ben Allen, Nick Pearson)
tippe.ru is an anonymous secret sharing website. The site is built as a web app where users can post text and image content. The posts are location based, initially only being seen by people in the immediate area. If a post gets a lot of traction it is promoted to a wider area and seen by more people.

## A for HTML
We used the Jade framework to generate valid HTML pages. We regularly verified our pages against the HTML validator to ensure our client side dynamic page content also produced valid HTML.
## A for CSS
We integrated the Materialize framework. We used a seperate stylesheet to modify the framework to fit our design. We used CSS transitions and animations to create our loading screen and for other elements.
## A for JS
We used AJAX requests extensively
We integrated the Google sign in API
We used javascript to handle button presses and changes of state on the page
We used the HTML5 geolocation API to determine the client's real world location
We used HTML5 canvas to allow the user to paint onto an image they want to upload
## ? for PNG
?
## B for SVG
We created custom SVG assets for our logo, button icons and loading graphic.
## B for Server
We implemented a RESTful API to handle our login system, posts and location systems.
We implemented unit tests for our server code and used a linter to identify errors and style issues with our server side code.
We hosted our server using Google App Engine and used continuous integration with TravisCI to manage this and run our automated tests
## B for Database
We have implemented SQL queries for finding and inserting data
We implemented complex SQL using transactions for the Upvoting system
## A for Dynamic Pages
We used the Jade framework to insert a small amount of data server side.
We implemented our 'feed' of posts using client side javascript. We used templates on the client side to add content to the page dynamically.
## ? for Depth
