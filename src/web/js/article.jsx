import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Scrollbars } from 'react-custom-scrollbars'

import m2h from './mdToHtml'

export default class Article extends Component {
	constructor(props) {
		super(props)
		this.hash = this.props.hash
		this.state = {
			preview: null
		}
	}
	componentDidUpdate() {
		if (this.hash != this.props.hash) {
			this.hash = this.props.hash
			console.log(this.hash, ReactDOM.findDOMNode(this))
			let hashDOM = document.getElementById(this.hash)
			if (hashDOM) {
				this.scrollbars.scrollTop(this.scrollbars.getScrollTop() + hashDOM.getBoundingClientRect().top)
			}
		}
	}
	scroll() {
		if (this.state.preview != null) {
			this.setState({ preview: null })
		}
		let hList = ReactDOM.findDOMNode(this).querySelectorAll("h2,h3")
		let hash = hList[0].id
		for (let i = 0; i < hList.length; i++) {
			if (hList[i].getBoundingClientRect().top > 1) {
				break
			}
			hash = hList[i].id
		}
		if (this.hash != hash) {
			console.log("hash update")
			this.hash = hash
			this.props.setHash(hash)
		}
	}
	click(e) {
		switch (e.target.nodeName) {
			case "IMG":
				e.preventDefault()
				let src = e.target.src
				console.log("imageViewer", src)
				global.qtObjects.imageViewer.open(src)
				break
			case "A":
				let dmanProtocol = "dman://"
				let rect = e.target.getBoundingClientRect()
				let href = e.target.getAttribute("href")
				if (href.indexOf(dmanProtocol) != 0) {
					return
				}
				e.preventDefault()
				let [appName, hash] = href.slice(dmanProtocol.length + 1).split("#")
				console.log(href, appName, hash)
				let file = `${global.path}/${appName}/${global.lang}/index.md`
				global.readFile(file, data => {
					let {html} = m2h(file, data)
					let d = document.createElement("div")
					d.innerHTML = html
					let hashDom = d.querySelector("#" + hash)
					let DomList = [hashDom]
					let nextDom = hashDom.nextElementSibling
					while (nextDom) {
						if (nextDom.nodeName == hashDom.nodeName) {
							break
						}
						DomList.push(nextDom)
						nextDom = nextDom.nextElementSibling
					}
					d.innerHTML = ""
					DomList.map(el => d.appendChild(el))
					html = d.innerHTML
					let {top, left} = rect
					let style = {
						top, left
					}
					style.left -= 400
					if (top > document.body.clientHeight / 2) {
						style.top -= 200
					} else {
						style.top += rect.bottom - rect.top
					}
					this.setState({ preview: { html, style } })
				})
		}
	}
	render() {
		return <div id="article">
			<Scrollbars autoHide autoHideTimeout={1000} onScroll={e => this.scroll(e)} ref={s => { this.scrollbars = s } }>
				<div className="read" onClick={this.click.bind(this)} dangerouslySetInnerHTML={{ __html: this.props.html }}></div>
				<div id="fillblank" />
			</Scrollbars>
			{
				this.state.preview != null &&
				<div style={this.state.preview.style} id="preview" >
					<Scrollbars>
						<div className="read" dangerouslySetInnerHTML={{ __html: this.state.preview.html }}></div>
					</Scrollbars>
				</div>
			}
		</div>
	}
}
