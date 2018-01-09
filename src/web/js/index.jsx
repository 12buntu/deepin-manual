import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

import m2h from './mdToHtml.js'

class Item extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "",
			title: "",
			logo: "",
			show: false
		}
		let path = `${global.path}/${this.props.appName}/${global.lang}/`
		global.readFile(path + "index.md", data => {
			let [title, logo] = data.substr("# ".length, data.indexOf("\n")).split("|")
			logo = `${path}${logo}`
			this.setState({ title, logo, show: true })
		})
	}
	render() {
		return (this.state.show &&
			<div className="item" onClick={() => global.openApp(this.props.appName)}>
				<img src={this.state.logo} alt={this.props.appName} />
				<br />
				<span>{this.state.title}</span>
			</div>
		)
	}
}


export default class Index extends Component {
	constructor(props) {
		super(props)
		let sequence = [
			"dde-file-manager",
			"deepin-appstore",
			"deepin-system-monitor",
			"deepin-terminal",
			"deepin-movie",
			"deepin-music",
			"deepin-image-viewer",
			"deepin-screenshot",
			"deepin-screen-recorder",
			"deepin-voice-recorder",
			"deepin-cloud-print",
			"deepin-cloud-scan",
			'deepin-calculator',
			"deepin-clone",
			"deepin-graphics-driver-manager",
			"deepin-package-manager",
			"deepin-presentation-assistant",
			"deepin-boot-maker"
		]
		this.state = {
			sequence,
			appList: []
		}

		global.readFile(global.path, data => {
			let appList = data.match(/addRow\("([^.][^"]+)"/g)
				.map(r => {
					return r.match(/"([^"]+)"/)[1]
				})
			this.setState({ appList: appList })
		})
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.appList.toString() == this.state.appList.toString()) {
			return false
		}
		return true
	}
	render() {
		let sysSoft = ['dde']
		let appSoft = this.state.sequence.filter(appName => this.state.appList.includes(appName))
		let otherSoft = this.state.appList.filter(appName => !this.state.sequence.includes(appName) && !sysSoft.includes(appName))
		return <Scrollbars>
			<div id="index">
				<h2>系统</h2>
				<div className="items">
					{sysSoft.map(appName => <Item key={appName} appName={appName} />)}
				</div>
				<h2>应用</h2>
				<div className="items">
					{appSoft.map(appName => <Item key={appName} appName={appName} />)}
					{otherSoft.map(appName => <Item key={appName} appName={appName} />)}
				</div>
			</div>
		</Scrollbars>
	}
}