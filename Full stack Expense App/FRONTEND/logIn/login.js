
const email=document.getElementById('email')
const password=document.getElementById('password')
const submit=document.getElementById('submit')
submit.addEventListener('click',(e)=>{
    e.preventDefault()
    axios.post('http://127.0.0.1:3000/login',{
        email: email.value,
        password: password.value
    }).then((result) => {
        alert('LOGGED IN')
        location.replace("http://127.0.0.1:5500/loggedIn/index.html");
    }).catch((err) => {
        // console.log(err.status);
        alert("WRONG CREDENTIAL OR USER DOESN'T EXISTS.")
    });
})