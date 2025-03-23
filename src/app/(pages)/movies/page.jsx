import Layout from "@/app/component/layout";
import MovieList from "./MovieList";
import Header from "@/app/component/header";


export default function MoviesPage() {
    return (
        <Layout>
            <Header />
            <section>
                <p id="pnt">Best Movies</p>
                <MovieList />
            </section>
        </Layout>
    );
}

