## WeDevs APIs

authRouter
- post /signup
- post /login
- post /logout

profileRouter
- get /profile/view
- patch /profile/edit
- patch /profile/password
- delete /profile/delete

connectionRequestRouter
- post /request/send/interested/:userId
- post /request/send/ignored/:userId
- post /request/review/accepted/:requestID
- post /request/review/rejected/:requestId

Status : ( ignore, interested ) , (accepted,rejected)

userInteractionRouter
- get /user/requests/received
- get /user/connections
- get /user/feed 


