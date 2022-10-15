const password = "password";

function Login(request, result)
{
    const attempt = request.body.password;
    if (attempt === password) {
        result.send("correct");
    } else {
        result.send("Invalid Password, try again");
    }
}
module.exports = { Login }