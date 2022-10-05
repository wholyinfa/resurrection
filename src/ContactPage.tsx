import React, { useEffect, useState } from 'react';
import './Stylesheets/contact.css';
import PropTypes, {InferProps} from 'prop-types';
import { Link } from 'react-router-dom';


function SuccessStatus ({status, setStatus}: InferProps<typeof SuccessStatus.propTypes>) {
    status = status;

    useEffect(() => {
        const animation = gsap.timeline({default: {duration: .1}});
        const element = document.querySelector('#status');

        animation
            .fromTo(element, {autoAlpha: 0}, {autoAlpha: 1})
            .fromTo(element, {autoAlpha: 1}, {autoAlpha: 0}, '>1')
            .call(() => {
                setStatus(false);
            });
    }, [])

    return(
        <div id='status' className={status}>
            <div>
            {
                (status === 'success') ?
                'GESENDET!'
                :
                'FEHLGESCHLAGEN!'
            }
            </div>
        </div>
    )
}
SuccessStatus.propTypes ={
    status: PropTypes.string.isRequired,
    setStatus: PropTypes.func.isRequired,
}

function Error({form}: InferProps<typeof Error.propTypes>){
    if ( !Object.values(form).filter(value => value == "").length ) return <></>;
  
    let err = [];
    const focusOnIt = (inputName: string) => document.getElementsByName(inputName)[0].focus();
    
    Object.entries(form).map( (item, i) => {
      if ( item[1] == "" ){
        if( err.length > 0 ) err.push(", ");
        const finalItem = ( item[0] === 'name' ) ? 'Name':
                          ( item[0] === 'email' ) ? 'Email':
                          ( item[0] === 'subject' ) ? 'Betreff':
                          ( item[0] === 'message' ) ? 'Nachtricht' : '';
        err.push(<button className='goldPaperButton' key={i} onClick={() => focusOnIt(item[0])}>{finalItem}</button>);
      };
    });
    
     err.unshift('Füllen Sie bitte die folgenden Felder aus: ');
     return <div id="error">{err}</div>;
}
Error.propTypes ={
    form: PropTypes.any.isRequired,
}

function ContactPageDOM ({handleSubmit, handleChange, formData, error, status, setStatus}: InferProps<typeof ContactPageDOM.propTypes>) {
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
ContactPageDOM.propTypes ={
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    formData: PropTypes.any.isRequired,
    status: PropTypes.string.isRequired,
    setStatus: PropTypes.func.isRequired,
    error: PropTypes.any.isRequired,
}

export default function ContactPage() {
    
    const [formData, setFormData] = useState(
        {
            name: '',
            email: '',
            subject: '',
            message: ''
        }
    );
    const handleChange = ({target}: any) => {
        const {name, value} = target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<null | number>(null);
    const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
    
        const isError = Object.values(formData).filter(value => value == "").length;
        setError( isError ? 1 : 0 );
        if ( isError ) return;

        setStatus('success');
    }
    
    return <ContactPageDOM
        handleSubmit = {handleSubmit}
        handleChange = {handleChange}
        formData = {formData}
        status = {status}
        setStatus = {setStatus}
        error = {error}
    />;
}