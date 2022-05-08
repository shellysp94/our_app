

function removeDisconnectedUser(userSocket)
{
    console.log("Client disconnected");

    usersArr = usersArr.filter(user => {
       return user !== userSocket.id;
     });
     console.log("usersArr:"+usersArr.length);
}

module.exports={removeDisconnectedUser};

