## steps:
1. app opened by the user, app send the app password to server.
2. if correct then check for JWT token, if no then return rejected.
3. if JWT token rejected / does not exist, routes open for sevice are only login, register, public stuff, etc.
4. if JWT accepted, login and register route are rejected but other routes are open, also send user data.

- create js file that manage all jsonwebtoken related stuff
- create js file that manage all casl/ability related stuff
- create js file that manage all pasport related stuff
- create js file that manage all mongoose related stuff

high risk of duplication:
- images
- merchandise info