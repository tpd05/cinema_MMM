import "../../styles/style.css";
import Footer from "./footer";
import Head from "next/head"; 
import ProfileModal from "./profileModal";
import { ProfileProvider } from "../hook/profileContext";

export default function Layout({ children }) {
  return (
    <ProfileProvider>
      <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Website to buy movie tickets</title>
      </Head>
      
      {children}
      <ProfileModal />
      <Footer />
    </>
    </ProfileProvider>
  );
}
