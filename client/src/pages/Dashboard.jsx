import { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'

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
            console.log(response.data)
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
        <div className="slider-wrapper">
            <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true} dynamicHeight={false} width={'30vw'} interval={2000}>
                <div>
                    <img src="https://img.freepik.com/free-photo/brown-rocky-mountain-white-clouds-daytime_410324-44.jpg?semt=ais_hybrid&w=740&q=80" alt="1" />
                </div>
                <div>
                    <img src="https://img.freepik.com/premium-vector/green-mountain-with-road-leading-top_1123160-9778.jpg?semt=ais_hybrid" alt="2" />
                </div>
                <div>
                    <img src="https://img.freepik.com/premium-photo/scenic-view-landscape-mountains-against-sky_1048944-28553338.jpg?semt=ais_hybrid&w=740" alt="3" />
                </div>
            </Carousel>
        </div>
        <div className="application-container">
            {applications.map((app) => (
                <div key={app.id} className="application" id={app.id}>
                    <h3 className="course-title">{app.course_name}</h3>
                    <div className="course-date">Идёт с {new Date(app.start_date).toLocaleString()}</div>
                    <div className="course-payment">Способ оплаты: {app.payment}</div>
                    <div className="app-status">Статус: {app.status}</div>
                    {app.status === 'Мероприятие завершено' && (
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