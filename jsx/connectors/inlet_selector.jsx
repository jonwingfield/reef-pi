import React from 'react'
import $ from 'jquery'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import {ajaxGet} from '../utils/ajax.js'

export default class InletSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inlets: [],
      inlet: undefined,
    }
    this.fetch = this.fetch.bind(this)
    this.inlets = this.inlets.bind(this)
    this.set = this.set.bind(this)
  }

  componentDidMount () {
    this.fetch()
  }

  fetch () {
    ajaxGet({
      url: '/api/inlets',
      success: function (data) {
        var inlet
        $.each(data, function (i, j) {
          if (this.props.id === i.id) {
            inlet = j
          }
        }.bind(this))
        this.setState({
          inlets: data,
          inlet: inlet,
        })
      }.bind(this)
    })
  }

  inlets () {
    var title = ''
    var id = ''
    if (this.state.inlet !== undefined) {
      title = this.state.inlet.name
      id = this.state.inlet.id
    }
    var items = []
    $.each(this.state.inlets, function (k, v) {
      items.push(<MenuItem key={k} active={v.id === id} eventKey={k}><span id={this.props.id + '-' + v.name}>{v.name}</span></MenuItem>)
    }.bind(this))
    return (
      <DropdownButton title={title} id={this.props.id + '-inlet'} onSelect={this.set}>
        {items}
      </DropdownButton>
    )
  }

  set (k, ev) {
    var i = this.state.inlets[k]
    if (i === undefined) {
      return
    }
    this.setState({
      inlet: i
    })
    this.props.update(i.id)
  }

  render () {
    return (
      <div className='container'>
        Inlet
        {this.inlets()}
      </div>
    )
  }
}
