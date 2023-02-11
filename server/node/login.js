function Login(request, result)
{
    switch (request.body.password)
    {
        case process.env.ACCESS_PASSWORD:
            result.send("correct");
            break;
        default:
            result.send("Invalid Password, try again");
            break;
    }
}
module.exports = { Login }