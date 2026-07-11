import { Link, useNavigate } from "react-router-dom"

function  NotFound() {

    const navigate = useNavigate();
    let numero = 2;
    
    function irInicio(){
        navigate('/');
    }

    return (
        <>
            <h1>404 | NotFound </h1>
            <Link to="/">Regresar al home</Link>

            <hr />
            <button onClick={ irInicio }> Regregar a la Home </button>

        </>
    )
}

export default NotFound