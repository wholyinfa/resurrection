import React from 'react';
import './Stylesheets/contact.css';
import PropTypes, {InferProps} from 'prop-types';
import { Link } from 'react-router-dom';

function ContactPageDOM () {
    return <article id='contactPage'>
    <div className='title'>
        <h1>CONTACT</h1>
        <div>CONTACT</div>
    </div>
    <section className='previewCards'>
    </section>
    
    <section className='builtWith'>
            <h2>I'M ALSO ON</h2>
            <section id="contact">
                <h1>CONTACT ME</h1>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div>
                    <div className="inputs">
                        <input type="text" name="name" onChange={(e) => handleChange(e)} placeholder="Name:" value={formData.name} />
                        <input type="text" name="email" onChange={(e) => handleChange(e)} placeholder="Email Address:" value={formData.email} />
                        <input type="text" name="subject" onChange={(e) => handleChange(e)} placeholder="Subject:" value={formData.subject} />
                    </div>
                    <textarea name="message" onChange={(e) => handleChange(e)} placeholder="You message:" value={formData.message}></textarea>
                    </div>
                    <div className='button'>
                        <button type="submit" className="goldPaperButton">SEND</button>
                    {error ? (<Error form= {formData} />) : ''}
                    </div>
                </form>
                { ( status ) ?
                <SuccessStatus
                status= {status}
                setStatus= {setStatus}
                />
                : ''}
            </section>
            <div className='socialMedia'>
                <Link to={'https://www.linkedin.com/in/alihadadi'} ><img src={require('./Assets/LinkedIn.svg')} alt='My LinkedIn profile | Infa' /></Link>
                <Link to={'https://github.com/wholyinfa'} ><img src={require('./Assets/GitHub.svg')} alt='My GitHub profile | Infa' /></Link>
            </div>
        </section>
</article>;
}
export default function ContactPage({}: InferProps<typeof ContactPage.propTypes>) {
    
    return <ContactPageDOM />;
}
ContactPage.propTypes ={
    
}