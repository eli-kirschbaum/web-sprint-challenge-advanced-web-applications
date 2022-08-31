import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import AuthRoute from './AuthRoute'
import axios from 'axios'
import axiosWithAuth from '../axios/index'
//
const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'


export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate('/')
  } 
  const redirectToArticles = () => {
    navigate('/Articles')
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    setMessage('Goodbye!')
    localStorage.removeItem('theToken')
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    axios
      .post(loginUrl, { username, password })
      .then((res) => {
        localStorage.setItem('theToken', res.data.token)
        setSpinnerOn(false)
        navigate('./Articles')
      })
      .catch((err) => {
        console.log({ err })
      })
  
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    axios({
      url: articlesUrl,
      method: 'get',
      headers: {
        Authorization: localStorage.getItem('theToken')
      }
    })
      .then(res => {
        console.log(res)
        setSpinnerOn(false)
        setArticles(res.data.articles)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log({ err })
      })
      
      
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('')
    setSpinnerOn(true)
    axios({
      url: articlesUrl,
      method: 'post',
      headers: {
        Authorization: localStorage.getItem('theToken')
      },
      data: article,
    })
      .then(res => {
        console.log(res)
        setSpinnerOn(false)
        const { article } = res.data
        setArticles(articles.concat(article))

      })
      .catch(err => {
        console.log({ err })
      })
    
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    axiosWithAuth().put()
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log({ err })
        setMessage(err.response.data.message)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
      .then(res => {
        console.log(res)
        setArticles(articles.filter(art => (art.article_id != article_id)))
        setMessage(res.data.message)
      }) 
      .catch(err => {
        console.log({ err })
        setMessage(err.response.data.message)
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner
       on={spinnerOn}
       />
      <Message 
        message={message}
      />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <AuthRoute>
              <ArticleForm
                postArticle={postArticle}
                setCurrentArticleId={setCurrentArticleId}
                updateArticle={updateArticle}
                currentArticle={articles.find(art =>(art.article_id === currentArticleId))}
               />
              <Articles 
                getArticles={getArticles}
                articles={articles}
                message={message}
                setArticles={setArticles}
                setSpinnerOn={setSpinnerOn}
                setMessage={setMessage}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
                />
            </AuthRoute>
          } /> 
          
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
