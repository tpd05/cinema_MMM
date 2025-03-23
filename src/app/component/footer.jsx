export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Logo */}
                <div className="footer-logo">
                    <h1>MMM</h1>
                </div>

                {/* Information */}
                <div className="footer-section">
                    <h3>INFORMATION</h3>
                    <ul>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* About Us */}
                <div className="footer-section">
                    <h3>ABOUT US</h3>
                    <ul>
                        <li><a href="#">MMM</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Contact us</a></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className="footer-social">
                    <h3>FOLLOW US</h3>
                    <div className="social-icons">
                        <a href="https://www.facebook.com"><img src="/icon/facebook.svg" alt="Facebook" /></a>
                        <a href="https://www.instagram.com"><img src="/icon/instagram.svg" alt="Instagram" /></a>
                        <a href="https://www.youtube.com"><img src="/icon/youtube.svg" alt="YouTube" /></a>
                        <a href="https://www.twitter.com"><img src="/icon/twitter.svg" alt="Twitter" /></a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-copyright">
                <p>All rights reserved MMM {new Date().getFullYear()} ©</p>
            </div>
        </footer>
    );
}
