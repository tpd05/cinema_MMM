import Link from "next/link";
export default function MovieCard({ id, img, title, genre, duration, releaseDate, price }) {
    return (
        <div className="movie-card">
            <img src={`/img/${img}`} alt={title} className="movie-img" />
            <div className="movie-info">
                <h3 className="movie-title">{title}</h3>
                <p><strong>Genre:</strong> {genre}</p>
                <p><strong>Duration:</strong> {duration}</p>
                <p><strong>Release Date:</strong> {releaseDate}</p>
                <p><strong>Ticket Price:</strong> {price}</p>
                <Link href={`/booking/${id}`}>
                    <button className="buy-ticket">Mua vé</button>
                </Link>
            </div>
        </div>
    );
}