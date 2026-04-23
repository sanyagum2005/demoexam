import './LogoutButton.css';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        localStorage.clear();
        navigate('/');
    }

    return <button className='logout-btn' onClick={handleClick}>Выйти</button>
}