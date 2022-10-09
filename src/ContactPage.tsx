import React, { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import './Stylesheets/contact.css';
import PropTypes, {InferProps} from 'prop-types';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import cred from './topsecret.js';
import ReCaptcha from "react-google-recaptcha";


function SuccessStatus ({status, setStatus}: InferProps<typeof SuccessStatus.propTypes>) {
    status = status;

    useEffect(() => {
        const animation = gsap.timeline({default: {duration: .1}});
        const element = document.querySelector('#status');
        
        if ( status === 'sending' ) animation
            .to(element, {autoAlpha: 1});
        if (status === 'failed' || status === 'success') animation
        .set(element, {autoAlpha: 1})
        .to(element, {scale: 1.1}, '>')
        .to(element, {scale: 1}, '>')
        .to(element, {autoAlpha: 0}, '+=.666')
        .eventCallback('onComplete',() => {
            setStatus(null);
        });
    }, []);

    return(
        <div id='status' className={`cobalt card ${status}`}>
            <div>
            {
                (status === 'sending') ?
                'IN PROGRESS...' :
                (status === 'success') ?
                'SENT!' :
                (status === 'failed') ?
                'FAILED!'
                : ''
            }
            </div>
        </div>
    )
}
SuccessStatus.propTypes ={
    status: PropTypes.any,
    setStatus: PropTypes.func.isRequired,
}

function Error({form, checkForErrors}: InferProps<typeof Error.propTypes>){
    const errorType = checkForErrors();
    if ( errorType === 0 ) return <></>;

    let err: any[] = [];
    const focusOnIt = (inputName: string) => document.getElementsByName(inputName)[0].focus();
    
    errorType === 1 && Object.entries(form).map( (item, i) => {
      if ( item[1] == "" ){
        if( err.length > 0 ) err.push(", ");
        err.push(<button className='card charcoalButton' key={i} onClick={() => focusOnIt(item[0])}>{item[0]}</button>);
      };
    });
    
    err.unshift(
        (errorType === 2) ?
        'Please enter a valid email address.':
        'Please fill in the following fields: '
    );

     return <div id='error'>{err}</div>;
}
Error.propTypes ={
    form: PropTypes.any.isRequired,
    checkForErrors: PropTypes.func.isRequired
}

function ContactPageDOM ({handleSubmit, handleChange, formData, error, checkForErrors, status, setStatus, recaptcha}: InferProps<typeof ContactPageDOM.propTypes>) {
    return <article id='contactPage'>
        <div className='title'>
            <h1>CONTACT</h1>
            <div>CONTACT</div>
        </div>
        <section id='contact' className='card cobalt'>
            <h2>GET IN TOUCH</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                <div className='inputs'>
                    <input type='text' name='name' onChange={(e) => handleChange(e)} placeholder='Name:' value={formData.name} />
                    <input type='text' name='email' onChange={(e) => handleChange(e)} placeholder='Email Address:' value={formData.email} />
                    <input type='text' name='subject' onChange={(e) => handleChange(e)} placeholder='Subject:' value={formData.subject} />
                </div>
                <textarea name='message' onChange={(e) => handleChange(e)} placeholder='You message:' value={formData.message}></textarea>
                </div>
                <div className='button'>
                <ReCaptcha
                    ref={recaptcha}
                    sitekey={cred.G_SITEKEY}
                    size='invisible'
                />
                <button type='submit' className='card charcoalButton'>SEND</button>
                {error ? (<Error checkForErrors = {checkForErrors} form = {formData} />) : ''}
                </div>
            </form>
            { ( status ) ?
            <SuccessStatus
            status= {status}
            setStatus= {setStatus}
            />
            : ''}
        </section>
        <section className='socialMedia'>
        <h2>I'M ALSO ON</h2>
        <div className='links'>
            <Link target={'_blank'} to={{pathname: 'https://www.linkedin.com/in/alihadadi'}} ><img src={require('./Assets/LinkedIn.svg')} alt='My LinkedIn profile | Infa' /></Link>
            <Link target={'_blank'} to={{pathname: 'https://github.com/wholyinfa'}} ><img src={require('./Assets/GitHub.svg')} alt='My GitHub profile | Infa' /></Link>
        </div>
        </section>
    </article>;
}
ContactPageDOM.propTypes ={
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    formData: PropTypes.any.isRequired,
    status: PropTypes.any,
    setStatus: PropTypes.func.isRequired,
    error: PropTypes.any,
    checkForErrors: PropTypes.func.isRequired,
    recaptcha: PropTypes.any.isRequired,
}

export default function ContactPage() {
    interface formType{
        name: string,
        email: string,
        subject: string,
        message: string
    }
    const [formData, setFormData] = useState<formType>(
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
    const recaptcha = useRef();
    const [status, setStatus] = useState<'sending' | 'success' | 'failed' | null>(null);
    const [error, setError] = useState<null | number>(null);
    
    /**
     * 0: when no errors are found
     * 
     * 1: when the fields are empty
     * 
     * 2: when the email field doesn't contain a valid email address
     */
    type errorTypes = 0 | 1 | 2;
    const checkForErrors = () : errorTypes => {
        let isError = Object.values(formData).filter(value => value == "").length;
        let errorType: errorTypes = 0;
        const match = formData.email.toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

        if( isError > 0 ) 
            errorType = 1;
        if( isError === 0 )
            errorType = ( match === null ) ? 2 : 0;

        return errorType;
    }
    const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if( !recaptcha.current || status !== null ) return;

        const errorType = checkForErrors();
        setError( errorType );
        if ( errorType !== 0 ) return;
            
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
    
        const captchaToken = await Object(recaptcha.current).executeAsync();
        Object(recaptcha.current).reset();

        const data = {
            ...formData,
            'g-recaptcha-response': captchaToken,
            date: dateTime
        }

        setStatus('sending');
        emailjs.send(
            cred.SERVICE_ID,
            cred.TEMPLATE_ID,
            data,
            cred.PUBLIC_KEY)
        .then(function() {
            setStatus('success');
            setFormData({
                email: '',
                message: '',
                name: '',
                subject: ''
            });
        }, function(error) {
            setStatus('failed');
            console.log('FAILED...', error);
        });
    }
    
    return <ContactPageDOM
        handleSubmit = {handleSubmit}
        handleChange = {handleChange}
        formData = {formData}
        status = {status}
        setStatus = {setStatus}
        error = {error}
        checkForErrors = {checkForErrors}
        recaptcha = {recaptcha}
    />;
}