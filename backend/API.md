signin function

URL: http://localhost:8000/api/users/signin
Method: POST
signup function

URL: http://localhost:8000/api/users/signup
Method: POST
updateUser function

URL: http://localhost:8000/api/users/update/:id
Method: PUT
deleteUser function

URL: http://localhost:8000/api/users/delete/:id
Method: DELETE
getUserDetails function

URL: http://localhost:8000/api/users/:id
Method: GET
refreshToken function

URL: http://localhost:8000/api/users/refresh-token
Method: POST
verifyToken function

URL: http://localhost:8000/api/users/verify-token
Method: GET
Please note that the :id in the URLs for updateUser, deleteUser, and getUserDetails should be replaced with the actual ID of the user you want to update, delete, or get details for.


signin function

Request Body: { email, password }
Response: JSON object with status code, success status, message, and user data (if successful)
signup function

Request Body: { email, password, firstName, lastName, isAdmin, isOrganizer, dateOfBirth, address, phoneNumber, bio, interests, organizations }
Response: JSON object with status code, success status, message, and user data (if successful)
updateUser function

Request Params: { id }
Request Body: { firstName, lastName, dateOfBirth, address, phoneNumber, bio, interests, joinedAt, organizations }
Response: JSON object with status code, success status, message, and updated user data (if successful)
deleteUser function

Request Params: { id }
Response: JSON object with status code, success status, and message
getUserDetails function

Request Params: { id }
Response: JSON object with status code, success status, message, and user data (if successful)
refreshToken function

Request Body: { token }
Response: JSON object with status code, success status, message, and new access token (if successful)
verifyToken function

Request Cookies: { token }
Response: HTTP status code
Each function is an Express.js middleware function that takes in a request (req) and a response (res) object. The request object contains information about the HTTP request that was made (including any data sent by the client in the body or parameters of the request), and the response object is used to send a response back to the client.