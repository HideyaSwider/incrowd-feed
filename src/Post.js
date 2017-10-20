import React, { Component } from 'react'

export class Post extends Component {
  static defaultProps = {
    title: 'hideya',
    published: 'today'
  }
  state = {}

  render() {
    const { title, published } = this.props
    return (
      <div className="post">
        <h2>{title}</h2>
        <p>{published}</p>
      </div>
    )
  }
}
