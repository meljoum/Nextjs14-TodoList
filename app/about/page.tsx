import Link from 'next/link';
import Style from './page.module.css';

function About() {
    return (
        <>
            <div className="justify-center items-center flex min-h-screen flex-col">
                <h2 className={Style.h2}>About Page</h2>
                <Link className="btn_custom" href="/">Go to Home</Link>
            </div>
            
        </>
    )
}

export default About;