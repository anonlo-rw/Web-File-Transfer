function Login(request, result)
{
    const attempt = request.body.password;
    if (attempt === process.env.ACCESS_PASSWORD) {
        result.send("correct");
    } else {
        result.send("Invalid Password, try again");
    }
}
module.exports = { Login }