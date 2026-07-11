import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserCreate = () =>{
    const HOST = 'http://127.0.0.1:3000/api';

    const [ user, setUser] = useState({name: '', email: '', password: ''});
    const [ msg, setMsg] = useState('');
    const navigate = useNavigate();

    function handlerChange( event ) {
        const clave = event.target.name;
        const value = event.target.value;
        setMsg('');
        setUser( {...user, [clave]: value} )
    }

    async function postUser(event) {
  event.preventDefault();

  if (user.name.trim() === '') {
    setMsg('Completar el nombre de usuario');
    return;
  }

  if (user.name.trim().length < 3) {
    setMsg('El nombre de ser mayor o igual a tres caracter');
    return;
  }

  if (user.email.trim() === '') {
    setMsg('Completar el email');
    return;
  }

  if (user.password.trim() === '') {
    setMsg('Completar la contraseña del usuario');
    return;
  }

  if (user.password.trim().length < 3) {
    setMsg('La contaseña de ser mayor o igual a tres caracter');
    return;
  }

  try {
    const options = {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(user)
    };

    console.log(options);

    const response = await fetch(`${HOST}/users`, options);
    const data = await response.json();
    console.log(data);

if (response.ok) {
  navigate('/login');
} else {
  setMsg(data.msg);
}

  } catch (error) {
    alert('Tenemos un error al Registrar el usuario');
  }
}

    return (
        <>
            <main>
                <h2 className="text-center m-5">Nuevo Usuario</h2>
                <p>{msg}</p>
                <form onSubmit={postUser}>
                    <label htmlFor="name">Nombre</label>
                    <input
                        name="name"
                        value={user.name}
                        onChange={ handlerChange } 
                        type="text"
                        minLength={3} 
                    />

                    <label htmlFor="name">Email</label>
                    <input
                        name="email"
                        type="email" 
                        value={user.email}
                        onChange={ handlerChange } 
                    />

                    <label htmlFor="name">password</label>
                    <input 
                        name="password"
                        value={user.password}
                        onChange={ handlerChange}
                        type="password" />

                    <button type="submit">Guardar</button>
                </form>
            </main>

        </>
    )

}

export default UserCreate