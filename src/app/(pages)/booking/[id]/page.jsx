"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/app/component/layout";
import Header from "@/app/component/header";

export default function BookingPage() {
    const params = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatList, setSeatList] = useState([]);

    // Lấy thông tin phim
    useEffect(() => {
        if (!params?.id) return;

        fetch(`/api/movieAPI?id=${params.id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setMovie(data?.length ? data[0] : data || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi tải phim:", err);
                setMovie(null);
                setLoading(false);
            });
    }, [params?.id]);

    // Lấy danh sách rạp chiếu phim
    useEffect(() => {
        fetch(`/api/theatersAPI?movie_id=${params.id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setTheaters(data || []);
                if (data?.length > 0) setSelectedTheater(data[0].id);
            })
            .catch((err) => {
                console.error("Lỗi khi tải danh sách rạp:", err);
                setTheaters([]);
            });
    }, [params?.id]);

    // Lấy suất chiếu của phim tại rạp đã chọn
    useEffect(() => {
        if (!selectedTheater) return;

        fetch(`/api/showtimesAPI?movie_id=${params.id}&theater_id=${selectedTheater}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setShowtimes(data || []);
                if (data?.length > 0) {
                    setSelectedDate(new Date(data[0].showtime).toISOString().split("T")[0]);
                } else {
                    setSelectedDate(null);
                }
            })
            .catch((err) => {
                console.error("Lỗi khi tải suất chiếu:", err);
                setShowtimes([]);
                setSelectedDate(null);
            });
    }, [params?.id, selectedTheater]);

    // Lọc danh sách ngày chiếu theo rạp đã chọn
    const uniqueDates = [
        ...new Set(
            showtimes
                .filter(show => show.theater_id === selectedTheater)
                .map(show => new Date(show.showtime).toISOString().split("T")[0])
        )
    ];

    // Lọc danh sách giờ chiếu theo ngày & rạp đã chọn
    useEffect(() => {
        if (!selectedDate || !selectedTheater) return;

        const times = showtimes
            .filter(
                (show) =>
                    show.theater_id === selectedTheater &&
                    new Date(show.showtime).toISOString().split("T")[0] === selectedDate
            )
            .map((show) => ({
                time: new Date(show.showtime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit", minute: "2-digit"
                }),
                id: show.id // Thêm id vào object để dễ quản lý
            }));

        setAvailableTimes(times);
    }, [selectedDate, selectedTheater, showtimes]);

    // Xử lý khi chọn giờ
    const handleTimeSelection = (timeInfo) => {
        setSelectedTime(timeInfo.time);

        // Gọi API để lấy số ghế trống tại thời gian đã chọn
        fetch(`/api/availableSeatsAPI?showtime_id=${timeInfo.id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setAvailableSeats(data.availableSeats);
            })
            .catch(err => {
                console.error("Lỗi khi tải số ghế trống:", err);
                setAvailableSeats(null);
            });
    };
    useEffect(() => {
        if (!selectedTheater || !selectedTime) return;

        const fetchSeats = async () => {
            try {
                const response = await fetch(`/api/seatsAPI?theaterId=${selectedTheater}&showtimeId=${selectedTime}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch seats");
                }
                const data = await response.json();
                if (data.success) {
                    setSeatList(data.seats);
                    console.log("Seats fetched:", data.seats);
                } else {
                    console.error("API không trả về danh sách ghế!", data);
                    setSeatList([]);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API seatsAPI:", error);
                setSeatList([]);
            }
        };

        fetchSeats();
    }, [selectedTheater, selectedTime]);



    // xử lý chọn ghế
    const handleSeatsSelection = (seat) => {
        if (seat.status === "booked") {
            alert("Ghế này đã được đặt, vui lòng chọn ghế khác.");
            return;
        }

        setSelectedSeats((prevSelectedSeats) => {
            if (prevSelectedSeats.includes(seat.id)) {
                // Nếu ghế đã được chọn, thì hủy chọn
                return prevSelectedSeats.filter((id) => id !== seat.id);
            } else {
                // Nếu ghế chưa được chọn, thêm vào mảng
                return [...prevSelectedSeats, seat.id];
            }
        });
    };



    const handleBooking = async () => {
        try {
            // Lấy thông tin người dùng từ API /me
            const meRes = await fetch('/api/auth/me');
            const meData = await meRes.json();
            const accountId = meData.user.account_id;

            const selectedShowtimeId = showtimes.find((st) => {
                const showtimeDate = st.showtime.split('T')[0]; // Lấy ngày
                const showtimeTime = new Date(st.showtime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

                return st.theater_id === selectedTheater &&
                    showtimeDate === selectedDate &&
                    showtimeTime === selectedTime;
            })?.id;

            if (!accountId || !selectedShowtimeId || selectedSeats.length === 0) {
                alert('Vui lòng chọn đầy đủ thông tin trước khi đặt vé.');
                return;
            }

            // Gọi API book ghế
            // Gọi API book ghế
            const res = await fetch('/api/bookSeatAPI', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    account_id: accountId,  // Đổi từ client_id thành account_id
                    showtime_id: selectedShowtimeId,
                    seat_ids: selectedSeats,
                }),
            });


            const data = await res.json();
            if (res.ok) {
                alert('Đặt vé thành công!');
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Lỗi khi đặt vé:', error);
        }
    };





    if (loading) return <p>Đang tải...</p>;
    if (!movie) return <p>Không tìm thấy phim</p>;

    return (
        <Layout>
            <Header />
            <div className="booking-container">
                <div className="movie-info-container">
                {/* Ảnh phim */}
                <img src={`/img/${movie.image_url}`} alt={movie.title} className="booking-movie-img" />
                
                {/* Thông tin chi tiết phim */}
                <div className="booking-movie-details">
                    <h1 className="booking-movie-title">Đặt vé: {movie.title}</h1>
                    <h2 className="booking-movie-h2"><strong>Mô tả:</strong> {movie.description}</h2>
                    <p className="booking-movie-info"><strong>Đạo diễn:</strong> {movie.director}</p>
                    <p className="booking-movie-info"><strong>Thể loại:</strong> {movie.genre}</p>
                    <p className="booking-movie-info"><strong>Thời lượng:</strong> {movie.duration} phút</p>
                    <p className="booking-movie-info"><strong>Ngày khởi chiếu:</strong> {movie.release_date}</p>
                    <p className="booking-movie-info"><strong>Giá vé:</strong> ${movie.ticket_price}</p>
                </div>
                </div>
    
                {/* Phần chọn vé */}
                <div className="booking-movie-select">
                    {/* Chọn rạp */}
                    <h2>Chọn rạp chiếu</h2>
                    <div className="theater-list">
                        {theaters.map((theater) => (
                            <button
                                key={theater.id}
                                className={`theater-button ${selectedTheater === theater.id ? 'active' : ''}`}
                                onClick={() => setSelectedTheater(theater.id)}
                            >
                                {theater.name}
                            </button>
                        ))}
                    </div>
    
                    {/* Chọn ngày chiếu */}
                    {selectedTheater && uniqueDates.length > 0 && (
                        <>
                            <h2>Chọn ngày chiếu</h2>
                            <div className="date-list">
                                {uniqueDates.map(date => (
                                    <button
                                        key={date}
                                        className={`date-button ${selectedDate === date ? 'active' : ''}`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        {new Date(date).toLocaleDateString("vi-VN", { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
    
                    {/* Chọn giờ chiếu */}
                    {selectedDate && (
                        <>
                            <h2>Chọn giờ chiếu</h2>
                            <div className="time-list">
                                {availableTimes.length > 0 ? (
                                    <>
                                        {availableTimes.map((item, index) => (
                                            <button
                                                key={index}
                                                className={`time-button ${selectedTime === item.time ? 'active' : ''}`}
                                                onClick={() => handleTimeSelection(item)}
                                            >
                                                {item.time}
                                            </button>
                                        ))}
                                        <p className="total">Tổng số ghế: <strong>{theaters.find(t => t.id === selectedTheater)?.total_seats || "N/A"}</strong></p>
                                    </>
                                ) : (
                                    <p>Không có suất chiếu</p>
                                )}
                            </div>
    
                            {selectedTime && availableSeats !== null && (
                                <p className="seats-info">Số ghế trống: <strong>{availableSeats}</strong></p>
                            )}
                        </>
                    )}
    
                    {/* Sơ đồ ghế */}
                    <div className="grid grid-cols-5 gap-2 p-4 bg-gray-100 rounded-lg shadow-md">
                        {seatList && seatList.length > 0 ? (
                            seatList.map((seat) => (
                                <button
                                    key={seat.id}
                                    onClick={() => handleSeatsSelection(seat)}
                                    disabled={seat.status === "booked"}
                                    className={`p-2 text-center rounded-lg font-bold transition duration-300 ${
                                        seat.status === "booked"
                                            ? "bg-red-400 text-white cursor-not-allowed"
                                            : selectedSeats.includes(seat.id)
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                >
                                    {seat.seat_number}
                                </button>
                            ))
                        ) : (
                            <p className="col-span-5 text-center text-gray-500">Không có ghế nào khả dụng.</p>
                        )}
                    </div>
    
                    {/* Nút xác nhận */}
                    <button
                        onClick={handleBooking}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Đặt vé ngay
                    </button>
                </div>
            </div>
        </Layout>
    );    
}

