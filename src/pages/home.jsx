import React, { useEffect } from 'react';
import { useState } from 'react';
import { Navbar,Nav,Container,Row,Col,Card,Button,Form} from 'react-bootstrap';
import {Link,useHistory} from 'react-router-dom';
import style from '../assets/scss/Home.module.scss';
import AuthService from '../service/Auth';
import HomeService from '../service/home';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../config/Config';
const Home = () => {
    const service = new HomeService();
    const history =useHistory()
    const logout =() =>{
        localStorage.removeItem('key');
        history.push('/login')
    }
    const [state,setState]  = useState({
        previewUrl : '',
        deiscription : '',
        uploadFile : '',
        Data : [],
        email : ''
    });
    useEffect(()=>{
        const authservice = new AuthService();
        const homeservice = new HomeService();
        authservice.checkTocken().then(res=>{
            if(!res.status){
                history.push('/login')
            }else{
                setState(prev=>({
                    ...prev,
                    email : res.data
                }))
                homeservice.getDocs().then(res=>{
                    if(res.status){
                        setState(prev=>({
                            ...prev,
                            Data : res.data
                        }))
                    }   
                });
            }
        })
    },[history]);
    const resetBanner = () =>{
        setState ( prev=>({
            ...prev,
            previewUrl : "",
        }))
    }
    const changeBanner =(e) =>{
        let reader = new FileReader();
        reader.onload = event => {
            setState(prev=>({
                ...prev,
                previewUrl: event.target.result,
                uploadFile: e.target.files[0]
            })) 
        }
        if(e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    const uploadBanner  =() =>{
        if(state.uploadFile){
            let formData = new FormData();
            if(!state.deiscription){
                console.log('here');
                toast.error('Please enter the Discription');
                // return false
            }else if(!state.uploadFile){
                toast.error('Please enter the Discription');
            }else{
                formData.append('file', state.uploadFile);
                formData.append('discription',state.deiscription)
                service.upload(formData).then(res=>{
                    if(res.status){
                        toast.success('Uploaded Successfully');
                        service.getDocs().then(res=>{
                            if(res.status){
                                setState(prev=>({
                                    ...prev,
                                    Data : res.data,
                                    previewUrl: '',
                                    uploadFile: '',
                                    deiscription : ''
                                }))
                            }   
                        });
                    }else{
                        toast.error('Failed Upload')
                    }
                })
            }
        }else{
            toast.error('Please Upload file')
        }

    };
    const changeHandler = (e)=>{
        const {name,value} = e.target
        setState(prev=>({
            ...prev,
            [name] : value
        }))
    }
    const downLoadfile = (id,Name)=>{
        return axios.get(BASE_URL+'/download/'+id)
        .then(res => {                
            if (res.status !== 200) {
                // ErrorHandler.logError(res);                
            } 
            else {                        
                const linkSource = res.data;
                const downloadLink = document.createElement("a");
                const fileName = Name;

                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();                        
            }         
        }).catch(function(error) {
            // ErrorHandler.logError(error);                               
        });
    }
    const iconImage = (type) =>{
        if(type === 'application/pdf'){
            return 'pdf.png'
        }else if(type === 'image/jpeg'){
            return 'image.png'
        }else if(type === 'text/csv'){
            return 'csv.png'
        }
        return 'pdf.png'
    }
    return ( 
        <div className={style.container}>
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand >
                    <Link to="/Home" className={style.Link}>Home</Link>
                </Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                    <span className={style.email}>{state.email}</span>
                </Nav>
                </Container>
            </Navbar>
            <Container fluid className={`pt-3`}>
            <ToastContainer />
                <Row>
                    {
                        state.Data.map((items,index)=>
                        <Col md={3} key={index} className={`mb-5`}>
                            <Card>
                                <Card.Img variant="top" src={require(`../assets/images/${iconImage(items.type)}`).default} width="45" height="150" />
                                {/* <Card.Img variant="top" src={`${items.url}/image`} /> */}
                                <Card.Body>
                                    <Card.Title>discription</Card.Title>
                                    <Card.Text className={`${style.discription}`}>
                                    {items.discription}
                                    </Card.Text>
                                    <Button variant="primary" onClick={()=>downLoadfile(items.id,items.docName)}>download</Button>
                                    <span className="pull-right">{items.username}</span>
                                </Card.Body>
                            </Card>
                        </Col>
                        )
                    }
                    <Col md={3}>
                        <div>
                            <Card>
                                <Card.Body className={style.FileConten}>
                                    <div>
                                        <Form.Label>Upload File</Form.Label>

                                        {
                                            state.previewUrl &&
                                            <div className={style.previewZone}>
                                                <div className={style.box}>
                                                    <div className={style.boxHeader}>
                                                        <div>preview</div>
                                                        <div className={style.boxTools}>
                                                            <button type="button" onClick={resetBanner} className={style.removePreview}>
                                                                <i className={style.faTimes}></i>
                                                                Reset
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className={style.boxBody}>
                                                        <img width="200" src={state.previewUrl} alt=""/>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            !state.previewUrl&&
                                            <div className={style.dropzoneWrapper}>
                                                <div className={style.dropzoneDesc}>
                                                    <p>Choose an image file or drag it here.</p>
                                                    <div className={style.dropzoneDesc2}>
                                                        <span className="">File types allowed: pdf | ppt | docx | doc | xls | xlsx | ods| odt</span>
                                                        <span className=""> Max size 2MB</span>
                                                    </div>
                                                </div>
                                                <input type="file" name="banner_image" id="banner_image" className={style.dropzone} onChange={changeBanner} />
                                            </div>
                                        }
                                        <Form.Group size="lg" controlId="name">
                                            <Form.Label>deiscription</Form.Label>
                                            <Form.Control
                                                autoFocus
                                                type="text"
                                                name="deiscription"
                                                value={state.deiscription}
                                                placeholder="Enter Name"
                                                onChange={changeHandler}
                                                required
                                            />
                                        </Form.Group>
                                    </div>
                                    <Button variant="primary" type="button" onClick={uploadBanner} className="mtp30 ml-1">
                                        Upload
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
 
export default Home;