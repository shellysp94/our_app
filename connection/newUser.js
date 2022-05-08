

function handleNewUser(userSocket, userData)
{
    console.log("socket id:"+userSocket.id+","+ userData.user_id);
    userSocket.id = parseInt(userData.user_id,10);
    usersArr.push(userSocket.id);
    console.log(usersArr);
}

module.exports={handleNewUser};

