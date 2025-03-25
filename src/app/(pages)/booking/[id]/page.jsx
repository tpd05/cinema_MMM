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

    // Fetch movie information
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
                console.error("Error loading movie:", err);
                setMovie(null);
                setLoading(false);
            });
    }, [params?.id]);

    // Fetch the list of theaters showing the movie
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
                console.error("Error loading theaters list:", err);
                setTheaters([]);
            });
    }, [params?.id]);


    // Fetch movie showtimes at the selected theater
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
                console.error("Error fetching showtimes:", err);
                setShowtimes([]);
                setSelectedDate(null);
            });
    }, [params?.id, selectedTheater]);

    // Filter unique show dates based on the selected theater
    const uniqueDates = [
        ...new Set(
            showtimes
                .filter(show => show.theater_id === selectedTheater)
                .map(show => new Date(show.showtime).toISOString().split("T")[0])
        )
    ];

    // Filter showtimes based on selected date & theater
    useEffect(() => {
        if (!selectedDate || !selectedTheater) return;

        const times = showtimes
            .filter(
                (show) =>
                    show.theater_id === selectedTheater &&
                    new Date(show.showtime).toISOString().split("T")[0] === selectedDate
            )
            .map((show) => ({
                time: new Date(show.showtime).toLocaleTimeString("en-GB", {
                    hour: "2-digit", minute: "2-digit"
                }),
                id: show.id // Add id to the object for easier management
            }));

        setAvailableTimes(times);
    }, [selectedDate, selectedTheater, showtimes]);


    // Handle time selection
    const handleTimeSelection = (timeInfo) => {
        setSelectedTime(timeInfo.time);

        // Call API to get the number of available seats at the selected time
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
                console.error("Error fetching available seats:", err);
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
                    console.error("API did not return seat list!", data);
                    setSeatList([]);
                }
            } catch (error) {
                console.error("Error calling seatsAPI:", error);
                setSeatList([]);
            }
        };

        fetchSeats();
    }, [selectedTheater, selectedTime]);

    // Handle seat selection
    const handleSeatsSelection = (seat) => {
        if (seat.status === "booked") {
            alert("This seat has already been booked, please select another seat.");
            return;
        }

        setSelectedSeats((prevSelectedSeats) => {
            if (prevSelectedSeats.includes(seat.id)) {
                // If the seat is already selected, deselect it
                return prevSelectedSeats.filter((id) => id !== seat.id);
            } else {
                // If the seat is not selected, add it to the array
                return [...prevSelectedSeats, seat.id];
            }
        });
    };




    const handleBooking = async () => {
        try {
            // Get user information from /me API
            const meRes = await fetch('/api/auth/me');
            const meData = await meRes.json();
            const accountId = meData.user.account_id;


            if (!accountId) {
                alert('Failed to get account ID. Please log in again.');
                return;
            }

            const selectedShowtimeId = showtimes.find((st) => {
                const showtimeDate = st.showtime.split('T')[0]; // Extract date
                const showtimeTime = new Date(st.showtime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

                return st.theater_id === selectedTheater &&
                    showtimeDate === selectedDate &&
                    showtimeTime === selectedTime;
            })?.id;

            if (!accountId || !selectedShowtimeId || selectedSeats.length === 0) {
                alert('Please select all required information before booking.');
                return;
            }

            // Call the seat booking API
            const res = await fetch('/api/bookSeatAPI', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    account_id: accountId,
                    showtime_id: selectedShowtimeId,
                    seat_ids: selectedSeats,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert('Booking successful!');
            } else {
                alert(data.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Error while booking:', error);
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    };





    if (loading) return <p></p>;
    if (!movie) return <p>!404</p>;

    return (
        <Layout>
            <Header />
            <div className="booking-container">
                <div className="movie-info-container">

                    {/* Ảnh phim */}
                    <img src={`/img/${movie.image_url}`} alt={movie.title} className="booking-movie-img" />

                    {/* Thông tin chi tiết phim */}
                    <div className="booking-movie-details">
                        <h1 className="booking-movie-title">Book a ticket: {movie.title}</h1>
                        <h2 className="booking-movie-h2"><strong>Description:</strong> {movie.description}</h2>
                        <p className="booking-movie-info"><strong>Director:</strong> {movie.director}</p>
                        <p className="booking-movie-info"><strong>Genre:</strong> {movie.genre}</p>
                        <p className="booking-movie-info"><strong>Duration:</strong> {movie.duration} phút</p>
                        <p className="booking-movie-info"><strong>Release date:</strong> {formatDate(movie.release_date)}</p>
                    </div>
                </div>

                {/* Phần chọn vé */}
                <div className="booking-movie-select">
                    {/* Chọn rạp */}
                    <h2>Choose a cinema</h2>
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
                            <h2>Choose a screening date</h2>
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

                    {/* Select Showtime */}
                    {selectedDate && (
                        <>
                            <h2>Select Showtime</h2>
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
                                        <p className="total">Total seats: <strong>{theaters.find(t => t.id === selectedTheater)?.total_seats || "N/A"}</strong></p>
                                    </>
                                ) : (
                                    <p>No showtimes available</p>
                                )}
                            </div>

                            {selectedTime && availableSeats !== null && (
                                <p className="seats-info">Available seats: <strong>{availableSeats}</strong></p>
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
                                    className={`p-2 text-center rounded-lg font-bold transition duration-300 ${seat.status === "booked"
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
                            <p className="col-span-5 text-center text-gray-500">No seats available.</p>
                        )}
                    </div>

                    {/* Nút xác nhận */}
                    <button
                        onClick={handleBooking}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Buy ticket
                    </button>
                </div>
            </div>
        </Layout >
    );
}

