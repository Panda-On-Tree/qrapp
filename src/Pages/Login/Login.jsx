import React from 'react'
import { useState } from 'react'

import './Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';



function Login() {

    let navigate = useNavigate()
    
    const [loginData, setLoginData] = useState({
        username:"",
        password:""
    })

   

    const submitLogin = () => {
        const data = loginData
        console.log(data);
        axios({
          method: 'post',
          url: `https://internal.microtek.tech:8443/v1/api/mhere/login`,
          headers: {
            'Content-Type': 'application/json',
          },
          data,
        })
          .then(function (response) {
            console.log(response)
            localStorage.setItem('employee_id', response.data.new_e_code)
            localStorage.setItem('manager_id', response.data.reporting_manager_id)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('fullname', response.data.name_of_the_employee)
            localStorage.setItem('email', response.data.email)
            localStorage.setItem('grade', response.data.grade)
            localStorage.setItem('band', response.data.band)
            localStorage.setItem('role', response.data.role)
            localStorage.setItem('department', response.data.department)
          /*   const data = {
                module_name:"qr-app",
                employee_id: response.data.new_e_code
            }
            axios({
                method: 'post',
                url: `https://internal.microtek.tech:8443/v1/api/mhere/log-login`,
                headers: {
                  'Content-Type': 'application/json',
                },
                data,
              }) */
              const data = {
                employee_id: response.data.new_e_code
              }
              axios({
                method:"post",
                url:`https://internal.microtek.tech:8443/v1/api/mhere/get-employee-module-access`,
                headers:{
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                data
              })
              .then((res)=>{
                console.log(res);
                if(res.data.data?.qrapp){
                    navigate('/')
                    window.location.reload()
                }
                else{
                    alert("module access not allowed")
                    document.getElementById("login-button").disabled = false
                }
                //localStorage.setItem('module_access', JSON.stringify(res.data.data))
              })
              .catch((err)=>{
                  document.getElementById("login-button").disabled = false
                console.log(err);
              })
            
           
          })
          .catch(function (err) {
            console.log(err)
            document.getElementById("login-button").disabled = false
          })
      }


  return (
    <div className='logi-main'>
        <div className='logi-main-left'>
            <div className='logi-main-left-container'>
              <form className='logi-main-left-inner'>
              
                <div className='logi-main-left-header'>
                        <h3>Welcome Back !</h3>
                        <p> Please enter your details</p>
                    </div>
                    <div className='logi-input-main'>
                        <div className='logi-input-inner'>
                            <label htmlFor="emp">Employee Id</label>
                            <input id='emp' placeholder='Enter Your Employee Code' onChange={(e)=>{
                                setLoginData({...loginData,username:e.target.value})
                               
                            }}  type="text" />
                        </div>
                        <div className='logi-input-inner'>
                            <label htmlFor="password">Password</label>
                            <input id='password' type="password" placeholder='Enter Password' onChange={(e)=>{
                                setLoginData({...loginData,password:e.target.value})
                               
                            }}  />
                        </div>
                        <div className='logi-forget-link'>
                            <a   href="/ess/forget-password">Forgot Password?</a>
                        </div>
                    </div>
                    <div className='logi-buttons-main'>
                        <button type='submit' id='login-button'  onClick={(e)=>{
                            console.log("submit");
                            document.getElementById("login-button").disabled = true
                            e.preventDefault()
                            submitLogin()
                        }}>Login</button>
                    </div>
               
              </form>
            </div>
        </div>
        <div className='logi-main-right'>
            <div className='logi-main-right-inner'>
              {/*  <img src={microtek2} alt="" /> */}
            </div>
                        
        </div>
    </div>
  )
}

export default Login