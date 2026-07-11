import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const UserLogin = () => {
    const HOST = 'http://127.0.0.1:3000/api';
    const [user, setUser] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); 

    function handlerChange(event) {
        const { name, value } = event.target;
        setUser(prev => ({ ...prev, [name]: value }));
    }

    async function postUser(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${HOST}/users/auth`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Credenciales inválidas');
            }

            if (data.token) {
                login(data.user, data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user)); 
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <header>
                <h1 className="text-center mt-5">Login</h1>
            </header>
            <main>
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={postUser}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={user.email}
                            onChange={handlerChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={user.password}
                            onChange={handlerChange}
                            required
                            minLength="6"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Entrar'}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default UserLogin;
