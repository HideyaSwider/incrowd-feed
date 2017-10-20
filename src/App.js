import React, { Component } from 'react'
import { Post } from './Post'

import spin from './spin.svg'
import './App.css'
const baseURL = 'https://www.stellarbiotechnologies.com/media/press-releases/json?'
const step = 15
class App extends Component {
  state = {
    isLoading: true,
    limit: step,
    offset: 0,
    feed: []
  }

  componentWillMount = () => {
    this.loadMore()
  }

  loadMore = () => {
    this.setState({ isLoading: true })
    const { limit, offset } = this.state
    fetch(`${baseURL}limit=${limit}&offset=${offset}`)
      .then(resp => resp.json())
      .then(json => {
        this.moveForward(json.news)
      })
  }

  moveForward = newFeed => {
    //check if there are no more posts and stop loading
    this.setState({ offset: this.state.offset + step, feed: this.state.feed.concat(newFeed), isLoading: false })
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = event => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    if (windowBottom >= docHeight) {
      this.loadMore()
    }
  }

  render() {
    const { isLoading, feed } = this.state
    const posts = feed.map(post => {
      return <Post {...post} key={post.published} />
    })
    return (
      <div id="app" className="App" onScroll={this.listenToScroll}>
        <div className="posts">{posts}</div>
        {isLoading ? <img src={spin} className="loading" alt="loading" /> : null}
      </div>
    )
  }
}

export default App
