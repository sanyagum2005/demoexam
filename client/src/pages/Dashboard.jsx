import { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [reviews, setReviews] = useState({});

    const navigate = useNavigate();

    const userId = localStorage.getItem('id');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) navigate('/');
            
            const response = await axios.get(`/api/applications/${userId}`);
            setApplications(response.data);
        }
        fetchData();
    }, [userId]);

    const handleCreateApp = () => {
        navigate('/create');
    }

    const handleGotoAdminPanel = () => {
        navigate('/admin');
    }

    const handleReview = async (id) => {
        const review = reviews[id];
        if (!review) return;

        await axios.put(`/api/applications/${id}/review`, {id, review});
        alert('Отзыв отправлен!');

        setReviews((prev) => ({ ...prev, [id]: '' }));
    }

    const handleReviewsChange = (id, text) => {
        setReviews((prev) => ({ ...prev, [id]: text}));
    }

    return (
        <>
        <h1 className="dashboard-header">Список заявок</h1>
        <LogoutButton />
        <button className='create-app-btn' onClick={handleCreateApp}>Создать заявление</button>
        {role === 'admin' && <button className='goto-admin-btn' onClick={handleGotoAdminPanel}>Админ панель</button>}
        <div className="application-container">
            {applications.map((app) => (
                <div key={app.id} className="application" id={app.id}>
                    <h3 className="course-title">{app.course_name}</h3>
                    <div className="course-date">Идёт с {new Date(app.start_date).toLocaleString()}</div>
                    <div className="course-payment">Способ оплаты: {app.payment_method}</div>
                    <div className="app-status">Статус: {app.status}</div>
                    {app.status === 'Обучение завершено' && (
                        <>
                        <textarea className='review-input' cols="30" rows="10" placeholder='Напишите отзыв о курсе!' onChange={(e) => handleReviewsChange(app.id, e.target.value)}></textarea>
                        <button style={{display: 'block'}} className='submit-review-btn' onClick={() => handleReview(app.id)}>Отправить</button>
                        </>
                    )}
                </div>
            ))}
        </div>
        </>
    )
}