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
    feed: [],
    noMore: false
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
    let { feed, offset } = this.state
    if (newFeed.length === 0) {
      window.removeEventListener('scroll', this.handleScroll)
      this.setState({ noMore: true, isLoading: false })
    }
    this.setState({ offset: offset + step, feed: feed.concat(newFeed) })
    setTimeout(() => {
      this.setState({ isLoading: false })
    }, 1000)
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = event => {
    if (!this.state.noMore) {
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (windowBottom >= docHeight && this.state.isLoading === false) {
        this.loadMore()
      }
    }
  }

  render() {
    const { isLoading, feed, noMore } = this.state
    const posts = feed.map(post => {
      return <Post {...post} key={post.published} />
    })
    return (
      <div id="app" className="App" onScroll={this.listenToScroll}>
        <div className="posts">{posts}</div>
        {isLoading ? <img src={spin} className="loading" alt="loading" /> : null}
        {noMore ? <p className="no-more">Whoopsies! We don't have any more articles for you!</p>: null}
      </div>
    )
  }
}

export default App
